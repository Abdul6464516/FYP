import React, { useState, useEffect, useCallback } from "react";
import {
  Search, Calendar, User, Briefcase, Award, MapPin, X, Clock,
  DollarSign, Star, Video, Building, FileText, ChevronDown, Loader2,
  CheckCircle, Heart,
} from "lucide-react";
import { fetchDoctors, fetchDoctorRatings } from "../../services/doctorAction";
import { bookAppointment } from "../../services/patientAction";
import { toast } from "react-toastify";

const AppointmentBooking = () => {
  const [doctors, setDoctors] = useState([]);
  const [ratings, setRatings] = useState({}); // { doctorId: { avgRating, totalReviews } }
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({ specialty: "All", availability: "All", city: "All" });
  const [hoveredCard, setHoveredCard] = useState(null);

  // Booking modal
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [booking, setBooking] = useState({ date: "", time: "", type: "online", reason: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  const loadDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchDoctors({
        search, specialty: filter.specialty,
        availability: filter.availability, city: filter.city,
      });
      setDoctors(data.doctors);
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  }, [search, filter]);

  // Load ratings once
  useEffect(() => {
    const loadRatings = async () => {
      try {
        const data = await fetchDoctorRatings();
        setRatings(data.ratings || {});
      } catch { /* silently fail — ratings are optional */ }
    };
    loadRatings();
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => loadDoctors(), 400);
    return () => clearTimeout(debounce);
  }, [loadDoctors]);

  const specialties = [...new Set(doctors.map((d) => d.specialty).filter(Boolean))];
  const availabilities = [...new Set(doctors.map((d) => d.availability).filter(Boolean))];
  const cities = [...new Set(doctors.map((d) => d.city).filter(Boolean))];

  const openBookingModal = (doctor) => {
    setSelectedDoctor(doctor);
    setBooking({ date: "", time: "", type: "online", reason: "", notes: "" });
    setBookingSuccess(false);
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setSelectedDoctor(null); setBookingSuccess(false); };

  const handleBookingChange = (e) => setBooking({ ...booking, [e.target.name]: e.target.value });

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!booking.date || !booking.time) { toast.error("Please select date and time"); return; }
    setSubmitting(true);
    try {
      await bookAppointment({
        doctor: selectedDoctor._id, date: booking.date, time: booking.time,
        type: booking.type, reason: booking.reason, notes: booking.notes,
      });
      toast.success(`Appointment booked with Dr. ${selectedDoctor.fullName}`);
      setBookingSuccess(true);
    } catch (err) { toast.error(err.message); }
    finally { setSubmitting(false); }
  };

  /* ─── Rating Stars ─── */
  const RatingStars = ({ doctorId }) => {
    const r = ratings[doctorId];
    if (!r) return <div style={st.noRating}><Star size={13} color="#d1d5db" /> No ratings yet</div>;
    const full = Math.floor(r.avgRating);
    const half = r.avgRating - full >= 0.5;
    return (
      <div style={st.ratingRow}>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i} size={14}
            color={i < full ? "#f59e0b" : i === full && half ? "#f59e0b" : "#d1d5db"}
            fill={i < full ? "#f59e0b" : i === full && half ? "url(#half)" : "none"}
          />
        ))}
        <span style={st.ratingNum}>{r.avgRating}</span>
        <span style={st.ratingCount}>({r.totalReviews})</span>
      </div>
    );
  };

  return (
    <div style={st.container}>
      {/* Header */}
      <div style={st.pageHeader}>
        <div>
          <h2 style={st.title}>Find a Specialist</h2>
          <p style={st.subtitle}>Browse our network of verified healthcare professionals</p>
        </div>
        <div style={st.resultsBadge}>{doctors.length} doctor{doctors.length !== 1 ? "s" : ""} found</div>
      </div>

      {/* SEARCH & FILTERS */}
      <div style={st.filterBar}>
        <div style={st.searchWrap}>
          <Search size={18} color="#9ca3af" />
          <input
            style={st.searchInput}
            placeholder="Search by doctor name, specialty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={st.selectWrap}>
          <Briefcase size={15} color="#9ca3af" />
          <select style={st.select} value={filter.specialty} onChange={(e) => setFilter({ ...filter, specialty: e.target.value })}>
            <option value="All">All Specialties</option>
            {specialties.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div style={st.selectWrap}>
          <Clock size={15} color="#9ca3af" />
          <select style={st.select} value={filter.availability} onChange={(e) => setFilter({ ...filter, availability: e.target.value })}>
            <option value="All">Any Availability</option>
            {availabilities.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div style={st.selectWrap}>
          <MapPin size={15} color="#9ca3af" />
          <select style={st.select} value={filter.city} onChange={(e) => setFilter({ ...filter, city: e.target.value })}>
            <option value="All">All Cities</option>
            {cities.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* LOADING / EMPTY */}
      {loading && (
        <div style={st.emptyState}>
          <Loader2 size={32} color="#16a34a" style={{ animation: "spin 1s linear infinite" }} />
          <p style={{ marginTop: "12px", color: "#6b7280" }}>Loading doctors...</p>
        </div>
      )}
      {!loading && doctors.length === 0 && (
        <div style={st.emptyState}>
          <Search size={40} color="#d1d5db" />
          <p style={{ marginTop: "12px", color: "#6b7280", fontWeight: "500" }}>No doctors found matching your criteria</p>
        </div>
      )}

      {/* DOCTOR CARDS */}
      {!loading && doctors.length > 0 && (
        <div style={st.grid}>
          {doctors.map((dr) => (
            <div
              key={dr._id}
              style={{
                ...st.card,
                transform: hoveredCard === dr._id ? "translateY(-4px)" : "none",
                boxShadow: hoveredCard === dr._id ? "0 12px 28px rgba(0,0,0,0.1)" : "0 1px 4px rgba(0,0,0,0.06)",
              }}
              onMouseEnter={() => setHoveredCard(dr._id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Avatar */}
              <div style={st.cardTop}>
                <div style={st.drAvatar}>
                  {dr.fullName ? dr.fullName.charAt(0).toUpperCase() : "D"}
                </div>
                {dr.chargesPerSession > 0 && (
                  <div style={st.feeBadge}>Rs. {dr.chargesPerSession}</div>
                )}
              </div>

              <h3 style={st.drName}>{dr.fullName}</h3>
              <p style={st.drSpec}>{dr.specialty || "General Physician"}</p>

              {/* ★ Average Rating */}
              <RatingStars doctorId={dr._id} />

              {/* Tags */}
              <div style={st.tagGroup}>
                {dr.yearsOfExperience && (
                  <span style={st.tag}><Briefcase size={11} /> {dr.yearsOfExperience} yrs exp</span>
                )}
                {dr.qualifications && (
                  <span style={st.tag}><Award size={11} /> {dr.qualifications}</span>
                )}
                {dr.city && (
                  <span style={st.tag}><MapPin size={11} /> {dr.city}</span>
                )}
                {dr.availability && (
                  <span style={st.tag}><Clock size={11} /> {dr.availability}</span>
                )}
              </div>

              <button style={st.bookBtn} onClick={() => openBookingModal(dr)}>
                <Calendar size={16} /> Book Consultation
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ═══════ BOOKING MODAL ═══════ */}
      {showModal && selectedDoctor && (
        <div style={st.overlay} onClick={closeModal}>
          <div style={st.modal} onClick={(e) => e.stopPropagation()}>
            {/* Close btn */}
            <button style={st.closeBtn} onClick={closeModal}><X size={20} /></button>

            {/* Success view */}
            {bookingSuccess ? (
              <div style={st.successView}>
                <div style={st.successIcon}><CheckCircle size={48} color="#16a34a" /></div>
                <h3 style={st.successTitle}>Appointment Booked!</h3>
                <p style={st.successText}>
                  Your appointment with <strong>Dr. {selectedDoctor.fullName}</strong> has been scheduled.
                  You'll receive a confirmation notification shortly.
                </p>
                <button style={st.successBtn} onClick={closeModal}>Done</button>
              </div>
            ) : (
              <>
                {/* Doctor info header */}
                <div style={st.modalHeader}>
                  <div style={st.modalAvatar}>
                    {selectedDoctor.fullName?.charAt(0).toUpperCase() || "D"}
                  </div>
                  <div>
                    <h3 style={st.modalDrName}>Dr. {selectedDoctor.fullName}</h3>
                    <p style={st.modalDrSpec}>{selectedDoctor.specialty || "General Physician"}</p>
                    <RatingStars doctorId={selectedDoctor._id} />
                  </div>
                </div>

                {/* Info chips */}
                <div style={st.modalChips}>
                  {selectedDoctor.city && (
                    <div style={st.chip}><MapPin size={13} /> {selectedDoctor.city}</div>
                  )}
                  {selectedDoctor.chargesPerSession > 0 && (
                    <div style={st.chip}><DollarSign size={13} /> Rs. {selectedDoctor.chargesPerSession}</div>
                  )}
                  {selectedDoctor.availability && (
                    <div style={st.chip}><Clock size={13} /> {selectedDoctor.availability}</div>
                  )}
                </div>

                <div style={st.modalDivider} />

                {/* Form */}
                <form onSubmit={handleBookingSubmit}>
                  <div style={st.formGrid}>
                    {/* Date */}
                    <div style={st.formField}>
                      <label style={st.formLabel}><Calendar size={14} /> Date *</label>
                      <input
                        type="date" name="date" value={booking.date}
                        onChange={handleBookingChange} required
                        min={new Date().toISOString().split("T")[0]}
                        onFocus={() => setFocusedField("date")}
                        onBlur={() => setFocusedField("")}
                        style={{
                          ...st.formInput,
                          borderColor: focusedField === "date" ? "#16a34a" : "#e5e7eb",
                          boxShadow: focusedField === "date" ? "0 0 0 3px rgba(22,163,74,0.08)" : "none",
                        }}
                      />
                    </div>

                    {/* Time */}
                    <div style={st.formField}>
                      <label style={st.formLabel}><Clock size={14} /> Time *</label>
                      <input
                        type="time" name="time" value={booking.time}
                        onChange={handleBookingChange} required
                        onFocus={() => setFocusedField("time")}
                        onBlur={() => setFocusedField("")}
                        style={{
                          ...st.formInput,
                          borderColor: focusedField === "time" ? "#16a34a" : "#e5e7eb",
                          boxShadow: focusedField === "time" ? "0 0 0 3px rgba(22,163,74,0.08)" : "none",
                        }}
                      />
                    </div>
                  </div>

                  {/* Consultation type */}
                  <div style={st.formField}>
                    <label style={st.formLabel}>Consultation Type</label>
                    <div style={st.typeRow}>
                      {[
                        { val: "online", icon: <Video size={16} />, label: "Online" },
                        { val: "in-person", icon: <Building size={16} />, label: "In-Person" },
                      ].map((t) => (
                        <div
                          key={t.val}
                          style={{
                            ...st.typeCard,
                            borderColor: booking.type === t.val ? "#16a34a" : "#e5e7eb",
                            backgroundColor: booking.type === t.val ? "#f0fdf4" : "#fff",
                            color: booking.type === t.val ? "#16a34a" : "#6b7280",
                          }}
                          onClick={() => setBooking({ ...booking, type: t.val })}
                        >
                          {t.icon} {t.label}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reason */}
                  <div style={st.formField}>
                    <label style={st.formLabel}><FileText size={14} /> Reason for Visit</label>
                    <input
                      type="text" name="reason" placeholder="e.g. Headache, Follow-up, Checkup..."
                      value={booking.reason} onChange={handleBookingChange}
                      onFocus={() => setFocusedField("reason")}
                      onBlur={() => setFocusedField("")}
                      style={{
                        ...st.formInput,
                        borderColor: focusedField === "reason" ? "#16a34a" : "#e5e7eb",
                        boxShadow: focusedField === "reason" ? "0 0 0 3px rgba(22,163,74,0.08)" : "none",
                      }}
                    />
                  </div>

                  {/* Notes */}
                  <div style={st.formField}>
                    <label style={st.formLabel}>Additional Notes (optional)</label>
                    <textarea
                      name="notes" placeholder="Any extra information for the doctor..."
                      value={booking.notes} onChange={handleBookingChange}
                      onFocus={() => setFocusedField("notes")}
                      onBlur={() => setFocusedField("")}
                      style={{
                        ...st.formInput, minHeight: "72px", resize: "vertical",
                        borderColor: focusedField === "notes" ? "#16a34a" : "#e5e7eb",
                        boxShadow: focusedField === "notes" ? "0 0 0 3px rgba(22,163,74,0.08)" : "none",
                      }}
                    />
                  </div>

                  <button type="submit" style={st.submitBtn} disabled={submitting}>
                    {submitting ? (
                      <><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Booking...</>
                    ) : (
                      <><CheckCircle size={18} /> Confirm Booking</>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

/* ═══════════════════ STYLES ═══════════════════ */
const st = {
  container: { width: "100%", fontFamily: "'Inter','Segoe UI',system-ui,sans-serif" },

  /* Page header */
  pageHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px", flexWrap: "wrap", gap: "12px" },
  title: { fontSize: "24px", fontWeight: "800", color: "#111827", margin: "0 0 4px", letterSpacing: "-0.5px" },
  subtitle: { fontSize: "14px", color: "#6b7280", margin: 0 },
  resultsBadge: {
    padding: "6px 14px", borderRadius: "20px", backgroundColor: "#f0fdf4",
    color: "#16a34a", fontSize: "13px", fontWeight: "600", border: "1px solid #dcfce7",
  },

  /* Filters */
  filterBar: { display: "flex", gap: "12px", marginBottom: "28px", flexWrap: "wrap" },
  searchWrap: {
    flex: "2 1 240px", display: "flex", alignItems: "center", gap: "10px",
    backgroundColor: "#fff", padding: "0 16px", borderRadius: "12px",
    border: "2px solid #e5e7eb", transition: "border 0.2s",
  },
  searchInput: { border: "none", outline: "none", width: "100%", fontSize: "14px", padding: "12px 0", backgroundColor: "transparent", fontFamily: "inherit" },
  selectWrap: {
    flex: "1 1 160px", display: "flex", alignItems: "center", gap: "8px",
    backgroundColor: "#fff", padding: "0 12px", borderRadius: "12px",
    border: "2px solid #e5e7eb",
  },
  select: { border: "none", outline: "none", width: "100%", fontSize: "13px", padding: "12px 0", cursor: "pointer", backgroundColor: "transparent", fontFamily: "inherit" },

  /* Empty / Loading */
  emptyState: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 20px" },

  /* Grid */
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" },

  /* Doctor Card */
  card: {
    backgroundColor: "#fff", borderRadius: "16px", padding: "24px",
    border: "1px solid #f0f0f0", transition: "all 0.25s ease", cursor: "default",
    display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
  },
  cardTop: { width: "100%", display: "flex", justifyContent: "center", position: "relative", marginBottom: "14px" },
  drAvatar: {
    width: "68px", height: "68px", borderRadius: "50%",
    background: "linear-gradient(135deg, #16a34a, #0d9488)",
    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "26px", fontWeight: "700",
    boxShadow: "0 4px 12px rgba(22,163,74,0.2)",
  },
  feeBadge: {
    position: "absolute", top: "0", right: "0",
    backgroundColor: "#f0fdf4", color: "#15803d", fontSize: "12px", fontWeight: "700",
    padding: "4px 10px", borderRadius: "8px", border: "1px solid #dcfce7",
  },
  drName: { fontSize: "17px", fontWeight: "700", color: "#111827", margin: "0 0 3px" },
  drSpec: { fontSize: "13px", color: "#6b7280", margin: "0 0 10px", fontWeight: "500" },

  /* Ratings */
  ratingRow: { display: "flex", alignItems: "center", gap: "3px", marginBottom: "12px" },
  ratingNum: { fontSize: "13px", fontWeight: "700", color: "#f59e0b", marginLeft: "4px" },
  ratingCount: { fontSize: "12px", color: "#9ca3af" },
  noRating: { display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#d1d5db", marginBottom: "12px" },

  /* Tags */
  tagGroup: { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px", marginBottom: "18px" },
  tag: {
    fontSize: "11px", backgroundColor: "#f9fafb", padding: "4px 10px",
    borderRadius: "6px", display: "flex", alignItems: "center", gap: "4px",
    color: "#4b5563", border: "1px solid #f3f4f6",
  },
  bookBtn: {
    width: "100%", padding: "11px", borderRadius: "10px", border: "none",
    background: "linear-gradient(135deg, #16a34a, #15803d)", color: "#fff",
    fontWeight: "600", fontSize: "14px", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
    transition: "opacity 0.2s", marginTop: "auto",
  },

  /* ══ MODAL ══ */
  overlay: {
    position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1000, backdropFilter: "blur(4px)",
  },
  modal: {
    backgroundColor: "#fff", borderRadius: "20px", padding: "32px",
    width: "520px", maxWidth: "95vw", maxHeight: "90vh", overflowY: "auto",
    position: "relative", boxShadow: "0 25px 60px rgba(0,0,0,0.15)",
    animation: "modalIn 0.25s ease-out",
  },
  closeBtn: {
    position: "absolute", top: "16px", right: "16px", background: "#f3f4f6",
    border: "none", cursor: "pointer", color: "#6b7280",
    width: "34px", height: "34px", borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "background 0.15s",
  },

  /* Modal Header */
  modalHeader: { display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" },
  modalAvatar: {
    width: "60px", height: "60px", borderRadius: "50%",
    background: "linear-gradient(135deg, #16a34a, #0d9488)",
    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "24px", fontWeight: "700", flexShrink: 0,
    boxShadow: "0 4px 12px rgba(22,163,74,0.2)",
  },
  modalDrName: { fontSize: "20px", fontWeight: "700", color: "#111827", margin: "0 0 2px" },
  modalDrSpec: { fontSize: "14px", color: "#6b7280", margin: "0 0 4px" },

  modalChips: { display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" },
  chip: {
    display: "flex", alignItems: "center", gap: "5px",
    padding: "6px 12px", borderRadius: "8px",
    backgroundColor: "#f9fafb", border: "1px solid #f0f0f0",
    fontSize: "12px", color: "#4b5563", fontWeight: "500",
  },
  modalDivider: { height: "1px", backgroundColor: "#f0f0f0", margin: "4px 0 20px" },

  /* Form */
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" },
  formField: { marginBottom: "16px" },
  formLabel: {
    display: "flex", alignItems: "center", gap: "5px",
    fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px",
  },
  formInput: {
    width: "100%", padding: "11px 14px", borderRadius: "10px",
    border: "2px solid #e5e7eb", fontSize: "14px", boxSizing: "border-box",
    transition: "all 0.2s", fontFamily: "inherit", outline: "none",
  },
  typeRow: { display: "flex", gap: "10px" },
  typeCard: {
    flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
    gap: "6px", padding: "11px", borderRadius: "10px",
    border: "2px solid #e5e7eb", cursor: "pointer",
    fontWeight: "600", fontSize: "13px", transition: "all 0.2s",
  },
  submitBtn: {
    width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
    gap: "8px", padding: "14px", borderRadius: "12px", border: "none",
    background: "linear-gradient(135deg, #16a34a, #15803d)", color: "#fff",
    fontSize: "15px", fontWeight: "700", cursor: "pointer",
    boxShadow: "0 4px 14px rgba(22,163,74,0.25)", marginTop: "6px",
    transition: "opacity 0.2s",
  },

  /* Success */
  successView: { display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "20px 0" },
  successIcon: { marginBottom: "16px" },
  successTitle: { fontSize: "22px", fontWeight: "700", color: "#111827", margin: "0 0 8px" },
  successText: { fontSize: "14px", color: "#6b7280", lineHeight: "1.6", marginBottom: "24px", maxWidth: "340px" },
  successBtn: {
    padding: "12px 40px", borderRadius: "10px", border: "none",
    background: "linear-gradient(135deg, #16a34a, #15803d)", color: "#fff",
    fontSize: "15px", fontWeight: "600", cursor: "pointer",
  },
};

export default AppointmentBooking;