import React, { useState } from "react";
import { User, BellRing, Save, DollarSign } from "lucide-react";

const DoctorSettings = () => {
  const [settings, setSettings] = useState({
    name: "Dr. Raz",
    email: "dr.raz@telemed.com",
    fee: "150",
    emailNotifications: true,
  });

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Account Settings</h2>
      
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <User size={20} color="#16a34a" />
          <h3 style={styles.sectionTitle}>Profile Information</h3>
        </div>
        <div style={styles.grid}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Display Name</label>
            <input 
              style={styles.input} 
              value={settings.name} 
              onChange={(e) => setSettings({...settings, name: e.target.value})}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Consultation Fee ($)</label>
            <input 
              style={styles.input} 
              type="number"
              value={settings.fee} 
              onChange={(e) => setSettings({...settings, fee: e.target.value})}
            />
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <BellRing size={20} color="#16a34a" />
          <h3 style={styles.sectionTitle}>Notifications</h3>
        </div>
        <div style={styles.toggleRow}>
          <span>Receive email alerts for new bookings</span>
          <input 
  type="checkbox" 
  checked={settings.emailNotifications} 
  onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})} 
  style={{ accentColor: "#16a34a", width: "13px", height: "13px", cursor: "pointer" }} 
/>
        </div>
      </div>

      <button style={styles.saveBtn}><Save size={18} /> Save Changes</button>
    </div>
  );
};

const styles = {
  container: { maxWidth: "800px" },
  title: { fontSize: "22px", fontWeight: "700", marginBottom: "25px", color: "#111827" },
  section: { backgroundColor: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e5e7eb", marginBottom: "20px" },
  sectionHeader: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" },
  sectionTitle: { margin: 0, fontSize: "16px", fontWeight: "600" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "14px", fontWeight: "500", color: "#4b5563" },
  input: { padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none" },
  toggleRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  saveBtn: { display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#16a34a", color: "#fff", border: "none", padding: "12px 25px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }
};

export default DoctorSettings;