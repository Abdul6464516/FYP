import React from "react";
import { 
  Activity, Video, Calendar, MessageSquare, 
  TrendingUp, Users, CheckCircle, Clock 
} from "lucide-react";

const SystemMonitoring = () => {
  // Mock data for system statistics
  const stats = [
    { id: 1, label: "Active Consultations", value: "12", icon: <Video size={20} />, color: "#4f46e5" },
    { id: 2, label: "Total Appointments Today", value: "48", icon: <Calendar size={20} />, color: "#16a34a" },
    { id: 3, label: "Avg. Wait Time", value: "8 min", icon: <Clock size={20} />, color: "#f59e0b" },
    { id: 4, label: "Platform Satisfaction", value: "94%", icon: <TrendingUp size={20} />, color: "#10b981" },
  ];

  const recentActivity = [
    { id: 1, user: "Dr. Raz", action: "started a video call with", target: "John Doe", time: "2 mins ago" },
    { id: 2, user: "Sarah Jenkins", action: "booked an appointment with", target: "Dr. Sarah", time: "15 mins ago" },
    { id: 3, user: "System", action: "generated monthly report for", target: "Hospital Admin", time: "1 hour ago" },
  ];

  const feedback = [
    { id: 1, patient: "Robert B.", rating: 5, comment: "Excellent consultation, very smooth video quality." },
    { id: 2, patient: "Emily D.", rating: 4, comment: "Doctor was helpful, but wait time was a bit long." },
  ];

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Live System Monitoring</h2>
      
      {/* 1. KEY METRICS CARDS */}
      <div style={styles.statsGrid}>
        {stats.map((stat) => (
          <div key={stat.id} style={styles.statCard}>
            <div style={{ ...styles.iconWrapper, backgroundColor: `${stat.color}15`, color: stat.color }}>
              {stat.icon}
            </div>
            <div>
              <div style={styles.statLabel}>{stat.label}</div>
              <div style={styles.statValue}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.mainGrid}>
        {/* 2. LIVE ACTIVITY FEED */}
        <div style={styles.sectionCard}>
          <div style={styles.sectionHeader}>
            <Activity size={18} color="#4f46e5" />
            <h3 style={styles.sectionTitle}>Real-time Activity Feed</h3>
          </div>
          <div style={styles.list}>
            {recentActivity.map((act) => (
              <div key={act.id} style={styles.listItem}>
                <div style={styles.activityText}>
                  <strong>{act.user}</strong> {act.action} <strong>{act.target}</strong>
                </div>
                <div style={styles.activityTime}>{act.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. PATIENT FEEDBACK SUMMARY */}
        <div style={styles.sectionCard}>
          <div style={styles.sectionHeader}>
            <MessageSquare size={18} color="#16a34a" />
            <h3 style={styles.sectionTitle}>Latest Feedback</h3>
          </div>
          <div style={styles.list}>
            {feedback.map((f) => (
              <div key={f.id} style={styles.feedbackItem}>
                <div style={styles.feedbackMeta}>
                  <strong>{f.patient}</strong>
                  <span style={styles.rating}>★ {f.rating}/5</span>
                </div>
                <p style={styles.comment}>"{f.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { width: "100%" },
  title: { fontSize: "22px", fontWeight: "700", color: "#111827", marginBottom: "25px" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "30px" },
  statCard: { backgroundColor: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: "15px" },
  iconWrapper: { width: "45px", height: "45px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" },
  statLabel: { fontSize: "13px", color: "#6b7280", fontWeight: "500" },
  statValue: { fontSize: "20px", fontWeight: "700", color: "#111827" },
  mainGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "25px" },
  sectionCard: { backgroundColor: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #e5e7eb" },
  sectionHeader: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", borderBottom: "1px solid #f3f4f6", paddingBottom: "10px" },
  sectionTitle: { margin: 0, fontSize: "16px", fontWeight: "600", color: "#374151" },
  list: { display: "flex", flexDirection: "column", gap: "15px" },
  listItem: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "10px", borderBottom: "1px solid #f9fafb" },
  activityText: { fontSize: "14px", color: "#4b5563" },
  activityTime: { fontSize: "12px", color: "#9ca3af" },
  feedbackItem: { padding: "12px", backgroundColor: "#f9fafb", borderRadius: "8px" },
  feedbackMeta: { display: "flex", justifyContent: "space-between", marginBottom: "5px", fontSize: "13px" },
  rating: { color: "#f59e0b", fontWeight: "bold" },
  comment: { margin: 0, fontSize: "13px", color: "#6b7280", fontStyle: "italic" }
};

export default SystemMonitoring;