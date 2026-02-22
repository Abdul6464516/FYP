import React, { useState, useEffect } from "react";
import {
  FileText, Download, Eye, Calendar, User, Search, Pill,
  Clock, Stethoscope, X, Loader, ClipboardList, ChevronRight,
  AlertCircle, CheckCircle, NotepadText
} from "lucide-react";
import { toast } from "react-toastify";
import { useUser } from "../../context/UserContext";
import { getMyPrescriptions } from "../../services/patientAction";
import jsPDF from "jspdf";

const PrescriptionAccess = () => {
  const { user } = useUser();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRx, setSelectedRx] = useState(null); // for detail modal

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyPrescriptions();
        if (data.prescriptions) setPrescriptions(data.prescriptions);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredPrescriptions = prescriptions.filter((rx) => {
    const q = searchTerm.toLowerCase();
    return (
      (rx.doctor?.fullName || "").toLowerCase().includes(q) ||
      (rx.diagnosis || "").toLowerCase().includes(q) ||
      rx.medications.some((m) => m.name.toLowerCase().includes(q))
    );
  });

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  // ── PDF GENERATION ──
  const handleDownloadPdf = (rx) => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const W = doc.internal.pageSize.getWidth();
    const margin = 18;
    let y = 18;

    // ─ Green header strip ─
    doc.setFillColor(22, 163, 74);
    doc.rect(0, 0, W, 38, "F");

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("PRESCRIPTION", margin, 16);

    // Rx ID + Date
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Date: ${formatDate(rx.createdAt)}`, margin, 24);
    doc.text(`ID: ${rx._id?.slice(-8)?.toUpperCase() || "N/A"}`, margin, 30);

    // Right side — Clinic info
    doc.setFontSize(9);
    doc.text("TeleMedicine Healthcare", W - margin, 16, { align: "right" });
    doc.text("Online Consultation Platform", W - margin, 22, { align: "right" });

    y = 48;

    // ─ Doctor info box ─
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(margin, y, W - margin * 2, 28, 3, 3, "F");
    doc.setDrawColor(187, 247, 208);
    doc.roundedRect(margin, y, W - margin * 2, 28, 3, 3, "S");

    doc.setTextColor(22, 101, 52);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(`Dr. ${rx.doctor?.fullName || "Doctor"}`, margin + 6, y + 10);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(75, 85, 99);
    doc.text(rx.doctor?.specialty || "General Physician", margin + 6, y + 17);
    if (rx.doctor?.qualifications) {
      doc.text(rx.doctor.qualifications, margin + 6, y + 23);
    }

    // Patient info on right of box
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(22, 101, 52);
    doc.text("PATIENT", W - margin - 55, y + 8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(55, 65, 81);
    doc.setFontSize(11);
    doc.text(user?.fullName || "Patient", W - margin - 55, y + 15);
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    const patientMeta = [user?.gender, user?.age ? `${user.age} yrs` : null].filter(Boolean).join(" · ");
    if (patientMeta) doc.text(patientMeta, W - margin - 55, y + 21);

    y += 36;

    // ─ Diagnosis ─
    if (rx.diagnosis) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(55, 65, 81);
      doc.text("DIAGNOSIS", margin, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(31, 41, 55);
      doc.text(rx.diagnosis, margin, y);
      y += 10;
    }

    // ─ Rx symbol ─
    doc.setFont("helvetica", "bolditalic");
    doc.setFontSize(28);
    doc.setTextColor(22, 163, 74);
    doc.text("\u211E", margin, y + 8);
    y += 14;

    // ─ Medication table ─
    // Table header
    doc.setFillColor(240, 253, 244);
    doc.rect(margin, y, W - margin * 2, 9, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(22, 101, 52);
    const cols = [margin + 4, margin + 14, margin + 80, margin + 112, margin + 145];
    doc.text("#", cols[0], y + 6);
    doc.text("MEDICINE", cols[1], y + 6);
    doc.text("DOSAGE", cols[2], y + 6);
    doc.text("FREQUENCY", cols[3], y + 6);
    doc.text("DURATION", cols[4], y + 6);
    y += 12;

    // Table rows
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    rx.medications.forEach((med, idx) => {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }
      // Alternate row bg
      if (idx % 2 === 0) {
        doc.setFillColor(249, 250, 251);
        doc.rect(margin, y - 4, W - margin * 2, 9, "F");
      }
      doc.setTextColor(31, 41, 55);
      doc.text(`${idx + 1}`, cols[0], y + 2);
      doc.setFont("helvetica", "bold");
      doc.text(med.name, cols[1], y + 2);
      doc.setFont("helvetica", "normal");
      doc.text(med.dosage, cols[2], y + 2);
      doc.text(med.frequency, cols[3], y + 2);
      doc.text(med.duration, cols[4], y + 2);
      y += 10;
    });

    y += 6;

    // ─ Instructions ─
    if (rx.instructions) {
      // Divider line
      doc.setDrawColor(229, 231, 235);
      doc.line(margin, y, W - margin, y);
      y += 8;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(55, 65, 81);
      doc.text("ADDITIONAL INSTRUCTIONS", margin, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(75, 85, 99);
      const lines = doc.splitTextToSize(rx.instructions, W - margin * 2);
      doc.text(lines, margin, y);
      y += lines.length * 5 + 6;
    }

    // ─ Footer ─
    const footerY = doc.internal.pageSize.getHeight() - 18;
    doc.setDrawColor(22, 163, 74);
    doc.setLineWidth(0.5);
    doc.line(margin, footerY - 6, W - margin, footerY - 6);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text("This is a computer-generated prescription from TeleMedicine Healthcare.", margin, footerY);
    doc.text(`Generated on ${new Date().toLocaleString()}`, W - margin, footerY, { align: "right" });

    // Save
    const fileName = `Prescription_Dr${(rx.doctor?.fullName || "Doctor").replace(/\s+/g, "_")}_${formatDate(rx.createdAt).replace(/[\s,]+/g, "")}.pdf`;
    doc.save(fileName);
    toast.success("PDF downloaded!");
  };

  // ── DETAIL MODAL ──
  const DetailModal = ({ rx, onClose }) => {
    if (!rx) return null;
    return (
      <div style={styles.modalOverlay} onClick={onClose}>
        <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
          {/* Close button */}
          <button style={styles.modalClose} onClick={onClose}>
            <X size={20} />
          </button>

          {/* Header */}
          <div style={styles.modalHeader}>
            <div style={styles.modalRxBadge}>℞</div>
            <div>
              <h2 style={{ margin: 0, fontSize: 20, color: "#1f2937" }}>Prescription Details</h2>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9ca3af" }}>
                ID: {rx._id?.slice(-8)?.toUpperCase()} · {formatDate(rx.createdAt)}
              </p>
            </div>
          </div>

          {/* Doctor & Patient info */}
          <div style={styles.modalInfoGrid}>
            <div style={styles.modalInfoBox}>
              <span style={styles.modalInfoLabel}>
                <Stethoscope size={14} /> Prescribed By
              </span>
              <span style={styles.modalInfoValue}>Dr. {rx.doctor?.fullName}</span>
              <span style={styles.modalInfoSub}>{rx.doctor?.specialty}</span>
            </div>
            <div style={styles.modalInfoBox}>
              <span style={styles.modalInfoLabel}>
                <User size={14} /> Patient
              </span>
              <span style={styles.modalInfoValue}>{user?.fullName}</span>
              <span style={styles.modalInfoSub}>
                {[user?.gender, user?.age ? `${user.age} yrs` : null].filter(Boolean).join(" · ")}
              </span>
            </div>
          </div>

          {/* Diagnosis */}
          {rx.diagnosis && (
            <div style={styles.modalDiagnosisBox}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5 }}>
                Diagnosis
              </span>
              <p style={{ margin: "4px 0 0", fontSize: 15, fontWeight: 600, color: "#1f2937" }}>{rx.diagnosis}</p>
            </div>
          )}

          {/* Medications */}
          <div style={{ marginBottom: 18 }}>
            <h4 style={{ margin: "0 0 10px", fontSize: 13, color: "#374151", display: "flex", alignItems: "center", gap: 6 }}>
              <Pill size={15} color="#16a34a" /> Medications ({rx.medications.length})
            </h4>
            <div style={styles.modalMedTable}>
              <div style={styles.modalMedHeader}>
                <span style={{ flex: 0.3 }}>#</span>
                <span style={{ flex: 2 }}>Medicine</span>
                <span style={{ flex: 1 }}>Dosage</span>
                <span style={{ flex: 1 }}>Frequency</span>
                <span style={{ flex: 1 }}>Duration</span>
              </div>
              {rx.medications.map((med, idx) => (
                <div
                  key={idx}
                  style={{
                    ...styles.modalMedRow,
                    backgroundColor: idx % 2 === 0 ? "#fff" : "#f9fafb",
                  }}
                >
                  <span style={{ flex: 0.3, color: "#9ca3af", fontWeight: 600 }}>{idx + 1}</span>
                  <span style={{ flex: 2, fontWeight: 600, color: "#1f2937" }}>{med.name}</span>
                  <span style={{ flex: 1, color: "#4b5563" }}>{med.dosage}</span>
                  <span style={{ flex: 1, color: "#4b5563" }}>{med.frequency}</span>
                  <span style={{ flex: 1, color: "#4b5563" }}>{med.duration}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          {rx.instructions && (
            <div style={styles.modalInstructions}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5 }}>
                <NotepadText size={13} style={{ verticalAlign: "middle", marginRight: 4 }} />
                Additional Instructions
              </span>
              <p style={{ margin: "6px 0 0", fontSize: 14, color: "#374151", lineHeight: 1.6 }}>
                {rx.instructions}
              </p>
            </div>
          )}

          {/* Actions */}
          <div style={styles.modalActions}>
            <button style={styles.modalSecondaryBtn} onClick={onClose}>Close</button>
            <button style={styles.modalPrimaryBtn} onClick={() => handleDownloadPdf(rx)}>
              <Download size={16} /> Download PDF
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ── RENDER ──
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <Loader size={36} color="#16a34a" style={{ animation: "spin 1s linear infinite" }} />
        <p style={{ marginTop: 10, color: "#6b7280" }}>Loading prescriptions...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.headerBar}>
        <div style={styles.headerLeft}>
          <div style={styles.headerIcon}>
            <ClipboardList size={24} color="#fff" />
          </div>
          <div>
            <h2 style={styles.pageTitle}>My Prescriptions</h2>
            <p style={styles.pageSubtitle}>{prescriptions.length} prescription{prescriptions.length !== 1 ? "s" : ""} from your doctors</p>
          </div>
        </div>
        <div style={styles.searchBox}>
          <Search size={17} color="#9ca3af" />
          <input
            type="text"
            placeholder="Search by doctor, diagnosis, or medicine..."
            style={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      {filteredPrescriptions.length === 0 ? (
        <div style={styles.emptyState}>
          <FileText size={52} color="#d1d5db" />
          <h3 style={{ color: "#6b7280", margin: "14px 0 4px" }}>
            {prescriptions.length === 0 ? "No Prescriptions Yet" : "No Results Found"}
          </h3>
          <p style={{ color: "#9ca3af", fontSize: 14 }}>
            {prescriptions.length === 0
              ? "When a doctor sends you a prescription after consultation, it will appear here."
              : "Try a different search term."}
          </p>
        </div>
      ) : (
        <div style={styles.list}>
          {filteredPrescriptions.map((rx) => (
            <div key={rx._id} style={styles.rxCard}>
              {/* Top row */}
              <div style={styles.rxTopRow}>
                <div style={styles.rxDoctorInfo}>
                  <div style={styles.doctorAvatar}>
                    {rx.doctor?.fullName?.charAt(0)?.toUpperCase() || "D"}
                  </div>
                  <div>
                    <h4 style={styles.doctorName}>Dr. {rx.doctor?.fullName || "Doctor"}</h4>
                    <p style={styles.doctorSpecialty}>{rx.doctor?.specialty || "General Physician"}</p>
                  </div>
                </div>
                <div style={styles.rxDateBadge}>
                  <Calendar size={13} color="#6b7280" />
                  <span>{formatDate(rx.createdAt)}</span>
                </div>
              </div>

              {/* Diagnosis */}
              {rx.diagnosis && (
                <div style={styles.diagnosisPill}>
                  <Stethoscope size={14} color="#16a34a" />
                  <span>{rx.diagnosis}</span>
                </div>
              )}

              {/* Medications */}
              <div style={styles.medSection}>
                <p style={styles.medSectionTitle}>
                  <Pill size={14} color="#3b82f6" /> {rx.medications.length} Medication{rx.medications.length > 1 ? "s" : ""}
                </p>
                <div style={styles.medPillContainer}>
                  {rx.medications.map((med, idx) => (
                    <span key={idx} style={styles.medPill}>
                      {med.name} <span style={{ color: "#9ca3af", fontWeight: 400 }}>· {med.dosage}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Instructions preview */}
              {rx.instructions && (
                <p style={styles.instructionsPreview}>
                  <NotepadText size={13} color="#9ca3af" style={{ flexShrink: 0, marginTop: 2 }} />
                  {rx.instructions.length > 100 ? rx.instructions.slice(0, 100) + "..." : rx.instructions}
                </p>
              )}

              {/* Actions */}
              <div style={styles.actionRow}>
                <button style={styles.viewBtn} onClick={() => setSelectedRx(rx)}>
                  <Eye size={15} /> View Details
                  <ChevronRight size={15} />
                </button>
                <button style={styles.downloadBtn} onClick={() => handleDownloadPdf(rx)}>
                  <Download size={15} /> Download PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedRx && <DetailModal rx={selectedRx} onClose={() => setSelectedRx(null)} />}
    </div>
  );
};

// ─── STYLES ─────────────────────────────────────────────
const styles = {
  container: { padding: 4 },
  loadingContainer: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400 },

  // Header
  headerBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
    padding: "18px 22px",
    backgroundColor: "#fff",
    borderRadius: 14,
    border: "1px solid #e5e7eb",
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    flexWrap: "wrap",
    gap: 14,
  },
  headerLeft: { display: "flex", alignItems: "center", gap: 14 },
  headerIcon: {
    width: 46,
    height: 46,
    borderRadius: 12,
    background: "linear-gradient(135deg, #16a34a, #22c55e)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  pageTitle: { margin: 0, fontSize: 19, fontWeight: 800, color: "#1f2937" },
  pageSubtitle: { margin: "2px 0 0", fontSize: 13, color: "#9ca3af" },
  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 16px",
    backgroundColor: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    width: 320,
    maxWidth: "100%",
  },
  searchInput: {
    border: "none",
    backgroundColor: "transparent",
    outline: "none",
    width: "100%",
    fontSize: 13,
    fontFamily: "inherit",
    color: "#374151",
  },

  // List
  list: { display: "flex", flexDirection: "column", gap: 16 },

  // Card
  rxCard: {
    padding: "22px 24px",
    backgroundColor: "#fff",
    borderRadius: 14,
    border: "1px solid #e5e7eb",
    boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
    transition: "box-shadow 0.2s",
  },
  rxTopRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  rxDoctorInfo: { display: "flex", alignItems: "center", gap: 12 },
  doctorAvatar: {
    width: 42,
    height: 42,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #16a34a, #22c55e)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 16,
    flexShrink: 0,
  },
  doctorName: { margin: 0, fontSize: 15, fontWeight: 700, color: "#1f2937" },
  doctorSpecialty: { margin: "2px 0 0", fontSize: 12, color: "#9ca3af" },
  rxDateBadge: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    color: "#6b7280",
    backgroundColor: "#f9fafb",
    padding: "5px 12px",
    borderRadius: 8,
    border: "1px solid #f3f4f6",
  },
  diagnosisPill: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 14px",
    borderRadius: 8,
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    fontSize: 13,
    fontWeight: 600,
    color: "#166534",
    marginBottom: 14,
  },
  medSection: { marginBottom: 12 },
  medSectionTitle: {
    margin: "0 0 8px",
    fontSize: 12,
    fontWeight: 700,
    color: "#6b7280",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  medPillContainer: { display: "flex", flexWrap: "wrap", gap: 8 },
  medPill: {
    padding: "5px 12px",
    borderRadius: 8,
    backgroundColor: "#eff6ff",
    border: "1px solid #bfdbfe",
    fontSize: 12,
    fontWeight: 600,
    color: "#1e40af",
  },
  instructionsPreview: {
    display: "flex",
    alignItems: "flex-start",
    gap: 6,
    margin: "0 0 12px",
    fontSize: 13,
    color: "#6b7280",
    lineHeight: 1.5,
    padding: "8px 12px",
    backgroundColor: "#fefce8",
    borderRadius: 8,
    border: "1px solid #fde68a",
  },
  actionRow: {
    display: "flex",
    gap: 10,
    borderTop: "1px solid #f3f4f6",
    paddingTop: 14,
  },
  viewBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "9px 18px",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    backgroundColor: "#fff",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
    transition: "all 0.2s",
  },
  downloadBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "9px 18px",
    border: "none",
    borderRadius: 10,
    background: "linear-gradient(135deg, #16a34a, #22c55e)",
    color: "#fff",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
    boxShadow: "0 2px 6px rgba(22,163,74,0.2)",
    transition: "all 0.2s",
  },

  // Empty state
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
    backgroundColor: "#fff",
    borderRadius: 14,
    border: "1px solid #e5e7eb",
    textAlign: "center",
  },

  // ── Modal ──
  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: 20,
  },
  modalCard: {
    position: "relative",
    backgroundColor: "#fff",
    borderRadius: 18,
    width: "100%",
    maxWidth: 640,
    maxHeight: "90vh",
    overflowY: "auto",
    padding: "28px 32px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
  },
  modalClose: {
    position: "absolute",
    top: 16,
    right: 16,
    background: "#f3f4f6",
    border: "none",
    borderRadius: "50%",
    width: 36,
    height: 36,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#6b7280",
    transition: "background 0.2s",
  },
  modalHeader: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 22,
  },
  modalRxBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    background: "linear-gradient(135deg, #16a34a, #22c55e)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
    fontWeight: 700,
    fontFamily: "serif",
    fontStyle: "italic",
  },
  modalInfoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginBottom: 18,
  },
  modalInfoBox: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
    padding: "12px 16px",
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    border: "1px solid #f3f4f6",
  },
  modalInfoLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  modalInfoValue: { fontSize: 15, fontWeight: 700, color: "#1f2937" },
  modalInfoSub: { fontSize: 12, color: "#6b7280" },
  modalDiagnosisBox: {
    padding: "12px 16px",
    backgroundColor: "#f0fdf4",
    borderRadius: 10,
    border: "1px solid #bbf7d0",
    marginBottom: 18,
  },
  modalMedTable: {
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    overflow: "hidden",
  },
  modalMedHeader: {
    display: "flex",
    gap: 8,
    padding: "10px 14px",
    backgroundColor: "#f0fdf4",
    fontSize: 11,
    fontWeight: 700,
    color: "#166534",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  modalMedRow: {
    display: "flex",
    gap: 8,
    padding: "10px 14px",
    fontSize: 13,
    borderTop: "1px solid #f3f4f6",
  },
  modalInstructions: {
    padding: "14px 16px",
    backgroundColor: "#fefce8",
    borderRadius: 10,
    border: "1px solid #fde68a",
    marginBottom: 18,
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 6,
    paddingTop: 16,
    borderTop: "1px solid #f3f4f6",
  },
  modalSecondaryBtn: {
    padding: "10px 22px",
    borderRadius: 10,
    border: "1px solid #d1d5db",
    backgroundColor: "#fff",
    color: "#6b7280",
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
  },
  modalPrimaryBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "10px 22px",
    borderRadius: 10,
    border: "none",
    background: "linear-gradient(135deg, #16a34a, #22c55e)",
    color: "#fff",
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
    boxShadow: "0 2px 6px rgba(22,163,74,0.2)",
  },
};

export default PrescriptionAccess;