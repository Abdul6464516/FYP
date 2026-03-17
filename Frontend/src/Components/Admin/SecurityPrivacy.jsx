import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, Lock, Eye, EyeOff, FileLock2, 
  ShieldAlert, History, Key, RefreshCcw, Users, Database,
  Trash2, Shield, Clock, CheckCircle, AlertCircle, Download
} from "lucide-react";
import {
  getSecurityLogs,
  getPatientDataAccess,
  getConsultationEncryption,
  getDataRetentionPolicies,
  getPendingDeletions,
  getStaffCompliance,
  getPatientConsent,
  approveDeletion
} from "../../services/adminActions";

const SecurityPrivacy = () => {
  const [encryptionEnabled, setEncryptionEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [securityLogs, setSecurityLogs] = useState([]);
  const [patientDataAccess, setPatientDataAccess] = useState([]);
  const [consultationEncryption, setConsultationEncryption] = useState([]);
  const [dataRetentionPolicies, setDataRetentionPolicies] = useState([]);
  const [pendingDeletions, setPendingDeletions] = useState([]);
  const [staffCompliance, setStaffCompliance] = useState([]);
  const [patientConsent, setPatientConsent] = useState([]);
  const [privacyControls, setPrivacyControls] = useState({
    dataRedaction: true,
    twoFactorAuth: true,
    consultationRecording: false,
  });

  const loadAllSecurityData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all security data in parallel
      const [
        logsData,
        accessData,
        encryptionData,
        retentionData,
        deletionData,
        complianceData,
        consentData
      ] = await Promise.all([
        getSecurityLogs(),
        getPatientDataAccess(),
        getConsultationEncryption(),
        getDataRetentionPolicies(),
        getPendingDeletions(),
        getStaffCompliance(),
        getPatientConsent()
      ]);

      // Set all the data
      setSecurityLogs(logsData);
      setPatientDataAccess(accessData);
      setConsultationEncryption(encryptionData);
      setDataRetentionPolicies(retentionData);
      setPendingDeletions(deletionData);
      setStaffCompliance(complianceData);
      setPatientConsent(consentData);

      setLoading(false);
    } catch (err) {
      console.error('Error loading security data:', err);
      setError(err.message || 'Failed to load security data');
      setLoading(false);
    }
  };

  // Load all data from backend on component mount
  useEffect(() => {
    loadAllSecurityData();
  }, []);

  // Dynamic Handlers
  const handleToggleControl = (controlName) => {
    setPrivacyControls(prev => ({
      ...prev,
      [controlName]: !prev[controlName]
    }));
  };

  const handleAddSecurityLog = (newLog) => {
    setSecurityLogs(prev => [newLog, ...prev]);
  };

  const handleDeletePatientData = (patientId) => {
    const newDeletion = {
      id: pendingDeletions.length + 1,
      patientId: patientId,
      reason: "Patient Request",
      initiatedBy: "Admin",
      date: "Just now",
      status: "Pending Review"
    };
    setPendingDeletions(prev => [newDeletion, ...prev]);
  };

  const handleUpdateStaffCompliance = (staffId, newStatus) => {
    setStaffCompliance(prev =>
      prev.map(staff =>
        staff.id === staffId ? { ...staff, complianceStatus: newStatus } : staff
      )
    );
  };

  const handleRotateEncryptionKey = (type) => {
    setConsultationEncryption(prev =>
      prev.map(item =>
        item.type === type
          ? { ...item, rotationDate: new Date().toISOString().split('T')[0] }
          : item
      )
    );
    handleAddSecurityLog({
      id: securityLogs.length + 1,
      event: `Encryption Key Rotated - ${type}`,
      status: "Success",
      time: "Just now",
      ip: "Internal System"
    });
  };

  const handleApproveDeletion = (deletionId) => {
    approveDeletion(deletionId)
      .then(() => {
        setPendingDeletions(prev =>
          prev.map(del =>
            del.id === deletionId ? { ...del, status: "Completed" } : del
          )
        );
        // Reload data to ensure consistency
        loadAllSecurityData();
      })
      .catch(err => {
        console.error('Error approving deletion:', err);
        setError('Failed to approve deletion');
      });
  };

  if (loading) {
    return (
      <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div style={{ fontSize: '16px', color: '#6b7280' }}>Loading security data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div style={{ 
          backgroundColor: '#fef2f2', 
          border: '1px solid #fecaca',
          borderRadius: '8px', 
          padding: '20px', 
          color: '#dc2626',
          display: 'flex',
          gap: '12px',
          alignItems: 'center'
        }}>
          <AlertCircle size={20} />
          <div>
            <strong>Error:</strong> {error}
            <button 
              onClick={loadAllSecurityData}
              style={{
                marginLeft: '20px',
                padding: '8px 16px',
                backgroundColor: '#dc2626',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Data Security & Privacy</h2>
        <p style={styles.subtitle}>Oversee platform-wide encryption and access control protocols ensuring patient confidentiality.</p>
      </div>

      {/* 1. GLOBAL SECURITY STATUS */}
      <div style={styles.statusBanner}>
        <div style={styles.bannerInfo}>
          <ShieldCheck size={32} color="#16a34a" />
          <div>
            <div style={styles.bannerTitle}>System Security: {encryptionEnabled ? "Active" : "Paused"}</div>
            <div style={styles.bannerSub}>End-to-end encryption is currently protecting {encryptionEnabled ? "100%" : "0%"} of consultations and patient records.</div>
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
            {securityLogs.slice(0, 5).map((log) => (
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
          <button style={styles.viewAllBtn}>View Full Audit Trail ({securityLogs.length} total)</button>
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
              <input 
                type="checkbox" 
                checked={privacyControls.dataRedaction}
                onChange={() => handleToggleControl('dataRedaction')}
              />
            </div>
            <div style={styles.controlRow}>
              <div>
                <div style={styles.controlLabel}>Two-Factor Authentication (2FA)</div>
                <div style={styles.controlDesc}>Enforce 2FA for all medical staff logins.</div>
              </div>
              <input 
                type="checkbox" 
                checked={privacyControls.twoFactorAuth}
                onChange={() => handleToggleControl('twoFactorAuth')}
              />
            </div>
            <div style={styles.controlRow}>
              <div>
                <div style={styles.controlLabel}>Consultation Recording</div>
                <div style={styles.controlDesc}>Allow patients to opt-out of video recordings.</div>
              </div>
              <input 
                type="checkbox"
                checked={privacyControls.consultationRecording}
                onChange={() => handleToggleControl('consultationRecording')}
              />
            </div>
          </div>
          <div style={styles.keyActions}>
            <button style={styles.actionBtn}><RefreshCcw size={16} /> Rotate API Keys</button>
            <button style={styles.actionBtn}><Key size={16} /> Update SSL Certs</button>
          </div>
        </div>
      </div>

      {/* 4. PATIENT DATA CONFIDENTIALITY - Staff Access Control */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <Users size={18} color="#7c3aed" />
          <h3 style={styles.cardTitle}>Patient Data Access Control</h3>
        </div>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.tableCell}>Staff Member</th>
                <th style={styles.tableCell}>Role</th>
                <th style={styles.tableCell}>Records Accessed</th>
                <th style={styles.tableCell}>Last Access</th>
                <th style={styles.tableCell}>Encryption</th>
              </tr>
            </thead>
            <tbody>
              {patientDataAccess.map((access) => (
                <tr key={access.id} style={styles.tableRow}>
                  <td style={styles.tableCell}>{access.staffName}</td>
                  <td style={styles.tableCell}>{access.role}</td>
                  <td style={styles.tableCell}>{access.recordsAccessed}</td>
                  <td style={styles.tableCell}>{access.lastAccess}</td>
                  <td style={styles.tableCell}>
                    <span style={{...styles.badge, backgroundColor: "#f0fdf4", color: "#16a34a"}}>
                      {access.encrypted ? "✓ Encrypted" : "Not Encrypted"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. CONSULTATION ENCRYPTION STATUS */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <Shield size={18} color="#059669" />
          <h3 style={styles.cardTitle}>Consultation Encryption Status</h3>
        </div>
        <div style={styles.encryptionGrid}>
          {consultationEncryption.map((item) => (
            <div key={item.id} style={styles.encryptionCard}>
              <div style={styles.encryptionHeader}>
                <div>
                  <h4 style={styles.encryptionTitle}>{item.type}</h4>
                  <div style={styles.encryptionMeta}>
                    <span style={{display: "flex", alignItems: "center", gap: "4px"}}>
                      <CheckCircle size={14} color="#16a34a" /> {item.coverage} Coverage
                    </span>
                  </div>
                </div>
                <span style={{...styles.badge, backgroundColor: "#f0fdf4", color: "#16a34a"}}>
                  Active
                </span>
              </div>
              <div style={styles.encryptionDetails}>
                <div>Key Status: <strong>{item.keyStatus}</strong></div>
                <div>Last Rotation: <strong>{item.rotationDate}</strong></div>
              </div>
              <button 
                style={styles.actionBtn}
                onClick={() => handleRotateEncryptionKey(item.type)}
              >
                <RefreshCcw size={14} /> Rotate Key
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 6. DATA RETENTION POLICIES */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <Clock size={18} color="#d97706" />
          <h3 style={styles.cardTitle}>Data Retention Policies</h3>
        </div>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.tableCell}>Data Type</th>
                <th style={styles.tableCell}>Retention Period</th>
                <th style={styles.tableCell}>Policy</th>
                <th style={styles.tableCell}>Status</th>
              </tr>
            </thead>
            <tbody>
              {dataRetentionPolicies.map((policy) => (
                <tr key={policy.id} style={styles.tableRow}>
                  <td style={styles.tableCell}>{policy.dataType}</td>
                  <td style={styles.tableCell}>{policy.retentionDays} days</td>
                  <td style={styles.tableCell}>{policy.policy}</td>
                  <td style={styles.tableCell}>
                    <span style={{...styles.badge, backgroundColor: "#f0fdf4", color: "#16a34a"}}>
                      {policy.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7. DATA DELETION & ANONYMIZATION */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <Trash2 size={18} color="#dc2626" />
          <h3 style={styles.cardTitle}>Data Deletion & Anonymization</h3>
        </div>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.tableCell}>Patient ID</th>
                <th style={styles.tableCell}>Reason</th>
                <th style={styles.tableCell}>Initiated By</th>
                <th style={styles.tableCell}>Date</th>
                <th style={styles.tableCell}>Status</th>
                <th style={styles.tableCell}>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingDeletions.map((deletion) => (
                <tr key={deletion.id} style={styles.tableRow}>
                  <td style={styles.tableCell}>{deletion.patientId}</td>
                  <td style={styles.tableCell}>{deletion.reason}</td>
                  <td style={styles.tableCell}>{deletion.initiatedBy}</td>
                  <td style={styles.tableCell}>{deletion.date}</td>
                  <td style={styles.tableCell}>
                    <span style={{
                      ...styles.badge, 
                      backgroundColor: deletion.status === "Completed" ? "#f0fdf4" : "#fef3c7",
                      color: deletion.status === "Completed" ? "#16a34a" : "#b45309"
                    }}>
                      {deletion.status}
                    </span>
                  </td>
                  <td style={styles.tableCell}>
                    {deletion.status === "Pending Review" && (
                      <button 
                        style={{...styles.smallBtn, backgroundColor: "#10b981", color: "#fff"}}
                        onClick={() => handleApproveDeletion(deletion.id)}
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 8. STAFF CONFIDENTIALITY COMPLIANCE */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <Shield size={18} color="#2563eb" />
          <h3 style={styles.cardTitle}>Staff Confidentiality Compliance</h3>
        </div>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.tableCell}>Staff Name</th>
                <th style={styles.tableCell}>Compliance Status</th>
                <th style={styles.tableCell}>Privacy Agreement</th>
                <th style={styles.tableCell}>Last Training</th>
                <th style={styles.tableCell}>Score</th>
              </tr>
            </thead>
            <tbody>
              {staffCompliance.map((staff) => (
                <tr key={staff.id} style={styles.tableRow}>
                  <td style={styles.tableCell}>{staff.staffName}</td>
                  <td style={styles.tableCell}>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: staff.complianceStatus === "Compliant" ? "#f0fdf4" : "#fef3c7",
                      color: staff.complianceStatus === "Compliant" ? "#16a34a" : "#b45309"
                    }}>
                      {staff.complianceStatus}
                    </span>
                  </td>
                  <td style={styles.tableCell}>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: staff.privacyAgreement === "Signed" ? "#f0fdf4" : "#fef3c7",
                      color: staff.privacyAgreement === "Signed" ? "#16a34a" : "#b45309"
                    }}>
                      {staff.privacyAgreement}
                    </span>
                  </td>
                  <td style={styles.tableCell}>{staff.lastTraining}</td>
                  <td style={styles.tableCell}>
                    <strong>{staff.confidentialityScore}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 9. PATIENT CONSENT MANAGEMENT */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <CheckCircle size={18} color="#0891b2" />
          <h3 style={styles.cardTitle}>Patient Consent Management</h3>
        </div>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.tableCell}>Patient ID</th>
                <th style={styles.tableCell}>Consent Type</th>
                <th style={styles.tableCell}>Status</th>
                <th style={styles.tableCell}>Date</th>
              </tr>
            </thead>
            <tbody>
              {patientConsent.map((consent) => (
                <tr key={consent.id} style={styles.tableRow}>
                  <td style={styles.tableCell}>{consent.patientId}</td>
                  <td style={styles.tableCell}>{consent.consentType}</td>
                  <td style={styles.tableCell}>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: consent.status === "Consented" ? "#f0fdf4" : "#fef2f2",
                      color: consent.status === "Consented" ? "#16a34a" : "#dc2626"
                    }}>
                      {consent.status}
                    </span>
                  </td>
                  <td style={styles.tableCell}>{consent.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { width: "100%", padding: "20px" },
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
  mainGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "25px", marginBottom: "25px" },
  card: { backgroundColor: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #e5e7eb", marginBottom: "25px" },
  cardHeader: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", borderBottom: "1px solid #f3f4f6", paddingBottom: "10px" },
  cardTitle: { margin: 0, fontSize: "16px", fontWeight: "600", color: "#374151" },
  logList: { display: "flex", flexDirection: "column", gap: "16px", marginBottom: "20px" },
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
  actionBtn: { display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", padding: "8px 15px", borderRadius: "6px", fontSize: "12px", color: "#374151", cursor: "pointer", fontWeight: "600", marginTop: "10px" },
  
  // Table Styles
  tableContainer: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "13px" },
  tableHeader: { backgroundColor: "#f9fafb", borderBottom: "2px solid #e5e7eb" },
  tableRow: { borderBottom: "1px solid #e5e7eb" },
  tableCell: { padding: "12px", textAlign: "left" },
  
  // Badge
  badge: { padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", display: "inline-block" },
  
  // Encryption Grid
  encryptionGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" },
  encryptionCard: { backgroundColor: "#f9fafb", padding: "16px", borderRadius: "8px", border: "1px solid #e5e7eb" },
  encryptionHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" },
  encryptionTitle: { margin: "0 0 4px 0", fontSize: "14px", fontWeight: "600", color: "#374151" },
  encryptionMeta: { fontSize: "12px", color: "#6b7280" },
  encryptionDetails: { fontSize: "12px", color: "#6b7280", marginBottom: "10px", lineHeight: "1.6" },
  
  // Small Button
  smallBtn: { padding: "4px 8px", fontSize: "11px", borderRadius: "4px", border: "none", cursor: "pointer", fontWeight: "600" }
};

export default SecurityPrivacy;
