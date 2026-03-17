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
import "./PerscriptionAccess.css";

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
      <div className="pa-modal-overlay" onClick={onClose}>
        <div className="pa-modal-card" onClick={(e) => e.stopPropagation()}>
          {/* Close button */}
          <button className="pa-modal-close" onClick={onClose}>
            <X size={20} />
          </button>

          {/* Header */}
          <div className="pa-modal-header">
            <div className="pa-modal-rx-badge">℞</div>
            <div>
              <h2>Prescription Details</h2>
              <p>
                ID: {rx._id?.slice(-8)?.toUpperCase()} · {formatDate(rx.createdAt)}
              </p>
            </div>
          </div>

          {/* Doctor & Patient info */}
          <div className="pa-modal-info-grid">
            <div className="pa-modal-info-box">
              <span className="pa-modal-info-label">
                <Stethoscope size={14} /> Prescribed By
              </span>
              <span className="pa-modal-info-value">Dr. {rx.doctor?.fullName}</span>
              <span className="pa-modal-info-sub">{rx.doctor?.specialty}</span>
            </div>
            <div className="pa-modal-info-box">
              <span className="pa-modal-info-label">
                <User size={14} /> Patient
              </span>
              <span className="pa-modal-info-value">{user?.fullName}</span>
              <span className="pa-modal-info-sub">
                {[user?.gender, user?.age ? `${user.age} yrs` : null].filter(Boolean).join(" · ")}
              </span>
            </div>
          </div>

          {/* Diagnosis */}
          {rx.diagnosis && (
            <div className="pa-modal-diagnosis-box">
              <span>
                Diagnosis
              </span>
              <p>{rx.diagnosis}</p>
            </div>
          )}

          {/* Medications */}
          <div>
            <h4 style={{ margin: "0 0 10px", fontSize: 13, color: "#374151", display: "flex", alignItems: "center", gap: 6 }}>
              <Pill size={15} color="#16a34a" /> Medications ({rx.medications.length})
            </h4>
            <div className="pa-modal-med-table">
              <div className="pa-modal-med-header">
                <span style={{ flex: 0.3 }}>#</span>
                <span style={{ flex: 2 }}>Medicine</span>
                <span style={{ flex: 1 }}>Dosage</span>
                <span style={{ flex: 1 }}>Frequency</span>
                <span style={{ flex: 1 }}>Duration</span>
              </div>
              {rx.medications.map((med, idx) => (
                <div
                  key={idx}
                  className="pa-modal-med-row"
                  style={{
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
            <div className="pa-modal-instructions">
              <span>
                <NotepadText size={13} style={{ verticalAlign: "middle", marginRight: 4 }} />
                Additional Instructions
              </span>
              <p>
                {rx.instructions}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="pa-modal-actions">
            <button className="pa-modal-secondary-btn" onClick={onClose}>Close</button>
            <button className="pa-modal-primary-btn" onClick={() => handleDownloadPdf(rx)}>
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
      <div className="pa-loading-container">
        <Loader size={36} color="#16a34a" style={{ animation: "spin 1s linear infinite" }} />
        <p>Loading prescriptions...</p>
      </div>
    );
  }

  return (
    <div className="pa-container">
      {/* Header */}
      <div className="pa-header-bar">
        <div className="pa-header-left">
          <div className="pa-header-icon">
            <ClipboardList size={24} color="#fff" />
          </div>
          <div>
            <h2 className="pa-page-title">My Prescriptions</h2>
            <p className="pa-page-subtitle">{prescriptions.length} prescription{prescriptions.length !== 1 ? "s" : ""} from your doctors</p>
          </div>
        </div>
        <div className="pa-search-box">
          <Search size={17} color="#9ca3af" />
          <input
            type="text"
            placeholder="Search by doctor, diagnosis, or medicine..."
            className="pa-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      {filteredPrescriptions.length === 0 ? (
        <div className="pa-empty-state">
          <FileText size={52} color="#d1d5db" />
          <h3>
            {prescriptions.length === 0 ? "No Prescriptions Yet" : "No Results Found"}
          </h3>
          <p>
            {prescriptions.length === 0
              ? "When a doctor sends you a prescription after consultation, it will appear here."
              : "Try a different search term."}
          </p>
        </div>
      ) : (
        <div className="pa-list">
          {filteredPrescriptions.map((rx) => (
            <div key={rx._id} className="pa-rx-card">
              {/* Top row */}
              <div className="pa-rx-top-row">
                <div className="pa-rx-doctor-info">
                  <div className="pa-doctor-avatar">
                    {rx.doctor?.fullName?.charAt(0)?.toUpperCase() || "D"}
                  </div>
                  <div>
                    <h4 className="pa-doctor-name">Dr. {rx.doctor?.fullName || "Doctor"}</h4>
                    <p className="pa-doctor-specialty">{rx.doctor?.specialty || "General Physician"}</p>
                  </div>
                </div>
                <div className="pa-rx-date-badge">
                  <Calendar size={13} color="#6b7280" />
                  <span>{formatDate(rx.createdAt)}</span>
                </div>
              </div>

              {/* Diagnosis */}
              {rx.diagnosis && (
                <div className="pa-diagnosis-pill">
                  <Stethoscope size={14} color="#16a34a" />
                  <span>{rx.diagnosis}</span>
                </div>
              )}

              {/* Medications */}
              <div className="pa-med-section">
                <p className="pa-med-section-title">
                  <Pill size={14} color="#3b82f6" /> {rx.medications.length} Medication{rx.medications.length > 1 ? "s" : ""}
                </p>
                <div className="pa-med-pill-container">
                  {rx.medications.map((med, idx) => (
                    <span key={idx} className="pa-med-pill">
                      {med.name} <span style={{ color: "#9ca3af", fontWeight: 400 }}>· {med.dosage}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Instructions preview */}
              {rx.instructions && (
                <p className="pa-instructions-preview">
                  <NotepadText size={13} color="#9ca3af" style={{ flexShrink: 0, marginTop: 2 }} />
                  {rx.instructions.length > 100 ? rx.instructions.slice(0, 100) + "..." : rx.instructions}
                </p>
              )}

              {/* Actions */}
              <div className="pa-action-row">
                <button className="pa-view-btn" onClick={() => setSelectedRx(rx)}>
                  <Eye size={15} /> View Details
                  <ChevronRight size={15} />
                </button>
                <button className="pa-download-btn" onClick={() => handleDownloadPdf(rx)}>
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

export default PrescriptionAccess;