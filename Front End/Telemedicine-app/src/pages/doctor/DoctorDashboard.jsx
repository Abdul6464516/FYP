import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  UserRound, CalendarCheck, Video, PencilLine, History, Bell, LogOut, Menu, X 
} from "lucide-react";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Profile");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    navigate("/");
  };

  // Sidebar Items for Doctor Module
  const menuItems = [
    { id: "Profile", icon: <UserRound size={20} />, label: "Doctor Profile" },
    { id: "Appointments", icon: <CalendarCheck size={20} />, label: "Manage Appointments" },
    { id: "Consultation", icon: <Video size={20} />, label: "Consultation Room" },
    { id: "Prescription", icon: <PencilLine size={20} />, label: "Generate Prescription" },
    { id: "History", icon: <History size={20} />, label: "Patient Records" },
    { id: "Notifications", icon: <Bell size={20} />, label: "Notifications" },
  ];

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={{ ...styles.sidebar, left: isSidebarOpen ? "0" : "-260px" }}>
        <h2 style={styles.logo}>TeleMed <span style={{fontSize: '12px', display: 'block'}}>Doctor Portal</span></h2>
        <nav style={styles.nav}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                ...styles.navLink,
                backgroundColor: activeTab === item.id ? "#e7f1ff" : "transparent",
                color: activeTab === item.id ? "#007bff" : "#333",
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

      {/* Main Content Area */}
      <div style={{ ...styles.mainContent, marginLeft: isSidebarOpen ? "260px" : "0" }}>
        <header style={styles.header}>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={styles.menuToggle}>
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
          <h3 style={{margin: 0}}>{activeTab}</h3>
        </header>

        <main style={styles.contentBody}>
          <div style={styles.card}>
            {activeTab === "Profile" && <DoctorProfileView />}
            {activeTab === "Appointments" && <p>List of pending/approved patient appointments.</p>}
            {activeTab === "Consultation" && <p>Video/Audio Interface for active sessions.</p>}
            {activeTab === "Prescription" && <p>Digital Prescription Writing Tool.</p>}
            {activeTab === "History" && <p>Searchable access to patient medical histories.</p>}
            {activeTab === "Notifications" && <p>Real-time alerts for booking changes.</p>}
          </div>
        </main>
      </div>
    </div>
  );
};

// Sub-component for Doctor Profile
const DoctorProfileView = () => (
  <div>
    <h4 style={{marginTop: 0}}>Professional Details</h4>
    <div style={styles.grid}>
      <div style={styles.infoBox}><strong>Specialty:</strong> Cardiologist</div>
      <div style={styles.infoBox}><strong>Qualifications:</strong> MBBS, MD (Internal Medicine)</div>
      <div style={styles.infoBox}><strong>Experience:</strong> 12+ Years</div>
      <div style={styles.infoBox}><strong>Schedule:</strong> Mon-Fri (10:00 AM - 4:00 PM)</div>
    </div>
  </div>
);

const styles = {
  container: { display: "flex", minHeight: "100vh", backgroundColor: "#f0f2f5", fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif" },
  sidebar: {
    width: "260px",
    backgroundColor: "#fff",
    height: "100vh",
    position: "fixed",
    boxShadow: "2px 0 10px rgba(0,0,0,0.05)",
    transition: "0.3s ease",
    display: "flex",
    flexDirection: "column",
    zIndex: 100,
  },
  logo: { padding: "20px", textAlign: "center", color: "#007bff", fontSize: "22px", borderBottom: "1px solid #f0f0f0", margin: 0 },
  nav: { flex: 1, padding: "15px 10px" },
  navLink: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    padding: "14px 18px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    marginBottom: "8px",
    fontSize: "15px",
    fontWeight: "500",
    transition: "all 0.2s",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    padding: "20px 25px",
    border: "none",
    backgroundColor: "transparent",
    color: "#e63946",
    cursor: "pointer",
    borderTop: "1px solid #f0f0f0",
    fontWeight: "600",
  },
  mainContent: { flex: 1, transition: "0.3s ease" },
  header: {
    height: "70px",
    backgroundColor: "#fff",
    display: "flex",
    alignItems: "center",
    padding: "0 30px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  menuToggle: { border: "none", backgroundColor: "transparent", cursor: "pointer", marginRight: "20px" },
  contentBody: { padding: "40px" },
  card: { backgroundColor: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 8px 30px rgba(0,0,0,0.05)" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "20px" },
  infoBox: { padding: "15px", border: "1px solid #edf2f7", borderRadius: "8px", backgroundColor: "#fafafa" },
};

export default DoctorDashboard;