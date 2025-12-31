import React, { useState } from "react";
import { 
  Video, VideoOff, Mic, MicOff, PhoneOff, MessageSquare, 
  FileText, User, Maximize, Settings 
} from "lucide-react";

const ConsultationInterface = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [notes, setNotes] = useState("");

  return (
    <div style={styles.container}>
      {/* LEFT: Video Session Area */}
      <div style={styles.videoSection}>
        <div style={styles.mainVideo}>
          {/* Main Patient Video Placeholder */}
          <div style={styles.videoPlaceholder}>
            <User size={80} color="#9ca3af" />
            <p style={{ color: "#9ca3af", marginTop: "10px" }}>Patient: John Doe (Connecting...)</p>
          </div>

          {/* Small Doctor Preview (Picture-in-Picture) */}
          <div style={styles.doctorPreview}>
            {!isVideoOff ? (
               <div style={{ backgroundColor: "#374151", height: "100%", borderRadius: "8px" }} />
            ) : (
              <VideoOff size={24} color="white" />
            )}
            <span style={styles.previewLabel}>You</span>
          </div>

          {/* Video Controls Overlay */}
          <div style={styles.controlsBar}>
            <button onClick={() => setIsMuted(!isMuted)} style={isMuted ? styles.controlBtnActive : styles.controlBtn}>
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <button onClick={() => setIsVideoOff(!isVideoOff)} style={isVideoOff ? styles.controlBtnActive : styles.controlBtn}>
              {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
            </button>
            <button style={styles.settingsBtn}>
              <Settings size={20} />
            </button>
            <button style={styles.endCallBtn}>
              <PhoneOff size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT: Sidebar for Notes & Info */}
      <div style={styles.sidePanel}>
        <div style={styles.panelHeader}>
          <FileText size={18} />
          <h4 style={{ margin: 0 }}>Consultation Notes</h4>
        </div>
        
        <div style={styles.patientBrief}>
          <p><strong>Patient:</strong> John Doe</p>
          <p><strong>Reason:</strong> Follow-up for Hypertension</p>
        </div>

        <textarea
          style={styles.notesArea}
          placeholder="Type clinical notes or prescription details here..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <button style={styles.saveBtn}>
          Save & Finalize Session
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: { display: "flex", gap: "20px", height: "100%", flexWrap: "wrap" },
  videoSection: { flex: "2", minWidth: "300px", position: "relative" },
  mainVideo: { 
    width: "100%", 
    aspectRatio: "16/9", 
    backgroundColor: "#1f2937", 
    borderRadius: "12px", 
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden"
  },
  videoPlaceholder: { textAlign: "center" },
  doctorPreview: { 
    position: "absolute", 
    top: "20px", 
    right: "20px", 
    width: "120px", 
    height: "80px", 
    backgroundColor: "#4b5563", 
    borderRadius: "8px", 
    border: "2px solid #fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  previewLabel: { position: "absolute", bottom: "5px", left: "5px", fontSize: "10px", color: "white", backgroundColor: "rgba(0,0,0,0.5)", padding: "2px 4px", borderRadius: "4px" },
  controlsBar: { 
    position: "absolute", 
    bottom: "20px", 
    left: "50%", 
    transform: "translateX(-50%)", 
    display: "flex", 
    gap: "15px", 
    backgroundColor: "rgba(31, 41, 55, 0.8)", 
    padding: "10px 20px", 
    borderRadius: "30px",
    backdropFilter: "blur(5px)"
  },
  controlBtn: { border: "none", backgroundColor: "#4b5563", color: "white", width: "40px", height: "40px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  controlBtnActive: { border: "none", backgroundColor: "#dc2626", color: "white", width: "40px", height: "40px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  settingsBtn: { border: "none", backgroundColor: "transparent", color: "white", cursor: "pointer" },
  endCallBtn: { border: "none", backgroundColor: "#dc2626", color: "white", width: "40px", height: "40px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  sidePanel: { flex: "1", minWidth: "280px", display: "flex", flexDirection: "column", backgroundColor: "#f9fafb", borderRadius: "12px", padding: "15px", border: "1px solid #e5e7eb" },
  panelHeader: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px", color: "#374151" },
  patientBrief: { fontSize: "14px", color: "#4b5563", marginBottom: "15px", padding: "10px", backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #eee" },
  notesArea: { flex: 1, width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db", resize: "none", fontFamily: "inherit", fontSize: "14px", outline: "none" },
  saveBtn: { marginTop: "15px", backgroundColor: "#16a34a", color: "white", border: "none", padding: "12px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }
};

export default ConsultationInterface;