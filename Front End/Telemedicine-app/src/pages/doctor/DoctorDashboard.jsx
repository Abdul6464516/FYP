import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  UserCheck, Users, Calendar, Video, ClipboardList, Settings, LogOut, Menu, X 
} from "lucide-react";

// Import your DoctorProfile component
import DoctorProfile from "../../Components/DoctorProfile";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Profile");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [drName, setDrName] = useState("");

  // Fetch the doctor's name from storage on load
  useEffect(() => {
    const savedName = localStorage.getItem("userName");
    if (savedName) {
      setDrName(savedName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear(); // Important: clear session data
    navigate("/");
  };

  const menuItems = [
    { id: "Profile", icon: <UserCheck size={20} />, label: "Doctor Profile" },
    { id: "Appointments", icon: <Calendar size={20} />, label: "Schedule" },
    { id: "Patients", icon: <Users size={20} />, label: "My Patients" },
    { id: "Consultation", icon: <Video size={20} />, label: "Video Consult" },
    { id: "Reports", icon: <ClipboardList size={20} />, label: "Medical Reports" },
    { id: "Settings", icon: <Settings size={20} />, label: "Settings" },
  ];

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={{ ...styles.sidebar, left: isSidebarOpen ? "0" : "-260px" }}>
        <h2 style={styles.logo}>TeleMed <span style={{fontSize: '12px', display: 'block', fontWeight: 'normal'}}>Medical Portal</span></h2>
        
        {/* Professional Greeting */}
        <div style={styles.welcomeBox}>
          <p style={styles.welcomeText}>Logged in as:</p>
          <p style={styles.userNameText}>Dr. {drName || "Specialist"}</p>
        </div>

        <nav style={styles.nav}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                ...styles.navLink,
                backgroundColor: activeTab === item.id ? "#f0fdf4" : "transparent",
                color: activeTab === item.id ? "#16a34a" : "#4b5563",
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
          <h3 style={{ margin: 0, color: '#374151' }}>{activeTab} Management</h3>
        </header>

        <main style={styles.contentBody}>
          <div style={styles.card}>
            {/* Conditional Rendering */}
            {activeTab === "Profile" && <DoctorProfile />}
            
            {activeTab === "Appointments" && <p>View and manage your upcoming patient slots.</p>}
            {activeTab === "Patients" && <p>Access electronic health records (EHR) of your assigned patients.</p>}
            {activeTab === "Consultation" && <p>Waiting room for secure video consultations.</p>}
            {activeTab === "Reports" && <p>Review lab results and historical diagnosis reports.</p>}
            {activeTab === "Settings" && <p>Update your consultation fees and availability hours.</p>}
          </div>
        </main>
      </div>
    </div>
  );
};

const styles = {
  container: { display: "flex", minHeight: "100vh", backgroundColor: "#f9fafb", fontFamily: "'Inter', sans-serif" },
  sidebar: {
    width: "260px",
    backgroundColor: "#ffffff",
    height: "100vh",
    position: "fixed",
    boxShadow: "2px 0 10px rgba(0,0,0,0.05)",
    transition: "0.3s",
    display: "flex",
    flexDirection: "column",
    zIndex: 100,
  },
  logo: { padding: "25px 20px", textAlign: "left", color: "#16a34a", fontSize: "22px", fontWeight: "bold", borderBottom: "1px solid #f3f4f6" },
  welcomeBox: { padding: "15px 20px", borderBottom: "1px solid #f3f4f6", backgroundColor: "#f9fafb" },
  welcomeText: { margin: 0, fontSize: "11px", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" },
  userNameText: { margin: 0, fontSize: "15px", fontWeight: "600", color: "#111827" },
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
    fontSize: "15px",
    fontWeight: "500",
    transition: "0.2s",
    textAlign: "left",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    padding: "20px 25px",
    border: "none",
    backgroundColor: "transparent",
    color: "#dc2626",
    cursor: "pointer",
    borderTop: "1px solid #f3f4f6",
    fontWeight: "600"
  },
  mainContent: { flex: 1, transition: "0.3s" },
  header: {
    height: "64px",
    backgroundColor: "#ffffff",
    display: "flex",
    alignItems: "center",
    padding: "0 24px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  },
  menuToggle: { border: "none", backgroundColor: "transparent", cursor: "pointer", marginRight: "16px", color: "#4b5563" },
  contentBody: { padding: "32px" },
  card: { backgroundColor: "#ffffff", padding: "28px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" },
};

export default DoctorDashboard;