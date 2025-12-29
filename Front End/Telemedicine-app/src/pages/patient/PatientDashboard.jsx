import React, { useState } from "react";
// 1. Import useNavigate from react-router-dom
import { useNavigate } from "react-router-dom"; 
import { 
  User, Calendar, Video, FileText, ClipboardList, Star, LogOut, Menu, X 
} from "lucide-react";

const PatientDashboard = () => {
  // 2. Initialize the navigate function
  const navigate = useNavigate(); 
  const [activeTab, setActiveTab] = useState("Profile");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Function to handle logout
  const handleLogout = () => {
    // If you use localStorage or tokens, clear them here (e.g., localStorage.clear())
    navigate("/"); // Redirect to the Login page
  };

  const menuItems = [
    { id: "Profile", icon: <User size={20} />, label: "Profile" },
    { id: "Appointments", icon: <Calendar size={20} />, label: "Book Appointment" },
    { id: "Consultation", icon: <Video size={20} />, label: "Video Call" },
    { id: "Prescriptions", icon: <FileText size={20} />, label: "Prescriptions" },
    { id: "Records", icon: <ClipboardList size={20} />, label: "Medical Records" },
    { id: "Feedback", icon: <Star size={20} />, label: "Feedback" },
  ];

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={{ ...styles.sidebar, left: isSidebarOpen ? "0" : "-260px" }}>
        <h2 style={styles.logo}>TeleMed</h2>
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
        
        {/* 3. Add onClick to the Logout button */}
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
          <h3>{activeTab} Management</h3>
        </header>

        <main style={styles.contentBody}>
          <div style={styles.card}>
            {activeTab === "Profile" && <ProfileView />}
            {activeTab === "Appointments" && <p>Doctor Search & Booking Interface</p>}
            {activeTab === "Consultation" && <p>Live WebRTC Video Session Area</p>}
            {activeTab === "Prescriptions" && <p>Downloadable Digital Prescriptions</p>}
            {activeTab === "Records" && <p>History of Consultations & Results</p>}
            {activeTab === "Feedback" && <p>Ratings and Reviews for Doctors</p>}
          </div>
        </main>
      </div>
    </div>
  );
};

// ... keep ProfileView and styles same as your original code
const ProfileView = () => (
  <div>
    <h4>Personal Details</h4>
    <div style={styles.grid}>
      <div style={styles.infoBox}><strong>Name:</strong> John Doe</div>
      <div style={styles.infoBox}><strong>Age:</strong> 28</div>
      <div style={styles.infoBox}><strong>Gender:</strong> Male</div>
      <div style={styles.infoBox}><strong>Medical History:</strong> No major issues</div>
    </div>
  </div>
);

const styles = {
  container: { display: "flex", minHeight: "100vh", backgroundColor: "#f8f9fa", fontFamily: "Arial, sans-serif" },
  sidebar: {
    width: "260px",
    backgroundColor: "#fff",
    height: "100vh",
    position: "fixed",
    boxShadow: "2px 0 5px rgba(0,0,0,0.05)",
    transition: "0.3s",
    display: "flex",
    flexDirection: "column",
    zIndex: 100,
  },
  logo: { padding: "20px", textAlign: "center", color: "#007bff", fontSize: "24px", borderBottom: "1px solid #eee" },
  nav: { flex: 1, padding: "20px 10px" },
  navLink: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    padding: "12px 15px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "5px",
    fontSize: "16px",
    transition: "0.2s",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    padding: "20px",
    border: "none",
    backgroundColor: "transparent",
    color: "#dc3545",
    cursor: "pointer",
    borderTop: "1px solid #eee",
  },
  mainContent: { flex: 1, transition: "0.3s" },
  header: {
    height: "60px",
    backgroundColor: "#fff",
    display: "flex",
    alignItems: "center",
    padding: "0 20px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
  },
  menuToggle: { border: "none", backgroundColor: "transparent", cursor: "pointer", marginRight: "15px" },
  contentBody: { padding: "30px" },
  card: { backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "15px" },
  infoBox: { padding: "10px", border: "1px solid #eee", borderRadius: "5px" },
};

export default PatientDashboard;