import React, { useState, useEffect } from "react";
import { Bell, CalendarCheck, CalendarX, Clock, CheckCircle2 } from "lucide-react";
import { getDoctorAppointments } from "../../services/doctorAction";
import { toast } from "react-toastify";

const timeAgo = (dateStr) => {
  const now = new Date();
  const past = new Date(dateStr);
  const diffMs = now - past;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min${mins > 1 ? "s" : ""} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const NotificationCenter = ({ readIds = [], onMarkRead }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getDoctorAppointments();
        setAppointments(data.appointments);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Build notification list from appointments
  const notifications = appointments.map((app) => {
    const patientName = app.patient?.fullName || "A patient";
    let type = "booking";
    let text = "";

    if (app.status === "pending") {
      type = "booking";
      text = `New appointment request from ${patientName} on ${app.date} at ${app.time}`;
    } else if (app.status === "approved") {
      type = "approved";
      text = `Appointment with ${patientName} approved for ${app.date} at ${app.time}`;
    } else if (app.status === "cancelled") {
      type = "cancellation";
      text = `Appointment with ${patientName} on ${app.date} was cancelled`;
    } else if (app.status === "completed") {
      type = "completed";
      text = `Consultation with ${patientName} on ${app.date} completed`;
    }

    return {
      _id: app._id,
      type,
      text,
      time: timeAgo(app.createdAt),
      date: formatDate(app.createdAt),
      read: readIds.includes(app._id),
    };
  });

  const markAllRead = () => {
    const allIds = notifications.map((n) => n._id);
    if (onMarkRead) onMarkRead(allIds);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) {
    return <p style={{ textAlign: "center", color: "#6b7280", padding: "30px 0" }}>Loading notifications...</p>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Bell size={22} color="#16a34a" />
          <h2 style={styles.title}>Alerts & Notifications</h2>
          {unreadCount > 0 && <span style={styles.countBadge}>{unreadCount} new</span>}
        </div>
        {unreadCount > 0 && (
          <button style={styles.markReadBtn} onClick={markAllRead}>Mark all as read</button>
        )}
      </div>

      {notifications.length === 0 && (
        <p style={{ textAlign: "center", color: "#6b7280", padding: "30px 0" }}>No notifications yet.</p>
      )}

      <div style={styles.feed}>
        {notifications.map((notif) => (
          <div
            key={notif._id}
            style={{
              ...styles.notifCard,
              borderLeft: notif.read ? "4px solid #e5e7eb" : "4px solid #16a34a",
              backgroundColor: notif.read ? "#fff" : "#f0fdf4",
            }}
            onClick={() => {
              if (!notif.read && onMarkRead) onMarkRead([notif._id]);
            }}
          >
            <div style={styles.iconBox}>
              {notif.type === "booking" && <CalendarCheck size={20} color="#16a34a" />}
              {notif.type === "cancellation" && <CalendarX size={20} color="#dc2626" />}
              {notif.type === "approved" && <CheckCircle2 size={20} color="#16a34a" />}
              {notif.type === "completed" && <CheckCircle2 size={20} color="#3b82f6" />}
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
  countBadge: { backgroundColor: "#16a34a", color: "#fff", padding: "2px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" },
  markReadBtn: { background: "none", border: "none", color: "#16a34a", fontSize: "14px", fontWeight: "600", cursor: "pointer" },
  feed: { display: "flex", flexDirection: "column", gap: "12px" },
  notifCard: { display: "flex", alignItems: "center", padding: "16px", borderRadius: "12px", border: "1px solid #e5e7eb", gap: "15px", position: "relative", cursor: "pointer", transition: "0.2s" },
  iconBox: { width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" },
  notifText: { fontSize: "14px", fontWeight: "600", color: "#374151" },
  notifMeta: { fontSize: "12px", color: "#9ca3af", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" },
  unreadDot: { width: "8px", height: "8px", backgroundColor: "#16a34a", borderRadius: "50%" },
};

export default NotificationCenter;