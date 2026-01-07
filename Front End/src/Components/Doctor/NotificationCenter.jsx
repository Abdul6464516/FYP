import React, { useState } from "react";
import { Bell, CalendarCheck, CalendarX, UserPlus, Clock, CheckCircle2 } from "lucide-react";

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, type: "booking", text: "New appointment booked by John Doe", time: "10 mins ago", date: "Dec 31, 2025", read: false },
    { id: 2, type: "cancellation", text: "Jane Smith cancelled her session for 3:00 PM today", time: "1 hour ago", date: "Dec 31, 2025", read: false },
    { id: 3, type: "booking", text: "Robert Brown booked a follow-up for tomorrow", time: "3 hours ago", date: "Jan 01, 2026", read: true },
    { id: 4, type: "update", text: "System Update: New prescription templates added", time: "1 day ago", date: "Dec 30, 2025", read: true },
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Bell size={22} color="#16a34a" />
          <h2 style={styles.title}>Alerts & Notifications</h2>
        </div>
        <button style={styles.markReadBtn} onClick={markAllRead}>Mark all as read</button>
      </div>

      <div style={styles.feed}>
        {notifications.map((notif) => (
          <div key={notif.id} style={{
            ...styles.notifCard,
            borderLeft: notif.read ? "4px solid #e5e7eb" : "4px solid #16a34a",
            backgroundColor: notif.read ? "#fff" : "#f0fdf4"
          }}>
            <div style={styles.iconBox}>
              {notif.type === "booking" && <CalendarCheck size={20} color="#16a34a" />}
              {notif.type === "cancellation" && <CalendarX size={20} color="#dc2626" />}
              {notif.type === "update" && <CheckCircle2 size={20} color="#3b82f6" />}
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={styles.notifText}>{notif.text}</div>
              <div style={styles.notifMeta}>
                <Clock size={12} /> {notif.time} • {notif.date}
              </div>
            </div>
            
            {!notif.read && <div style={styles.unreadDot} />}
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { width: "100%", maxWidth: "800px", margin: "0 auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  title: { margin: 0, fontSize: "20px", color: "#111827" },
  markReadBtn: { background: "none", border: "none", color: "#16a34a", fontSize: "14px", fontWeight: "600", cursor: "pointer" },
  feed: { display: "flex", flexDirection: "column", gap: "12px" },
  notifCard: { display: "flex", alignItems: "center", padding: "16px", borderRadius: "12px", border: "1px solid #e5e7eb", gap: "15px", position: "relative" },
  iconBox: { width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" },
  notifText: { fontSize: "14px", fontWeight: "600", color: "#374151" },
  notifMeta: { fontSize: "12px", color: "#9ca3af", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" },
  unreadDot: { width: "8px", height: "8px", backgroundColor: "#16a34a", borderRadius: "50%" }
};

export default NotificationCenter;