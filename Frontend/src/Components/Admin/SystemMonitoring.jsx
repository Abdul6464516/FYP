import React, { useEffect, useState } from "react";
import { 
  Activity, Video, Calendar, MessageSquare, 
  TrendingUp, Users, CheckCircle, Clock, AlertCircle 
} from "lucide-react";
import { getSystemMonitoring, getRecentActivity, getLatestFeedback } from "../../services/adminActions";

// Add animation styles
const animationStyles = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

// Inject animation styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = animationStyles;
  document.head.appendChild(style);
}

const SystemMonitoring = () => {
  const [stats, setStats] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMonitoringData();
    // Refresh data every 30 seconds for real-time monitoring
    const interval = setInterval(fetchMonitoringData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchMonitoringData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all monitoring data in parallel
      const [statsData, activityData, feedbackData] = await Promise.all([
        getSystemMonitoring(),
        getRecentActivity(),
        getLatestFeedback(5)
      ]);

      // Format stats with icons and colors
      const formattedStats = [
        { 
          id: 1, 
          label: "Active Consultations", 
          value: statsData.activeConsultations || 0, 
          icon: <Video size={20} />, 
          color: "#4f46e5" 
        },
        { 
          id: 2, 
          label: "Total Appointments Today", 
          value: statsData.appointmentsToday || 0, 
          icon: <Calendar size={20} />, 
          color: "#16a34a" 
        },
        { 
          id: 3, 
          label: "Avg. Wait Time", 
          value: `${statsData.avgWaitTime || 8} min`, 
          icon: <Clock size={20} />, 
          color: "#f59e0b" 
        },
        { 
          id: 4, 
          label: "Platform Satisfaction", 
          value: `${statsData.platformSatisfaction || 94}%`, 
          icon: <TrendingUp size={20} />, 
          color: "#10b981" 
        },
      ];

      setStats(formattedStats);
      setRecentActivity(activityData || []);
      setFeedback(feedbackData || []);
    } catch (err) {
      console.error('Error fetching monitoring data:', err);
      setError(err.message || 'Failed to fetch monitoring data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerSection}>
        <h2 style={styles.title}>Live System Monitoring</h2>
        <button 
          onClick={fetchMonitoringData}
          style={styles.refreshBtn}
          disabled={loading}
        >
          🔄 {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div style={styles.errorBox}>
          <AlertCircle size={18} style={{ marginRight: '10px' }} />
          <span>{error}</span>
        </div>
      )}

      {/* Loading State */}
      {loading && stats.length === 0 && (
        <div style={styles.loadingBox}>
          <div style={styles.spinner}></div>
          <p>Loading monitoring data...</p>
        </div>
      )}
      
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
            {recentActivity && recentActivity.length > 0 ? (
              recentActivity.map((act) => (
                <div key={act.id} style={styles.listItem}>
                  <div style={styles.activityText}>
                    <strong>{act.user}</strong> {act.action} <strong>{act.target}</strong>
                  </div>
                  <div style={styles.activityTime}>{act.time}</div>
                </div>
              ))
            ) : (
              <div style={styles.emptyState}>No recent activity</div>
            )}
          </div>
        </div>

        {/* 3. PATIENT FEEDBACK SUMMARY */}
        <div style={styles.sectionCard}>
          <div style={styles.sectionHeader}>
            <MessageSquare size={18} color="#16a34a" />
            <h3 style={styles.sectionTitle}>Latest Feedback</h3>
          </div>
          <div style={styles.list}>
            {feedback && feedback.length > 0 ? (
              feedback.map((f) => (
                <div key={f.id} style={styles.feedbackItem}>
                  <div style={styles.feedbackMeta}>
                    <strong>{f.patient}</strong>
                    <span style={styles.rating}>★ {f.rating}/5</span>
                  </div>
                  <p style={styles.comment}>"{f.comment}"</p>
                </div>
              ))
            ) : (
              <div style={styles.emptyState}>No feedback yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { width: "100%" },
  headerSection: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" },
  title: { fontSize: "22px", fontWeight: "700", color: "#111827", margin: 0 },
  refreshBtn: { 
    padding: "8px 16px", 
    backgroundColor: "#16a34a", 
    color: "#fff", 
    border: "none", 
    borderRadius: "8px", 
    cursor: "pointer", 
    fontSize: "13px",
    fontWeight: "600",
    transition: "background-color 0.3s",
    opacity: 1
  },
  errorBox: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fee2e2",
    border: "1px solid #fecaca",
    color: "#dc2626",
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "14px"
  },
  loadingBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
    backgroundColor: "#f9fafb",
    borderRadius: "12px",
    border: "1px solid #e5e7eb"
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #e5e7eb",
    borderTop: "4px solid #4f46e5",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "15px"
  },
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
  comment: { margin: 0, fontSize: "13px", color: "#6b7280", fontStyle: "italic" },
  emptyState: { textAlign: "center", padding: "30px 20px", color: "#9ca3af", fontSize: "14px" }
};

export default SystemMonitoring;