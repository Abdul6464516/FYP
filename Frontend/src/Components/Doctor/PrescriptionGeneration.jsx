import React, { useState, useEffect } from "react";
import {
  Plus, Trash2, Printer, Send, FileText, ChevronDown,
  Pill, Clock, CalendarDays, Stethoscope, User, AlertCircle,
  CheckCircle, Loader, ClipboardList, NotepadText
} from "lucide-react";
import { toast } from "react-toastify";
import { useUser } from "../../context/UserContext";
import { getCompletedPatients, createPrescription, getDoctorPrescriptions } from "../../services/doctorAction";

const PrescriptionGeneration = () => {
  const { user } = useUser();

  // Patient dropdown
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingPatients, setLoadingPatients] = useState(true);

  // Prescription form
  const [diagnosis, setDiagnosis] = useState("");
  const [medications, setMedications] = useState([
    { id: 1, name: "", dosage: "", frequency: "", duration: "" },
  ]);
  const [instructions, setInstructions] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Previous prescriptions
  const [pastPrescriptions, setPastPrescriptions] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load completed patients
  useEffect(() => {
    const loadPatients = async () => {
      try {
        const data = await getCompletedPatients();
        if (data.patients) setPatients(data.patients);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load patients");
      } finally {
        setLoadingPatients(false);
      }
    };
    loadPatients();
  }, []);

  // Load prescription history
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await getDoctorPrescriptions();
        if (data.prescriptions) setPastPrescriptions(data.prescriptions);
      } catch (_) {}
    };
    loadHistory();
  }, []);

  const filteredPatients = patients.filter((p) =>
    p.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addMedication = () => {
    setMedications([
      ...medications,
      { id: Date.now(), name: "", dosage: "", frequency: "", duration: "" },
    ]);
  };

  const removeMedication = (id) => {
    if (medications.length > 1) {
      setMedications(medications.filter((m) => m.id !== id));
    }
  };

  const handleChange = (id, field, value) => {
    setMedications(medications.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  const resetForm = () => {
    setMedications([{ id: 1, name: "", dosage: "", frequency: "", duration: "" }]);
    setInstructions("");
    setDiagnosis("");
    setSelectedPatient(null);
    setSearchQuery("");
  };

  const handleSubmit = async () => {
    if (!selectedPatient) {
      toast.error("Please select a patient");
      return;
    }

    const validMeds = medications.filter((m) => m.name.trim());
    if (validMeds.length === 0) {
      toast.error("Please add at least one medication");
      return;
    }

    // Check all fields filled
    for (const med of validMeds) {
      if (!med.dosage.trim() || !med.frequency.trim() || !med.duration.trim()) {
        toast.error(`Please fill all fields for "${med.name}"`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload = {
        patient: selectedPatient._id,
        appointment: selectedPatient.lastAppointmentId,
        medications: validMeds.map(({ name, dosage, frequency, duration }) => ({
          name, dosage, frequency, duration,
        })),
        instructions,
        diagnosis,
      };

      await createPrescription(payload);
      toast.success("Prescription sent to patient successfully!");

      // Refresh history
      const data = await getDoctorPrescriptions();
      if (data.prescriptions) setPastPrescriptions(data.prescriptions);

      resetForm();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const doctorName = user?.fullName || "Doctor";
  const doctorSpecialty = user?.specialty || "General Physician";

  return (
    <div style={styles.pageWrapper}>
      {/* ── TOP HEADER ── */}
      <div style={styles.headerBar}>
        <div style={styles.headerLeft}>
          <div style={styles.headerIconCircle}>
            <FileText size={24} color="#fff" />
          </div>
          <div>
            <h1 style={styles.pageTitle}>Prescription Generator</h1>
            <p style={styles.pageSubtitle}>Create and send prescriptions to your patients</p>
          </div>
        </div>
        <button
          style={styles.historyToggle}
          onClick={() => setShowHistory(!showHistory)}
        >
          <ClipboardList size={18} />
          {showHistory ? "Write Prescription" : `History (${pastPrescriptions.length})`}
        </button>
      </div>

      {/* ── PRESCRIPTION HISTORY VIEW ── */}
      {showHistory ? (
        <div style={styles.historySection}>
          {pastPrescriptions.length === 0 ? (
            <div style={styles.emptyHistory}>
              <NotepadText size={48} color="#d1d5db" />
              <p style={{ color: "#9ca3af", marginTop: 12 }}>No prescriptions yet</p>
            </div>
          ) : (
            pastPrescriptions.map((rx) => (
              <div key={rx._id} style={styles.historyCard}>
                <div style={styles.historyCardHeader}>
                  <div style={styles.historyPatientInfo}>
                    <div style={styles.historyAvatar}>
                      {rx.patient?.fullName?.charAt(0)?.toUpperCase() || "P"}
                    </div>
                    <div>
                      <span style={styles.historyPatientName}>{rx.patient?.fullName}</span>
                      <span style={styles.historyDate}>
                        {new Date(rx.createdAt).toLocaleDateString("en-US", {
                          year: "numeric", month: "short", day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <span style={{
                    ...styles.historyBadge,
                    backgroundColor: rx.status === "sent" ? "#ecfdf5" : rx.status === "viewed" ? "#eff6ff" : "#f9fafb",
                    color: rx.status === "sent" ? "#10b981" : rx.status === "viewed" ? "#3b82f6" : "#6b7280",
                  }}>
                    {rx.status === "sent" ? <Send size={12} /> : <CheckCircle size={12} />}
                    {rx.status.charAt(0).toUpperCase() + rx.status.slice(1)}
                  </span>
                </div>
                {rx.diagnosis && (
                  <p style={styles.historyDiagnosis}><strong>Diagnosis:</strong> {rx.diagnosis}</p>
                )}
                <div style={styles.historyMedsList}>
                  {rx.medications.map((m, i) => (
                    <span key={i} style={styles.historyMedPill}>
                      <Pill size={12} /> {m.name} — {m.dosage}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* ── PRESCRIPTION FORM ── */
        <div style={styles.prescCard}>
          {/* ─ Letterhead ─ */}
          <div style={styles.letterhead}>
            <div>
              <h2 style={styles.drName}>Dr. {doctorName}</h2>
              <p style={styles.drSub}>{doctorSpecialty}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={styles.drSub}>
                <CalendarDays size={13} style={{ verticalAlign: "middle", marginRight: 4 }} />
                {new Date().toLocaleDateString("en-US", {
                  weekday: "short", year: "numeric", month: "short", day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* ─ Patient selector ─ */}
          <div style={styles.section}>
            <label style={styles.label}>
              <User size={15} style={{ verticalAlign: "middle", marginRight: 6 }} />
              Select Patient
            </label>
            <div style={styles.dropdownWrapper}>
              <div
                style={{
                  ...styles.dropdownTrigger,
                  borderColor: dropdownOpen ? "#16a34a" : "#d1d5db",
                  boxShadow: dropdownOpen ? "0 0 0 3px rgba(22,163,74,0.1)" : "none",
                }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {selectedPatient ? (
                  <div style={styles.selectedPatientDisplay}>
                    <div style={styles.patientAvatarSmall}>
                      {selectedPatient.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span style={{ fontWeight: 600, color: "#1f2937", fontSize: 14 }}>
                        {selectedPatient.fullName}
                      </span>
                      <span style={{ fontSize: 12, color: "#6b7280", marginLeft: 8 }}>
                        {selectedPatient.gender}{selectedPatient.age ? `, ${selectedPatient.age} yrs` : ""}
                      </span>
                    </div>
                  </div>
                ) : (
                  <span style={{ color: "#9ca3af", fontSize: 14 }}>
                    {loadingPatients ? "Loading patients..." : "Choose a patient with completed consultation"}
                  </span>
                )}
                <ChevronDown
                  size={18}
                  color="#6b7280"
                  style={{
                    transition: "transform 0.2s",
                    transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </div>

              {dropdownOpen && (
                <div style={styles.dropdownMenu}>
                  <input
                    type="text"
                    placeholder="Search patient by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={styles.dropdownSearch}
                    autoFocus
                  />
                  <div style={styles.dropdownList}>
                    {loadingPatients ? (
                      <div style={styles.dropdownEmpty}>
                        <Loader size={20} color="#16a34a" style={{ animation: "spin 1s linear infinite" }} />
                        <span>Loading...</span>
                      </div>
                    ) : filteredPatients.length === 0 ? (
                      <div style={styles.dropdownEmpty}>
                        <AlertCircle size={18} color="#9ca3af" />
                        <span>No patients found</span>
                      </div>
                    ) : (
                      filteredPatients.map((p) => (
                        <div
                          key={p._id}
                          style={{
                            ...styles.dropdownItem,
                            backgroundColor: selectedPatient?._id === p._id ? "#f0fdf4" : "transparent",
                          }}
                          onClick={() => {
                            setSelectedPatient(p);
                            setDropdownOpen(false);
                            setSearchQuery("");
                          }}
                        >
                          <div style={styles.patientAvatar}>
                            {p.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, fontSize: 14, color: "#1f2937" }}>
                              {p.fullName}
                            </div>
                            <div style={{ fontSize: 12, color: "#9ca3af" }}>
                              {p.gender}{p.age ? ` · ${p.age} yrs` : ""}{p.city ? ` · ${p.city}` : ""}
                              {p.lastAppointmentDate ? ` · Last visit: ${p.lastAppointmentDate}` : ""}
                            </div>
                          </div>
                          {selectedPatient?._id === p._id && (
                            <CheckCircle size={16} color="#16a34a" />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ─ Diagnosis ─ */}
          <div style={styles.section}>
            <label style={styles.label}>
              <Stethoscope size={15} style={{ verticalAlign: "middle", marginRight: 6 }} />
              Diagnosis
            </label>
            <input
              type="text"
              placeholder="e.g. Upper Respiratory Tract Infection"
              style={styles.diagnosisInput}
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
            />
          </div>

          {/* ─ Rx Symbol ─ */}
          <div style={styles.rxSymbol}>℞</div>

          {/* ─ Medication Table ─ */}
          <div style={styles.tableWrapper}>
            <div style={styles.tableHeader}>
              <span style={{ flex: 3 }}>
                <Pill size={14} style={{ verticalAlign: "middle", marginRight: 4 }} />
                Medicine Name
              </span>
              <span style={{ flex: 1.5 }}>Dosage</span>
              <span style={{ flex: 1.5 }}>Frequency</span>
              <span style={{ flex: 1.5 }}>Duration</span>
              <span style={{ width: "44px" }}></span>
            </div>

            {medications.map((med, idx) => (
              <div key={med.id} style={styles.medRow}>
                <div style={styles.medIndex}>{idx + 1}</div>
                <input
                  placeholder="e.g. Paracetamol"
                  style={{ ...styles.input, flex: 3 }}
                  value={med.name}
                  onChange={(e) => handleChange(med.id, "name", e.target.value)}
                />
                <input
                  placeholder="500mg"
                  style={{ ...styles.input, flex: 1.5 }}
                  value={med.dosage}
                  onChange={(e) => handleChange(med.id, "dosage", e.target.value)}
                />
                <input
                  placeholder="1-0-1"
                  style={{ ...styles.input, flex: 1.5 }}
                  value={med.frequency}
                  onChange={(e) => handleChange(med.id, "frequency", e.target.value)}
                />
                <input
                  placeholder="5 Days"
                  style={{ ...styles.input, flex: 1.5 }}
                  value={med.duration}
                  onChange={(e) => handleChange(med.id, "duration", e.target.value)}
                />
                <button
                  onClick={() => removeMedication(med.id)}
                  style={{
                    ...styles.deleteBtn,
                    opacity: medications.length === 1 ? 0.3 : 1,
                    cursor: medications.length === 1 ? "not-allowed" : "pointer",
                  }}
                  title="Remove"
                  disabled={medications.length === 1}
                >
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
          </div>

          <button onClick={addMedication} style={styles.addBtn}>
            <Plus size={16} /> Add Medicine
          </button>

          {/* ─ Additional Advice ─ */}
          <div style={styles.section}>
            <label style={styles.label}>
              <NotepadText size={15} style={{ verticalAlign: "middle", marginRight: 6 }} />
              Additional Advice / Instructions
            </label>
            <textarea
              style={styles.textArea}
              placeholder="e.g. Drink plenty of fluids, avoid cold food, review in 7 days..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </div>

          {/* ─ Footer Actions ─ */}
          <div style={styles.footerActions}>
            <button style={styles.secondaryBtn} onClick={resetForm}>
              Clear All
            </button>
            <button
              style={{
                ...styles.primaryBtn,
                opacity: submitting ? 0.7 : 1,
                cursor: submitting ? "not-allowed" : "pointer",
              }}
              disabled={submitting}
              onClick={handleSubmit}
            >
              {submitting ? (
                <>
                  <Loader size={18} style={{ animation: "spin 1s linear infinite" }} />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={18} /> Send to Patient
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── STYLES ─────────────────────────────────────────────
const styles = {
  pageWrapper: {
    width: "100%",
    maxWidth: 900,
    margin: "0 auto",
  },

  // Header bar
  headerBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    padding: "20px 24px",
    backgroundColor: "#fff",
    borderRadius: 14,
    border: "1px solid #e5e7eb",
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
  },
  headerLeft: { display: "flex", alignItems: "center", gap: 14 },
  headerIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 12,
    background: "linear-gradient(135deg, #16a34a, #22c55e)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  pageTitle: { margin: 0, fontSize: 20, fontWeight: 800, color: "#1f2937" },
  pageSubtitle: { margin: "2px 0 0", fontSize: 13, color: "#9ca3af" },
  historyToggle: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 18px",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    backgroundColor: "#f9fafb",
    color: "#374151",
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
    transition: "all 0.2s",
  },

  // Prescription card
  prescCard: {
    backgroundColor: "#fff",
    width: "100%",
    padding: "36px 40px",
    borderRadius: 14,
    border: "1px solid #e5e7eb",
    boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
  },

  // Letterhead
  letterhead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottom: "2px solid #16a34a",
    paddingBottom: 18,
    marginBottom: 28,
  },
  drName: { margin: 0, color: "#16a34a", fontSize: 22, fontWeight: 800 },
  drSub: { margin: "3px 0", fontSize: 13, color: "#6b7280" },

  // Sections
  section: { marginBottom: 22 },
  label: {
    display: "block",
    marginBottom: 8,
    fontWeight: 700,
    color: "#374151",
    fontSize: 13,
  },

  // Patient dropdown
  dropdownWrapper: { position: "relative" },
  dropdownTrigger: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    border: "1px solid #d1d5db",
    borderRadius: 10,
    cursor: "pointer",
    backgroundColor: "#fff",
    transition: "all 0.2s",
    minHeight: 48,
  },
  selectedPatientDisplay: { display: "flex", alignItems: "center", gap: 10 },
  patientAvatarSmall: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #16a34a, #22c55e)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 14,
    flexShrink: 0,
  },
  dropdownMenu: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    marginTop: 4,
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
    zIndex: 50,
    overflow: "hidden",
  },
  dropdownSearch: {
    width: "100%",
    padding: "12px 16px",
    border: "none",
    borderBottom: "1px solid #f3f4f6",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  dropdownList: { maxHeight: 220, overflowY: "auto" },
  dropdownItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 16px",
    cursor: "pointer",
    transition: "background 0.15s",
    borderBottom: "1px solid #f9fafb",
  },
  dropdownEmpty: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "24px 16px",
    color: "#9ca3af",
    fontSize: 14,
  },
  patientAvatar: {
    width: 38,
    height: 38,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #16a34a, #22c55e)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 15,
    flexShrink: 0,
  },

  // Diagnosis input
  diagnosisInput: {
    width: "100%",
    padding: "12px 16px",
    border: "1px solid #d1d5db",
    borderRadius: 10,
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    transition: "border-color 0.2s",
  },

  // Rx symbol
  rxSymbol: {
    fontSize: 38,
    fontWeight: "bold",
    color: "#16a34a",
    fontFamily: "serif",
    marginBottom: 16,
    fontStyle: "italic",
  },

  // Medication table
  tableWrapper: { width: "100%", overflowX: "auto" },
  tableHeader: {
    display: "flex",
    gap: 10,
    padding: "12px 14px",
    paddingLeft: 44,
    backgroundColor: "#f0fdf4",
    fontWeight: 700,
    fontSize: 12,
    color: "#166534",
    borderRadius: 10,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  medRow: {
    display: "flex",
    gap: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  medIndex: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    backgroundColor: "#f3f4f6",
    color: "#6b7280",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 700,
    flexShrink: 0,
  },
  input: {
    padding: "11px 14px",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    backgroundColor: "#fff",
    fontFamily: "inherit",
  },
  deleteBtn: {
    background: "none",
    border: "none",
    color: "#ef4444",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    padding: 6,
    borderRadius: 8,
    transition: "background 0.2s",
  },
  addBtn: {
    marginTop: 8,
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "none",
    border: "1px dashed #16a34a",
    color: "#16a34a",
    padding: "10px 20px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 13,
    transition: "all 0.2s",
  },

  // Text area
  textArea: {
    width: "100%",
    height: 110,
    padding: "14px 16px",
    border: "1px solid #d1d5db",
    borderRadius: 10,
    fontSize: 14,
    resize: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    outline: "none",
    transition: "border-color 0.2s",
  },

  // Footer actions
  footerActions: {
    marginTop: 32,
    display: "flex",
    justifyContent: "flex-end",
    gap: 14,
  },
  primaryBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 28px",
    borderRadius: 10,
    border: "none",
    background: "linear-gradient(135deg, #16a34a, #22c55e)",
    color: "#fff",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "0 2px 8px rgba(22,163,74,0.25)",
  },
  secondaryBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 24px",
    borderRadius: 10,
    border: "1px solid #d1d5db",
    backgroundColor: "#fff",
    color: "#6b7280",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    transition: "all 0.2s",
  },

  // History section
  historySection: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  emptyHistory: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
    backgroundColor: "#fff",
    borderRadius: 14,
    border: "1px solid #e5e7eb",
  },
  historyCard: {
    padding: "18px 22px",
    backgroundColor: "#fff",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
  },
  historyCardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  historyPatientInfo: { display: "flex", alignItems: "center", gap: 10 },
  historyAvatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #16a34a, #22c55e)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 14,
  },
  historyPatientName: { display: "block", fontWeight: 600, color: "#1f2937", fontSize: 14 },
  historyDate: { display: "block", fontSize: 12, color: "#9ca3af" },
  historyBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    fontSize: 11,
    fontWeight: 600,
    padding: "4px 10px",
    borderRadius: 20,
  },
  historyDiagnosis: { fontSize: 13, color: "#4b5563", marginBottom: 8 },
  historyMedsList: { display: "flex", flexWrap: "wrap", gap: 6 },
  historyMedPill: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    fontSize: 12,
    fontWeight: 500,
    padding: "4px 10px",
    borderRadius: 8,
    backgroundColor: "#f0fdf4",
    color: "#166534",
    border: "1px solid #bbf7d0",
  },
};

export default PrescriptionGeneration;