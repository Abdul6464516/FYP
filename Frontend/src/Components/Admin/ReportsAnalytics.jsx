import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { 
  BarChart3, TrendingUp, Users, Star, 
  Download, Filter, ArrowUpRight, Calendar, AlertCircle, Activity
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { getTopDoctors, getKPIMetrics, getEngagementMetrics, getConsultationTrend } from "../../services/adminActions";

const ReportsAnalytics = () => {
  const [topDoctors, setTopDoctors] = useState([]);
  const [kpiMetrics, setKpiMetrics] = useState({
    totalConsultations: 0,
    newRegistrations: 0,
    consultationsTrend: 0,
    consultationsLastMonth: 0
  });
  const [engagementMetrics, setEngagementMetrics] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [doctorsData, kpiData, engagementData, trendChartData] = await Promise.all([
        getTopDoctors(),
        getKPIMetrics(),
        getEngagementMetrics(),
        getConsultationTrend()
      ]);

      setTopDoctors(doctorsData);
      setKpiMetrics(kpiData);
      setEngagementMetrics(engagementData);

      // Format trend data for chart
      if (trendChartData?.months && trendChartData?.consultationData) {
        const formattedTrend = trendChartData.months.map((month, index) => ({
          month,
          consultations: trendChartData.consultationData[index]
        }));
        setTrendData(formattedTrend);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err.message || 'Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  // Colors for engagement metrics pie chart
  const ENGAGEMENT_COLORS = ["#4f46e5", "#16a34a", "#f59e0b"];

  // Export analytics data to CSV
  const exportToCSV = () => {
    try {
      let csvContent = "Reports & Analytics Export\n";
      csvContent += `Generated on: ${new Date().toLocaleString()}\n\n`;

      // 1. KPI Metrics Section
      csvContent += "KEY PERFORMANCE INDICATORS\n";
      csvContent += "Metric,Value\n";
      csvContent += `Total Consultations,${kpiMetrics.totalConsultations || 0}\n`;
      csvContent += `New Registrations (Last 30 Days),${kpiMetrics.newRegistrations || 0}\n`;
      csvContent += `Consultations Trend %,${kpiMetrics.consultationsTrend || 0}%\n`;
      csvContent += `Consultations Last Month,${kpiMetrics.consultationsLastMonth || 0}\n\n`;

      // 2. Top Doctors Section
      csvContent += "TOP PERFORMING DOCTORS\n";
      csvContent += "Rank,Doctor Name,Consultations,Rating\n";
      topDoctors.forEach((dr, index) => {
        csvContent += `${index + 1},${dr.name || 'Unknown'},${dr.consultations || 0},${dr.rating || 0}\n`;
      });
      csvContent += "\n";

      // 3. Engagement Metrics Section
      csvContent += "ENGAGEMENT METRICS\n";
      csvContent += "Metric,Percentage\n";
      engagementMetrics.forEach((metric) => {
        csvContent += `${metric.label},${metric.value}%\n`;
      });
      csvContent += "\n";

      // 4. Consultation Trends Section
      csvContent += "CONSULTATION TRENDS (LAST 6 MONTHS)\n";
      csvContent += "Month,Consultations\n";
      trendData.forEach((trend) => {
        csvContent += `${trend.month},${trend.consultations}\n`;
      });

      // Create a blob and trigger download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      
      link.setAttribute("href", url);
      link.setAttribute("download", `Analytics-Report-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = "hidden";
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error exporting CSV:', err);
      toast.error('Failed to export CSV. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Reports & Analytics</h2>
          <p style={styles.subtitle}>Analyze system growth and performance metrics.</p>
        </div>
        <div style={styles.headerActions}>
          <button style={styles.filterBtn} onClick={fetchAnalyticsData}>
            <Filter size={16} /> Refresh
          </button>
          <button style={styles.downloadBtn} onClick={exportToCSV}>
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div style={styles.errorBox}>
          <AlertCircle size={18} style={{ marginRight: '10px' }} />
          <span>{error}</span>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div style={styles.loadingBox}>
          <div style={styles.spinner}></div>
          <p>Loading analytics data...</p>
        </div>
      ) : (
        <>
          {/* 1. KEY PERFORMANCE INDICATORS */}
          <div style={styles.kpiGrid}>
            <div style={styles.kpiCard}>
              <div style={styles.kpiHeader}>
                <span style={styles.kpiLabel}>Total Consultations</span>
                <TrendingUp size={18} color="#16a34a" />
              </div>
              <div style={styles.kpiValue}>{kpiMetrics.totalConsultations?.toLocaleString() || 0}</div>
              <div style={styles.kpiTrend}>
                <ArrowUpRight size={14} style={{ marginRight: '4px' }} />
                {kpiMetrics.consultationsTrend > 0 ? '+' : ''}{kpiMetrics.consultationsTrend}% from last month
              </div>
            </div>
            <div style={styles.kpiCard}>
              <div style={styles.kpiHeader}>
                <span style={styles.kpiLabel}>New Registrations</span>
                <Users size={18} color="#4f46e5" />
              </div>
              <div style={styles.kpiValue}>{kpiMetrics.newRegistrations || 0}</div>
              <div style={styles.kpiTrend}>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Last 30 days</span>
              </div>
            </div>
          </div>

          {/* 2. CONSULTATION TREND CHART */}
          <div style={styles.sectionCard}>
            <div style={styles.sectionHeader}>
              <Activity size={18} color="#4f46e5" />
              <h3 style={{ ...styles.sectionTitle, color: "#4f46e5" }}>Consultation Trends (Last 6 Months)</h3>
            </div>
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#fff", 
                      border: "1px solid #e5e7eb", 
                      borderRadius: "8px"
                    }} 
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="consultations" 
                    stroke="#4f46e5" 
                    strokeWidth={3}
                    dot={{ fill: "#4f46e5", r: 6 }}
                    activeDot={{ r: 8 }}
                    name="Consultations"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={styles.emptyState}>No trend data available</div>
            )}
          </div>

          <div style={styles.mainGrid}>
            {/* 3. TOP PERFORMING DOCTORS */}
            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <Star size={18} color="#f59e0b" />
                <h3 style={{ ...styles.sectionTitle, color: "#f59e0b" }}>Top Performing Doctors</h3>
              </div>
              {topDoctors.length > 0 ? (
                <div style={styles.doctorList}>
                  {topDoctors.map((dr, index) => (
                    <div key={dr.doctorId || index} style={styles.doctorItem}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={styles.doctorRank}>{index + 1}</div>
                        <div>
                          <div style={styles.drName}>{dr.name || 'Unknown'}</div>
                          <div style={styles.drSub}>{dr.consultations || 0} Consultations</div>
                        </div>
                      </div>
                      <div style={styles.drRating}>★ {dr.rating || 0}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={styles.emptyState}>No doctor data available</div>
              )}
            </div>

            {/* 4. ENGAGEMENT METRICS */}
            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <BarChart3 size={18} color="#16a34a" />
                <h3 style={{ ...styles.sectionTitle, color: "#16a34a" }}>Engagement Metrics</h3>
              </div>
              <div style={styles.metricsContainer}>
                {engagementMetrics.length > 0 ? (
                  <>
                    <div style={styles.metricsList}>
                      {engagementMetrics.map((metric, index) => (
                        <div key={index} style={styles.metricItem}>
                          <div style={styles.metricLabelRow}>
                            <span style={styles.metricLabel}>{metric.label}</span>
                            <span style={{ ...styles.metricValue, color: metric.color }}>
                              {metric.value}%
                            </span>
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
                    {engagementMetrics.length > 0 && (
                      <ResponsiveContainer width="100%" height={320}>
                        <PieChart margin={{ top: 20, right: 10, bottom: 20, left: 10 }}>
                          <Pie
                            data={engagementMetrics}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ label, value }) => `${label}: ${value}%`}
                            outerRadius={70}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {engagementMetrics.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </>
                ) : (
                  <div style={styles.emptyState}>No engagement data available</div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  container: { width: "100%" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "30px" },
  title: { fontSize: "22px", fontWeight: "700", color: "#111827", margin: 0 },
  subtitle: { color: "#6b7280", fontSize: "14px", marginTop: "5px" },
  headerActions: { display: "flex", gap: "10px" },
  filterBtn: { display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", borderRadius: "8px", border: "1px solid #e5e7eb", backgroundColor: "#fff", cursor: "pointer", fontSize: "13px", fontWeight: "500", color: "#4b5563", transition: "all 0.2s" },
  downloadBtn: { display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", borderRadius: "8px", border: "none", backgroundColor: "#16a34a", color: "#fff", cursor: "pointer", fontSize: "13px", fontWeight: "600" },
  
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
    padding: "80px 20px",
    backgroundColor: "#f9fafb",
    borderRadius: "12px",
    border: "1px solid #e5e7eb"
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #e5e7eb",
    borderTop: "4px solid #16a34a",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "15px"
  },

  kpiGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" },
  kpiCard: { backgroundColor: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e5e7eb" },
  kpiHeader: { display: "flex", justifyContent: "space-between", marginBottom: "10px" },
  kpiLabel: { fontSize: "14px", color: "#6b7280", fontWeight: "500" },
  kpiValue: { fontSize: "28px", fontWeight: "700", color: "#111827" },
  kpiTrend: { fontSize: "12px", color: "#16a34a", marginTop: "5px", fontWeight: "500", display: "flex", alignItems: "center" },
  
  mainGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "25px" },
  sectionCard: { backgroundColor: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #e5e7eb" },
  sectionHeader: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", borderBottom: "1px solid #f3f4f6", paddingBottom: "15px" },
  sectionTitle: { margin: 0, fontSize: "16px", fontWeight: "600", color: "#374151" },
  
  doctorList: { display: "flex", flexDirection: "column", gap: "12px" },
  doctorItem: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px", backgroundColor: "#f9fafb", borderRadius: "10px", border: "1px solid #f3f4f6", transition: "all 0.2s" },
  doctorRank: { width: "28px", height: "28px", borderRadius: "50%", backgroundColor: "#16a34a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "12px", flexShrink: 0 },
  drName: { fontSize: "14px", fontWeight: "600", color: "#111827" },
  drSub: { fontSize: "12px", color: "#6b7280", marginTop: "2px" },
  drRating: { fontSize: "14px", fontWeight: "700", color: "#f59e0b", backgroundColor: "#fef3c7", padding: "4px 10px", borderRadius: "6px" },
  
  metricsContainer: { display: "flex", flexDirection: "column", gap: "20px" },
  metricsList: { display: "flex", flexDirection: "column", gap: "18px" },
  metricItem: { width: "100%" },
  metricLabelRow: { display: "flex", justifyContent: "space-between", marginBottom: "8px" },
  metricLabel: { fontSize: "14px", fontWeight: "500", color: "#4b5563" },
  metricValue: { fontSize: "14px", fontWeight: "700", color: "#111827" },
  progressBarBg: { width: "100%", height: "8px", backgroundColor: "#f3f4f6", borderRadius: "4px", overflow: "hidden" },
  progressBarFill: { height: "100%", borderRadius: "4px", transition: "width 1s ease-in-out" },
  
  emptyState: { textAlign: "center", padding: "40px 20px", color: "#9ca3af", fontSize: "14px" }
};

// Add animation styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}

export default ReportsAnalytics;