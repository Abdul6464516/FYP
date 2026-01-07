import React, { useState } from 'react';
import { ClipboardList, Upload, Eye, Download, Search, FilePlus, Filter } from 'lucide-react';

const MedicalRecords = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock Data for Medical Records
  const records = [
    { 
      id: "REC-001", 
      type: "Lab Report", 
      doctor: "Dr. Sarah Smith", 
      date: "Dec 15, 2025", 
      summary: "Full Blood Count - Normal",
      fileSize: "1.2 MB"
    },
    { 
      id: "REC-002", 
      type: "Radiology", 
      doctor: "Dr. James Wilson", 
      date: "Nov 20, 2025", 
      summary: "Chest X-Ray - Clear",
      fileSize: "4.5 MB"
    },
    { 
      id: "REC-003", 
      type: "Consultation Summary", 
      doctor: "Dr. Maria Garcia", 
      date: "Oct 05, 2025", 
      summary: "Annual Health Checkup",
      fileSize: "0.8 MB"
    }
  ];

  const filteredRecords = records.filter(rec => 
    rec.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rec.doctor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      {/* Header Actions */}
      <div style={styles.header}>
        <h3 style={styles.title}>Medical Records & History</h3>
        <button style={styles.uploadBtn}>
          <Upload size={18} /> Upload New Report
        </button>
      </div>

      {/* Filter Bar */}
      <div style={styles.filterRow}>
        <div style={styles.searchBox}>
          <Search size={18} color="#888" />
          <input 
            type="text" 
            placeholder="Search by report type or doctor..." 
            style={styles.searchInput}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button style={styles.iconBtn}><Filter size={18} /></button>
      </div>

      {/* Records Table/List */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>Report Type</th>
              <th style={styles.th}>Assigned Doctor</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((rec) => (
              <tr key={rec.id} style={styles.tr}>
                <td style={styles.td}>
                  <div style={styles.typeCol}>
                    <ClipboardList size={18} color="#28a745" />
                    <div>
                      <div style={styles.primaryText}>{rec.type}</div>
                      <div style={styles.secondaryText}>{rec.summary}</div>
                    </div>
                  </div>
                </td>
                <td style={styles.td}>{rec.doctor}</td>
                <td style={styles.td}>{rec.date}</td>
                <td style={styles.td}>
                  <div style={styles.actionGroup}>
                    <button style={styles.actionBtn} title="View"><Eye size={16} /></button>
                    <button style={styles.actionBtn} title="Download"><Download size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '5px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
  title: { margin: 0, color: '#2d3748' },
  uploadBtn: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#28a745', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  filterRow: { display: 'flex', gap: '12px', marginBottom: '20px' },
  searchBox: { flex: 1, display: 'flex', alignItems: 'center', backgroundColor: '#f1f3f5', padding: '8px 15px', borderRadius: '10px' },
  searchInput: { border: 'none', backgroundColor: 'transparent', width: '100%', marginLeft: '10px', outline: 'none' },
  iconBtn: { backgroundColor: '#f1f3f5', border: 'none', padding: '10px', borderRadius: '10px', cursor: 'pointer' },
  tableContainer: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
  tableHeader: { borderBottom: '2px solid #edf2f7', textAlign: 'left' },
  th: { padding: '12px 15px', color: '#718096', fontWeight: '600', fontSize: '14px' },
  tr: { borderBottom: '1px solid #edf2f7', transition: '0.2s' },
  td: { padding: '15px', fontSize: '14px', color: '#4a5568' },
  typeCol: { display: 'flex', alignItems: 'center', gap: '12px' },
  primaryText: { fontWeight: '600', color: '#2d3748' },
  secondaryText: { fontSize: '12px', color: '#a0aec0' },
  actionGroup: { display: 'flex', gap: '8px' },
  actionBtn: { border: '1px solid #e2e8f0', backgroundColor: '#fff', padding: '6px', borderRadius: '6px', cursor: 'pointer', color: '#4a5568' }
};

export default MedicalRecords;