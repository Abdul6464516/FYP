import React, { useState } from "react";
import { 
  FileText, Upload, Search, Download, 
  Eye, Filter, MoreVertical, FilePlus 
} from "lucide-react";

const MedicalReports = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for patient reports
  const reports = [
    { id: 1, patient: "John Doe", type: "Blood Test", date: "2025-12-10", status: "Analyzed", file: "blood_work_dec.pdf" },
    { id: 2, patient: "Jane Smith", type: "X-Ray", date: "2025-11-28", status: "Pending Review", file: "chest_xray_01.png" },
    { id: 3, patient: "John Doe", type: "MRI Scan", date: "2025-11-15", status: "Analyzed", file: "mri_lumbar.pdf" },
    { id: 4, patient: "Robert Brown", type: "ECG", date: "2025-12-05", status: "New", file: "ecg_report.pdf" },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.titleArea}>
          <h2 style={styles.title}>Medical Reports Repository</h2>
          <p style={styles.subtitle}>Manage and review patient diagnostic documents</p>
        </div>
        <button style={styles.uploadBtn}>
          <Upload size={18} /> Upload New Report
        </button>
      </div>

      <div style={styles.toolbar}>
        <div style={styles.searchWrapper}>
          <Search size={18} color="#9ca3af" />
          <input 
            type="text" 
            placeholder="Search by patient or report type..." 
            style={styles.searchInput}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button style={styles.filterBtn}>
          <Filter size={18} /> Filter
        </button>
      </div>

      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeadRow}>
              <th style={styles.th}>Report Name / Type</th>
              <th style={styles.th}>Patient Name</th>
              <th style={styles.th}>Upload Date</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports
              .filter(r => r.patient.toLowerCase().includes(searchTerm.toLowerCase()) || r.type.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((report) => (
                <tr key={report.id} style={styles.tableRow}>
                  <td style={styles.td}>
                    <div style={styles.fileNameCell}>
                      <FileText size={20} color="#16a34a" />
                      <div style={{ marginLeft: "10px" }}>
                        <div style={styles.fileName}>{report.type}</div>
                        <div style={styles.fileSub}>{report.file}</div>
                      </div>
                    </div>
                  </td>
                  <td style={styles.td}>{report.patient}</td>
                  <td style={styles.td}>{report.date}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: report.status === "Analyzed" ? "#f0fdf4" : "#fefce8",
                      color: report.status === "Analyzed" ? "#16a34a" : "#a16207"
                    }}>
                      {report.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actionGroup}>
                      <button style={styles.iconBtn} title="View"><Eye size={18} /></button>
                      <button style={styles.iconBtn} title="Download"><Download size={18} /></button>
                      <button style={styles.iconBtn} title="More"><MoreVertical size={18} /></button>
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
  container: { width: "100%" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" },
  title: { margin: 0, fontSize: "22px", color: "#111827", fontWeight: "700" },
  subtitle: { margin: "5px 0 0 0", fontSize: "14px", color: "#6b7280" },
  uploadBtn: { display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#16a34a", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" },
  toolbar: { display: "flex", gap: "15px", marginBottom: "20px" },
  searchWrapper: { flex: 1, display: "flex", alignItems: "center", gap: "10px", backgroundColor: "#fff", border: "1px solid #e5e7eb", padding: "0 15px", borderRadius: "8px", height: "45px" },
  searchInput: { border: "none", outline: "none", width: "100%", fontSize: "14px" },
  filterBtn: { display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#fff", border: "1px solid #e5e7eb", padding: "0 20px", borderRadius: "8px", color: "#374151", fontSize: "14px", cursor: "pointer" },
  tableCard: { backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
  tableHeadRow: { backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" },
  th: { padding: "15px 20px", fontSize: "13px", fontWeight: "600", color: "#4b5563" },
  tableRow: { borderBottom: "1px solid #f3f4f6", transition: "0.2s" },
  td: { padding: "15px 20px", fontSize: "14px", color: "#374151" },
  fileNameCell: { display: "flex", alignItems: "center" },
  fileName: { fontWeight: "600", color: "#111827" },
  fileSub: { fontSize: "12px", color: "#9ca3af" },
  statusBadge: { padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" },
  actionGroup: { display: "flex", gap: "10px" },
  iconBtn: { background: "none", border: "none", color: "#9ca3af", cursor: "pointer", padding: "5px", transition: "0.2s color" }
};

export default MedicalReports;