import React, { useState, useEffect, useCallback } from "react";
import { Check, X, Clock, Calendar, User, AlertCircle, MapPin, Phone, DollarSign, FileText } from "lucide-react";
import { getDoctorAppointments, approveAppointment, cancelAppointmentByDoctor } from "../../services/doctorAction";
import { toast } from "react-toastify";

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // track which appointment action is in progress

  const loadAppointments = useCallback(async () => {
    try {
      const data = await getDoctorAppointments();
      setAppointments(data.appointments);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      const data = await approveAppointment(id);
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? data.appointment : a))
      );
      toast.success("Appointment approved");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (id) => {
    setActionLoading(id);
    try {
      const data = await cancelAppointmentByDoctor(id);
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? data.appointment : a))
      );
      toast.success("Appointment cancelled");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const pendingCount = appointments.filter((a) => a.status === "pending").length;

  if (loading) {
    return <p style={{ textAlign: "center", color: "#6b7280", padding: "30px 0" }}>Loading appointments...</p>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h4 style={styles.title}>Appointment Requests</h4>
        {pendingCount > 0 && (
          <span style={styles.countBadge}>{pendingCount} New</span>
        )}
      </div>

      {appointments.length === 0 && (
        <p style={{ textAlign: "center", color: "#6b7280", padding: "30px 0" }}>No appointment requests yet.</p>
      )}

      <div style={styles.list}>
        {appointments.map((app) => (
          <div key={app._id} style={styles.appointmentCard}>
            <div style={styles.cardInfo}>
              {/* Patient name + status */}
              <div style={styles.patientRow}>
                <div style={styles.avatar}>
                  {app.patient?.fullName ? app.patient.fullName.charAt(0).toUpperCase() : <User size={18} />}
                </div>
                <span style={styles.patientName}>{app.patient?.fullName || "Unknown"}</span>
                <span style={{ ...styles.statusBadge, ...getStatusStyle(app.status) }}>
                  {app.status}
                </span>
              </div>

              {/* Date, Time, Type */}
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
                  <span style={{ textTransform: "capitalize" }}>{app.type}</span>
                </div>
                {app.fee > 0 && (
                  <div style={styles.infoItem}>
                    <DollarSign size={14} style={styles.icon} />
                    <span>${app.fee}</span>
                  </div>
                )}
              </div>

              {/* Extra details row */}
              <div style={{ ...styles.dateTimeRow, marginTop: "8px" }}>
                {app.patient?.phone && (
                  <div style={styles.infoItem}>
                    <Phone size={14} style={styles.icon} />
                    <span>{app.patient.phone}</span>
                  </div>
                )}
                {app.patient?.city && (
                  <div style={styles.infoItem}>
                    <MapPin size={14} style={styles.icon} />
                    <span>{app.patient.city}</span>
                  </div>
                )}
                {app.reason && (
                  <div style={styles.infoItem}>
                    <FileText size={14} style={styles.icon} />
                    <span>{app.reason}</span>
                  </div>
                )}
              </div>

              {app.notes && (
                <p style={styles.notes}><strong>Notes:</strong> {app.notes}</p>
              )}
            </div>

            <div style={styles.actionButtons}>
              {app.status === "pending" && (
                <>
                  <button
                    onClick={() => handleApprove(app._id)}
                    style={styles.approveBtn}
                    disabled={actionLoading === app._id}
                  >
                    <Check size={18} /> {actionLoading === app._id ? "..." : "Approve"}
                  </button>
                  <button
                    onClick={() => handleCancel(app._id)}
                    style={styles.cancelBtn}
                    disabled={actionLoading === app._id}
                  >
                    <X size={20} />
                  </button>
                </>
              )}
              {app.status === "approved" && (
                <span style={{ fontSize: "12px", color: "#16a34a", fontWeight: "bold" }}>✓ Approved</span>
              )}
              {app.status === "cancelled" && (
                <span style={{ fontSize: "12px", color: "#dc2626", fontWeight: "bold" }}>Rejected</span>
              )}
              {app.status === "completed" && (
                <span style={{ fontSize: "12px", color: "#2563eb", fontWeight: "bold" }}>Completed</span>
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
    case "pending": return { backgroundColor: "#fff7ed", color: "#c2410c" };
    case "approved": return { backgroundColor: "#f0fdf4", color: "#16a34a" };
    case "cancelled": return { backgroundColor: "#fef2f2", color: "#dc2626" };
    case "completed": return { backgroundColor: "#eff6ff", color: "#2563eb" };
    default: return {};
  }
};

const styles = {
  container: { marginTop: "10px", width: "100%" },
  header: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" },
  title: { margin: 0, fontSize: "18px", color: "#374151", fontWeight: "600" },
  countBadge: { backgroundColor: "#16a34a", color: "#fff", padding: "2px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" },
  list: { display: "flex", flexDirection: "column", gap: "15px" },
  appointmentCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    border: "1px solid #f3f4f6",
    borderRadius: "12px",
    backgroundColor: "#fff",
    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
  },
  cardInfo: { flex: "1" },
  patientRow: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" },
  avatar: { width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#4f46e5", fontWeight: "bold", fontSize: "15px", border: "1px solid #e5e7eb" },
  patientName: { fontWeight: "700", color: "#111827", fontSize: "15px" },
  statusBadge: { padding: "3px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" },
  dateTimeRow: { display: "flex", gap: "20px", color: "#6b7280", fontSize: "13px", flexWrap: "wrap" },
  infoItem: { display: "flex", alignItems: "center", gap: "6px" },
  icon: { color: "#9ca3af" },
  notes: { fontSize: "13px", color: "#6b7280", marginTop: "8px", marginBottom: 0 },
  actionButtons: { display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 },
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
    transition: "0.2s",
  },
  cancelBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    border: "1px solid #fecaca",
    width: "42px",
    height: "42px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "0.2s",
    padding: 0,
  },
};

export default AppointmentManagement;