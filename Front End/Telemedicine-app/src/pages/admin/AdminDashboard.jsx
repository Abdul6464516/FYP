import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ShieldCheck, Users, Activity, Lock, BarChart3, LogOut, Menu, X, UserCog 
} from "lucide-react";

// --- COMPONENT IMPORTS ---
import AdminProfile from "../../Components/AdminProfile";
import UserManagement from "../../Components/UserManagement";
import SystemMonitoring from "../../Components/SystemMonitoring";
import SecurityPrivacy from "../../Components/SecurityPrivacy";
import ReportsAnalytics from "../../Components/ReportsAnalytics";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Admin Profile");
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };

    window.addEventListener("resize", handleResize);
    const savedName = localStorage.getItem("userName");
    if (savedName) setAdminName(savedName);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const menuItems = [
    { id: "Admin Profile", icon: <UserCog size={20} />, label: "Admin Profile" },
    { id: "User Management", icon: <Users size={20} />, label: "User Management" },
    { id: "System Monitoring", icon: <Activity size={20} />, label: "System Activity" },
    { id: "Security & Privacy", icon: <Lock size={20} />, label: "Security & Privacy" },
    { id: "Reports & Analytics", icon: <BarChart3 size={20} />, label: "Reports & Analytics" },
  ];

  return (
    <div style={styles.container}>
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div style={styles.overlay} onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <div style={{ 
        ...styles.sidebar, 
        left: isSidebarOpen ? "0" : "-280px",
        width: isMobile ? "250px" : "260px"
      }}>
        <h2 style={styles.logo}>
          TeleMed 
          <span style={{fontSize: '12px', display: 'block', fontWeight: 'normal', color: '#6366f1'}}>
            Admin Panel
          </span>
        </h2>
        
        <nav style={styles.nav}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (isMobile) setIsSidebarOpen(false);
              }}
              style={{
                ...styles.navLink,
                backgroundColor: activeTab === item.id ? "#eef2ff" : "transparent",
                color: activeTab === item.id ? "#4f46e5" : "#4b5563",
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

      {/* MAIN CONTENT */}
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
            <div style={isMobile ? styles.hideOnMobile : styles.userTextContainer}>
              <span style={styles.topUserName}>{adminName || "Administrator"}</span>
              <span style={styles.topUserRole}>System Admin</span>
            </div>
            <div style={styles.avatar}>
              <ShieldCheck size={20} />
            </div>
          </div>
        </header>

        <main style={{ ...styles.contentBody, padding: isMobile ? "15px" : "30px" }}>
          <div style={styles.card}>
            {/* DYNAMIC RENDERING OF COMPONENTS */}
            {activeTab === "Admin Profile" && <AdminProfile />}
            {activeTab === "User Management" && <UserManagement />}
            {activeTab === "System Monitoring" && <SystemMonitoring />}
            {activeTab === "Security & Privacy" && <SecurityPrivacy />}
            {activeTab === "Reports & Analytics" && <ReportsAnalytics />}
          </div>
        </main>
      </div>
    </div>
  );
};

const styles = {
  container: { display: "flex", minHeight: "100vh", backgroundColor: "#f3f4f6", fontFamily: "'Inter', sans-serif", overflowX: "hidden" },
  overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 99 },
  sidebar: { backgroundColor: "#ffffff", height: "100vh", position: "fixed", boxShadow: "4px 0 10px rgba(0,0,0,0.03)", transition: "0.3s ease", display: "flex", flexDirection: "column", zIndex: 100 },
  logo: { padding: "25px", textAlign: "left", color: "#4f46e5", fontSize: "22px", borderBottom: "1px solid #f3f4f6", margin: 0, fontWeight: 'bold' },
  nav: { flex: 1, padding: "20px 10px", overflowY: "auto" },
  navLink: { display: "flex", alignItems: "center", width: "100%", padding: "12px 15px", border: "none", borderRadius: "8px", cursor: "pointer", marginBottom: "8px", fontSize: "15px", fontWeight: "500", transition: "0.2s", textAlign: 'left' },
  logoutBtn: { display: "flex", alignItems: "center", padding: "20px 25px", border: "none", backgroundColor: "transparent", color: "#ef4444", cursor: "pointer", borderTop: "1px solid #f3f4f6", fontWeight: "bold" },
  mainContent: { flex: 1, transition: "0.3s ease", minWidth: 0 },
  header: { height: "70px", backgroundColor: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 25px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", position: 'sticky', top: 0, zIndex: 90 },
  headerTitle: { margin: 0, fontSize: "1.1rem", color: "#111827", fontWeight: '600' },
  userInfoTop: { display: "flex", alignItems: "center", gap: "12px" },
  userTextContainer: { display: "flex", flexDirection: "column", textAlign: "right" },
  hideOnMobile: { display: "none" },
  topUserName: { fontSize: "14px", fontWeight: "bold", color: "#111827" },
  topUserRole: { fontSize: "11px", color: "#4f46e5", textTransform: "uppercase", fontWeight: '600' },
  avatar: { width: "38px", height: "38px", borderRadius: "50%", backgroundColor: "#4f46e5", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" },
  menuToggle: { border: "none", backgroundColor: "transparent", cursor: "pointer", marginRight: "15px", color: "#4b5563" },
  contentBody: { width: "100%", boxSizing: "border-box" },
  card: { backgroundColor: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", minHeight: '80vh' }
};

export default AdminDashboard;