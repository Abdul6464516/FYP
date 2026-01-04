import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, Calendar, Video, FileText, ClipboardList, Star, LogOut, Menu, X, Search 
} from "lucide-react";

import PatientProfile from '../../Components/PatientProfile'; 
import VideoCall from "../../Components/VideoCall";
import AppointmentBooking from "../../Components/AppointmentBooking";
import PrescriptionAccess from "../../Components/PerscriptionAccess";
import MedicalRecords from "../../Components/MedicalRecords";
import FeedbackSystem from "../../Components/FeedbackSystem";
import DoctorSearch from "../../Components/DoctorSearch";

const PatientDashboard = () => {
  const navigate = useNavigate(); 
  const [activeTab, setActiveTab] = useState("Profile");
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState(""); 

  // Handle window resizing to adjust UI automatically
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(true);
      else setIsSidebarOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const selectTab = (id) => {
    setActiveTab(id);
    if (isMobile) setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const menuItems = [
    { id: "Profile", icon: <User size={20} />, label: "Profile" },
    { id: "Search", icon: <Search size={20} />, label: "Find a Doctor" },
    { id: "Appointments", icon: <Calendar size={20} />, label: "Book Appointment" },
    { id: "Consultation", icon: <Video size={20} />, label: "Video Call" },
    { id: "Prescriptions", icon: <FileText size={20} />, label: "Prescriptions" },
    { id: "Records", icon: <ClipboardList size={20} />, label: "Medical Records" },
    { id: "Feedback", icon: <Star size={20} />, label: "Feedback" },
  ];

  return (
    <div style={styles.container}>
      {/* Overlay for mobile when sidebar is open */}
      {isMobile && isSidebarOpen && (
        <div style={styles.overlay} onClick={() => setIsSidebarOpen(false)} />
      )}

      <div style={{ 
        ...styles.sidebar, 
        left: isSidebarOpen ? "0" : "-260px",
        zIndex: isMobile ? 1000 : 100 
      }}>
        <h2 style={styles.logo}>TeleMed</h2>
        
        <nav style={styles.nav}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => selectTab(item.id)}
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

      <div style={{ 
        ...styles.mainContent, 
        marginLeft: isMobile ? "0" : (isSidebarOpen ? "260px" : "0") 
      }}>
        <header style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={styles.menuToggle}>
              {isSidebarOpen ? <X /> : <Menu />}
            </button>
            <h3 style={styles.headerTitle}>{activeTab}</h3>
          </div>

          <div style={styles.userInfoTop}>
            <div style={styles.userTextContainer}>
              <span style={styles.topUserName}>{userName || "User"}</span>
              {!isMobile && <span style={styles.topUserRole}>{userRole}</span>}
            </div>
            <div style={styles.avatar}>
              {userName ? userName.charAt(0).toUpperCase() : "U"}
            </div>
          </div>
        </header>

        <main style={styles.contentBody}>
          <div style={styles.card}>
            {activeTab === "Profile" && <PatientProfile />}
            {activeTab === "Search" && <DoctorSearch />}
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

const styles = {
  container: { display: "flex", minHeight: "100vh", backgroundColor: "#f8f9fa", fontFamily: "Arial, sans-serif", overflowX: "hidden" },
  sidebar: { width: "260px", backgroundColor: "#fff", height: "100vh", position: "fixed", boxShadow: "2px 0 5px rgba(0,0,0,0.05)", transition: "0.3s", display: "flex", flexDirection: "column" },
  overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.3)", zIndex: 999 },
  logo: { padding: "20px", textAlign: "center", color: "#007bff", fontSize: "24px", borderBottom: "1px solid #eee", marginBottom: '0', fontWeight: 'bold' },
  nav: { flex: 1, padding: "10px" },
  navLink: { display: "flex", alignItems: "center", width: "100%", padding: "12px 15px", border: "none", borderRadius: "8px", cursor: "pointer", marginBottom: "5px", fontSize: "14px", transition: "0.2s", textAlign: 'left' },
  logoutBtn: { display: "flex", alignItems: "center", padding: "20px", border: "none", backgroundColor: "transparent", color: "#dc3545", cursor: "pointer", borderTop: "1px solid #eee", fontWeight: "bold" },
  mainContent: { flex: 1, transition: "0.3s", width: "100%" },
  header: { height: "70px", backgroundColor: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 15px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)", position: 'sticky', top: 0, zIndex: 90 },
  headerTitle: { margin: 0, fontSize: "18px" },
  userInfoTop: { display: "flex", alignItems: "center", gap: "10px" },
  userTextContainer: { display: "flex", flexDirection: "column", textAlign: "right" },
  topUserName: { fontSize: "13px", fontWeight: "bold", color: "#333" },
  topUserRole: { fontSize: "10px", color: "#007bff", textTransform: "uppercase" },
  avatar: { width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#007bff", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "12px" },
  menuToggle: { border: "none", backgroundColor: "transparent", cursor: "pointer", padding: "5px" },
  contentBody: { padding: "15px" }, // Reduced padding for mobile
  card: { backgroundColor: "#fff", padding: "15px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", minHeight: '80vh' }
};

export default PatientDashboard;