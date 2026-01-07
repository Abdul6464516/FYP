import React, { useState } from 'react';
import { Search, MapPin, Calendar, Clock, CheckCircle } from 'lucide-react';

const AppointmentBooking = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [bookingStep, setBookingStep] = useState("list"); // list, details, success
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Mock Data for Doctors
  const doctors = [
    { id: 1, name: "Dr. Sarah Smith", specialty: "Cardiologist", location: "New York", fee: "$100", availability: "Today" },
    { id: 2, name: "Dr. James Wilson", specialty: "Dermatologist", location: "Chicago", fee: "$80", availability: "Tomorrow" },
    { id: 3, name: "Dr. Maria Garcia", specialty: "Pediatrician", location: "Los Angeles", fee: "$90", availability: "Jan 5" },
  ];

  const filteredDoctors = doctors.filter(doc => 
    doc.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBookClick = (doctor) => {
    setSelectedDoctor(doctor);
    setBookingStep("details");
  };

  const confirmBooking = () => {
    setBookingStep("success");
  };

  if (bookingStep === "success") {
    return (
      <div style={styles.successContainer}>
        <CheckCircle size={60} color="#28a745" />
        <h2>Appointment Confirmed!</h2>
        <p>Your session with <strong>{selectedDoctor.name}</strong> has been scheduled.</p>
        <button onClick={() => setBookingStep("list")} style={styles.backBtn}>Book Another</button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {bookingStep === "list" ? (
        <>
          <div style={styles.searchBar}>
            <Search size={20} style={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search by specialty or doctor name..." 
              style={styles.searchInput}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={styles.grid}>
            {filteredDoctors.map(doc => (
              <div key={doc.id} style={styles.doctorCard}>
                <h4>{doc.name}</h4>
                <p style={styles.specialty}>{doc.specialty}</p>
                <div style={styles.infoRow}><MapPin size={14} /> {doc.location}</div>
                <div style={styles.infoRow}><Calendar size={14} /> Next: {doc.availability}</div>
                <div style={styles.priceRow}><strong>{doc.fee}</strong> / session</div>
                <button onClick={() => handleBookClick(doc)} style={styles.bookBtn}>Select Slot</button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={styles.detailsBox}>
          <button onClick={() => setBookingStep("list")} style={styles.textBtn}>← Back to list</button>
          <h3>Booking with {selectedDoctor.name}</h3>
          <p>Choose a time slot for {selectedDoctor.availability}:</p>
          <div style={styles.slotGrid}>
            {["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"].map(time => (
              <button key={time} onClick={confirmBooking} style={styles.slotBtn}><Clock size={14} /> {time}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: "10px" },
  searchBar: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#f1f3f5",
    padding: "10px 15px",
    borderRadius: "10px",
    marginBottom: "20px",
  },
  searchInput: {
    border: "none",
    backgroundColor: "transparent",
    width: "100%",
    marginLeft: "10px",
    outline: "none",
    fontSize: "15px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
  },
  doctorCard: {
    border: "1px solid #eee",
    padding: "20px",
    borderRadius: "12px",
    transition: "0.3s",
  },
  specialty: {
    color: "#28a745",
    fontWeight: "bold",
    fontSize: "14px",
    marginBottom: "10px",
  },
  infoRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    color: "#666",
    marginBottom: "5px",
  },
  priceRow: { marginTop: "10px", fontSize: "15px" },
  bookBtn: {
    width: "100%",
    marginTop: "15px",
    padding: "10px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  successContainer: { textAlign: "center", padding: "50px" },
  detailsBox: {
    padding: "20px",
    border: "1px solid #eee",
    borderRadius: "12px",
  },
  slotGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    marginTop: "20px",
  },
  slotBtn: {
    padding: "12px",
    border: "1px solid #28a745",
    color: "#28a745",
    borderRadius: "8px",
    backgroundColor: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  backBtn: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#28a745",
    color: "#fff",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
  },
  textBtn: {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    backgroundColor: "#c7f1d0ff", 
    color: "#28a745", 
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    transition: "all 0.25s ease",
  },
};

export default AppointmentBooking;