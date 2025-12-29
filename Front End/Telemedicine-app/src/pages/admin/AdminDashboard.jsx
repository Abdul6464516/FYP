import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ShieldCheck, Users, Activity, Lock, BarChart3, LogOut, Menu, X, CheckCircle, AlertCircle 
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("User Management");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    navigate("/");
  };

  const menuItems = [
    { id: "User Management", icon: <Users size={20} />, label: "User Management" },
    { id: "System Monitoring", icon: <Activity size={20} />, label: "System Activity" },
    { id: "Security & Privacy", icon: <Lock size={20} />, label: "Security & Privacy" },
    { id: "Reports & Analytics", icon: <BarChart3 size={20} />, label: "Reports & Analytics" },
  ];

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={{ ...styles.sidebar, left: isSidebarOpen ? "0" : "-260px" }}>
        <h2 style={styles.logo}>TeleMed <span style={{fontSize: '12px', display: 'block'}}>Admin Panel</span></h2>
        <nav style={styles.nav}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                ...styles.navLink,
                backgroundColor: activeTab === item.id ? "#eef2ff" : "transparent",
                color: activeTab === item.id ? "#4f46e5" : "#333",
              }}
            >
              {item.icon}
              <span style={{ marginLeft: "10px" }}>{item.label}</span>
            </button>
          ))}
        </nav>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={20} />
          <span style={{ marginLeft: "10px" }}>Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div style={{ ...styles.mainContent, marginLeft: isSidebarOpen ? "260px" : "0" }}>
        <header style={styles.header}>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={styles.menuToggle}>
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
          <h3 style={{margin: 0}}>{activeTab}</h3>
        </header>

        <main style={styles.contentBody}>
          <div style={styles.card}>
            {activeTab === "User Management" && <UserManagementView />}
            {activeTab === "System Monitoring" && <p>Live feed of appointments, feedback, and active consultations.</p>}
            {activeTab === "Security & Privacy" && <p>Log management and encryption status for patient records.</p>}
            {activeTab === "Reports & Analytics" && <p>Visual statistics for system usage and engagement.</p>}
          </div>
        </main>
      </div>
    </div>
  );
};

// Sub-component for Admin User Management
const UserManagementView = () => (
  <div>
    <h4 style={{marginTop: 0}}>Pending Doctor Verifications</h4>
    <table style={styles.table}>
      <thead>
        <tr style={styles.tableHead}>
          <th style={styles.th}>Doctor Name</th>
          <th style={styles.th}>Specialty</th>
          <th style={styles.th}>Status</th>
          <th style={styles.th}>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={styles.td}>Dr. Sarah Smith</td>
          <td style={styles.td}>Neurology</td>
          <td style={styles.td}><span style={styles.badgePending}>Pending</span></td>
          <td style={styles.td}><button style={styles.approveBtn}>Approve</button></td>
        </tr>
      </tbody>
    </table>
  </div>
);

const styles = {
  container: { display: "flex", minHeight: "100vh", backgroundColor: "#f3f4f6", fontFamily: "inherit" },
  sidebar: {
    width: "260px",
    backgroundColor: "#ffffff",
    height: "100vh",
    position: "fixed",
    boxShadow: "4px 0 10px rgba(0,0,0,0.03)",
    transition: "0.3s ease",
    display: "flex",
    flexDirection: "column",
    zIndex: 100,
  },
  logo: { padding: "25px", textAlign: "center", color: "#4f46e5", fontSize: "22px", borderBottom: "1px solid #f3f4f6", margin: 0 },
  nav: { flex: 1, padding: "20px 10px" },
  navLink: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    padding: "12px 15px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "10px",
    fontSize: "15px",
    fontWeight: "500",
    transition: "0.2s",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    padding: "20px 25px",
    border: "none",
    backgroundColor: "transparent",
    color: "#ef4444",
    cursor: "pointer",
    borderTop: "1px solid #f3f4f6",
    fontWeight: "bold",
  },
  mainContent: { flex: 1, transition: "0.3s ease" },
  header: {
    height: "70px",
    backgroundColor: "#fff",
    display: "flex",
    alignItems: "center",
    padding: "0 30px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  menuToggle: { border: "none", backgroundColor: "transparent", cursor: "pointer", marginRight: "20px" },
  contentBody: { padding: "40px" },
  card: { backgroundColor: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" },
  table: { width: "100%", borderCollapse: "collapse", marginTop: "20px" },
  tableHead: { backgroundColor: "#f9fafb", textAlign: "left" },
  th: { padding: "12px", borderBottom: "2px solid #f3f4f6", color: "#6b7280" },
  td: { padding: "12px", borderBottom: "1px solid #f3f4f6" },
  badgePending: { backgroundColor: "#fef3c7", color: "#92400e", padding: "4px 8px", borderRadius: "12px", fontSize: "12px" },
  approveBtn: { backgroundColor: "#10b981", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" }
};

export default AdminDashboard;