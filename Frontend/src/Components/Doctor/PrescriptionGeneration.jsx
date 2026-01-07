import React, { useState } from "react";
import { Plus, Trash2, Printer, Send, FileText } from "lucide-react";

const PrescriptionGeneration = () => {
  const [medications, setMedications] = useState([
    { id: 1, name: "", dosage: "", frequency: "", duration: "" }
  ]);
  const [instructions, setInstructions] = useState("");

  const addMedication = () => {
    setMedications([
      ...medications, 
      { id: Date.now(), name: "", dosage: "", frequency: "", duration: "" }
    ]);
  };

  const removeMedication = (id) => {
    if (medications.length > 1) {
      setMedications(medications.filter(m => m.id !== id));
    }
  };

  const handleChange = (id, field, value) => {
    setMedications(medications.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  return (
    <div style={styles.container}>
      <div style={styles.prescCard}>
        {/* MEDICAL LETTERHEAD */}
        <div style={styles.letterhead}>
          <div style={{ textAlign: "left" }}>
            <h2 style={styles.drName}>Dr. Raz</h2>
            <p style={styles.drSub}>Internal Medicine Specialist</p>
            <p style={styles.drSub}>License No: MED-10293847</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={styles.drSub}><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
            <p style={styles.drSub}><strong>Patient:</strong> John Doe</p>
          </div>
        </div>

        {/* Rx SYMBOL */}
        <div style={styles.rxSymbol}>Rx</div>

        {/* MEDICATION TABLE - Managed for Alignment */}
        <div style={styles.tableWrapper}>
          <div style={styles.tableHeader}>
            <span style={{ flex: 3 }}>Medicine Name</span>
            <span style={{ flex: 1.5 }}>Dosage</span>
            <span style={{ flex: 1.5 }}>Frequency</span>
            <span style={{ flex: 1.5 }}>Duration</span>
            <span style={{ width: "40px" }}></span>
          </div>

          {medications.map((med) => (
            <div key={med.id} style={styles.medRow}>
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
                style={styles.deleteBtn}
                title="Remove Medication"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <button onClick={addMedication} style={styles.addBtn}>
          <Plus size={16} /> Add Medicine
        </button>

        {/* ADDITIONAL ADVICE SECTION */}
        <div style={styles.adviceSection}>
          <label style={styles.label}>Additional Advice / Instructions</label>
          <textarea 
            style={styles.textArea} 
            placeholder="e.g. Drink plenty of fluids, avoid cold food, review in 7 days..."
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </div>

        {/* FOOTER ACTIONS */}
        <div style={styles.footerActions}>
          <button style={styles.secondaryBtn}>
            <Printer size={18} /> Print
          </button>
          <button style={styles.primaryBtn}>
            <Send size={18} /> Send to Patient
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { display: "flex", justifyContent: "center", width: "100%" },
  prescCard: { 
    backgroundColor: "#fff", 
    width: "100%", 
    maxWidth: "850px", 
    padding: "40px", 
    borderRadius: "12px", 
    border: "1px solid #e5e7eb",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
  },
  letterhead: { 
    display: "flex", 
    justifyContent: "space-between", 
    borderBottom: "2px solid #16a34a", 
    paddingBottom: "20px", 
    marginBottom: "30px" 
  },
  drName: { margin: 0, color: "#16a34a", fontSize: "24px", fontWeight: "700" },
  drSub: { margin: "2px 0", fontSize: "13px", color: "#6b7280" },
  rxSymbol: { 
    fontSize: "40px", 
    fontWeight: "bold", 
    color: "#16a34a", 
    fontFamily: "serif", 
    marginBottom: "20px",
    fontStyle: "italic"
  },
  tableWrapper: { width: "100%", overflowX: "auto" },
  tableHeader: { 
    display: "flex", 
    gap: "10px", 
    padding: "12px", 
    backgroundColor: "#f9fafb", 
    fontWeight: "700", 
    fontSize: "13px", 
    color: "#374151", 
    borderRadius: "8px", 
    marginBottom: "10px",
    textAlign: "left"
  },
  medRow: { 
    display: "flex", 
    gap: "10px", 
    marginBottom: "12px", 
    alignItems: "center" 
  },
  input: { 
    padding: "12px", 
    border: "1px solid #d1d5db", 
    borderRadius: "8px", 
    fontSize: "14px", 
    outline: "none", 
    transition: "0.2s focus",
    backgroundColor: "#fff"
  },
  deleteBtn: { 
    background: "none", 
    border: "none", 
    color: "#ef4444", 
    cursor: "pointer", 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    width: "40px",
    transition: "color 0.2s"
  },
  addBtn: { 
    marginTop: "10px", 
    display: "flex", 
    alignItems: "center", 
    gap: "8px", 
    background: "none", 
    border: "1px dashed #16a34a", 
    color: "#16a34a", 
    padding: "10px 20px", 
    borderRadius: "8px", 
    cursor: "pointer", 
    fontWeight: "600",
    fontSize: "14px"
  },
  adviceSection: { marginTop: "30px" },
  label: { 
    display: "block", 
    marginBottom: "10px", 
    fontWeight: "700", 
    color: "#374151", 
    fontSize: "14px" 
  },
  textArea: { 
    width: "100%", 
    height: "120px", 
    padding: "15px", 
    border: "1px solid #d1d5db", 
    borderRadius: "8px", 
    fontSize: "14px", 
    resize: "none",
    boxSizing: "border-box",
    fontFamily: "inherit"
  },
  footerActions: { 
    marginTop: "40px", 
    display: "flex", 
    justifyContent: "flex-end", 
    gap: "15px" 
  },
  primaryBtn: { 
    display: "flex", 
    alignItems: "center", 
    gap: "8px", 
    padding: "12px 24px", 
    borderRadius: "8px", 
    border: "none", 
    backgroundColor: "#16a34a", 
    color: "#fff", 
    fontWeight: "600", 
    cursor: "pointer" 
  },
  secondaryBtn: { 
    display: "flex", 
    alignItems: "center", 
    gap: "8px", 
    padding: "12px 24px", 
    borderRadius: "8px", 
    border: "1px solid #d1d5db", 
    backgroundColor: "#fff", 
    color: "#374151",
    fontWeight: "600", 
    cursor: "pointer" 
  }
};

export default PrescriptionGeneration;