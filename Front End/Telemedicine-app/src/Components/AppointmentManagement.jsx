import React, { useState } from "react";
import { Check, X, Clock, Calendar, User, AlertCircle } from "lucide-react";

const AppointmentManagement = () => {
  // Mock data for display
  const [appointments, setAppointments] = useState([
    { id: 1, patient: "John Doe", date: "2023-10-25", time: "10:30 AM", status: "Cancelled", type: "Video Call" },
    { id: 2, patient: "Jane Smith", date: "2023-10-25", time: "11:45 AM", status: "Approved", type: "In-Person" },
    { id: 3, patient: "Robert Brown", date: "2023-10-26", time: "09:00 AM", status: "Pending", type: "Video Call" },
  ]);

  const updateStatus = (id, newStatus) => {
    setAppointments(appointments.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    ));
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h4 style={styles.title}>Appointment Requests</h4>
        <span style={styles.countBadge}>
          {appointments.filter(a => a.status === 'Pending').length} New
        </span>
      </div>

      <div style={styles.list}>
        {appointments.map((app) => (
          <div key={app.id} style={styles.appointmentCard}>
            <div style={styles.cardInfo}>
              <div style={styles.patientRow}>
                <div style={styles.avatar}>
                  <User size={18} />
                </div>
                <span style={styles.patientName}>{app.patient}</span>
                <span style={{...styles.statusBadge, ...getStatusStyle(app.status)}}>
                  {app.status}
                </span>
              </div>

              <div style={styles.dateTimeRow}>
                <div style={styles.infoItem}>
                  <Calendar size={14} style={styles.icon} />
                  <span>{app.date}</span>
                </div>
                <div style={styles.infoItem}>
                  <Clock size={14} style={styles.icon} />
                  <span>{app.time}</span>
                </div>
                <div style={styles.infoItem}>
                  <AlertCircle size={14} style={styles.icon} />
                  <span>{app.type}</span>
                </div>
              </div>
            </div>

            <div style={styles.actionButtons}>
              {app.status === "Pending" && (
                <>
                  <button 
                    onClick={() => updateStatus(app.id, "Approved")}
                    style={styles.approveBtn}
                  >
                    <Check size={18} /> Approve
                  </button>
                  <button 
                    onClick={() => updateStatus(app.id, "Cancelled")}
                    style={styles.cancelBtn}
                    title="Reject Appointment"
                  >
                    {/* Fixed: Explicit color and strokeWidth for visibility */}
                    <X size={20} color="#dc2626" strokeWidth={2.5} />
                  </button>
                </>
              )}
              {app.status === "Approved" && (
                <button 
                  onClick={() => updateStatus(app.id, "Pending")}
                  style={styles.rescheduleBtn}
                >
                  Reschedule
                </button>
              )}
              {app.status === "Cancelled" && (
                <span style={styles.rejectedText}>Rejected</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper for status colors
const getStatusStyle = (status) => {
  switch (status) {
    case "Pending": return { backgroundColor: "#fff7ed", color: "#c2410c" };
    case "Approved": return { backgroundColor: "#f0fdf4", color: "#16a34a" };
    case "Cancelled": return { backgroundColor: "#fef2f2", color: "#dc2626" };
    default: return {};
  }
};

const styles = {
  container: { marginTop: "10px", width: "100%" },
  header: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" },
  title: { margin: 0, fontSize: "18px", color: "#374151", fontWeight: '600' },
  countBadge: { backgroundColor: "#16a34a", color: "#fff", padding: "2px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: 'bold' },
  list: { display: "flex", flexDirection: "column", gap: "15px" },
  appointmentCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    border: "1px solid #f3f4f6",
    borderRadius: "12px",
    backgroundColor: "#fff",
    boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
  },
  cardInfo: { flex: "1" },
  patientRow: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" },
  avatar: { width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", border: "1px solid #e5e7eb" },
  patientName: { fontWeight: "700", color: "#111827", fontSize: "15px" },
  statusBadge: { padding: "3px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", textTransform: 'uppercase' },
  dateTimeRow: { display: "flex", gap: "20px", color: "#6b7280", fontSize: "13px" },
  infoItem: { display: "flex", alignItems: "center", gap: "6px" },
  icon: { color: "#9ca3af" },
  actionButtons: { display: "flex", alignItems: "center", gap: "12px" },
  approveBtn: { 
    display: "flex", 
    alignItems: "center", 
    gap: "8px", 
    backgroundColor: "#16a34a", 
    color: "#fff", 
    border: "none", 
    padding: "0 20px", 
    height: "42px", 
    borderRadius: "8px", 
    cursor: "pointer", 
    fontWeight: "600",
    fontSize: "14px",
    transition: "background 0.2s"
  },
  cancelBtn: { 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    backgroundColor: "#fff", 
    border: "1.5px solid #dc2626", 
    width: "42px", 
    height: "42px", 
    borderRadius: "8px", 
    cursor: "pointer",
    padding: "0",
    transition: "all 0.2s ease"
  },
  rescheduleBtn: { 
    backgroundColor: "#f3f4f6", 
    color: "#4b5563", 
    border: "none", 
    padding: "0 18px", 
    height: "40px", 
    borderRadius: "8px", 
    cursor: "pointer", 
    fontSize: "13px",
    fontWeight: "500" 
  },
  rejectedText: {
    fontSize: '12px', 
    color: '#dc2626', 
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  }
};

export default AppointmentManagement;