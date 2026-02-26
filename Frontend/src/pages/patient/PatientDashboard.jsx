import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, Calendar, Video, FileText, ClipboardList, Star,
  LogOut, Menu, X, Heart, ChevronRight, Bell,
} from "lucide-react";
import { toast } from "react-toastify";
import { clearSession } from "../../services/auth";
import { useUser } from "../../context/UserContext";
import { connectSocket, disconnectSocket } from "../../services/socket";

import PatientProfile from "../../Components/Patient/PatientProfile";
import VideoCall from "../../Components/Patient/VideoCall";
import AppointmentBooking from "../../Components/Patient/AppointmentBooking";
import PrescriptionAccess from "../../Components/Patient/PerscriptionAccess";
import MedicalRecords from "../../Components/Patient/MedicalRecords";
import FeedbackSystem from "../../Components/Patient/FeedbackSystem";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { user, logoutUser } = useUser();
  const [activeTab, setActiveTab] = useState("Profile");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [incomingCallData, setIncomingCallData] = useState(null);
  const [hovered, setHovered] = useState(null);

  const userName = user?.fullName || localStorage.getItem("userName") || "Patient";

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!user?._id) return;
    const socket = connectSocket(user._id);
    const handleIncomingCall = (data) => {
      setIncomingCallData(data);
      setActiveTab("Consultation");
    };
    socket.on("incoming-call", handleIncomingCall);
    return () => { socket.off("incoming-call", handleIncomingCall); };
  }, [user]);

  const handleLogout = () => {
    clearSession();
    if (logoutUser) logoutUser();
    navigate("/login");
  };

  const menuItems = [
    { id: "Profile", icon: <User size={20} />, label: "My Profile" },
    { id: "Appointments", icon: <Calendar size={20} />, label: "Book Appointment" },
    { id: "Consultation", icon: <Video size={20} />, label: "Video Consultation" },
    { id: "Prescriptions", icon: <FileText size={20} />, label: "Prescriptions" },
    { id: "Records", icon: <ClipboardList size={20} />, label: "Medical Records" },
    { id: "Feedback", icon: <Star size={20} />, label: "Feedback" },
  ];

  const greetHour = new Date().getHours();
  const greeting = greetHour < 12 ? "Good Morning" : greetHour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <div style={s.page}>
      {isMobile && sidebarOpen && <div style={s.overlay} onClick={() => setSidebarOpen(false)} />}

      {/* ═══ SIDEBAR ═══ */}
      <aside style={{ ...s.sidebar, left: sidebarOpen ? 0 : "-280px", width: isMobile ? "260px" : "272px" }}>
        {/* Brand */}
        <div style={s.brand}>
          <div style={s.brandIcon}><Heart size={20} color="#fff" fill="#fff" /></div>
          <span style={s.brandName}>Telemedicine</span>
        </div>

        {/* User card */}
        <div style={s.userCard}>
          <div style={s.userAvatar}>{userName.charAt(0).toUpperCase()}</div>
          <div>
            <div style={s.userFullName}>{userName}</div>
            <div style={s.userRole}>Patient</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={s.nav}>
          <div style={s.navLabel}>MENU</div>
          {menuItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); if (isMobile) setSidebarOpen(false); }}
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  ...s.navItem,
                  backgroundColor: active ? "#f0fdf4" : hovered === item.id ? "#f9fafb" : "transparent",
                  color: active ? "#16a34a" : "#4b5563",
                  borderLeft: active ? "3px solid #16a34a" : "3px solid transparent",
                  fontWeight: active ? "600" : "500",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {active && <ChevronRight size={16} color="#16a34a" />}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <button style={s.logoutBtn} onClick={handleLogout}>
          <LogOut size={18} /> <span>Logout</span>
        </button>
      </aside>

      {/* ═══ MAIN ═══ */}
      <div style={{ ...s.main, marginLeft: isMobile ? 0 : sidebarOpen ? "272px" : 0 }}>
        {/* Header */}
        <header style={s.header}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <button style={s.menuBtn} onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div>
              <div style={s.greet}>{greeting} 👋</div>
              <div style={s.greetName}>{userName}</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={s.headerAvatar}>{userName.charAt(0).toUpperCase()}</div>
          </div>
        </header>

        {/* Content */}
        <main style={{ padding: isMobile ? "16px" : "28px" }}>
          <div style={s.contentCard}>
            {activeTab === "Profile" && <PatientProfile />}
            {activeTab === "Appointments" && <AppointmentBooking />}
            {activeTab === "Consultation" && (
              <VideoCall incomingCallData={incomingCallData} onCallHandled={() => setIncomingCallData(null)} />
            )}
            {activeTab === "Prescriptions" && <PrescriptionAccess />}
            {activeTab === "Records" && <MedicalRecords />}
            {activeTab === "Feedback" && <FeedbackSystem />}
          </div>
        </main>
      </div>
    </div>
  );
};

