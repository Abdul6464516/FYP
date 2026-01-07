import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserCheck,
  Users,
  Calendar,
  Video,
  ClipboardList,
  Settings,
  LogOut,
  Menu,
  X,
  FileText,
  Bell,
} from "lucide-react";

// --- COMPONENT IMPORTS ---
import DoctorProfile from "../../Components/Doctor/DoctorProfile";
import AppointmentManagement from "../../Components/Doctor/AppointmentManagement";
import ConsultationInterface from "../../Components/Doctor/ConsultationInterface";
import PatientHistory from "../../Components/Doctor/PatientHistory";
import PrescriptionGeneration from "../../Components/Doctor/PrescriptionGeneration";
import MedicalReports from "../../Components/Doctor/MedicalReports";
import NotificationCenter from "../../Components/Doctor/NotificationCenter";
import DoctorSettings from "../../Components/Doctor/DoctorSettings";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Profile");
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [drName, setDrName] = useState("");
  const [unreadNotifications, setUnreadNotifications] = useState(2); // Mock count

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };

    window.addEventListener("resize", handleResize);
    const savedName = localStorage.getItem("userName") || "Specialist";
    setDrName(savedName);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const menuItems = [
    { id: "Profile", icon: <UserCheck size={20} />, label: "Doctor Profile" },
    { id: "Appointments", icon: <Calendar size={20} />, label: "Schedule" },
    { id: "Patients", icon: <Users size={20} />, label: "Patient History" },
    { id: "Consultation", icon: <Video size={20} />, label: "Video Consult" },
    { id: "Prescription", icon: <FileText size={20} />, label: "Prescription" },
    {
      id: "Reports",
      icon: <ClipboardList size={20} />,
      label: "Medical Reports",
    },
    { id: "Settings", icon: <Settings size={20} />, label: "Settings" },
  ];

  return (
    <div style={styles.container}>
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div style={styles.overlay} onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <div
        style={{
          ...styles.sidebar,
          left: isSidebarOpen ? "0" : "-280px",
          width: isMobile ? "250px" : "260px",
        }}
      >
        <div style={styles.sidebarHeader}>
          <h2 style={styles.logo}>TeleMed</h2>
          <div style={styles.welcomeContainer}>
            <span style={styles.welcomeLabel}>WELCOME BACK</span>
            <span style={styles.drNameSidebar}>
              Dr. {drName.split(/[0-9]/)[0]}
            </span>
          </div>
        </div>

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
                backgroundColor:
                  activeTab === item.id ? "#f0fdf4" : "transparent",
                color: activeTab === item.id ? "#16a34a" : "#4b5563",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                {item.icon}
                <span style={{ marginLeft: "12px" }}>{item.label}</span>
              </div>
            </button>
          ))}
        </nav>

        <button style={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={20} />
          <span style={{ marginLeft: "10px" }}>Logout</span>
        </button>
      </div>

      {/* MAIN CONTENT AREA */}
      <div
        style={{
          ...styles.mainContent,
          marginLeft: isMobile ? "0" : isSidebarOpen ? "260px" : "0",
        }}
      >
        <header style={styles.header}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={styles.menuToggle}
            >
              {isSidebarOpen ? <X /> : <Menu />}
            </button>
            <h3 style={styles.headerTitle}>{activeTab} Management</h3>
          </div>

          <div style={styles.headerActions}>
            {/* Notification Bell with Badge */}
            <button
              style={styles.notifIconButton}
              onClick={() => setActiveTab("Notifications")}
              title="Notifications"
            >
              <Bell size={22} color="#4b5563" />
              {unreadNotifications > 0 && (
                <span style={styles.badge}>{unreadNotifications}</span>
              )}
            </button>

            <div style={styles.avatar}>{drName.charAt(0).toUpperCase()}</div>
          </div>
        </header>

        <main
          style={{ ...styles.contentBody, padding: isMobile ? "15px" : "30px" }}
        >
          <div style={styles.card}>
            {/* DYNAMIC TAB RENDERING */}
            {activeTab === "Profile" && <DoctorProfile />}
            {activeTab === "Appointments" && <AppointmentManagement />}
            {activeTab === "Patients" && <PatientHistory />}
            {activeTab === "Consultation" && <ConsultationInterface />}
            {activeTab === "Prescription" && <PrescriptionGeneration />}
            {activeTab === "Reports" && <MedicalReports />}
            {activeTab === "Settings" && <DoctorSettings />}
            {activeTab === "Notifications" && <NotificationCenter />}
          </div>
        </main>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f9fafb",
    fontFamily: "'Inter', sans-serif",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 99,
  },
  sidebar: {
    backgroundColor: "#ffffff",
    height: "100vh",
    position: "fixed",
    boxShadow: "2px 0 10px rgba(0,0,0,0.05)",
    transition: "0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    display: "flex",
    flexDirection: "column",
    zIndex: 100,
  },
  sidebarHeader: { padding: "25px 20px", borderBottom: "1px solid #f3f4f6" },
  logo: { color: "#16a34a", margin: 0, fontSize: "22px", fontWeight: "bold" },
  welcomeContainer: {
    marginTop: "15px",
    display: "flex",
    flexDirection: "column",
  },
  welcomeLabel: {
    fontSize: "10px",
    color: "#28a745",
    fontWeight: "800",
    letterSpacing: "0.5px",
  },
  drNameSidebar: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#111827",
    marginTop: "2px",
  },
  nav: { flex: 1, padding: "15px 10px", overflowY: "auto" },
  navLink: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    padding: "12px 15px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "4px",
    fontSize: "14px",
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
    fontWeight: "600",
  },
  mainContent: { flex: 1, transition: "0.3s ease-in-out", minWidth: 0 },
  header: {
    height: "70px",
    backgroundColor: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    position: "sticky",
    top: 0,
    zIndex: 90,
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  },
  headerTitle: {
    margin: 0,
    color: "#374151",
    fontSize: "1.1rem",
    fontWeight: "600",
  },
  headerActions: { display: "flex", alignItems: "center", gap: "20px" },
  notifIconButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    position: "relative",
    padding: "5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: "0px",
    right: "0px",
    backgroundColor: "#dc2626",
    color: "white",
    fontSize: "10px",
    fontWeight: "bold",
    padding: "2px 5px",
    borderRadius: "10px",
    border: "2px solid #fff",
    minWidth: "18px",
    textAlign: "center",
  },
  avatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    backgroundColor: "#16a34a",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },
  menuToggle: {
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    marginRight: "15px",
    color: "#4b5563",
  },
  contentBody: { width: "100%" },
  card: {
    backgroundColor: "#fff",
    padding: "28px",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    minHeight: "80vh",
  },
};

export default DoctorDashboard;
