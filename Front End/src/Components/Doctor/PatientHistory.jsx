import React, { useState } from "react";
import { 
  Search, Clock, FileText, Calendar, ChevronRight, 
  Filter, Download, User, Activity 
} from "lucide-react";

const PatientHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Mock Data
  const patients = [
    { id: 1, name: "John Doe", age: 45, gender: "Male", lastVisit: "2023-10-15" },
    { id: 2, name: "Jane Smith", age: 32, gender: "Female", lastVisit: "2023-11-02" },
    { id: 3, name: "Robert Brown", age: 58, gender: "Male", lastVisit: "2023-09-20" },
  ];

  const historyData = [
    { date: "Oct 15, 2023", diagnosis: "Acute Bronchitis", doctor: "Dr. Self", notes: "Prescribed antibiotics. Advised 5 days rest.", attachment: "X-Ray_Report.pdf" },
    { date: "June 12, 2023", diagnosis: "Routine Checkup", doctor: "Dr. Self", notes: "Blood pressure slightly high (140/90). Life style changes recommended.", attachment: "Blood_Work.pdf" },
    { date: "Jan 05, 2023", diagnosis: "Seasonal Flu", doctor: "Dr. Wilson", notes: "High fever and body aches.", attachment: null },
  ];

  return (
    <div style={styles.container}>
      {/* LEFT SIDE: Patient List */}
      <div style={styles.listSection}>
        <div style={styles.searchBox}>
          <Search size={18} color="#9ca3af" />
          <input 
            type="text" 
            placeholder="Search patients..." 
            style={styles.searchInput}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div style={styles.patientList}>
          {patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
            <div 
              key={p.id} 
              style={{
                ...styles.patientCard,
                borderColor: selectedPatient?.id === p.id ? "#16a34a" : "#e5e7eb",
                backgroundColor: selectedPatient?.id === p.id ? "#f0fdf4" : "#fff"
              }}
              onClick={() => setSelectedPatient(p)}
            >
              <div style={styles.avatarSmall}>{p.name.charAt(0)}</div>
              <div style={{ flex: 1 }}>
                <div style={styles.patientName}>{p.name}</div>
                <div style={styles.patientSub}>{p.gender}, {p.age} years</div>
              </div>
              <ChevronRight size={16} color="#9ca3af" />
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE: Detailed History */}
      <div style={styles.historySection}>
        {selectedPatient ? (
          <>
            <div style={styles.historyHeader}>
              <div>
                <h3 style={{ margin: 0 }}>{selectedPatient.name}'s Medical History</h3>
                <span style={styles.patientSub}>Records from Jan 2023 - Present</span>
              </div>
              <button style={styles.downloadBtn}><Download size={16} /> Export PDF</button>
            </div>

            <div style={styles.timeline}>
              {historyData.map((item, index) => (
                <div key={index} style={styles.timelineItem}>
                  <div style={styles.timelineDate}>
                    <Calendar size={14} /> {item.date}
                  </div>
                  <div style={styles.timelineContent}>
                    <div style={styles.diagnosisTitle}>{item.diagnosis}</div>
                    <div style={styles.doctorTag}>Consultant: {item.doctor}</div>
                    <p style={styles.notesText}>{item.notes}</p>
                    {item.attachment && (
                      <div style={styles.attachment}>
                        <FileText size={14} /> {item.attachment}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={styles.emptyState}>
            <Activity size={48} color="#d1d5db" />
            <p>Select a patient from the list to view their detailed medical history.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { display: "flex", gap: "20px", height: "100%", flexWrap: "wrap" },
  listSection: { flex: "1", minWidth: "280px", borderRight: "1px solid #f3f4f6", paddingRight: "20px" },
  searchBox: { display: "flex", alignItems: "center", gap: "10px", backgroundColor: "#f3f4f6", padding: "10px 15px", borderRadius: "8px", marginBottom: "20px" },
  searchInput: { border: "none", backgroundColor: "transparent", outline: "none", width: "100%", fontSize: "14px" },
  patientList: { display: "flex", flexDirection: "column", gap: "10px" },
  patientCard: { display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "10px", border: "1px solid #e5e7eb", cursor: "pointer", transition: "0.2s" },
  avatarSmall: { width: "35px", height: "35px", borderRadius: "50%", backgroundColor: "#16a34a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" },
  patientName: { fontWeight: "600", color: "#111827", fontSize: "14px" },
  patientSub: { fontSize: "12px", color: "#6b7280" },
  historySection: { flex: "2", minWidth: "350px" },
  historyHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", borderBottom: "1px solid #f3f4f6", paddingBottom: "15px" },
  downloadBtn: { display: "flex", alignItems: "center", gap: "8px", border: "1px solid #e5e7eb", backgroundColor: "#fff", padding: "8px 15px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  timeline: { position: "relative", paddingLeft: "20px", borderLeft: "2px solid #f3f4f6" },
  timelineItem: { marginBottom: "30px", position: "relative" },
  timelineDate: { display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", fontWeight: "600", color: "#16a34a", marginBottom: "8px" },
  timelineContent: { backgroundColor: "#f9fafb", padding: "15px", borderRadius: "10px", border: "1px solid #f3f4f6" },
  diagnosisTitle: { fontWeight: "700", color: "#1f2937", marginBottom: "4px" },
  doctorTag: { fontSize: "12px", color: "#6b7280", fontStyle: "italic", marginBottom: "10px" },
  notesText: { fontSize: "14px", color: "#4b5563", lineHeight: "1.5", margin: 0 },
  attachment: { display: "inline-flex", alignItems: "center", gap: "5px", marginTop: "12px", padding: "6px 10px", backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "6px", fontSize: "12px", color: "#4b5563" },
  emptyState: { height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#9ca3af", textAlign: "center" }
};

export default PatientHistory;