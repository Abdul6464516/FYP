import React, { useState } from 'react';
import { FileText, Download, Eye, Calendar, User, Search, Pill } from 'lucide-react';

const PrescriptionAccess = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock Data for Prescriptions
  const prescriptions = [
    { 
      id: "RX-9901", 
      doctor: "Dr. Sarah Smith", 
      date: "Dec 28, 2025", 
      diagnosis: "Acute Bronchitis", 
      medicines: ["Amoxicillin 500mg", "Cough Syrup", "Vitamin C"] 
    },
    { 
      id: "RX-8842", 
      doctor: "Dr. James Wilson", 
      date: "Nov 15, 2025", 
      diagnosis: "Seasonal Allergies", 
      medicines: ["Cetirizine 10mg", "Fluticasone Nasal Spray"] 
    },
    { 
      id: "RX-7721", 
      doctor: "Dr. Maria Garcia", 
      date: "Oct 10, 2025", 
      diagnosis: "Hypertension Follow-up", 
      medicines: ["Lisinopril 10mg"] 
    }
  ];

  const filteredPrescriptions = prescriptions.filter(rx => 
    rx.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rx.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = (id) => {
    // In a real app, this would trigger a PDF generation or fetch a file URL
    alert(`Generating PDF for Prescription ${id}...`);
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h3 style={styles.title}>Prescription History</h3>
        <div style={styles.searchBox}>
          <Search size={18} color="#888" />
          <input 
            type="text" 
            placeholder="Search by doctor or illness..." 
            style={styles.searchInput}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div style={styles.list}>
        {filteredPrescriptions.length > 0 ? (
          filteredPrescriptions.map((rx) => (
            <div key={rx.id} style={styles.rxCard}>
              <div style={styles.rxMainInfo}>
                <div style={styles.iconCircle}>
                  <FileText color="#007bff" />
                </div>
                <div style={styles.textContainer}>
                  <h4 style={styles.diagnosisText}>{rx.diagnosis}</h4>
                  <div style={styles.metaInfo}>
                    <span style={styles.metaItem}><User size={14} /> {rx.doctor}</span>
                    <span style={styles.metaItem}><Calendar size={14} /> {rx.date}</span>
                    <span style={styles.idTag}>{rx.id}</span>
                  </div>
                </div>
              </div>

              <div style={styles.medicationSection}>
                <p style={styles.medTitle}><Pill size={14} /> Prescribed Medications:</p>
                <div style={styles.medTagContainer}>
                  {rx.medicines.map((med, index) => (
                    <span key={index} style={styles.medTag}>{med}</span>
                  ))}
                </div>
              </div>

              <div style={styles.actionRow}>
                <button style={styles.viewBtn}><Eye size={16} /> View Details</button>
                <button onClick={() => handleDownload(rx.id)} style={styles.downloadBtn}>
                  <Download size={16} /> Download PDF
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={styles.emptyState}>No prescriptions found.</div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '5px' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' },
  title: { margin: 0, fontSize: '20px', color: '#2d3748' },
  searchBox: { display: 'flex', alignItems: 'center', backgroundColor: '#edf2f7', padding: '8px 16px', borderRadius: '25px', width: '320px' },
  searchInput: { border: 'none', backgroundColor: 'transparent', marginLeft: '10px', outline: 'none', width: '100%', fontSize: '14px' },
  list: { display: 'flex', flexDirection: 'column', gap: '16px' },
  rxCard: { border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', backgroundColor: '#fff', transition: '0.2s shadow' },
  rxMainInfo: { display: 'flex', alignItems: 'flex-start', gap: '16px' },
  iconCircle: { width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#ebf8ff', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  textContainer: { flex: 1 },
  diagnosisText: { margin: '0 0 6px 0', fontSize: '18px', color: '#1a202c' },
  metaInfo: { display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' },
  metaItem: { fontSize: '13px', color: '#718096', display: 'flex', alignItems: 'center', gap: '4px' },
  idTag: { fontSize: '11px', backgroundColor: '#f7fafc', padding: '2px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', color: '#a0aec0' },
  medicationSection: { marginTop: '15px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px' },
  medTitle: { margin: '0 0 8px 0', fontSize: '13px', fontWeight: 'bold', color: '#4a5568', display: 'flex', alignItems: 'center', gap: '6px' },
  medTagContainer: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  medTag: { backgroundColor: '#fff', border: '1px solid #cbd5e0', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', color: '#2d3748' },
  actionRow: { display: 'flex', gap: '12px', marginTop: '15px', borderTop: '1px solid #f1f5f9', paddingTop: '15px' },
  viewBtn: { display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', border: '1px solid #cbd5e0', borderRadius: '8px', backgroundColor: '#fff', cursor: 'pointer', fontSize: '14px', color: '#4a5568' },
  downloadBtn: { display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', border: 'none', borderRadius: '8px', backgroundColor: '#007bff', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: '500' },
  emptyState: { textAlign: 'center', padding: '40px', color: '#a0aec0', fontSize: '15px' }
};

export default PrescriptionAccess;