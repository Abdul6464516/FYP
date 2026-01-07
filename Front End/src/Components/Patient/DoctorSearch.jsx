import React, { useState } from "react";
import { Search, Filter, Calendar, User } from "lucide-react";

const DoctorSearch = () => {
  const [filter, setFilter] = useState({ specialty: "All", gender: "All" });

  const doctors = [
    { id: 1, name: "Dr. Raz", specialty: "Cardiology", gender: "Male", availability: "Today", rating: 4.9 },
    { id: 2, name: "Dr. Sarah", specialty: "Dermatology", gender: "Female", availability: "Tomorrow", rating: 4.8 },
    { id: 3, name: "Dr. Smith", specialty: "Neurology", gender: "Male", availability: "Today", rating: 4.7 },
  ];

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Find a Specialist</h2>
      
      {/* SEARCH & FILTER BAR */}
      <div style={styles.searchBar}>
        <div style={styles.inputWrapper}>
          <Search size={18} color="#9ca3af" />
          <input style={styles.input} placeholder="Search by doctor name or specialty..." />
        </div>
        
        <select 
          style={styles.select} 
          onChange={(e) => setFilter({...filter, specialty: e.target.value})}
        >
          <option value="All">All Specialties</option>
          <option value="Cardiology">Cardiology</option>
          <option value="Dermatology">Dermatology</option>
        </select>

        <select 
          style={styles.select}
          onChange={(e) => setFilter({...filter, gender: e.target.value})}
        >
          <option value="All">Any Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      {/* DOCTOR CARDS */}
      <div style={styles.grid}>
        {doctors.map(dr => (
          <div key={dr.id} style={styles.card}>
            <div style={styles.avatar}>{dr.name.charAt(4)}</div>
            <h3 style={styles.drName}>{dr.name}</h3>
            <p style={styles.drSpec}>{dr.specialty}</p>
            <div style={styles.tagGroup}>
              <span style={styles.tag}><User size={12} /> {dr.gender}</span>
              <span style={styles.tag}><Calendar size={12} /> {dr.availability}</span>
            </div>
            <button style={styles.bookBtn}>Book Consultation</button>
          </div>
        ))}
      </div>
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

export default DoctorSearch;