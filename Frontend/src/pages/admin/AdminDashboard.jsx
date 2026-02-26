import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck, Users, Activity, Lock, BarChart3,
  LogOut, Menu, X, UserCog, Heart, ChevronRight,
} from "lucide-react";
import { clearSession } from "../../services/auth";
import { useUser } from "../../context/UserContext";

import AdminProfile from "../../Components/Admin/AdminProfile";
import UserManagement from "../../Components/Admin/UserManagement";
import SystemMonitoring from "../../Components/Admin/SystemMonitoring";
import SecurityPrivacy from "../../Components/Admin/SecurityPrivacy";
import ReportsAnalytics from "../../Components/Admin/ReportsAnalytics";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logoutUser } = useUser();
  const [activeTab, setActiveTab] = useState("Admin Profile");
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [hovered, setHovered] = useState(null);

  const adminName = user?.fullName || localStorage.getItem("userName") || "Administrator";

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

  const handleLogout = () => {
    clearSession();
    if (logoutUser) logoutUser();
    navigate("/login");
  };

  const menuItems = [
    { id: "Admin Profile", icon: <UserCog size={20} />, label: "Admin Profile" },
    { id: "User Management", icon: <Users size={20} />, label: "User Management" },
    { id: "System Monitoring", icon: <Activity size={20} />, label: "System Activity" },
    { id: "Security & Privacy", icon: <Lock size={20} />, label: "Security & Privacy" },
    { id: "Reports & Analytics", icon: <BarChart3 size={20} />, label: "Reports & Analytics" },
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
          <div>
            <span style={s.brandName}>Telemedicine</span>
            <div style={s.brandSub}>Admin Panel</div>
          </div>
        </div>

        {/* Admin card */}
        <div style={s.userCard}>
          <div style={s.userAvatar}><ShieldCheck size={20} color="#fff" /></div>
          <div>
            <div style={s.userFullName}>{adminName}</div>
            <div style={s.userRole}>System Admin</div>
          </div>
        </div>

        <nav style={s.nav}>
          <div style={s.navLabel}>MANAGEMENT</div>
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
                  backgroundColor: active ? "#eef2ff" : hovered === item.id ? "#f9fafb" : "transparent",
                  color: active ? "#4f46e5" : "#4b5563",
                  borderLeft: active ? "3px solid #4f46e5" : "3px solid transparent",
                  fontWeight: active ? "600" : "500",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {active && <ChevronRight size={16} color="#4f46e5" />}
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
              <div style={s.greetName}>{adminName}</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={!isMobile ? s.roleChip : { display: "none" }}>
              <ShieldCheck size={14} /> Admin
            </div>
            <div style={s.headerAvatar}><ShieldCheck size={18} color="#fff" /></div>
          </div>
        </header>

        <main style={{ padding: isMobile ? "16px" : "28px" }}>
          <div style={s.contentCard}>
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
    background: "linear-gradient(135deg, #4f46e5, #6366f1)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  brandName: { fontWeight: "800", fontSize: "20px", color: "#111827", letterSpacing: "-0.5px", display: "block" },
  brandSub: { fontSize: "10px", fontWeight: "600", color: "#6366f1", letterSpacing: "0.5px", textTransform: "uppercase" },

  userCard: {
    display: "flex", alignItems: "center", gap: "12px",
    margin: "0 16px 16px", padding: "14px",
    borderRadius: "14px", backgroundColor: "#eef2ff", border: "1px solid #e0e7ff",
  },
  userAvatar: {
    width: "40px", height: "40px", borderRadius: "50%",
    background: "linear-gradient(135deg, #4f46e5, #6366f1)", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  userFullName: { fontWeight: "600", fontSize: "14px", color: "#111827" },
  userRole: { fontSize: "11px", color: "#4f46e5", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.3px" },

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
  roleChip: {
    display: "flex", alignItems: "center", gap: "5px",
    padding: "5px 12px", borderRadius: "20px",
    backgroundColor: "#eef2ff", color: "#4f46e5",
    fontSize: "12px", fontWeight: "600",
  },
  headerAvatar: {
    width: "38px", height: "38px", borderRadius: "50%",
    background: "linear-gradient(135deg, #4f46e5, #6366f1)", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
  },

  contentCard: {
    backgroundColor: "#fff", borderRadius: "16px", padding: "28px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)", border: "1px solid #f0f0f0",
    minHeight: "78vh",
  },
};

export default AdminDashboard;
