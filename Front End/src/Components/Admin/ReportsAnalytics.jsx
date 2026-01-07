import React from "react";
import { 
  BarChart3, TrendingUp, Users, Star, 
  Download, Filter, ArrowUpRight, Calendar 
} from "lucide-react";

const ReportsAnalytics = () => {
  // Mock Data for Analytics
  const topDoctors = [
    { id: 1, name: "Dr. Raz", consultations: 145, rating: 4.9 },
    { id: 2, name: "Dr. Sarah", consultations: 122, rating: 4.8 },
    { id: 3, name: "Dr. Smith", consultations: 98, rating: 4.7 },
  ];

  const engagementMetrics = [
    { label: "Patient Retention", value: 85, color: "#4f46e5" },
    { label: "App Usage Frequency", value: 72, color: "#16a34a" },
    { label: "Consultation Completion", value: 94, color: "#f59e0b" },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Reports & Analytics</h2>
          <p style={styles.subtitle}>Analyze system growth and performance metrics.</p>
        </div>
        <div style={styles.headerActions}>
          <button style={styles.filterBtn}><Calendar size={16} /> Last 30 Days</button>
          <button style={styles.downloadBtn}><Download size={16} /> Export CSV</button>
        </div>
      </div>

      {/* 1. KEY PERFORMANCE INDICATORS */}
      <div style={styles.kpiGrid}>
        <div style={styles.kpiCard}>
          <div style={styles.kpiHeader}>
            <span style={styles.kpiLabel}>Total Consultations</span>
            <TrendingUp size={18} color="#16a34a" />
          </div>
          <div style={styles.kpiValue}>1,284</div>
          <div style={styles.kpiTrend}>+12.5% from last month</div>
        </div>
        <div style={styles.kpiCard}>
          <div style={styles.kpiHeader}>
            <span style={styles.kpiLabel}>New Registrations</span>
            <Users size={18} color="#4f46e5" />
          </div>
          <div style={styles.kpiValue}>452</div>
          <div style={styles.kpiTrend}>+8.2% from last month</div>
        </div>
      </div>

      <div style={styles.mainGrid}>
        {/* 2. MOST CONSULTED DOCTORS */}
        <div style={styles.sectionCard}>
          <div style={styles.sectionHeader}>
            <Star size={18} color="#f59e0b" />
            <h3 style={styles.sectionTitle}>Top Performing Doctors</h3>
          </div>
          <div style={styles.doctorList}>
            {topDoctors.map((dr) => (
              <div key={dr.id} style={styles.doctorItem}>
                <div>
                  <div style={styles.drName}>{dr.name}</div>
                  <div style={styles.drSub}>{dr.consultations} Consultations</div>
                </div>
                <div style={styles.drRating}>★ {dr.rating}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. PATIENT ENGAGEMENT STATISTICS */}
        <div style={styles.sectionCard}>
          <div style={styles.sectionHeader}>
            <BarChart3 size={18} color="#4f46e5" />
            <h3 style={styles.sectionTitle}>Engagement Statistics</h3>
          </div>
          <div style={styles.metricsList}>
            {engagementMetrics.map((metric, index) => (
              <div key={index} style={styles.metricItem}>
                <div style={styles.metricLabelRow}>
                  <span style={styles.metricLabel}>{metric.label}</span>
                  <span style={styles.metricValue}>{metric.value}%</span>
                </div>
                <div style={styles.progressBarBg}>
                  <div style={{
                    ...styles.progressBarFill, 
                    width: `${metric.value}%`, 
                    backgroundColor: metric.color 
                  }} />
                </div>
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
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "30px" },
  title: { fontSize: "22px", fontWeight: "700", color: "#111827", margin: 0 },
  subtitle: { color: "#6b7280", fontSize: "14px", marginTop: "5px" },
  headerActions: { display: "flex", gap: "10px" },
  filterBtn: { display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", borderRadius: "8px", border: "1px solid #e5e7eb", backgroundColor: "#fff", cursor: "pointer", fontSize: "13px" },
  downloadBtn: { display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", borderRadius: "8px", border: "none", backgroundColor: "#4f46e5", color: "#fff", cursor: "pointer", fontSize: "13px", fontWeight: "600" },
  kpiGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" },
  kpiCard: { backgroundColor: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e5e7eb" },
  kpiHeader: { display: "flex", justifyContent: "space-between", marginBottom: "10px" },
  kpiLabel: { fontSize: "14px", color: "#6b7280", fontWeight: "500" },
  kpiValue: { fontSize: "28px", fontWeight: "700", color: "#111827" },
  kpiTrend: { fontSize: "12px", color: "#16a34a", marginTop: "5px", fontWeight: "500" },
  mainGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "25px" },
  sectionCard: { backgroundColor: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #e5e7eb" },
  sectionHeader: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" },
  sectionTitle: { margin: 0, fontSize: "16px", fontWeight: "600", color: "#374151" },
  doctorList: { display: "flex", flexDirection: "column", gap: "15px" },
  doctorItem: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", backgroundColor: "#f9fafb", borderRadius: "8px" },
  drName: { fontSize: "14px", fontWeight: "600", color: "#111827" },
  drSub: { fontSize: "12px", color: "#6b7280" },
  drRating: { fontSize: "14px", fontWeight: "700", color: "#f59e0b" },
  metricsList: { display: "flex", flexDirection: "column", gap: "20px" },
  metricItem: { width: "100%" },
  metricLabelRow: { display: "flex", justifyContent: "space-between", marginBottom: "8px" },
  metricLabel: { fontSize: "14px", fontWeight: "500", color: "#4b5563" },
  metricValue: { fontSize: "14px", fontWeight: "700", color: "#111827" },
  progressBarBg: { width: "100%", height: "8px", backgroundColor: "#f3f4f6", borderRadius: "4px", overflow: "hidden" },
  progressBarFill: { height: "100%", borderRadius: "4px", transition: "width 1s ease-in-out" }
};

export default ReportsAnalytics;