import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, Calendar, Video, FileText, ClipboardList, Star, LogOut, Menu, X, Search 
} from "lucide-react";

// --- COMPONENT IMPORTS ---
import PatientProfile from '../../Components/PatientProfile'; 
import VideoCall from "../../Components/VideoCall";
import AppointmentBooking from "../../Components/AppointmentBooking";
import PrescriptionAccess from "../../Components/PerscriptionAccess";
import MedicalRecords from "../../Components/MedicalRecords";
import FeedbackSystem from "../../Components/FeedbackSystem";
import DoctorSearch from "../../Components/DoctorSearch"; // 1. Added DoctorSearch Import

const PatientDashboard = () => {
  const navigate = useNavigate(); 
  const [activeTab, setActiveTab] = useState("Profile");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState(""); 

  useEffect(() => {
    const savedName = localStorage.getItem("userName");
    const savedRole = localStorage.getItem("userRole") || "Patient"; 
    
    if (savedName) setUserName(savedName);
    setUserRole(savedRole);
  }, []);

  const handleLogout = () => {
    localStorage.clear(); 
    navigate("/"); 
  };

  const menuItems = [
    { id: "Profile", icon: <User size={20} />, label: "Profile" },
    { id: "Search", icon: <Search size={20} />, label: "Find a Doctor" }, // 2. Added Search to Menu
    { id: "Appointments", icon: <Calendar size={20} />, label: "Book Appointment" },
    { id: "Consultation", icon: <Video size={20} />, label: "Video Call" },
    { id: "Prescriptions", icon: <FileText size={20} />, label: "Prescriptions" },
    { id: "Records", icon: <ClipboardList size={20} />, label: "Medical Records" },
    { id: "Feedback", icon: <Star size={20} />, label: "Feedback" },
  ];

  return (
    <div style={styles.container}>
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
        
        <button style={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={20} />
          <span style={{ marginLeft: "10px" }}>Logout</span>
        </button>
      </div>

      <div style={{ ...styles.mainContent, marginLeft: isSidebarOpen ? "260px" : "0" }}>
        <header style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={styles.menuToggle}>
              {isSidebarOpen ? <X /> : <Menu />}
            </button>
            <h3 style={{ margin: 0 }}>{activeTab} Management</h3>
          </div>

          <div style={styles.userInfoTop}>
            <div style={styles.userTextContainer}>
              <span style={styles.topUserName}>{userName || "User"}</span>
              <span style={styles.topUserRole}>{userRole}</span>
            </div>
            <div style={styles.avatar}>
              {userName ? userName.charAt(0).toUpperCase() : "U"}
            </div>
          </div>
        </header>

        <main style={styles.contentBody}>
          <div style={styles.card}>
            {activeTab === "Profile" && <PatientProfile />}
            {activeTab === "Search" && <DoctorSearch />} {/* 3. Added Search Rendering */}
            {activeTab === "Appointments" && <AppointmentBooking />}
            {activeTab === "Consultation" && <VideoCall />}
            {activeTab === "Prescriptions" && <PrescriptionAccess />}
            {activeTab === "Records" && <MedicalRecords />}
            {activeTab === "Feedback" && <FeedbackSystem />}
          </div>
        </main>
      </div>
    </div>
  );
};

// ... styles remains exactly as you provided ...
const styles = {
  container: { display: "flex", minHeight: "100vh", backgroundColor: "#f8f9fa", fontFamily: "Arial, sans-serif" },
  sidebar: { width: "260px", backgroundColor: "#fff", height: "100vh", position: "fixed", boxShadow: "2px 0 5px rgba(0,0,0,0.05)", transition: "0.3s", display: "flex", flexDirection: "column", zIndex: 100 },
  logo: { padding: "20px", textAlign: "center", color: "#007bff", fontSize: "24px", borderBottom: "1px solid #eee", marginBottom: '0', fontWeight: 'bold' },
  nav: { flex: 1, padding: "20px 10px" },
  navLink: { display: "flex", alignItems: "center", width: "100%", padding: "12px 15px", border: "none", borderRadius: "8px", cursor: "pointer", marginBottom: "5px", fontSize: "15px", transition: "0.2s", textAlign: 'left' },
  logoutBtn: { display: "flex", alignItems: "center", padding: "20px", border: "none", backgroundColor: "transparent", color: "#dc3545", cursor: "pointer", borderTop: "1px solid #eee", fontWeight: "bold" },
  mainContent: { flex: 1, transition: "0.3s" },
  header: { height: "70px", backgroundColor: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 25px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)", position: 'sticky', top: 0, zIndex: 90 },
  userInfoTop: { display: "flex", alignItems: "center", gap: "12px" },
  userTextContainer: { display: "flex", flexDirection: "column", textAlign: "right" },
  topUserName: { fontSize: "14px", fontWeight: "bold", color: "#333" },
  topUserRole: { fontSize: "11px", color: "#007bff", textTransform: "uppercase", letterSpacing: "0.5px" },
  avatar: { width: "35px", height: "35px", borderRadius: "50%", backgroundColor: "#007bff", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "14px" },
  menuToggle: { border: "none", backgroundColor: "transparent", cursor: "pointer", marginRight: "15px" },
  contentBody: { padding: "30px" },
  card: { backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", minHeight: '500px' }
};

export default PatientDashboard;