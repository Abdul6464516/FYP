import React, { useState, useEffect, useRef } from "react";
import {
  Mic, MicOff, Video, VideoOff, PhoneOff, Phone,
  User, Clock, AlertCircle, Loader, Star, Send, CheckCircle,
  CalendarCheck, CalendarClock, CalendarX, Activity, Wifi, Camera, MicIcon
} from "lucide-react";
import { toast } from "react-toastify";
import { useUser } from "../../context/UserContext";
import { getActiveConsultations, endConsultation } from "../../services/consultationService";
import { submitFeedback, getMyAppointments } from "../../services/patientAction";
import { connectSocket } from "../../services/socket";

const ICE_SERVERS = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

const VideoCall = ({ incomingCallData, onCallHandled }) => {
  const { user } = useUser();

  const [callStatus, setCallStatus] = useState("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [incomingCall, setIncomingCall] = useState(null);
  const [activeConsultation, setActiveConsultation] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Post-call feedback state
  const [endedCallInfo, setEndedCallInfo] = useState(null); // { doctorName, doctorId, duration }
  const [fbRating, setFbRating] = useState(0);
  const [fbHover, setFbHover] = useState(0);
  const [fbComment, setFbComment] = useState("");
  const [fbSubmitting, setFbSubmitting] = useState(false);
  const [fbSubmitted, setFbSubmitted] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const timerRef = useRef(null);
  const socketRef = useRef(null);
  const incomingCallRef = useRef(null);
  const callDurationRef = useRef(0);

  useEffect(() => {
    const load = async () => {
      try {
        const [consData, apptData] = await Promise.all([
          getActiveConsultations(),
          getMyAppointments(),
        ]);
        if (consData.consultations && consData.consultations.length > 0) setActiveConsultation(consData.consultations[0]);
        if (apptData.appointments) setAppointments(apptData.appointments);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  // Socket connection — only for ICE & call-ended (incoming-call handled by Dashboard)
  useEffect(() => {
    if (!user?._id) return;
    socketRef.current = connectSocket(user._id);

    const handleIce = ({ candidate }) => {
      try {
        if (pcRef.current && candidate) pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) { console.error("addIceCandidate error:", e); }
    };

    const handleEnded = () => { cleanUpCall(false); toast.info("Doctor ended the call"); };

    socketRef.current.on("ice-candidate", handleIce);
    socketRef.current.on("call-ended", handleEnded);

    return () => {
      socketRef.current?.off("ice-candidate", handleIce);
      socketRef.current?.off("call-ended", handleEnded);
    };
  }, [user]);

  // React to incoming call forwarded from PatientDashboard
  useEffect(() => {
    if (incomingCallData && callStatus === "idle") {
      incomingCallRef.current = incomingCallData;
      setIncomingCall(incomingCallData);
      setCallStatus("ringing");
    }
  }, [incomingCallData]);

  useEffect(() => {
    if (callStatus === "connected") {
      timerRef.current = setInterval(() => {
        setCallDuration(d => {
          const next = d + 1;
          callDurationRef.current = next;
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [callStatus]);

  // Ensure remote stream is attached to video element after render
  useEffect(() => {
    if ((callStatus === "connecting" || callStatus === "connected") && remoteVideoRef.current && remoteStreamRef.current) {
      remoteVideoRef.current.srcObject = remoteStreamRef.current;
    }
    // Also ensure local stream is attached
    if ((callStatus === "connecting" || callStatus === "connected") && localVideoRef.current && localStreamRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }
  }, [callStatus]);

  const formatDuration = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const cleanUpCall = async (notify = true) => {
    // Capture call info for post-call feedback before clearing
    const call = incomingCallRef.current;
    const duration = callDurationRef.current;

    if (localStreamRef.current) { localStreamRef.current.getTracks().forEach(t => t.stop()); localStreamRef.current = null; }
    if (pcRef.current) { pcRef.current.close(); pcRef.current = null; }
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    remoteStreamRef.current = null;
    clearInterval(timerRef.current);

    if (notify && call) {
      socketRef.current?.emit("end-call", { to: call.from });
      if (call.consultationId) { try { await endConsultation(call.consultationId); } catch (_) {} }
    }

    toast.dismiss("incoming-call");
    incomingCallRef.current = null;
    callDurationRef.current = 0;
    setCallDuration(0);
    setIncomingCall(null);

    // Show feedback form if there was a call (even brief)
    if (call) {
      setEndedCallInfo({
        doctorName: call.callerName || "Doctor",
        doctorId: call.from,
        duration,
      });
      setCallStatus("ended");
    } else {
      setCallStatus("idle");
    }
  };

  const handleAcceptCall = async () => {
    const call = incomingCallRef.current;
    if (!call) return;
    toast.dismiss("incoming-call");
    if (onCallHandled) onCallHandled(); // clear dashboard state

    try {
      // Audio constraints to prevent echo/noise
      const audioConstraints = {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      };

      // Try video+audio first, fall back to audio-only if camera is busy
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: audioConstraints });
      } catch (mediaErr) {
        console.warn("Video failed, trying audio-only:", mediaErr.message);
        toast.warn("Camera unavailable — joining with audio only");
        stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: audioConstraints });
        setIsCameraOff(true);
      }

      localStreamRef.current = stream;

      // Show the call UI immediately so video refs exist in DOM
      setCallStatus("connecting");

      // Wait for React to render the video elements, then attach local stream
      await new Promise(r => setTimeout(r, 100));
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        try { await localVideoRef.current.play(); } catch (_) {}
      }

      const pc = new RTCPeerConnection(ICE_SERVERS);
      pcRef.current = pc;

      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      pc.ontrack = (event) => {
        if (event.streams[0]) {
          remoteStreamRef.current = event.streams[0];
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
          setCallStatus("connected");
          setCallDuration(0);
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current.emit("ice-candidate", { to: call.from, candidate: event.candidate });
        }
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === "disconnected" || pc.connectionState === "failed") {
          cleanUpCall(false);
        }
      };

      // Set the offer from doctor, create answer, send it back
      await pc.setRemoteDescription(new RTCSessionDescription(call.signal));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socketRef.current.emit("answer-call", { to: call.from, signal: pc.localDescription });
    } catch (err) {
      toast.error("Could not access camera or microphone. Please check your browser permissions and make sure no other app is using the camera.");
      console.error("getUserMedia error:", err);
    }
  };

  const handleDeclineCall = () => {
    if (incomingCall) {
      socketRef.current?.emit("end-call", { to: incomingCall.from });
    }
    toast.dismiss("incoming-call");
    setCallStatus("idle");
    setIncomingCall(null);
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
      // Already have a video track — just toggle it
      existingTrack.enabled = !existingTrack.enabled;
      setIsCameraOff(!existingTrack.enabled);
    } else {
      // No video track (joined audio-only) — try to acquire camera now
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
        setIsCameraOff(false);
        toast.success("Camera enabled!");
      } catch (err) {
        toast.error("Camera still unavailable. Make sure no other app is using it.");
        console.error("toggleVideo acquire error:", err);
      }
    }
  };

  // ─── RENDER ──────────────────────────────────

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <Loader size={40} style={{ animation: "spin 1s linear infinite" }} color="#10b981" />
        <p style={{ marginTop: 10, color: "#6b7280" }}>Loading...</p>
      </div>
    );
  }

  // ── INCOMING CALL — DOCTOR STARTED CONSULTATION ──
  if (callStatus === "ringing" && incomingCall) {
    return (
      <div style={styles.ringingContainer}>
        <div style={styles.ringingCard}>
          <div style={styles.ringingPulse}>
            <Video size={50} color="#fff" />
          </div>
          <h2 style={{ color: "#1f2937", margin: "20px 0 5px" }}>Consultation Started</h2>
          <p style={{ color: "#6b7280", fontSize: 16, marginBottom: 6 }}>
            Dr. {incomingCall.callerName} has started the consultation.
          </p>
          <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 30 }}>
            Please click <strong>Join Now</strong> to begin your video consultation.
          </p>
          <div style={styles.ringingActions}>
            <button onClick={handleDeclineCall} style={styles.declineBtn}>
              <PhoneOff size={24} />
              <span>Decline</span>
            </button>
            <button onClick={handleAcceptCall} style={styles.acceptBtn}>
              <Video size={24} />
              <span>Join Now</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── ACTIVE CALL VIEW (connecting / connected) ──
  if (callStatus === "connecting" || callStatus === "connected") {
    const doctorName = incomingCall?.callerName || "Doctor";

    return (
      <div style={styles.callContainer}>
        <video ref={remoteVideoRef} autoPlay playsInline style={styles.remoteVideo} />

        {/* Connecting overlay */}
        {callStatus === "connecting" && (
          <div style={styles.connectingOverlay}>
            <Loader size={36} color="#fff" style={{ animation: "spin 1s linear infinite" }} />
            <p style={{ color: "#fff", fontSize: 16, marginTop: 14 }}>Connecting to Dr. {doctorName}...</p>
          </div>
        )}

        {/* Local self-view */}
        <div style={styles.localVideoWrapper}>
          <video ref={localVideoRef} autoPlay playsInline muted style={styles.localVideo} />
          {isCameraOff && <div style={styles.videoOffOverlay}><VideoOff size={24} color="#fff" /></div>}
          <span style={styles.selfLabel}>You</span>
        </div>

        {/* Call info */}
        {callStatus === "connected" && (
          <div style={styles.callInfoBar}>
            <div style={styles.liveDot} />
            <span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>LIVE</span>
            <span style={{ color: "#d1d5db", fontSize: 14, marginLeft: 10 }}>
              <Clock size={14} style={{ verticalAlign: "middle", marginRight: 4 }} />{formatDuration(callDuration)}
            </span>
            <span style={{ color: "#d1d5db", fontSize: 14, marginLeft: 10 }}>with Dr. {doctorName}</span>
          </div>
        )}

        {/* Control bar */}
        <div style={styles.controlBar}>
          <button onClick={toggleMute} style={isMuted ? styles.activeBtn : styles.iconBtn}>
            {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
          </button>
          <button onClick={toggleVideo} style={isCameraOff ? styles.activeBtn : styles.iconBtn} title={isCameraOff ? "Enable Camera" : "Disable Camera"}>
            {isCameraOff ? <VideoOff size={22} /> : <Video size={22} />}
          </button>
          <button onClick={() => cleanUpCall(true)} style={styles.endCallBtn}>
            <PhoneOff size={22} />
          </button>
        </div>

        {/* Audio-only notice */}
        {isCameraOff && !localStreamRef.current?.getVideoTracks().length && (
          <div style={styles.audioOnlyBanner}>
            <AlertCircle size={16} />
            <span>You joined with audio only. Click the camera button to try enabling video.</span>
          </div>
        )}
      </div>
    );
  }

  // ── POST-CALL FEEDBACK VIEW ──
  if (callStatus === "ended" && endedCallInfo) {
    const handleFeedbackSubmit = async (e) => {
      e.preventDefault();
      if (fbRating === 0) {
        toast.error("Please provide a star rating.");
        return;
      }
      setFbSubmitting(true);
      try {
        await submitFeedback({
          rating: fbRating,
          message: fbComment,
          reviewOn: endedCallInfo.doctorId,
        });
        setFbSubmitted(true);
        toast.success("Thank you for your feedback!");
      } catch (err) {
        toast.error(err.message);
      } finally {
        setFbSubmitting(false);
      }
    };

    const handleSkip = () => {
      setCallStatus("idle");
      setEndedCallInfo(null);
      setFbRating(0);
      setFbHover(0);
      setFbComment("");
      setFbSubmitted(false);
    };

    if (fbSubmitted) {
      return (
        <div style={styles.feedbackContainer}>
          <div style={styles.feedbackCard}>
            <CheckCircle size={60} color="#10b981" />
            <h3 style={{ color: "#1f2937", margin: "16px 0 6px" }}>Thank you for your feedback!</h3>
            <p style={{ color: "#6b7280", fontSize: 14 }}>Your review helps us improve our healthcare services.</p>
            <button onClick={handleSkip} style={styles.fbDoneBtn}>Back to Dashboard</button>
          </div>
        </div>
      );
    }

    return (
      <div style={styles.feedbackContainer}>
        <div style={styles.feedbackCard}>
          {/* Doctor info header */}
          <div style={styles.fbDoctorHeader}>
            <div style={styles.fbDoctorAvatar}>
              {endedCallInfo.doctorName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 style={{ margin: 0, color: "#1f2937" }}>Dr. {endedCallInfo.doctorName}</h3>
              <p style={{ margin: 0, color: "#6b7280", fontSize: 13 }}>
                Consultation ended · {formatDuration(endedCallInfo.duration)}
              </p>
            </div>
          </div>

          <h3 style={{ color: "#1f2937", margin: "20px 0 4px", textAlign: "center" }}>Rate Your Consultation</h3>
          <p style={{ color: "#6b7280", fontSize: 14, textAlign: "center", marginBottom: 20 }}>
            How was your experience with Dr. {endedCallInfo.doctorName}?
          </p>

          <form onSubmit={handleFeedbackSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Star rating */}
            <div style={{ display: "flex", justifyContent: "center", gap: 8, alignItems: "center" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  style={{ border: "none", background: "none", cursor: "pointer", padding: 0 }}
                  onClick={() => setFbRating(star)}
                  onMouseEnter={() => setFbHover(star)}
                  onMouseLeave={() => setFbHover(0)}
                >
                  <Star
                    size={36}
                    fill={(fbHover || fbRating) >= star ? "#fbbf24" : "none"}
                    color={(fbHover || fbRating) >= star ? "#fbbf24" : "#d1d5db"}
                  />
                </button>
              ))}
              {fbRating > 0 && (
                <span style={{ marginLeft: 10, fontSize: 14, color: "#4b5563", fontWeight: 600 }}>{fbRating} / 5</span>
              )}
            </div>

            {/* Comment */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6, display: "block" }}>
                Share your thoughts (Optional)
              </label>
              <textarea
                style={styles.fbTextarea}
                placeholder="How was the consultation? Did the doctor address your concerns?"
                value={fbComment}
                onChange={(e) => setFbComment(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button type="button" onClick={handleSkip} style={styles.fbSkipBtn}>Skip</button>
              <button type="submit" disabled={fbSubmitting} style={styles.fbSubmitBtn}>
                <Send size={16} />
                {fbSubmitting ? "Submitting..." : "Submit Feedback"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ── helpers for booking cards ──
  const getStatusConfig = (status) => {
    switch (status) {
      case "pending":
        return { label: "Pending", color: "#f59e0b", bg: "#fffbeb", border: "#fde68a", icon: <CalendarClock size={16} color="#f59e0b" /> };
      case "approved":
        return { label: "Upcoming", color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe", icon: <CalendarCheck size={16} color="#3b82f6" /> };
      case "completed":
        return { label: "Completed", color: "#10b981", bg: "#ecfdf5", border: "#a7f3d0", icon: <CheckCircle size={16} color="#10b981" /> };
      case "cancelled":
        return { label: "Cancelled", color: "#ef4444", bg: "#fef2f2", border: "#fecaca", icon: <CalendarX size={16} color="#ef4444" /> };
      default:
        return { label: status, color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb", icon: <Clock size={16} color="#6b7280" /> };
    }
  };

  const upcomingAppts = appointments.filter(a => a.status === "approved" || a.status === "pending");
  const pastAppts = appointments.filter(a => a.status === "completed" || a.status === "cancelled");

  // ── IDLE / WAITING VIEW ──
  return (
    <div style={styles.idleContainer}>
      {/* Header */}
      <div style={styles.idleHeader}>
        <div style={styles.idleIconCircle}>
          <Video size={36} color="#10b981" />
        </div>
        <div>
          <h2 style={{ color: "#1f2937", margin: 0 }}>Video Consultation</h2>
          <p style={{ color: "#6b7280", margin: "4px 0 0", fontSize: 14 }}>
            When your doctor starts a consultation, you'll receive a call notification here.
          </p>
        </div>
      </div>

      {/* Two-column layout */}
      <div style={styles.idleGrid}>
        {/* ── LEFT: Pre-call Checklist ── */}
        <div style={styles.checklistCard}>
          <div style={styles.cardHeader}>
            <Activity size={20} color="#10b981" />
            <h3 style={styles.cardTitle}>Pre-call Checklist</h3>
          </div>
          <div style={styles.checklistBody}>
            <div style={styles.checkItemNew}>
              <div style={styles.checkIconCircle}><Camera size={16} color="#10b981" /></div>
              <div>
                <span style={styles.checkLabel}>Camera Access</span>
                <span style={styles.checkDesc}>Make sure your browser allows camera</span>
              </div>
            </div>
            <div style={styles.checkItemNew}>
              <div style={styles.checkIconCircle}><Mic size={16} color="#3b82f6" /></div>
              <div>
                <span style={styles.checkLabel}>Microphone Access</span>
                <span style={styles.checkDesc}>Ensure your mic is working properly</span>
              </div>
            </div>
            <div style={styles.checkItemNew}>
              <div style={styles.checkIconCircle}><Wifi size={16} color="#8b5cf6" /></div>
              <div>
                <span style={styles.checkLabel}>Stable Connection</span>
                <span style={styles.checkDesc}>Use a reliable internet connection</span>
              </div>
            </div>
            <div style={styles.checkItemNew}>
              <div style={styles.checkIconCircle}><User size={16} color="#f59e0b" /></div>
              <div>
                <span style={styles.checkLabel}>Quiet Environment</span>
                <span style={styles.checkDesc}>Find a well-lit, quiet space</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Consultation Bookings ── */}
        <div style={styles.bookingsCard}>
          <div style={styles.cardHeader}>
            <CalendarCheck size={20} color="#3b82f6" />
            <h3 style={styles.cardTitle}>My Consultations</h3>
          </div>

          {/* Upcoming / Pending */}
          {upcomingAppts.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <p style={styles.sectionLabel}>Upcoming</p>
              {upcomingAppts.map((appt) => {
                const cfg = getStatusConfig(appt.status);
                return (
                  <div key={appt._id} style={styles.apptItem}>
                    <div style={{ ...styles.apptStatusDot, backgroundColor: cfg.color }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={styles.apptTopRow}>
                        <span style={styles.apptDoctor}>Dr. {appt.doctor?.fullName || "Doctor"}</span>
                        <span style={{ ...styles.apptBadge, color: cfg.color, backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}>
                          {cfg.icon}
                          {cfg.label}
                        </span>
                      </div>
                      <div style={styles.apptMeta}>
                        <Clock size={12} color="#9ca3af" />
                        <span>{appt.date} · {appt.time}</span>
                        <span style={styles.apptTypePill}>{appt.type === "online" ? "🖥 Online" : "🏥 In-person"}</span>
                      </div>
                      {appt.reason && <p style={styles.apptReason}>{appt.reason}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Past / Completed */}
          {pastAppts.length > 0 && (
            <div>
              <p style={styles.sectionLabel}>Previous</p>
              {pastAppts.slice(0, 5).map((appt) => {
                const cfg = getStatusConfig(appt.status);
                return (
                  <div key={appt._id} style={{ ...styles.apptItem, opacity: appt.status === "cancelled" ? 0.65 : 1 }}>
                    <div style={{ ...styles.apptStatusDot, backgroundColor: cfg.color }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={styles.apptTopRow}>
                        <span style={styles.apptDoctor}>Dr. {appt.doctor?.fullName || "Doctor"}</span>
                        <span style={{ ...styles.apptBadge, color: cfg.color, backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}>
                          {cfg.icon}
                          {cfg.label}
                        </span>
                      </div>
                      <div style={styles.apptMeta}>
                        <Clock size={12} color="#9ca3af" />
                        <span>{appt.date} · {appt.time}</span>
                        <span style={styles.apptTypePill}>{appt.type === "online" ? "🖥 Online" : "🏥 In-person"}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty state */}
          {appointments.length === 0 && (
            <div style={styles.emptyBookings}>
              <CalendarClock size={40} color="#d1d5db" />
              <p style={{ color: "#9ca3af", fontSize: 14, marginTop: 8 }}>No consultations booked yet</p>
              <p style={{ color: "#d1d5db", fontSize: 12, marginTop: 2 }}>Book an appointment to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  loadingContainer: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400 },

  // Ringing
  ringingContainer: { display: "flex", alignItems: "center", justifyContent: "center", minHeight: 500 },
  ringingCard: { textAlign: "center", padding: 40, backgroundColor: "#fff", borderRadius: 20, boxShadow: "0 10px 40px rgba(0,0,0,0.1)", maxWidth: 400, width: "100%" },
  ringingPulse: { width: 100, height: 100, borderRadius: "50%", backgroundColor: "#10b981", display: "inline-flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 0 20px rgba(16,185,129,0.15), 0 0 0 40px rgba(16,185,129,0.08)" },
  ringingActions: { display: "flex", justifyContent: "center", gap: 24 },
  declineBtn: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "14px 28px", backgroundColor: "#ef4444", color: "#fff", border: "none", borderRadius: 16, cursor: "pointer", fontWeight: 600, fontSize: 14 },
  acceptBtn: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "14px 28px", backgroundColor: "#10b981", color: "#fff", border: "none", borderRadius: 16, cursor: "pointer", fontWeight: 600, fontSize: 14 },

  // Active call
  callContainer: { position: "relative", width: "100%", height: 520, backgroundColor: "#111827", borderRadius: 14, overflow: "hidden" },
  remoteVideo: { width: "100%", height: "100%", objectFit: "cover" },
  connectingOverlay: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(17,24,39,0.85)", zIndex: 5 },
  localVideoWrapper: { position: "absolute", top: 16, right: 16, width: 170, height: 120, borderRadius: 12, overflow: "hidden", border: "3px solid #fff", boxShadow: "0 4px 12px rgba(0,0,0,0.3)", zIndex: 10, backgroundColor: "#374151" },
  localVideo: { width: "100%", height: "100%", objectFit: "cover" },
  videoOffOverlay: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.6)" },
  selfLabel: { position: "absolute", bottom: 6, left: 8, fontSize: 11, color: "#fff", backgroundColor: "rgba(0,0,0,0.5)", padding: "2px 6px", borderRadius: 4 },
  callInfoBar: { position: "absolute", top: 16, left: 16, display: "flex", alignItems: "center", gap: 8, backgroundColor: "rgba(0,0,0,0.6)", padding: "6px 14px", borderRadius: 20, zIndex: 10 },
  liveDot: { width: 10, height: 10, borderRadius: "50%", backgroundColor: "#ef4444" },
  controlBar: { position: "absolute", bottom: 0, width: "100%", height: 80, backgroundColor: "rgba(17,24,39,0.9)", display: "flex", justifyContent: "center", alignItems: "center", gap: 24, backdropFilter: "blur(8px)" },
  iconBtn: { padding: 14, borderRadius: "50%", border: "none", backgroundColor: "#4b5563", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" },
  activeBtn: { padding: 14, borderRadius: "50%", border: "none", backgroundColor: "#ef4444", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" },
  endCallBtn: { padding: 14, borderRadius: "50%", border: "none", backgroundColor: "#dc2626", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" },

  // Audio-only banner
  audioOnlyBanner: { position: "absolute", bottom: 90, left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 8, backgroundColor: "rgba(245,158,11,0.9)", color: "#fff", padding: "8px 18px", borderRadius: 10, fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", zIndex: 10 },

  // Idle / waiting — two-column layout
  idleContainer: { display: "flex", flexDirection: "column", gap: 20, padding: 20, minHeight: 500 },
  idleHeader: { display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", backgroundColor: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" },
  idleIconCircle: { width: 60, height: 60, borderRadius: "50%", backgroundColor: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  idleGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 },

  // Checklist card
  checklistCard: { backgroundColor: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", boxShadow: "0 2px 10px rgba(0,0,0,0.04)", overflow: "hidden" },
  cardHeader: { display: "flex", alignItems: "center", gap: 10, padding: "16px 20px", borderBottom: "1px solid #f3f4f6" },
  cardTitle: { margin: 0, fontSize: 16, color: "#1f2937", fontWeight: 700 },
  checklistBody: { padding: "12px 20px", display: "flex", flexDirection: "column", gap: 14 },
  checkItemNew: { display: "flex", alignItems: "flex-start", gap: 12 },
  checkIconCircle: { width: 36, height: 36, borderRadius: 10, backgroundColor: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid #f3f4f6" },
  checkLabel: { display: "block", fontSize: 14, fontWeight: 600, color: "#374151" },
  checkDesc: { display: "block", fontSize: 12, color: "#9ca3af", marginTop: 2 },

  // Bookings card
  bookingsCard: { backgroundColor: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", boxShadow: "0 2px 10px rgba(0,0,0,0.04)", padding: "0 0 16px", overflow: "hidden", maxHeight: 440, overflowY: "auto" },
  sectionLabel: { fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.8, margin: "0 20px 8px", paddingTop: 4 },
  apptItem: { display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 20px", borderBottom: "1px solid #f9fafb", transition: "background 0.15s", cursor: "default" },
  apptStatusDot: { width: 8, height: 8, borderRadius: "50%", marginTop: 7, flexShrink: 0 },
  apptTopRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 },
  apptDoctor: { fontSize: 14, fontWeight: 600, color: "#1f2937", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  apptBadge: { display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap" },
  apptMeta: { display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#9ca3af", marginTop: 4 },
  apptTypePill: { fontSize: 11, padding: "1px 6px", borderRadius: 6, backgroundColor: "#f3f4f6", color: "#6b7280" },
  apptReason: { fontSize: 12, color: "#6b7280", margin: "4px 0 0", lineHeight: 1.4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  emptyBookings: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", textAlign: "center" },

  // Post-call feedback
  feedbackContainer: { display: "flex", alignItems: "center", justifyContent: "center", minHeight: 500 },
  feedbackCard: { display: "flex", flexDirection: "column", alignItems: "center", maxWidth: 480, width: "100%", padding: 32, backgroundColor: "#fff", borderRadius: 16, boxShadow: "0 8px 30px rgba(0,0,0,0.08)", border: "1px solid #e5e7eb" },
  fbDoctorHeader: { display: "flex", alignItems: "center", gap: 14, width: "100%", padding: 16, backgroundColor: "#f0fdf4", borderRadius: 12, border: "1px solid #bbf7d0" },
  fbDoctorAvatar: { width: 50, height: 50, borderRadius: "50%", backgroundColor: "#10b981", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 20 },
  fbTextarea: { width: "100%", padding: 12, borderRadius: 8, border: "1px solid #d1d5db", minHeight: 90, resize: "none", fontFamily: "inherit", fontSize: 14, outline: "none", boxSizing: "border-box" },
  fbSubmitBtn: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 20px", backgroundColor: "#10b981", color: "#fff", border: "none", borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: "pointer" },
  fbSkipBtn: { padding: "12px 20px", backgroundColor: "transparent", color: "#6b7280", border: "1px solid #d1d5db", borderRadius: 10, fontWeight: 500, fontSize: 14, cursor: "pointer" },
  fbDoneBtn: { marginTop: 16, padding: "12px 28px", backgroundColor: "#10b981", color: "#fff", border: "none", borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: "pointer" },
};

export default VideoCall;