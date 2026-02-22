import React, { useState, useEffect } from "react";
import {
  Search, Clock, FileText, Calendar, ChevronRight,
  Download, User, Activity, Pill, Stethoscope, ClipboardList,
  Phone, Mail, MapPin, Heart, AlertCircle, Loader2
} from "lucide-react";
import { getCompletedPatients, getPatientHistory } from "../../services/doctorAction";
import jsPDF from "jspdf";

const PatientHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [history, setHistory] = useState(null);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState("");

  // Fetch completed patients on mount
  useEffect(() => {
    async function fetchPatients() {
      try {
        setLoadingPatients(true);
        const data = await getCompletedPatients();
        setPatients(data.patients || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingPatients(false);
      }
    }
    fetchPatients();
  }, []);

  // Fetch patient history when a patient is selected
  const handleSelectPatient = async (patient) => {
    setSelectedPatient(patient);
    setHistory(null);
    try {
      setLoadingHistory(true);
      const data = await getPatientHistory(patient._id);
      setHistory(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric",
    });
  };

  // Format duration helper
  const formatDuration = (seconds) => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Status badge colors
  const getStatusColor = (status) => {
    const map = {
      completed: { bg: "#dcfce7", color: "#15803d" },
      approved: { bg: "#dbeafe", color: "#1d4ed8" },
      pending: { bg: "#fef3c7", color: "#b45309" },
      cancelled: { bg: "#fee2e2", color: "#dc2626" },
      active: { bg: "#dbeafe", color: "#1d4ed8" },
      missed: { bg: "#fee2e2", color: "#dc2626" },
      sent: { bg: "#dcfce7", color: "#15803d" },
      viewed: { bg: "#dbeafe", color: "#1d4ed8" },
      draft: { bg: "#f3f4f6", color: "#6b7280" },
    };
    return map[status] || { bg: "#f3f4f6", color: "#6b7280" };
  };

  // Timeline icon + color by type
  const getTimelineIcon = (type) => {
    switch (type) {
      case "appointment": return { icon: <Calendar size={16} />, color: "#2563eb", bg: "#dbeafe", label: "Appointment" };
      case "consultation": return { icon: <Stethoscope size={16} />, color: "#7c3aed", bg: "#ede9fe", label: "Consultation" };
      case "prescription": return { icon: <Pill size={16} />, color: "#059669", bg: "#d1fae5", label: "Prescription" };
      default: return { icon: <Activity size={16} />, color: "#6b7280", bg: "#f3f4f6", label: "Event" };
    }
  };

  // PDF Export
  const handleExportPDF = () => {
    if (!history || !selectedPatient) return;

    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();
    let y = 15;

    // Header strip
    doc.setFillColor(22, 163, 106);
    doc.rect(0, 0, pageW, 38, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Patient Medical History", pageW / 2, 16, { align: "center" });
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, pageW / 2, 26, { align: "center" });

    // Patient info box
    y = 48;
    doc.setDrawColor(229, 231, 235);
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(14, y, pageW - 28, 36, 3, 3, "FD");
    doc.setTextColor(17, 24, 39);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(history.patient.fullName, 20, y + 10);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    const info = [
      `Age: ${history.patient.age || "N/A"}`,
      `Gender: ${history.patient.gender || "N/A"}`,
      `Phone: ${history.patient.phone || "N/A"}`,
      `Email: ${history.patient.email || "N/A"}`,
      `City: ${history.patient.city || "N/A"}`,
    ].join("   |   ");
    doc.text(info, 20, y + 20);

    // Summary
    const s = history.summary;
    doc.setFontSize(10);
    doc.setTextColor(22, 163, 106);
    doc.text(
      `Total Appointments: ${s.totalAppointments}   |   Completed: ${s.completedAppointments}   |   Consultations: ${s.totalConsultations}   |   Prescriptions: ${s.totalPrescriptions}`,
      20, y + 30
    );

    y += 44;

    // Timeline
    doc.setTextColor(17, 24, 39);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Medical Timeline", 14, y);
    y += 8;

    for (const item of history.timeline) {
      if (y > 270) { doc.addPage(); y = 20; }

      const meta = getTimelineIcon(item.type);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(22, 163, 106);
      doc.text(`${formatDate(item.date)}  —  ${meta.label}`, 20, y);
      y += 6;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(55, 65, 81);
      doc.setFontSize(9);

      if (item.type === "appointment") {
        const d = item.data;
        doc.text(`Type: ${d.appointmentType || "N/A"}  |  Time: ${d.time || "N/A"}  |  Status: ${d.status}`, 24, y); y += 5;
        if (d.reason) { doc.text(`Reason: ${d.reason}`, 24, y); y += 5; }
        if (d.doctorRemarks) { doc.text(`Remarks: ${d.doctorRemarks}`, 24, y); y += 5; }
        if (d.fee) { doc.text(`Fee: Rs. ${d.fee}`, 24, y); y += 5; }
      } else if (item.type === "consultation") {
        const d = item.data;
        doc.text(`Status: ${d.status}  |  Duration: ${formatDuration(d.duration)}`, 24, y); y += 5;
        if (d.notes) {
          const lines = doc.splitTextToSize(`Notes: ${d.notes}`, pageW - 50);
          doc.text(lines, 24, y); y += lines.length * 4.5;
        }
      } else if (item.type === "prescription") {
        const d = item.data;
        if (d.diagnosis) { doc.text(`Diagnosis: ${d.diagnosis}`, 24, y); y += 5; }
        if (d.medications?.length) {
          for (const med of d.medications) {
            doc.text(`• ${med.name} — ${med.dosage}, ${med.frequency}, ${med.duration}`, 28, y); y += 5;
            if (y > 275) { doc.addPage(); y = 20; }
          }
        }
        if (d.instructions) {
          const lines = doc.splitTextToSize(`Instructions: ${d.instructions}`, pageW - 50);
          doc.text(lines, 24, y); y += lines.length * 4.5;
        }
      }

      y += 6;
    }

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(156, 163, 175);
      doc.text("Confidential — Healthcare Management System", pageW / 2, 290, { align: "center" });
      doc.text(`Page ${i} of ${pageCount}`, pageW - 20, 290, { align: "right" });
    }

    doc.save(`${history.patient.fullName.replace(/\s+/g, "_")}_History.pdf`);
  };

  // Filter patients
  const filteredPatients = patients.filter(p =>
    p.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      {/* LEFT: Patient List */}
      <div style={styles.listSection}>
        <div style={styles.listHeader}>
          <ClipboardList size={20} color="#16a34a" />
          <h3 style={{ margin: 0, fontSize: "16px", color: "#111827" }}>My Patients</h3>
          <span style={styles.badge}>{patients.length}</span>
        </div>

        <div style={styles.searchBox}>
          <Search size={18} color="#9ca3af" />
          <input
            type="text"
            placeholder="Search by name, email, city..."
            style={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {error && (
          <div style={styles.errorBar}>
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <div style={styles.patientList}>
          {loadingPatients ? (
            <div style={styles.centerFlex}>
              <Loader2 size={28} color="#16a34a" style={{ animation: "spin 1s linear infinite" }} />
              <span style={{ color: "#6b7280", fontSize: "13px", marginTop: "8px" }}>Loading patients...</span>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div style={styles.centerFlex}>
              <User size={32} color="#d1d5db" />
              <span style={{ color: "#9ca3af", fontSize: "13px", marginTop: "8px" }}>
                {searchTerm ? "No matching patients" : "No completed patients yet"}
              </span>
            </div>
          ) : (
            filteredPatients.map((p) => (
              <div
                key={p._id}
                style={{
                  ...styles.patientCard,
                  borderColor: selectedPatient?._id === p._id ? "#16a34a" : "#e5e7eb",
                  backgroundColor: selectedPatient?._id === p._id ? "#f0fdf4" : "#fff",
                  boxShadow: selectedPatient?._id === p._id ? "0 0 0 2px rgba(22,163,74,0.15)" : "none",
                }}
                onClick={() => handleSelectPatient(p)}
              >
                <div style={styles.avatarSmall}>
                  {p.fullName?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={styles.patientName}>{p.fullName}</div>
                  <div style={styles.patientSub}>
                    {p.gender || "—"}{p.age ? `, ${p.age} yrs` : ""}
                    {p.city ? ` • ${p.city}` : ""}
                  </div>
                  <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "2px" }}>
                    Last visit: {formatDate(p.lastAppointmentDate)}
                  </div>
                </div>
                <ChevronRight size={16} color="#9ca3af" />
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT: Patient History */}
      <div style={styles.historySection}>
        {loadingHistory ? (
          <div style={styles.emptyState}>
            <Loader2 size={48} color="#16a34a" style={{ animation: "spin 1s linear infinite" }} />
            <p style={{ color: "#6b7280", marginTop: "12px" }}>Loading medical history...</p>
          </div>
        ) : history && selectedPatient ? (
          <>
            {/* Patient Info Card */}
            <div style={styles.patientInfoCard}>
              <div style={styles.patientInfoLeft}>
                <div style={styles.avatarLarge}>
                  {history.patient.fullName?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "18px", color: "#111827" }}>
                    {history.patient.fullName}
                  </h3>
                  <div style={styles.infoRow}>
                    <span style={styles.infoChip}><User size={12} /> {history.patient.gender || "—"}, {history.patient.age || "—"} yrs</span>
                    {history.patient.phone && <span style={styles.infoChip}><Phone size={12} /> {history.patient.phone}</span>}
                    {history.patient.email && <span style={styles.infoChip}><Mail size={12} /> {history.patient.email}</span>}
                    {history.patient.city && <span style={styles.infoChip}><MapPin size={12} /> {history.patient.city}</span>}
                  </div>
                  {history.patient.medicalHistory && (
                    <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "6px" }}>
                      <Heart size={12} style={{ verticalAlign: "middle", marginRight: "4px" }} />
                      {history.patient.medicalHistory}
                    </div>
                  )}
                </div>
              </div>
              <button style={styles.downloadBtn} onClick={handleExportPDF}>
                <Download size={15} /> Export PDF
              </button>
            </div>

            {/* Summary Cards */}
            <div style={styles.summaryRow}>
              {[
                { label: "Appointments", value: history.summary.totalAppointments, icon: <Calendar size={18} />, color: "#2563eb", bg: "#eff6ff" },
                { label: "Completed", value: history.summary.completedAppointments, icon: <Activity size={18} />, color: "#16a34a", bg: "#f0fdf4" },
                { label: "Consultations", value: history.summary.totalConsultations, icon: <Stethoscope size={18} />, color: "#7c3aed", bg: "#f5f3ff" },
                { label: "Prescriptions", value: history.summary.totalPrescriptions, icon: <Pill size={18} />, color: "#ea580c", bg: "#fff7ed" },
              ].map((s, i) => (
                <div key={i} style={{ ...styles.summaryCard, backgroundColor: s.bg }}>
                  <div style={{ color: s.color }}>{s.icon}</div>
                  <div>
                    <div style={{ fontSize: "22px", fontWeight: "700", color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: "11px", color: "#6b7280", fontWeight: "500" }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Timeline */}
            <div style={styles.timelineHeader}>
              <Clock size={16} color="#16a34a" />
              <h4 style={{ margin: 0, fontSize: "15px", color: "#111827" }}>Medical Timeline</h4>
            </div>

            {history.timeline.length === 0 ? (
              <div style={{ ...styles.emptyState, height: "auto", padding: "40px 0" }}>
                <FileText size={36} color="#d1d5db" />
                <p style={{ color: "#9ca3af" }}>No records found for this patient.</p>
              </div>
            ) : (
              <div style={styles.timeline}>
                {history.timeline.map((item, index) => {
                  const meta = getTimelineIcon(item.type);
                  return (
                    <div key={index} style={styles.timelineItem}>
                      {/* Dot */}
                      <div style={{ ...styles.timelineDot, backgroundColor: meta.bg, borderColor: meta.color }}>
                        <span style={{ color: meta.color }}>{meta.icon}</span>
                      </div>

                      {/* Connector line */}
                      {index < history.timeline.length - 1 && <div style={styles.timelineLine} />}

                      {/* Content */}
                      <div style={styles.timelineContent}>
                        <div style={styles.timelineMeta}>
                          <span style={{ ...styles.typeChip, backgroundColor: meta.bg, color: meta.color }}>
                            {meta.label}
                          </span>
                          <span style={styles.timelineDate}>
                            <Calendar size={12} /> {formatDate(item.date)}
                          </span>
                        </div>

                        {/* Appointment card */}
                        {item.type === "appointment" && (
                          <div style={styles.cardBody}>
                            <div style={styles.cardRow}>
                              <span style={styles.cardLabel}>Type</span>
                              <span style={styles.cardValue}>{item.data.appointmentType || "N/A"}</span>
                            </div>
                            <div style={styles.cardRow}>
                              <span style={styles.cardLabel}>Time</span>
                              <span style={styles.cardValue}>{item.data.time || "N/A"}</span>
                            </div>
                            <div style={styles.cardRow}>
                              <span style={styles.cardLabel}>Status</span>
                              <span style={{
                                ...styles.statusBadge,
                                backgroundColor: getStatusColor(item.data.status).bg,
                                color: getStatusColor(item.data.status).color,
                              }}>
                                {item.data.status}
                              </span>
                            </div>
                            {item.data.reason && (
                              <div style={styles.cardRow}>
                                <span style={styles.cardLabel}>Reason</span>
                                <span style={styles.cardValue}>{item.data.reason}</span>
                              </div>
                            )}
                            {item.data.doctorRemarks && (
                              <div style={styles.cardRow}>
                                <span style={styles.cardLabel}>Remarks</span>
                                <span style={styles.cardValue}>{item.data.doctorRemarks}</span>
                              </div>
                            )}
                            {item.data.fee && (
                              <div style={styles.cardRow}>
                                <span style={styles.cardLabel}>Fee</span>
                                <span style={{ fontWeight: "600", color: "#16a34a" }}>Rs. {item.data.fee}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Consultation card */}
                        {item.type === "consultation" && (
                          <div style={styles.cardBody}>
                            <div style={styles.cardRow}>
                              <span style={styles.cardLabel}>Status</span>
                              <span style={{
                                ...styles.statusBadge,
                                backgroundColor: getStatusColor(item.data.status).bg,
                                color: getStatusColor(item.data.status).color,
                              }}>
                                {item.data.status}
                              </span>
                            </div>
                            <div style={styles.cardRow}>
                              <span style={styles.cardLabel}>Duration</span>
                              <span style={styles.cardValue}>{formatDuration(item.data.duration)}</span>
                            </div>
                            {item.data.appointmentType && (
                              <div style={styles.cardRow}>
                                <span style={styles.cardLabel}>Type</span>
                                <span style={styles.cardValue}>{item.data.appointmentType}</span>
                              </div>
                            )}
                            {item.data.notes && (
                              <div style={{ marginTop: "8px", padding: "8px 10px", backgroundColor: "#f9fafb", borderRadius: "6px", fontSize: "13px", color: "#4b5563", lineHeight: "1.5" }}>
                                <strong>Notes:</strong> {item.data.notes}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Prescription card */}
                        {item.type === "prescription" && (
                          <div style={styles.cardBody}>
                            {item.data.diagnosis && (
                              <div style={styles.cardRow}>
                                <span style={styles.cardLabel}>Diagnosis</span>
                                <span style={{ fontWeight: "600", color: "#111827" }}>{item.data.diagnosis}</span>
                              </div>
                            )}
                            {item.data.medications?.length > 0 && (
                              <div style={{ marginTop: "6px" }}>
                                <span style={{ ...styles.cardLabel, marginBottom: "6px", display: "block" }}>Medications</span>
                                <div style={styles.medTable}>
                                  <div style={styles.medHeader}>
                                    <span>Medicine</span>
                                    <span>Dosage</span>
                                    <span>Frequency</span>
                                    <span>Duration</span>
                                  </div>
                                  {item.data.medications.map((med, mi) => (
                                    <div key={mi} style={styles.medRow}>
                                      <span style={styles.medCell}>{med.name}</span>
                                      <span style={styles.medCell}>{med.dosage}</span>
                                      <span style={styles.medCell}>{med.frequency}</span>
                                      <span style={styles.medCell}>{med.duration}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {item.data.instructions && (
                              <div style={{ marginTop: "8px", padding: "8px 10px", backgroundColor: "#f0fdf4", borderRadius: "6px", fontSize: "13px", color: "#166534", lineHeight: "1.5" }}>
                                <strong>Instructions:</strong> {item.data.instructions}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <div style={styles.emptyState}>
            <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
              <Activity size={36} color="#16a34a" />
            </div>
            <h4 style={{ margin: "0 0 6px", color: "#374151" }}>Patient Medical History</h4>
            <p style={{ color: "#9ca3af", fontSize: "14px", maxWidth: "300px", lineHeight: "1.5" }}>
              Select a patient from the list to view their complete medical history, consultations, and prescriptions.
            </p>
          </div>
        )}
      </div>

      {/* Spin animation */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

/* ─── Styles ─── */
const styles = {
  container: {
    display: "flex", gap: "0", height: "100%", minHeight: "calc(100vh - 100px)",
    background: "#fff", borderRadius: "14px", overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb",
  },
  /* LEFT PANEL */
  listSection: {
    width: "320px", minWidth: "280px", borderRight: "1px solid #f3f4f6",
    padding: "20px", display: "flex", flexDirection: "column", backgroundColor: "#fafbfc",
  },
  listHeader: {
    display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px",
  },
  badge: {
    marginLeft: "auto", backgroundColor: "#dcfce7", color: "#15803d",
    fontSize: "12px", fontWeight: "700", padding: "2px 10px", borderRadius: "20px",
  },
  searchBox: {
    display: "flex", alignItems: "center", gap: "10px",
    backgroundColor: "#fff", padding: "10px 14px", borderRadius: "10px",
    border: "1px solid #e5e7eb", marginBottom: "16px",
  },
  searchInput: {
    border: "none", backgroundColor: "transparent", outline: "none",
    width: "100%", fontSize: "13px", color: "#374151",
  },
  errorBar: {
    display: "flex", alignItems: "center", gap: "6px", padding: "8px 12px",
    backgroundColor: "#fef2f2", color: "#dc2626", borderRadius: "8px",
    fontSize: "12px", marginBottom: "12px",
  },
  patientList: {
    display: "flex", flexDirection: "column", gap: "8px",
    overflowY: "auto", flex: 1,
  },
  patientCard: {
    display: "flex", alignItems: "center", gap: "12px",
    padding: "12px", borderRadius: "12px", border: "1.5px solid #e5e7eb",
    cursor: "pointer", transition: "all 0.2s", backgroundColor: "#fff",
  },
  avatarSmall: {
    width: "40px", height: "40px", borderRadius: "50%",
    background: "linear-gradient(135deg, #16a34a, #22d3ee)",
    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: "700", fontSize: "16px", flexShrink: 0,
  },
  patientName: { fontWeight: "600", color: "#111827", fontSize: "14px" },
  patientSub: { fontSize: "12px", color: "#6b7280", marginTop: "1px" },
  centerFlex: {
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", padding: "40px 0",
  },

  /* RIGHT PANEL */
  historySection: {
    flex: 1, padding: "24px", overflowY: "auto", minWidth: 0,
  },
  patientInfoCard: {
    display: "flex", alignItems: "flex-start", justifyContent: "space-between",
    padding: "20px", backgroundColor: "#f9fafb", borderRadius: "14px",
    border: "1px solid #e5e7eb", marginBottom: "20px", flexWrap: "wrap", gap: "12px",
  },
  patientInfoLeft: {
    display: "flex", gap: "16px", alignItems: "flex-start",
  },
  avatarLarge: {
    width: "54px", height: "54px", borderRadius: "50%",
    background: "linear-gradient(135deg, #16a34a, #22d3ee)",
    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: "700", fontSize: "22px", flexShrink: 0,
  },
  infoRow: {
    display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px",
  },
  infoChip: {
    display: "inline-flex", alignItems: "center", gap: "4px",
    fontSize: "12px", color: "#6b7280", backgroundColor: "#fff",
    padding: "3px 10px", borderRadius: "20px", border: "1px solid #e5e7eb",
  },
  downloadBtn: {
    display: "flex", alignItems: "center", gap: "8px",
    border: "1px solid #16a34a", backgroundColor: "#f0fdf4",
    color: "#15803d", padding: "10px 18px", borderRadius: "10px",
    cursor: "pointer", fontSize: "13px", fontWeight: "600",
    transition: "all 0.2s", whiteSpace: "nowrap",
  },

  /* SUMMARY */
  summaryRow: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "12px", marginBottom: "24px",
  },
  summaryCard: {
    display: "flex", alignItems: "center", gap: "12px",
    padding: "16px", borderRadius: "12px", border: "1px solid #f3f4f6",
  },

  /* TIMELINE */
  timelineHeader: {
    display: "flex", alignItems: "center", gap: "8px",
    marginBottom: "16px", paddingBottom: "10px", borderBottom: "1px solid #f3f4f6",
  },
  timeline: {
    position: "relative", paddingLeft: "0",
  },
  timelineItem: {
    display: "flex", gap: "16px", marginBottom: "20px", position: "relative",
  },
  timelineDot: {
    width: "36px", height: "36px", borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    border: "2px solid", flexShrink: 0, zIndex: 1,
  },
  timelineLine: {
    position: "absolute", left: "17px", top: "38px", bottom: "-20px",
    width: "2px", backgroundColor: "#e5e7eb",
  },
  timelineContent: {
    flex: 1, backgroundColor: "#fff", borderRadius: "12px",
    border: "1px solid #f3f4f6", overflow: "hidden",
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
  },
  timelineMeta: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "10px 16px", backgroundColor: "#fafbfc", borderBottom: "1px solid #f3f4f6",
  },
  typeChip: {
    fontSize: "11px", fontWeight: "600", padding: "3px 10px",
    borderRadius: "20px",
  },
  timelineDate: {
    display: "flex", alignItems: "center", gap: "4px",
    fontSize: "12px", color: "#6b7280",
  },
  cardBody: { padding: "14px 16px" },
  cardRow: {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "4px 0", fontSize: "13px",
  },
  cardLabel: {
    fontSize: "12px", fontWeight: "600", color: "#9ca3af",
    minWidth: "80px",
  },
  cardValue: { color: "#374151", fontSize: "13px" },
  statusBadge: {
    fontSize: "11px", fontWeight: "600", padding: "2px 10px",
    borderRadius: "20px", textTransform: "capitalize",
  },

  /* MEDICATION TABLE */
  medTable: {
    borderRadius: "8px", overflow: "hidden", border: "1px solid #e5e7eb",
  },
  medHeader: {
    display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr",
    backgroundColor: "#f9fafb", padding: "8px 10px",
    fontSize: "11px", fontWeight: "600", color: "#6b7280",
    borderBottom: "1px solid #e5e7eb",
  },
  medRow: {
    display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr",
    padding: "8px 10px", fontSize: "12px", color: "#374151",
    borderBottom: "1px solid #f3f4f6",
  },
  medCell: {},

  /* EMPTY STATE */
  emptyState: {
    height: "100%", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", textAlign: "center",
    padding: "20px",
  },
};

export default PatientHistory;