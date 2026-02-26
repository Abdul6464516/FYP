import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserCheck, Users, Calendar, Video, ClipboardList, Settings,
  LogOut, Menu, X, FileText, Bell, Heart, ChevronRight, Stethoscope,
} from "lucide-react";
import { clearSession } from "../../services/auth";
import { useUser } from "../../context/UserContext";
import { getUnreadCount } from "../../services/doctorAction";

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
  const { user, logoutUser } = useUser();
  const drName = user?.fullName || "Specialist";

  const [activeTab, setActiveTab] = useState("Profile");
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [hovered, setHovered] = useState(null);

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

  // Fetch unread notification count from DB
  const refreshUnreadCount = async () => {
    try {
      const data = await getUnreadCount();
      setUnreadNotifications(data.count);
    } catch {}
  };

  useEffect(() => {
    refreshUnreadCount();
    const interval = setInterval(refreshUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    clearSession();
    logoutUser();
    navigate("/login");
  };

  const menuItems = [
    { id: "Profile", icon: <UserCheck size={20} />, label: "Doctor Profile" },
    { id: "Appointments", icon: <Calendar size={20} />, label: "Schedule" },
    { id: "Patients", icon: <Users size={20} />, label: "Patient History" },
    { id: "Consultation", icon: <Video size={20} />, label: "Video Consult" },
    { id: "Prescription", icon: <FileText size={20} />, label: "Prescription" },
    { id: "Reports", icon: <ClipboardList size={20} />, label: "Medical Reports" },
    { id: "Settings", icon: <Settings size={20} />, label: "Settings" },
  ];

  const greetHour = new Date().getHours();
  const greeting = greetHour < 12 ? "Good Morning" : greetHour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <div style={s.page}>
      {isMobile && sidebarOpen && <div style={s.overlay} onClick={() => setSidebarOpen(false)} />}

      {/* ═══ SIDEBAR ═══ */}
      <aside style={{ ...s.sidebar, left: sidebarOpen ? 0 : "-280px", width: isMobile ? "260px" : "272px" }}>
        <div style={s.brand}>
          <div style={s.brandIcon}><Heart size={20} color="#fff" fill="#fff" /></div>
          <span style={s.brandName}>Telemedicine</span>
        </div>

        {/* Doctor card */}
        <div style={s.userCard}>
          <div style={s.userAvatar}>
            <Stethoscope size={20} color="#fff" />
          </div>
          <div>
            <div style={s.userFullName}>Dr. {drName.split(/[0-9]/)[0]}</div>
            <div style={s.userRole}>Doctor</div>
          </div>
        </div>

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

        <button style={s.logoutBtn} onClick={handleLogout}>
          <LogOut size={18} /> <span>Logout</span>
        </button>
      </aside>

      {/* ═══ MAIN ═══ */}
      <div style={{ ...s.main, marginLeft: isMobile ? 0 : sidebarOpen ? "272px" : 0 }}>
        <header style={s.header}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <button style={s.menuBtn} onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div>
              <div style={s.greet}>{greeting} 👋</div>
              <div style={s.greetName}>Dr. {drName.split(/[0-9]/)[0]}</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* Notification bell */}
            <button
              style={s.notifBtn}
              onClick={() => setActiveTab("Notifications")}
              title="Notifications"
            >
              <Bell size={21} color="#4b5563" />
              {unreadNotifications > 0 && <span style={s.badge}>{unreadNotifications}</span>}
            </button>
            <div style={s.headerAvatar}><Stethoscope size={18} color="#fff" /></div>
          </div>
        </header>

        <main style={{ padding: isMobile ? "16px" : "28px" }}>
          <div style={s.contentCard}>
            {activeTab === "Profile" && <DoctorProfile />}
            {activeTab === "Appointments" && <AppointmentManagement />}
            {activeTab === "Patients" && <PatientHistory />}
            {activeTab === "Consultation" && <ConsultationInterface />}
            {activeTab === "Prescription" && <PrescriptionGeneration />}
            {activeTab === "Reports" && <MedicalReports />}
            {activeTab === "Settings" && <DoctorSettings />}
            {activeTab === "Notifications" && (
              <NotificationCenter
                onCountChange={refreshUnreadCount}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

const s = {
  page: { display: "flex", minHeight: "100vh", backgroundColor: "#f0f2f5", fontFamily: "'Inter','Segoe UI',system-ui,sans-serif" },
  overlay: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", zIndex: 99 },

  sidebar: {
    position: "fixed", height: "100vh", backgroundColor: "#fff",
    boxShadow: "2px 0 16px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column",
    zIndex: 100, transition: "left 0.3s cubic-bezier(.4,0,.2,1)", borderRight: "1px solid #f0f0f0",
  },
  brand: { display: "flex", alignItems: "center", gap: "10px", padding: "22px 22px 18px" },
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
    background: "linear-gradient(135deg, #0d9488, #0f766e)", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: "700", fontSize: "16px", flexShrink: 0,
  },
  userFullName: { fontWeight: "600", fontSize: "14px", color: "#111827" },
  userRole: { fontSize: "11px", color: "#0d9488", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.3px" },

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

  notifBtn: {
    background: "none", border: "none", cursor: "pointer",
    position: "relative", padding: "6px", display: "flex", alignItems: "center",
    borderRadius: "10px", transition: "background 0.15s",
  },
  badge: {
    position: "absolute", top: "0", right: "0",
    backgroundColor: "#dc2626", color: "#fff", fontSize: "10px", fontWeight: "700",
    padding: "1px 5px", borderRadius: "10px", border: "2px solid #fff", minWidth: "16px", textAlign: "center",
  },
  headerAvatar: {
    width: "38px", height: "38px", borderRadius: "50%",
    background: "linear-gradient(135deg, #0d9488, #0f766e)", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
  },

  contentCard: {
    backgroundColor: "#fff", borderRadius: "16px", padding: "28px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)", border: "1px solid #f0f0f0",
    minHeight: "78vh",
  },
};

export default DoctorDashboard;
