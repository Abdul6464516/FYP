import React, { useState } from "react";
import { 
  ShieldCheck, Lock, Eye, EyeOff, FileLock2, 
  ShieldAlert, History, Key, RefreshCcw 
} from "lucide-react";

const SecurityPrivacy = () => {
  const [encryptionEnabled, setEncryptionEnabled] = useState(true);

  // Mock data for security logs
  const securityLogs = [
    { id: 1, event: "Database Backup", status: "Success", time: "2 hours ago", ip: "192.168.1.1" },
    { id: 2, event: "Unauthorized Login Attempt", status: "Blocked", time: "5 hours ago", ip: "45.12.33.102" },
    { id: 3, event: "Encryption Key Rotated", status: "Success", time: "1 day ago", ip: "Internal System" },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Data Security & Privacy</h2>
        <p style={styles.subtitle}>Oversee platform-wide encryption and access control protocols.</p>
      </div>

      {/* 1. GLOBAL SECURITY STATUS */}
      <div style={styles.statusBanner}>
        <div style={styles.bannerInfo}>
          <ShieldCheck size={32} color="#16a34a" />
          <div>
            <div style={styles.bannerTitle}>System Security: Active</div>
            <div style={styles.bannerSub}>End-to-end encryption is currently protecting 100% of consultations.</div>
          </div>
        </div>
        <button 
          style={{...styles.toggleBtn, backgroundColor: encryptionEnabled ? "#f0fdf4" : "#fef2f2"}}
          onClick={() => setEncryptionEnabled(!encryptionEnabled)}
        >
          {encryptionEnabled ? <Lock size={18} color="#16a34a" /> : <ShieldAlert size={18} color="#dc2626" />}
          {encryptionEnabled ? "Encryption Active" : "Encryption Paused"}
        </button>
      </div>

      <div style={styles.mainGrid}>
        {/* 2. ACCESS AUDIT LOGS */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <History size={18} color="#4f46e5" />
            <h3 style={styles.cardTitle}>System Access Logs</h3>
          </div>
          <div style={styles.logList}>
            {securityLogs.map((log) => (
              <div key={log.id} style={styles.logItem}>
                <div>
                  <div style={styles.logEvent}>{log.event}</div>
                  <div style={styles.logMeta}>{log.time} • IP: {log.ip}</div>
                </div>
                <span style={{
                  ...styles.statusBadge,
                  backgroundColor: log.status === "Success" ? "#f0fdf4" : "#fef2f2",
                  color: log.status === "Success" ? "#16a34a" : "#dc2626"
                }}>
                  {log.status}
                </span>
              </div>
            ))}
          </div>
          <button style={styles.viewAllBtn}>View Full Audit Trail</button>
        </div>

        {/* 3. PRIVACY & DATA CONTROLS */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <FileLock2 size={18} color="#16a34a" />
            <h3 style={styles.cardTitle}>Privacy Controls</h3>
          </div>
          <div style={styles.controlList}>
            <div style={styles.controlRow}>
              <div>
                <div style={styles.controlLabel}>Automatic Data Redaction</div>
                <div style={styles.controlDesc}>Hide patient names in system logs for developers.</div>
              </div>
              <input type="checkbox" defaultChecked />
            </div>
            <div style={styles.controlRow}>
              <div>
                <div style={styles.controlLabel}>Two-Factor Authentication (2FA)</div>
                <div style={styles.controlDesc}>Enforce 2FA for all medical staff logins.</div>
              </div>
              <input type="checkbox" defaultChecked />
            </div>
            <div style={styles.controlRow}>
              <div>
                <div style={styles.controlLabel}>Consultation Recording</div>
                <div style={styles.controlDesc}>Allow patients to opt-out of video recordings.</div>
              </div>
              <input type="checkbox" />
            </div>
          </div>
          <div style={styles.keyActions}>
            <button style={styles.actionBtn}><RefreshCcw size={16} /> Rotate API Keys</button>
            <button style={styles.actionBtn}><Key size={16} /> Update SSL Certs</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { width: "100%" },
  header: { marginBottom: "30px" },
  title: { fontSize: "22px", fontWeight: "700", color: "#111827", margin: 0 },
  subtitle: { color: "#6b7280", fontSize: "14px", marginTop: "5px" },
  statusBanner: { 
    display: "flex", justifyContent: "space-between", alignItems: "center", 
    backgroundColor: "#fff", padding: "20px", borderRadius: "12px", 
    border: "1px solid #e5e7eb", marginBottom: "25px" 
  },
  bannerInfo: { display: "flex", alignItems: "center", gap: "15px" },
  bannerTitle: { fontSize: "16px", fontWeight: "700", color: "#111827" },
  bannerSub: { fontSize: "13px", color: "#6b7280" },
  toggleBtn: { 
    display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px", 
    borderRadius: "8px", border: "1px solid #e5e7eb", fontWeight: "600", cursor: "pointer" 
  },
  mainGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "25px" },
  card: { backgroundColor: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #e5e7eb", display: "flex", flexDirection: "column" },
  cardHeader: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", borderBottom: "1px solid #f3f4f6", paddingBottom: "10px" },
  cardTitle: { margin: 0, fontSize: "16px", fontWeight: "600", color: "#374151" },
  logList: { display: "flex", flexDirection: "column", gap: "16px", flex: 1 },
  logItem: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  logEvent: { fontSize: "14px", fontWeight: "600", color: "#111827" },
  logMeta: { fontSize: "12px", color: "#9ca3af" },
  statusBadge: { padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" },
  viewAllBtn: { marginTop: "20px", background: "none", border: "1px solid #e5e7eb", padding: "10px", borderRadius: "8px", fontSize: "13px", color: "#4b5563", cursor: "pointer", fontWeight: "500" },
  controlList: { display: "flex", flexDirection: "column", gap: "20px", marginBottom: "20px" },
  controlRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  controlLabel: { fontSize: "14px", fontWeight: "600", color: "#374151" },
  controlDesc: { fontSize: "12px", color: "#6b7280" },
  keyActions: { display: "flex", gap: "10px", borderTop: "1px solid #f3f4f6", paddingTop: "20px" },
  actionBtn: { display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", padding: "8px 15px", borderRadius: "6px", fontSize: "12px", color: "#374151", cursor: "pointer", fontWeight: "600" }
};

export default SecurityPrivacy;