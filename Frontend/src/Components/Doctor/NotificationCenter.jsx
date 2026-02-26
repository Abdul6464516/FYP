import React, { useState, useEffect } from "react";
import {
  Bell, CalendarCheck, CalendarX, CheckCircle2, Clock,
  Inbox, CheckCheck, Loader2,
} from "lucide-react";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../../services/doctorAction";
import { toast } from "react-toastify";

/* ── helpers ─────────────────────────────────────── */
const timeAgo = (dateStr) => {
  const now = new Date();
  const past = new Date(dateStr);
  const mins = Math.floor((now - past) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return past.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const typeConfig = {
  booking: {
    icon: CalendarCheck,
    color: "#16a34a",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    label: "New Booking",
  },
  approved: {
    icon: CheckCircle2,
    color: "#2563eb",
    bg: "#eff6ff",
    border: "#bfdbfe",
    label: "Approved",
  },
  cancelled: {
    icon: CalendarX,
    color: "#dc2626",
    bg: "#fef2f2",
    border: "#fecaca",
    label: "Cancelled",
  },
  completed: {
    icon: CheckCircle2,
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#ddd6fe",
    label: "Completed",
  },
  general: {
    icon: Bell,
    color: "#6b7280",
    bg: "#f9fafb",
    border: "#e5e7eb",
    label: "General",
  },
};

/* ── component ───────────────────────────────────── */
const NotificationCenter = ({ onCountChange }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all | unread | read
  const [markingAll, setMarkingAll] = useState(false);

  const fetchData = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data.notifications);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const unreadCount = notifications.filter((n) => n.status === "unread").length;

  const handleMarkRead = async (id) => {
    const notif = notifications.find((n) => n._id === id);
    if (!notif || notif.status === "read") return;

    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, status: "read" } : n))
      );
      if (onCountChange) onCountChange();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleMarkAllRead = async () => {
    if (unreadCount === 0) return;
    setMarkingAll(true);
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, status: "read" })));
      if (onCountChange) onCountChange();
      toast.success("All notifications marked as read");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setMarkingAll(false);
    }
  };

  const filtered = notifications.filter((n) => {
    if (filter === "unread") return n.status === "unread";
    if (filter === "read") return n.status === "read";
    return true;
  });

  /* ── render ──────────────────────────────────── */
  if (loading) {
    return (
      <div style={st.loadingWrap}>
        <Loader2 size={32} color="#16a34a" style={{ animation: "spin 1s linear infinite" }} />
        <p style={{ color: "#6b7280", marginTop: "12px" }}>Loading notifications…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={st.container}>
      {/* ── HEADER ── */}
      <div style={st.headerBar}>
        <div style={st.headerLeft}>
          <div style={st.headerIconWrap}>
            <Bell size={22} color="#fff" />
          </div>
          <div>
            <h2 style={st.headerTitle}>Notifications</h2>
            <p style={st.headerSub}>
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                : "You're all caught up! ✨"}
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            style={st.markAllBtn}
            onClick={handleMarkAllRead}
            disabled={markingAll}
          >
            {markingAll ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <CheckCheck size={14} />}
            <span>{markingAll ? "Marking…" : "Mark all read"}</span>
          </button>
        )}
      </div>

      {/* ── FILTER TABS ── */}
      <div style={st.filterRow}>
        {[
          { key: "all", label: "All", count: notifications.length },
          { key: "unread", label: "Unread", count: unreadCount },
          { key: "read", label: "Read", count: notifications.length - unreadCount },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            style={{
              ...st.filterBtn,
              backgroundColor: filter === tab.key ? "#16a34a" : "#fff",
              color: filter === tab.key ? "#fff" : "#4b5563",
              border: filter === tab.key ? "1px solid #16a34a" : "1px solid #e5e7eb",
            }}
          >
            {tab.label}
            <span
              style={{
                ...st.filterCount,
                backgroundColor: filter === tab.key ? "rgba(255,255,255,0.25)" : "#f3f4f6",
                color: filter === tab.key ? "#fff" : "#6b7280",
              }}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* ── NOTIFICATION LIST ── */}
      {filtered.length === 0 ? (
        <div style={st.emptyWrap}>
          <div style={st.emptyIcon}>
            <Inbox size={44} color="#d1d5db" />
          </div>
          <p style={st.emptyTitle}>No notifications here</p>
          <p style={st.emptySubtitle}>
            {filter === "unread"
              ? "Great job! You've read all your notifications."
              : filter === "read"
              ? "No read notifications yet."
              : "Notifications will appear when patients book appointments."}
          </p>
        </div>
      ) : (
        <div style={st.feed}>
          {filtered.map((notif, i) => {
            const cfg = typeConfig[notif.type] || typeConfig.general;
            const Icon = cfg.icon;
            const isUnread = notif.status === "unread";

            return (
              <div
                key={notif._id}
                onClick={() => handleMarkRead(notif._id)}
                style={{
                  ...st.card,
                  backgroundColor: isUnread ? cfg.bg : "#fff",
                  borderLeft: `4px solid ${isUnread ? cfg.color : "#e5e7eb"}`,
                  cursor: isUnread ? "pointer" : "default",
                  animation: `fadeSlide 0.3s ease ${i * 0.04}s both`,
                }}
              >
                {/* Icon circle */}
                <div
                  style={{
                    ...st.iconCircle,
                    backgroundColor: isUnread ? cfg.color : "#f3f4f6",
                  }}
                >
                  <Icon size={18} color={isUnread ? "#fff" : "#9ca3af"} />
                </div>

                {/* Content */}
                <div style={st.cardBody}>
                  <div style={st.cardTop}>
                    <span
                      style={{
                        ...st.typeBadge,
                        backgroundColor: isUnread ? `${cfg.color}18` : "#f3f4f6",
                        color: isUnread ? cfg.color : "#9ca3af",
                        border: `1px solid ${isUnread ? cfg.border : "#e5e7eb"}`,
                      }}
                    >
                      {cfg.label}
                    </span>
                    <span style={st.timeText}>
                      <Clock size={11} /> {timeAgo(notif.createdAt)}
                    </span>
                  </div>

                  <p style={{ ...st.cardTitle, color: isUnread ? "#111827" : "#6b7280" }}>
                    {notif.title}
                  </p>
                  <p style={{ ...st.cardMsg, color: isUnread ? "#374151" : "#9ca3af" }}>
                    {notif.message}
                  </p>

                  {notif.relatedAppointment && (
                    <div style={st.metaRow}>
                      <CalendarCheck size={12} color="#9ca3af" />
                      <span style={st.metaText}>
                        {notif.relatedAppointment.date} at {notif.relatedAppointment.time}
                      </span>
                    </div>
                  )}
                </div>

                {/* Unread dot */}
                {isUnread && (
                  <div style={st.unreadPulseWrap}>
                    <div style={st.unreadDot} />
                    <div style={st.unreadPulse} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Animation keyframes */}
      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50%      { transform: scale(2.2); opacity: 0; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

/* ── styles ───────────────────────────────────────── */
const st = {
  container: {
    width: "100%",
    maxWidth: "820px",
    margin: "0 auto",
  },
  loadingWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "300px",
  },

  /* header */
  headerBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "12px",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  headerIconWrap: {
    width: "46px",
    height: "46px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #16a34a, #15803d)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 12px rgba(22,163,74,0.3)",
  },
  headerTitle: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "700",
    color: "#111827",
  },
  headerSub: {
    margin: 0,
    fontSize: "13px",
    color: "#6b7280",
    marginTop: "2px",
  },

  markAllBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 16px",
    borderRadius: "10px",
    border: "1px solid #16a34a",
    backgroundColor: "#f0fdf4",
    color: "#16a34a",
    fontWeight: "600",
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.15s",
  },

  /* filters */
  filterRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  filterBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "7px 16px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  filterCount: {
    fontSize: "11px",
    fontWeight: "700",
    padding: "1px 7px",
    borderRadius: "10px",
  },

  /* empty */
  emptyWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
  },
  emptyIcon: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundColor: "#f9fafb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "16px",
    border: "2px dashed #e5e7eb",
  },
  emptyTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#374151",
    margin: "0 0 4px",
  },
  emptySubtitle: {
    fontSize: "13px",
    color: "#9ca3af",
    margin: 0,
    textAlign: "center",
    maxWidth: "320px",
  },

  /* feed */
  feed: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  /* card */
  card: {
    display: "flex",
    alignItems: "flex-start",
    padding: "16px 18px",
    borderRadius: "14px",
    border: "1px solid #e5e7eb",
    gap: "14px",
    position: "relative",
    transition: "all 0.2s ease",
  },
  iconCircle: {
    width: "42px",
    height: "42px",
    minWidth: "42px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardBody: {
    flex: 1,
    minWidth: 0,
  },
  cardTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "6px",
    flexWrap: "wrap",
    gap: "6px",
  },
  typeBadge: {
    fontSize: "11px",
    fontWeight: "700",
    padding: "2px 10px",
    borderRadius: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.3px",
  },
  timeText: {
    fontSize: "12px",
    color: "#9ca3af",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  cardTitle: {
    margin: "0 0 3px",
    fontSize: "14.5px",
    fontWeight: "700",
    lineHeight: "1.3",
  },
  cardMsg: {
    margin: "0 0 6px",
    fontSize: "13px",
    lineHeight: "1.45",
  },
  metaRow: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    marginTop: "4px",
  },
  metaText: {
    fontSize: "12px",
    color: "#9ca3af",
  },

  /* unread indicator */
  unreadPulseWrap: {
    position: "relative",
    width: "10px",
    height: "10px",
    flexShrink: 0,
    marginTop: "6px",
  },
  unreadDot: {
    position: "absolute",
    top: "1px",
    left: "1px",
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#16a34a",
  },
  unreadPulse: {
    position: "absolute",
    top: "0",
    left: "0",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "#16a34a",
    animation: "pulse 2s ease-in-out infinite",
  },
};

export default NotificationCenter;