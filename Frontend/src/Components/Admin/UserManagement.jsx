import React, { useState, useEffect } from "react";
import { 
  UserCheck, UserX, ShieldCheck, Search, 
  Filter, MoreVertical, CheckCircle, XCircle 
} from "lucide-react";
import { toast } from "react-toastify";
import { getAllDoctors, getAllPatients, verifyUser, rejectUser } from "../../services/adminActions";

const UserManagement = () => {
  const [activeSubTab, setActiveSubTab] = useState("Doctors");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  // Fetch all doctors and patients on component mount and when tab changes
  useEffect(() => {
    if (activeSubTab === "Doctors") {
      fetchAllDoctors();
    } else {
      fetchAllPatients();
    }
  }, [activeSubTab]);

  const fetchAllDoctors = async () => {
    try {
      setLoading(true);
      const data = await getAllDoctors();
      setDoctors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to load doctors');
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllPatients = async () => {
    try {
      setLoading(true);
      const data = await getAllPatients();
      setPatients(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast.error('Failed to load patients');
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (userId) => {
    try {
      await verifyUser(userId);
      toast.success('User verified successfully');
      // Refresh the list
      if (activeSubTab === "Doctors") {
        fetchAllDoctors();
      } else {
        fetchAllPatients();
      }
    } catch (error) {
      console.error('Error verifying user:', error);
      toast.error(error.message || 'Failed to verify user');
    }
  };

  const handleReject = async (userId) => {
    try {
      await rejectUser(userId);
      toast.success('User rejected successfully');
      // Refresh the list
      if (activeSubTab === "Doctors") {
        fetchAllDoctors();
      } else {
        fetchAllPatients();
      }
    } catch (error) {
      console.error('Error rejecting user:', error);
      toast.error(error.message || 'Failed to reject user');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>User Management</h2>
        <div style={styles.tabSwitcher}>
          <button 
            style={{...styles.tabBtn, borderBottom: activeSubTab === "Doctors" ? "3px solid #16a34a" : "none"}}
            onClick={() => setActiveSubTab("Doctors")}
          >
            Doctor Verifications
          </button>
          <button 
            style={{...styles.tabBtn, borderBottom: activeSubTab === "Patients" ? "3px solid #16a34a" : "none"}}
            onClick={() => setActiveSubTab("Patients")}
          >
            Patient Registrations
          </button>
        </div>
      </div>

      <div style={styles.toolbar}>
        <div style={styles.toolbarContent}>
          <div style={styles.searchBox}>
            <Search size={18} color="#9ca3af" />
            <input 
              placeholder={`Search ${activeSubTab.toLowerCase()}...`} 
              style={styles.searchInput}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={styles.filterBox}>
            <Filter size={18} color="#9ca3af" />
            <select 
              style={styles.filterSelect}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={styles.loadingMessage}>Loading {activeSubTab.toLowerCase()}...</div>
      ) : (
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thRow}>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>{activeSubTab === "Doctors" ? "Specialty" : "Email"}</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Joined Date</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activeSubTab === "Doctors" ? (
              doctors.length > 0 ? doctors
                .filter(d => d.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
                .filter(d => statusFilter === "all" || d.verificationStatus === statusFilter)
                .map(dr => (
                <tr key={dr._id} style={styles.tr}>
                  <td style={styles.td}>{dr.fullName}</td>
                  <td style={styles.td}>{dr.specialty || 'N/A'}</td>
                  <td style={styles.td}>{dr.email}</td>
                  <td style={styles.td}>
                    <span style={{...styles.badge, ...styles[dr.verificationStatus]}}>
                      {dr.verificationStatus.charAt(0).toUpperCase() + dr.verificationStatus.slice(1)}
                    </span>
                  </td>
                  <td style={styles.td}>{new Date(dr.createdAt).toLocaleDateString()}</td>
                  <td style={styles.td}>
                    {dr.verificationStatus === "pending" ? (
                      <div style={styles.actionGroup}>
                        <button onClick={() => handleVerify(dr._id)} style={styles.verifyBtn} title="Approve"><CheckCircle size={18} /></button>
                        <button onClick={() => handleReject(dr._id)} style={styles.rejectBtn} title="Reject"><XCircle size={18} /></button>
                      </div>
                    ) : (
                      <span style={styles.noAction}>-</span>
                    )}
                  </td>
                </tr>
              )) : (
                <tr style={styles.tr}>
                  <td colSpan="6" style={{...styles.td, textAlign: 'center'}}>No doctors found</td>
                </tr>
              )
            ) : (
              patients.length > 0 ? patients
                .filter(p => p.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
                .filter(p => statusFilter === "all" || p.verificationStatus === statusFilter)
                .map(pa => (
                <tr key={pa._id} style={styles.tr}>
                  <td style={styles.td}>{pa.fullName}</td>
                  <td style={styles.td}>{pa.email}</td>
                  <td style={styles.td}>{pa.email}</td>
                  <td style={styles.td}>
                    <span style={{...styles.badge, ...styles[pa.verificationStatus]}}>
                      {pa.verificationStatus.charAt(0).toUpperCase() + pa.verificationStatus.slice(1)}
                    </span>
                  </td>
                  <td style={styles.td}>{new Date(pa.createdAt).toLocaleDateString()}</td>
                  <td style={styles.td}>
                    {pa.verificationStatus === "pending" ? (
                      <div style={styles.actionGroup}>
                        <button onClick={() => handleVerify(pa._id)} style={styles.verifyBtn} title="Approve"><CheckCircle size={18} /></button>
                        <button onClick={() => handleReject(pa._id)} style={styles.rejectBtn} title="Reject"><XCircle size={18} /></button>
                      </div>
                    ) : (
                      <span style={styles.noAction}>-</span>
                    )}
                  </td>
                </tr>
              )) : (
                <tr style={styles.tr}>
                  <td colSpan="6" style={{...styles.td, textAlign: 'center'}}>No patients found</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
};

const styles = {
  container: { width: "100%" },
  header: { marginBottom: "25px" },
  title: { fontSize: "22px", fontWeight: "700", color: "#111827", marginBottom: "15px" },
  tabSwitcher: { display: "flex", gap: "30px", borderBottom: "1px solid #e5e7eb" },
  tabBtn: { background: "none", border: "none", padding: "10px 5px", fontSize: "15px", fontWeight: "600", color: "#4b5563", cursor: "pointer" },
  toolbar: { margin: "20px 0" },
  toolbarContent: { display: "flex", gap: "15px", alignItems: "center" },
  searchBox: { display: "flex", alignItems: "center", gap: "10px", backgroundColor: "#fff", border: "1px solid #d1d5db", padding: "10px 15px", borderRadius: "8px", width: "350px" },
  searchInput: { border: "none", outline: "none", width: "100%", fontSize: "14px" },
  filterBox: { display: "flex", alignItems: "center", gap: "10px", backgroundColor: "#fff", border: "1px solid #d1d5db", padding: "10px 15px", borderRadius: "8px", width: "200px" },
  filterSelect: { border: "none", outline: "none", width: "100%", fontSize: "14px", backgroundColor: "transparent", cursor: "pointer" },
  loadingMessage: { padding: "40px", textAlign: "center", color: "#666", fontSize: "16px" },
  tableWrapper: { backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
  thRow: { backgroundColor: "#f9fafb" },
  th: { padding: "15px", fontSize: "13px", color: "#6b7280", fontWeight: "600" },
  tr: { borderBottom: "1px solid #f3f4f6" },
  td: { padding: "15px", fontSize: "14px", color: "#374151" },
  badge: { padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", display: "inline-block" },
  pending: { backgroundColor: "#fefce8", color: "#a16207" },
  verified: { backgroundColor: "#f0fdf4", color: "#16a34a" },
  rejected: { backgroundColor: "#fef2f2", color: "#dc2626" },
  actionGroup: { display: "flex", gap: "12px" },
  verifyBtn: { background: "none", border: "none", color: "#16a34a", cursor: "pointer", padding: "5px", borderRadius: "4px", transition: "background 0.2s" },
  rejectBtn: { background: "none", border: "none", color: "#dc2626", cursor: "pointer", padding: "5px", borderRadius: "4px", transition: "background 0.2s" },
  noAction: { color: "#9ca3af", fontSize: "14px" }
};

export default UserManagement;