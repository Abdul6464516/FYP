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
import "./VideoCall.css";

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
      <div className="vc-loading-container">
        <Loader size={40} style={{ animation: "spin 1s linear infinite" }} color="#10b981" />
        <p>Loading...</p>
      </div>
    );
  }

  // ── INCOMING CALL — DOCTOR STARTED CONSULTATION ──
  if (callStatus === "ringing" && incomingCall) {
    return (
      <div className="vc-ringing-container">
        <div className="vc-ringing-card">
          <div className="vc-ringing-pulse">
            <Video size={50} color="#fff" />
          </div>
          <h2>Consultation Started</h2>
          <p>
            Dr. {incomingCall.callerName} has started the consultation.
          </p>
          <p>
            Please click <strong>Join Now</strong> to begin your video consultation.
          </p>
          <div className="vc-ringing-actions">
            <button onClick={handleDeclineCall} className="vc-decline-btn">
              <PhoneOff size={24} />
              <span>Decline</span>
            </button>
            <button onClick={handleAcceptCall} className="vc-accept-btn">
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
      <div className="vc-call-container">
        <video ref={remoteVideoRef} autoPlay playsInline className="vc-remote-video" />

        {/* Connecting overlay */}
        {callStatus === "connecting" && (
          <div className="vc-connecting-overlay">
            <Loader size={36} color="#fff" style={{ animation: "spin 1s linear infinite" }} />
            <p>Connecting to Dr. {doctorName}...</p>
          </div>
        )}

        {/* Local self-view */}
        <div className="vc-local-video-wrapper">
          <video ref={localVideoRef} autoPlay playsInline muted className="vc-local-video" />
          {isCameraOff && <div className="vc-video-off-overlay"><VideoOff size={24} color="#fff" /></div>}
          <span className="vc-self-label">You</span>
        </div>

        {/* Call info */}
        {callStatus === "connected" && (
          <div className="vc-call-info-bar">
            <div className="vc-live-dot" />
            <span>LIVE</span>
            <span className="vc-live-meta">
              <Clock size={14} style={{ verticalAlign: "middle", marginRight: 4 }} />{formatDuration(callDuration)}
            </span>
            <span className="vc-live-meta">with Dr. {doctorName}</span>
          </div>
        )}

        {/* Control bar */}
        <div className="vc-control-bar">
          <button onClick={toggleMute} className={isMuted ? "vc-active-btn" : "vc-icon-btn"}>
            {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
          </button>
          <button onClick={toggleVideo} className={isCameraOff ? "vc-active-btn" : "vc-icon-btn"} title={isCameraOff ? "Enable Camera" : "Disable Camera"}>
            {isCameraOff ? <VideoOff size={22} /> : <Video size={22} />}
          </button>
          <button onClick={() => cleanUpCall(true)} className="vc-end-call-btn">
            <PhoneOff size={22} />
          </button>
        </div>

        {/* Audio-only notice */}
        {isCameraOff && !localStreamRef.current?.getVideoTracks().length && (
          <div className="vc-audio-only-banner">
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
        <div className="vc-feedback-container">
          <div className="vc-feedback-card">
            <CheckCircle size={60} color="#10b981" />
            <h3>Thank you for your feedback!</h3>
            <p>Your review helps us improve our healthcare services.</p>
            <button onClick={handleSkip} className="vc-fb-done-btn">Back to Dashboard</button>
          </div>
        </div>
      );
    }

    return (
      <div className="vc-feedback-container">
        <div className="vc-feedback-card">
          {/* Doctor info header */}
          <div className="vc-fb-doctor-header">
            <div className="vc-fb-doctor-avatar">
              {endedCallInfo.doctorName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3>Dr. {endedCallInfo.doctorName}</h3>
              <p>
                Consultation ended · {formatDuration(endedCallInfo.duration)}
              </p>
            </div>
          </div>

          <h3>Rate Your Consultation</h3>
          <p>
            How was your experience with Dr. {endedCallInfo.doctorName}?
          </p>

          <form onSubmit={handleFeedbackSubmit} className="vc-fb-form">
            {/* Star rating */}
            <div className="vc-star-rating">
              <div className="vc-stars" role="radiogroup" aria-label="Rate your consultation">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    className="vc-star-btn"
                    aria-label={`${star} star${star === 1 ? "" : "s"}`}
                    aria-checked={fbRating === star}
                    role="radio"
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
              </div>
              <div className="vc-rating-slot" aria-live="polite">
                {fbRating > 0 && (
                  <span className="vc-rating-text">{fbRating} / 5</span>
                )}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="vc-fb-label">
                Share your thoughts (Optional)
              </label>
              <textarea
                className="vc-fb-textarea"
                placeholder="How was the consultation? Did the doctor address your concerns?"
                value={fbComment}
                onChange={(e) => setFbComment(e.target.value)}
              />
            </div>

            <div className="vc-fb-button-group">
              <button type="button" onClick={handleSkip} className="vc-fb-skip-btn">Skip</button>
              <button type="submit" disabled={fbSubmitting} className="vc-fb-submit-btn">
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
    <div className="vc-idle-container">
      {/* Header */}
      <div className="vc-idle-header">
        <div className="vc-idle-icon-circle">
          <Video size={36} color="#10b981" />
        </div>
        <div>
          <h2>Video Consultation</h2>
          <p>
            When your doctor starts a consultation, you'll receive a call notification here.
          </p>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="vc-idle-grid">
        {/* ── LEFT: Pre-call Checklist ── */}
        <div className="vc-card vc-checklist-card">
          <div className="vc-card-header">
            <Activity size={20} color="#10b981" />
            <h3 className="vc-card-title">Pre-call Checklist</h3>
          </div>
          <div className="vc-checklist-body">
            <div className="vc-check-item">
              <div className="vc-check-icon-circle"><Camera size={16} color="#10b981" /></div>
              <div>
                <span className="vc-check-label">Camera Access</span>
                <span className="vc-check-desc">Make sure your browser allows camera</span>
              </div>
            </div>
            <div className="vc-check-item">
              <div className="vc-check-icon-circle"><Mic size={16} color="#3b82f6" /></div>
              <div>
                <span className="vc-check-label">Microphone Access</span>
                <span className="vc-check-desc">Ensure your mic is working properly</span>
              </div>
            </div>
            <div className="vc-check-item">
              <div className="vc-check-icon-circle"><Wifi size={16} color="#8b5cf6" /></div>
              <div>
                <span className="vc-check-label">Stable Connection</span>
                <span className="vc-check-desc">Use a reliable internet connection</span>
              </div>
            </div>
            <div className="vc-check-item">
              <div className="vc-check-icon-circle"><User size={16} color="#f59e0b" /></div>
              <div>
                <span className="vc-check-label">Quiet Environment</span>
                <span className="vc-check-desc">Find a well-lit, quiet space</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Consultation Bookings ── */}
        <div className="vc-card vc-bookings-card">
          <div className="vc-card-header">
            <CalendarCheck size={20} color="#3b82f6" />
            <h3 className="vc-card-title">My Consultations</h3>
          </div>

          {/* Upcoming / Pending */}
          {upcomingAppts.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <p className="vc-section-label">Upcoming</p>
              {upcomingAppts.map((appt) => {
                const cfg = getStatusConfig(appt.status);
                return (
                  <div key={appt._id} className="vc-appt-item">
                    <div className="vc-appt-status-dot" style={{ backgroundColor: cfg.color }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="vc-appt-top-row">
                        <span className="vc-appt-doctor">Dr. {appt.doctor?.fullName || "Doctor"}</span>
                        <span className="vc-appt-badge" style={{ color: cfg.color, backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}>
                          {cfg.icon}
                          {cfg.label}
                        </span>
                      </div>
                      <div className="vc-appt-meta">
                        <Clock size={12} color="#9ca3af" />
                        <span>{appt.date} · {appt.time}</span>
                        <span className="vc-appt-type-pill">{appt.type === "online" ? "🖥 Online" : "🏥 In-person"}</span>
                      </div>
                      {appt.reason && <p className="vc-appt-reason">{appt.reason}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Past / Completed */}
          {pastAppts.length > 0 && (
            <div>
              <p className="vc-section-label">Previous</p>
              {pastAppts.slice(0, 5).map((appt) => {
                const cfg = getStatusConfig(appt.status);
                return (
                  <div key={appt._id} className="vc-appt-item" style={{ opacity: appt.status === "cancelled" ? 0.65 : 1 }}>
                    <div className="vc-appt-status-dot" style={{ backgroundColor: cfg.color }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="vc-appt-top-row">
                        <span className="vc-appt-doctor">Dr. {appt.doctor?.fullName || "Doctor"}</span>
                        <span className="vc-appt-badge" style={{ color: cfg.color, backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}>
                          {cfg.icon}
                          {cfg.label}
                        </span>
                      </div>
                      <div className="vc-appt-meta">
                        <Clock size={12} color="#9ca3af" />
                        <span>{appt.date} · {appt.time}</span>
                        <span className="vc-appt-type-pill">{appt.type === "online" ? "🖥 Online" : "🏥 In-person"}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty state */}
          {appointments.length === 0 && (
            <div className="vc-empty-bookings">
              <CalendarClock size={40} color="#d1d5db" />
              <p>No consultations booked yet</p>
              <p>Book an appointment to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCall;