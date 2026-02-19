import React, { useState, useEffect, useCallback } from "react";
import { Search, Calendar, User, Briefcase, Award, MapPin } from "lucide-react";
import { fetchDoctors } from "../../services/doctorAction";
import { toast } from "react-toastify";

const AppointmentBooking = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({ specialty: "All", availability: "All", city: "All" });

  const loadDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchDoctors({
        search,
        specialty: filter.specialty,
        availability: filter.availability,
        city: filter.city,
      });
      setDoctors(data.doctors);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, filter]);

  // Fetch doctors on mount and whenever search/filter changes
  useEffect(() => {
    const debounce = setTimeout(() => {
      loadDoctors();
    }, 400);
    return () => clearTimeout(debounce);
  }, [loadDoctors]);

  // Build unique values from loaded doctors for filter dropdowns
  const specialties = [...new Set(doctors.map((d) => d.specialty).filter(Boolean))];
  const availabilities = [...new Set(doctors.map((d) => d.availability).filter(Boolean))];
  const cities = [...new Set(doctors.map((d) => d.city).filter(Boolean))];

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Find a Specialist</h2>

      {/* SEARCH & FILTER BAR */}
      <div style={styles.searchBar}>
        <div style={styles.inputWrapper}>
          <Search size={18} color="#9ca3af" />
          <input
            style={styles.input}
            placeholder="Search by doctor name or specialty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          style={styles.select}
          value={filter.specialty}
          onChange={(e) => setFilter({ ...filter, specialty: e.target.value })}
        >
          <option value="All">All Specialties</option>
          {specialties.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          style={styles.select}
          value={filter.availability}
          onChange={(e) => setFilter({ ...filter, availability: e.target.value })}
        >
          <option value="All">Any Availability</option>
          {availabilities.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>

        <select
          style={styles.select}
          value={filter.city}
          onChange={(e) => setFilter({ ...filter, city: e.target.value })}
        >
          <option value="All">All Cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* LOADING STATE */}
      {loading && (
        <p style={{ textAlign: "center", color: "#6b7280", padding: "30px 0" }}>Loading doctors...</p>
      )}

      {/* NO RESULTS */}
      {!loading && doctors.length === 0 && (
        <p style={{ textAlign: "center", color: "#6b7280", padding: "30px 0" }}>No doctors found.</p>
      )}

      {/* DOCTOR CARDS */}
      {!loading && doctors.length > 0 && (
        <div style={styles.grid}>
          {doctors.map((dr) => (
            <div key={dr._id} style={styles.card}>
              <div style={styles.avatar}>
                {dr.fullName ? dr.fullName.charAt(0).toUpperCase() : "D"}
              </div>
              <h3 style={styles.drName}>{dr.fullName}</h3>
              <p style={styles.drSpec}>{dr.specialty || "General"}</p>
              <div style={styles.tagGroup}>
                {dr.gender && (
                  <span style={styles.tag}><User size={12} /> {dr.gender.charAt(0).toUpperCase() + dr.gender.slice(1)}</span>
                )}
                {dr.availability && (
                  <span style={styles.tag}><Calendar size={12} /> {dr.availability}</span>
                )}
                {dr.yearsOfExperience && (
                  <span style={styles.tag}><Briefcase size={12} /> {dr.yearsOfExperience} yrs</span>
                )}
                {dr.qualifications && (
                  <span style={styles.tag}><Award size={12} /> {dr.qualifications}</span>
                )}
                {dr.city && (
                  <span style={styles.tag}><MapPin size={12} /> {dr.city}</span>
                )}
              </div>
              <button style={styles.bookBtn}>Book Consultation</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { width: "100%" },
  title: { fontSize: "22px", fontWeight: "700", marginBottom: "20px" },
  searchBar: { display: "flex", gap: "15px", marginBottom: "30px", flexWrap: "wrap" },
  inputWrapper: { flex: 2, display: "flex", alignItems: "center", gap: "10px", backgroundColor: "#fff", padding: "10px 15px", borderRadius: "8px", border: "1px solid #e5e7eb" },
  input: { border: "none", outline: "none", width: "100%", fontSize: "14px" },
  select: { flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #e5e7eb", backgroundColor: "#fff", cursor: "pointer" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" },
  card: { backgroundColor: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e5e7eb", textAlign: "center", transition: "0.2s" },
  avatar: { width: "60px", height: "60px", borderRadius: "50%", backgroundColor: "#eef2ff", color: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: "bold", margin: "0 auto 15px" },
  drName: { fontSize: "16px", fontWeight: "700", margin: "0 0 5px 0" },
  drSpec: { fontSize: "14px", color: "#6b7280", marginBottom: "15px" },
  tagGroup: { display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" },
  tag: { fontSize: "11px", backgroundColor: "#f3f4f6", padding: "4px 8px", borderRadius: "4px", display: "flex", alignItems: "center", gap: "4px", color: "#4b5563" },
  bookBtn: { width: "100%", padding: "10px", borderRadius: "8px", border: "none", backgroundColor: "#16a34a", color: "#fff", fontWeight: "600", cursor: "pointer" }
};

export default AppointmentBooking;