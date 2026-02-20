import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Video, VideoOff, Mic, MicOff, PhoneOff, Phone,
  FileText, User, Clock, AlertCircle, CheckCircle, Loader
} from "lucide-react";
import { toast } from "react-toastify";
import { useUser } from "../../context/UserContext";
import { getDoctorAppointments } from "../../services/doctorAction";
import { startConsultation, getActiveConsultations, endConsultation, saveConsultationNotes } from "../../services/consultationService";
import { connectSocket } from "../../services/socket";

const ICE_SERVERS = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

const ConsultationInterface = () => {
  const { user } = useUser();

  const [approvedAppointments, setApprovedAppointments] = useState([]);
  const [activeConsultation, setActiveConsultation] = useState(null);
  const [loading, setLoading] = useState(true);

  const [callStatus, setCallStatus] = useState("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const [notes, setNotes] = useState("");
  const [prescription, setPrescription] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const timerRef = useRef(null);
  const socketRef = useRef(null);
  const currentPatientIdRef = useRef(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [apptData, consultData] = await Promise.all([
        getDoctorAppointments(),
        getActiveConsultations(),
      ]);
      const approved = (apptData.appointments || []).filter(a => a.status === "approved");
      setApprovedAppointments(approved);
      if (consultData.consultations && consultData.consultations.length > 0) {
        setActiveConsultation(consultData.consultations[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Socket connection
  useEffect(() => {
    if (!user?._id) return;
    socketRef.current = connectSocket(user._id);

    // Patient accepted → set remote description
    socketRef.current.on("call-accepted", async ({ signal }) => {
      try {
        if (pcRef.current && pcRef.current.signalingState !== "stable") {
          await pcRef.current.setRemoteDescription(new RTCSessionDescription(signal));
        }
      } catch (e) { console.error("setRemoteDescription error:", e); }
    });

    // ICE candidates from patient
    socketRef.current.on("ice-candidate", ({ candidate }) => {
      try {
        if (pcRef.current && candidate) pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) { console.error("addIceCandidate error:", e); }
    });

    socketRef.current.on("call-ended", () => { cleanUpCall(false); toast.info("Patient ended the call"); });
    socketRef.current.on("user-offline", () => { toast.error("Patient is not online. They need to open their dashboard first."); cleanUpCall(false); });

    return () => {
      socketRef.current?.off("call-accepted");
      socketRef.current?.off("ice-candidate");
      socketRef.current?.off("call-ended");
      socketRef.current?.off("user-offline");
    };
  }, [user]);

  useEffect(() => {
    if (callStatus === "connected") {
      timerRef.current = setInterval(() => setCallDuration(d => d + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [callStatus]);

  // Re-attach local video stream after render (fixes dark preview)
  useEffect(() => {
    if (callStatus !== "idle" && localVideoRef.current && localStreamRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }
  }, [callStatus]);

  const formatDuration = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const cleanUpCall = async (notify = true) => {
    if (localStreamRef.current) { localStreamRef.current.getTracks().forEach(t => t.stop()); localStreamRef.current = null; }
    if (pcRef.current) { pcRef.current.close(); pcRef.current = null; }
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    clearInterval(timerRef.current);

    if (notify && currentPatientIdRef.current) {
      socketRef.current?.emit("end-call", { to: currentPatientIdRef.current });
      if (activeConsultation) { try { await endConsultation(activeConsultation._id); } catch (_) {} }
    }

    currentPatientIdRef.current = null;
    setCallStatus("idle");
    setCallDuration(0);
    setActiveConsultation(null);
    setNotes("");
    setPrescription("");
    loadData();
  };

  const handleStartCall = async (appointment) => {
    try {
      const { consultation } = await startConsultation(appointment._id);
      setActiveConsultation(consultation);
      toast.success("Consultation started! Calling patient...");

      const patientId = typeof appointment.patient === "object" ? appointment.patient._id : appointment.patient;
      currentPatientIdRef.current = patientId;

      // Audio constraints to prevent echo/noise
      const audioConstraints = {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      };

      // Try video+audio, fall back to audio-only if camera is busy
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: audioConstraints });
      } catch (mediaErr) {
        console.warn("Video failed, trying audio-only:", mediaErr.message);
        toast.warn("Camera unavailable — starting with audio only");
        stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: audioConstraints });
        setIsVideoOff(true);
      }

      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      // Create RTCPeerConnection
      const pc = new RTCPeerConnection(ICE_SERVERS);
      pcRef.current = pc;

      // Add local tracks
      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      // Handle remote stream
      pc.ontrack = (event) => {
        if (remoteVideoRef.current && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0];
          setCallStatus("connected");
          setCallDuration(0);
        }
      };

      // Send ICE candidates to patient
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current.emit("ice-candidate", { to: patientId, candidate: event.candidate });
        }
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === "disconnected" || pc.connectionState === "failed") {
          cleanUpCall(false);
        }
      };

      // Create and send offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socketRef.current.emit("call-user", {
        to: patientId, from: user._id,
        signal: pc.localDescription,
        callerName: user.fullName || "Doctor",
        consultationId: consultation._id,
      });

      setCallStatus("calling");
      setApprovedAppointments(prev => prev.filter(a => a._id !== appointment._id));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const track = localStreamRef.current.getAudioTracks()[0];
      if (track) { track.enabled = !track.enabled; setIsMuted(!track.enabled); }
    }
  };

  const toggleVideo = async () => {
    if (!localStreamRef.current) return;

    const existingTrack = localStreamRef.current.getVideoTracks()[0];
    if (existingTrack) {
      existingTrack.enabled = !existingTrack.enabled;
      setIsVideoOff(!existingTrack.enabled);
    } else {
      // No video track (started audio-only) — try to acquire camera now
      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        const videoTrack = videoStream.getVideoTracks()[0];
        localStreamRef.current.addTrack(videoTrack);
        if (pcRef.current) {
          const sender = pcRef.current.getSenders().find(s => s.track?.kind === "video");
          if (sender) {
            sender.replaceTrack(videoTrack);
          } else {
            pcRef.current.addTrack(videoTrack, localStreamRef.current);
          }
        }
        if (localVideoRef.current) localVideoRef.current.srcObject = localStreamRef.current;
        setIsVideoOff(false);
        toast.success("Camera enabled!");
      } catch (err) {
        toast.error("Camera still unavailable. Make sure no other app is using it.");
        console.error("toggleVideo acquire error:", err);
      }
    }
  };

  const handleSaveNotes = async () => {
    if (!activeConsultation) return;
    setSavingNotes(true);
    try {
      await saveConsultationNotes(activeConsultation._id, notes, prescription);
      toast.success("Notes saved successfully");
    } catch (err) { toast.error(err.message); }
    finally { setSavingNotes(false); }
  };

  // ─── RENDER ──────────────────────────────────

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <Loader size={40} style={{ animation: "spin 1s linear infinite" }} color="#16a34a" />
        <p style={{ marginTop: 10, color: "#6b7280" }}>Loading consultations...</p>
      </div>
    );
  }

  // ── ACTIVE CALL VIEW ──
  if (callStatus !== "idle") {
    const patientName = activeConsultation?.patient?.fullName || "Patient";
    const reason = activeConsultation?.appointment?.reason || "Consultation";

    return (
      <div style={styles.container}>
        <div style={styles.videoSection}>
          <div style={styles.mainVideo}>
            <video ref={remoteVideoRef} autoPlay playsInline style={styles.remoteVideo} />

            {callStatus === "calling" && (
              <div style={styles.callingOverlay}>
                <div style={styles.pulseCircle}><Phone size={40} color="#fff" /></div>
                <p style={{ color: "#fff", fontSize: 18, marginTop: 20 }}>Calling {patientName}...</p>
                <p style={{ color: "#9ca3af", fontSize: 14 }}>Waiting for patient to accept</p>
              </div>
            )}

            <div style={styles.localVideoWrapper}>
              <video ref={localVideoRef} autoPlay playsInline muted style={styles.localVideo} />
              {isVideoOff && <div style={styles.videoOffOverlay}><VideoOff size={24} color="#fff" /></div>}
              <span style={styles.previewLabel}>You</span>
            </div>

            {callStatus === "connected" && (
              <div style={styles.callInfoBar}>
                <div style={styles.callInfoDot} />
                <span style={{ color: "#fff", fontSize: 14 }}>LIVE</span>
                <span style={{ color: "#d1d5db", fontSize: 14, marginLeft: 10 }}>
                  <Clock size={14} style={{ verticalAlign: "middle", marginRight: 4 }} />{formatDuration(callDuration)}
                </span>
              </div>
            )}

            <div style={styles.controlsBar}>
              <button onClick={toggleMute} style={isMuted ? styles.controlBtnActive : styles.controlBtn}>
                {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
              <button onClick={toggleVideo} style={isVideoOff ? styles.controlBtnActive : styles.controlBtn}>
                {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
              </button>
              <button onClick={() => cleanUpCall(true)} style={styles.endCallBtn}><PhoneOff size={20} /></button>
            </div>
          </div>
        </div>

        <div style={styles.sidePanel}>
          <div style={styles.panelHeader}>
            <FileText size={18} color="#16a34a" />
            <h4 style={{ margin: 0, color: "#1f2937" }}>Consultation Notes</h4>
          </div>
          <div style={styles.patientBrief}>
            <p><strong>Patient:</strong> {patientName}</p>
            <p><strong>Reason:</strong> {reason}</p>
            {activeConsultation?.appointment?.date && (
              <p><strong>Date:</strong> {activeConsultation.appointment.date} at {activeConsultation.appointment.time}</p>
            )}
          </div>
          <label style={styles.noteLabel}>Clinical Notes</label>
          <textarea style={styles.notesArea} placeholder="Type clinical notes here..." value={notes} onChange={(e) => setNotes(e.target.value)} />
          <label style={styles.noteLabel}>Prescription</label>
          <textarea style={{ ...styles.notesArea, height: 80 }} placeholder="Prescription details..." value={prescription} onChange={(e) => setPrescription(e.target.value)} />
          <button onClick={handleSaveNotes} disabled={savingNotes} style={styles.saveBtn}>
            {savingNotes ? "Saving..." : "Save Notes"}
          </button>
        </div>
      </div>
    );
  }

  // ── LOBBY VIEW — list approved appointments ──
  return (
    <div style={styles.lobbyContainer}>
      <div style={styles.lobbyHeader}>
        <Video size={28} color="#16a34a" />
        <div>
          <h2 style={{ margin: 0, color: "#1f2937" }}>Video Consultations</h2>
          <p style={{ margin: 0, color: "#6b7280", fontSize: 14 }}>Start a video call with your patients</p>
        </div>
      </div>

      {approvedAppointments.length === 0 ? (
        <div style={styles.emptyState}>
          <AlertCircle size={50} color="#d1d5db" />
          <h3 style={{ color: "#6b7280", marginTop: 15 }}>No Approved Appointments</h3>
          <p style={{ color: "#9ca3af", maxWidth: 400, textAlign: "center" }}>
            Approve pending appointments from the Appointment Management tab to start video consultations.
          </p>
        </div>
      ) : (
        <div style={styles.appointmentGrid}>
          {approvedAppointments.map((appt) => {
            const patient = appt.patient || {};
            return (
              <div key={appt._id} style={styles.appointmentCard}>
                <div style={styles.cardTop}>
                  <div style={styles.patientAvatar}>{(patient.fullName || "P").charAt(0).toUpperCase()}</div>
                  <div>
                    <h4 style={{ margin: 0, color: "#1f2937" }}>{patient.fullName || "Patient"}</h4>
                    <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>{patient.email || ""}</p>
                  </div>
                </div>
                <div style={styles.cardDetails}>
                  <div style={styles.detailRow}><Clock size={14} color="#6b7280" /><span>{appt.date} at {appt.time}</span></div>
                  {appt.reason && <div style={styles.detailRow}><FileText size={14} color="#6b7280" /><span>{appt.reason}</span></div>}
                  <div style={styles.detailRow}><CheckCircle size={14} color="#16a34a" /><span style={{ color: "#16a34a", fontWeight: 600 }}>Approved</span></div>
                </div>
                <button style={styles.startCallBtn} onClick={() => handleStartCall(appt)}>
                  <Phone size={18} /><span>Start Video Call</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const styles = {
  loadingContainer: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400 },
  container: { display: "flex", gap: 20, height: "100%", flexWrap: "wrap" },
  videoSection: { flex: 2, minWidth: 300 },
  mainVideo: { width: "100%", aspectRatio: "16/9", backgroundColor: "#111827", borderRadius: 12, position: "relative", overflow: "hidden" },
  remoteVideo: { width: "100%", height: "100%", objectFit: "cover" },
  callingOverlay: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.7)", zIndex: 5 },
  pulseCircle: { width: 80, height: 80, borderRadius: "50%", backgroundColor: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center" },
  localVideoWrapper: { position: "absolute", top: 16, right: 16, width: 160, height: 110, borderRadius: 10, overflow: "hidden", border: "3px solid #fff", boxShadow: "0 4px 12px rgba(0,0,0,0.3)", zIndex: 10, backgroundColor: "#374151" },
  localVideo: { width: "100%", height: "100%", objectFit: "cover" },
  videoOffOverlay: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.6)" },
  previewLabel: { position: "absolute", bottom: 6, left: 8, fontSize: 11, color: "#fff", backgroundColor: "rgba(0,0,0,0.5)", padding: "2px 6px", borderRadius: 4 },
  callInfoBar: { position: "absolute", top: 16, left: 16, display: "flex", alignItems: "center", gap: 8, backgroundColor: "rgba(0,0,0,0.6)", padding: "6px 14px", borderRadius: 20, zIndex: 10 },
  callInfoDot: { width: 10, height: 10, borderRadius: "50%", backgroundColor: "#ef4444" },
  controlsBar: { position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 16, backgroundColor: "rgba(17,24,39,0.85)", padding: "12px 24px", borderRadius: 40, backdropFilter: "blur(8px)", zIndex: 10 },
  controlBtn: { border: "none", backgroundColor: "#4b5563", color: "#fff", width: 44, height: 44, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" },
  controlBtnActive: { border: "none", backgroundColor: "#ef4444", color: "#fff", width: 44, height: 44, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" },
  endCallBtn: { border: "none", backgroundColor: "#dc2626", color: "#fff", width: 44, height: 44, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" },
  sidePanel: { flex: 1, minWidth: 280, display: "flex", flexDirection: "column", backgroundColor: "#fff", borderRadius: 12, padding: 20, border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" },
  panelHeader: { display: "flex", alignItems: "center", gap: 10, marginBottom: 16 },
  patientBrief: { fontSize: 14, color: "#4b5563", marginBottom: 16, padding: 12, backgroundColor: "#f9fafb", borderRadius: 8, border: "1px solid #f3f4f6", lineHeight: 1.8 },
  noteLabel: { fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6, marginTop: 8 },
  notesArea: { flex: 1, width: "100%", padding: 12, borderRadius: 8, border: "1px solid #d1d5db", resize: "none", fontFamily: "inherit", fontSize: 14, outline: "none", minHeight: 100, boxSizing: "border-box" },
  saveBtn: { marginTop: 12, backgroundColor: "#16a34a", color: "#fff", border: "none", padding: "12px 20px", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 14, transition: "background 0.2s" },
  lobbyContainer: { padding: 10 },
  lobbyHeader: { display: "flex", alignItems: "center", gap: 14, marginBottom: 30 },
  emptyState: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 350 },
  appointmentGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 },
  appointmentCard: { backgroundColor: "#fff", borderRadius: 12, padding: 20, border: "1px solid #e5e7eb", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", transition: "box-shadow 0.2s" },
  cardTop: { display: "flex", alignItems: "center", gap: 14, marginBottom: 16 },
  patientAvatar: { width: 48, height: 48, borderRadius: "50%", backgroundColor: "#16a34a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18 },
  cardDetails: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 },
  detailRow: { display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#4b5563" },
  startCallBtn: { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "12px 0", backgroundColor: "#16a34a", color: "#fff", border: "none", borderRadius: 10, fontWeight: 600, fontSize: 15, cursor: "pointer", transition: "background 0.2s" },
};

export default ConsultationInterface;