const s = {
  page: { display: "flex", minHeight: "100vh", backgroundColor: "#f0f2f5", fontFamily: "'Inter','Segoe UI',system-ui,sans-serif" },
  overlay: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", zIndex: 99 },

  /* Sidebar */
  sidebar: {
    position: "fixed", height: "100vh", backgroundColor: "#fff",
    boxShadow: "2px 0 16px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column",
    zIndex: 100, transition: "left 0.3s cubic-bezier(.4,0,.2,1)", borderRight: "1px solid #f0f0f0",
  },
  brand: {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "22px 22px 18px",
  },
  brandIcon: {
    width: "36px", height: "36px", borderRadius: "10px",
    background: "linear-gradient(135deg, #16a34a, #15803d)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  brandName: { fontWeight: "800", fontSize: "20px", color: "#111827", letterSpacing: "-0.5px" },

  userCard: {
    display: "flex", alignItems: "center", gap: "12px",
    margin: "0 16px 16px", padding: "14px",
    borderRadius: "14px", backgroundColor: "#f0fdf4", border: "1px solid #dcfce7",
  },
  userAvatar: {
    width: "40px", height: "40px", borderRadius: "50%",
    background: "linear-gradient(135deg, #16a34a, #0d9488)", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: "700", fontSize: "16px", flexShrink: 0,
  },
  userFullName: { fontWeight: "600", fontSize: "14px", color: "#111827" },
  userRole: { fontSize: "11px", color: "#16a34a", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.3px" },

  nav: { flex: 1, padding: "4px 12px", overflowY: "auto" },
  navLabel: { fontSize: "10px", fontWeight: "700", color: "#9ca3af", letterSpacing: "1px", padding: "8px 10px 6px", marginTop: "4px" },
  navItem: {
    display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%",
    padding: "11px 14px", border: "none", borderRadius: "10px", cursor: "pointer",
    fontSize: "13.5px", transition: "all 0.15s", textAlign: "left", marginBottom: "2px",
    background: "none",
  },

  logoutBtn: {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "18px 24px", border: "none", backgroundColor: "transparent",
    color: "#ef4444", cursor: "pointer", fontWeight: "600", fontSize: "14px",
    borderTop: "1px solid #f3f4f6",
  },

  /* Main */
  main: { flex: 1, transition: "margin 0.3s ease", minWidth: 0 },
  header: {
    height: "72px", backgroundColor: "#fff", display: "flex", alignItems: "center",
    justifyContent: "space-between", padding: "0 28px",
    position: "sticky", top: 0, zIndex: 90,
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)", borderBottom: "1px solid #f0f0f0",
  },
  menuBtn: { border: "none", backgroundColor: "transparent", cursor: "pointer", color: "#4b5563", display: "flex" },
  greet: { fontSize: "12px", color: "#9ca3af", fontWeight: "500" },
  greetName: { fontSize: "16px", fontWeight: "700", color: "#111827" },
  headerAvatar: {
    width: "38px", height: "38px", borderRadius: "50%",
    background: "linear-gradient(135deg, #16a34a, #0d9488)", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: "700", fontSize: "15px",
  },

  contentCard: {
    backgroundColor: "#fff", borderRadius: "16px", padding: "28px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)", border: "1px solid #f0f0f0",
    minHeight: "78vh",
  },
};

export default PatientDashboard;
