import React, { useEffect, useState } from "react";
import {
  Activity, Video, Calendar, MessageSquare,
  TrendingUp, Users, CheckCircle, Clock, AlertCircle
} from "lucide-react";
import { getSystemMonitoring, getRecentActivity, getLatestFeedback } from "../../services/adminActions";
import "./SystemMonitoring.css";

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
    <div className="sm-container">
      <div className="sm-header-section">
        <h2 className="sm-title">Live System Monitoring</h2>
        <button
          onClick={fetchMonitoringData}
          className="sm-refresh-btn"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="sm-error-box">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Loading State */}
      {loading && stats.length === 0 && (
        <div className="sm-loading-box">
          <div className="sm-spinner"></div>
          <p>Loading monitoring data...</p>
        </div>
      )}

      {/* 1. KEY METRICS CARDS */}
      <div className="sm-stats-grid">
        {stats.map((stat) => (
          <div key={stat.id} className="sm-stat-card">
            <div className="sm-icon-wrapper" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
              {stat.icon}
            </div>
            <div>
              <div className="sm-stat-label">{stat.label}</div>
              <div className="sm-stat-value">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="sm-main-grid">
        {/* 2. LIVE ACTIVITY FEED */}
        <div className="sm-section-card">
          <div className="sm-section-header">
            <Activity size={18} color="#16a34a" />
            <h3 className="sm-section-title">Real-time Activity Feed</h3>
          </div>
          <div className="sm-list">
            {recentActivity && recentActivity.length > 0 ? (
              recentActivity.map((act) => (
                <div key={act.id} className="sm-list-item">
                  <div className="sm-activity-text">
                    <strong>{act.user}</strong> {act.action} <strong>{act.target}</strong>
                  </div>
                  <div className="sm-activity-time">{act.time}</div>
                </div>
              ))
            ) : (
              <div className="sm-empty-state">No recent activity</div>
            )}
          </div>
        </div>

        {/* 3. PATIENT FEEDBACK SUMMARY */}
        <div className="sm-section-card">
          <div className="sm-section-header">
            <MessageSquare size={18} color="#16a34a" />
            <h3 className="sm-section-title">Latest Feedback</h3>
          </div>
          <div className="sm-list">
            {feedback && feedback.length > 0 ? (
              feedback.map((f) => (
                <div key={f.id} className="sm-feedback-item">
                  <div className="sm-feedback-meta">
                    <strong>{f.patient}</strong>
                    <span className="sm-rating">★ {f.rating}/5</span>
                  </div>
                  <p className="sm-comment">"{f.comment}"</p>
                </div>
              ))
            ) : (
              <div className="sm-empty-state">No feedback yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemMonitoring;