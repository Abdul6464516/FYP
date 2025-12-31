import React, { useState } from "react";
import { 
  UserCheck, UserX, ShieldCheck, Search, 
  Filter, MoreVertical, CheckCircle, XCircle 
} from "lucide-react";

const UserManagement = () => {
  const [activeSubTab, setActiveSubTab] = useState("Doctors");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock Data
  const [doctors, setDoctors] = useState([
    { id: 1, name: "Dr. Raz", specialty: "Cardiology", status: "Pending", email: "raz@med.com", joined: "2025-12-28" },
    { id: 2, name: "Dr. Sarah", specialty: "Dermatology", status: "Verified", email: "sarah@med.com", joined: "2025-12-20" },
  ]);

  const [patients, setPatients] = useState([
    { id: 101, name: "John Doe", email: "john@email.com", status: "Active", joined: "2025-12-25" },
    { id: 102, name: "Jane Smith", email: "jane@email.com", status: "Active", joined: "2025-12-27" },
  ]);

  const handleVerify = (id) => {
    setDoctors(doctors.map(dr => dr.id === id ? { ...dr, status: "Verified" } : dr));
  };

  const handleReject = (id) => {
    setDoctors(doctors.map(dr => dr.id === id ? { ...dr, status: "Rejected" } : dr));
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>User Management</h2>
        <div style={styles.tabSwitcher}>
          <button 
            style={{...styles.tabBtn, borderBottom: activeSubTab === "Doctors" ? "3px solid #16a34a" : "none"}}
            onClick={() => setActiveSubTab("Doctors")}
          >
            Doctor Verifications
          </button>
          <button 
            style={{...styles.tabBtn, borderBottom: activeSubTab === "Patients" ? "3px solid #16a34a" : "none"}}
            onClick={() => setActiveSubTab("Patients")}
          >
            Patient Registrations
          </button>
        </div>
      </div>

      <div style={styles.toolbar}>
        <div style={styles.searchBox}>
          <Search size={18} color="#9ca3af" />
          <input 
            placeholder={`Search ${activeSubTab.toLowerCase()}...`} 
            style={styles.searchInput}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thRow}>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>{activeSubTab === "Doctors" ? "Specialty" : "Email"}</th>
              <th style={styles.th}>Joined Date</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activeSubTab === "Doctors" ? (
              doctors.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase())).map(dr => (
                <tr key={dr.id} style={styles.tr}>
                  <td style={styles.td}>{dr.name}</td>
                  <td style={styles.td}>{dr.specialty}</td>
                  <td style={styles.td}>{dr.joined}</td>
                  <td style={styles.td}>
                    <span style={{...styles.badge, ...styles[dr.status.toLowerCase()]}}>{dr.status}</span>
                  </td>
                  <td style={styles.td}>
                    {dr.status === "Pending" ? (
                      <div style={styles.actionGroup}>
                        <button onClick={() => handleVerify(dr.id)} style={styles.verifyBtn} title="Approve"><CheckCircle size={18} /></button>
                        <button onClick={() => handleReject(dr.id)} style={styles.rejectBtn} title="Reject"><XCircle size={18} /></button>
                      </div>
                    ) : (
                      <MoreVertical size={18} color="#9ca3af" />
                    )}
                  </td>
                </tr>
              ))
            ) : (
              patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(pa => (
                <tr key={pa.id} style={styles.tr}>
                  <td style={styles.td}>{pa.name}</td>
                  <td style={styles.td}>{pa.email}</td>
                  <td style={styles.td}>{pa.joined}</td>
                  <td style={styles.td}>
                    <span style={{...styles.badge, ...styles.verified}}>{pa.status}</span>
                  </td>
                  <td style={styles.td}><MoreVertical size={18} color="#9ca3af" /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: { width: "100%" },
  header: { marginBottom: "25px" },
  title: { fontSize: "22px", fontWeight: "700", color: "#111827", marginBottom: "15px" },
  tabSwitcher: { display: "flex", gap: "30px", borderBottom: "1px solid #e5e7eb" },
  tabBtn: { background: "none", border: "none", padding: "10px 5px", fontSize: "15px", fontWeight: "600", color: "#4b5563", cursor: "pointer" },
  toolbar: { margin: "20px 0" },
  searchBox: { display: "flex", alignItems: "center", gap: "10px", backgroundColor: "#fff", border: "1px solid #d1d5db", padding: "10px 15px", borderRadius: "8px", width: "350px" },
  searchInput: { border: "none", outline: "none", width: "100%", fontSize: "14px" },
  tableWrapper: { backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
  thRow: { backgroundColor: "#f9fafb" },
  th: { padding: "15px", fontSize: "13px", color: "#6b7280", fontWeight: "600" },
  tr: { borderBottom: "1px solid #f3f4f6" },
  td: { padding: "15px", fontSize: "14px", color: "#374151" },
  badge: { padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" },
  pending: { backgroundColor: "#fefce8", color: "#a16207" },
  verified: { backgroundColor: "#f0fdf4", color: "#16a34a" },
  rejected: { backgroundColor: "#fef2f2", color: "#dc2626" },
  actionGroup: { display: "flex", gap: "12px" },
  verifyBtn: { background: "none", border: "none", color: "#16a34a", cursor: "pointer" },
  rejectBtn: { background: "none", border: "none", color: "#dc2626", cursor: "pointer" }
};

export default UserManagement;