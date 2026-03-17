import React, { useState, useEffect, useCallback } from "react";
import {
  Search, Calendar, User, Briefcase, Award, MapPin, X, Clock,
  DollarSign, Star, Video, Building, FileText, ChevronDown, Loader2,
  CheckCircle, Heart,
} from "lucide-react";
import { fetchDoctors, fetchDoctorRatings } from "../../services/doctorAction";
import { bookAppointment } from "../../services/patientAction";
import { toast } from "react-toastify";
import "./AppointmentBooking.css";

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
    if (!r) return <div className="ab-no-rating"><Star size={13} color="#d1d5db" /> No ratings yet</div>;
    const full = Math.floor(r.avgRating);
    const half = r.avgRating - full >= 0.5;
    return (
      <div className="ab-rating-row">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i} size={14}
            color={i < full ? "#f59e0b" : i === full && half ? "#f59e0b" : "#d1d5db"}
            fill={i < full ? "#f59e0b" : i === full && half ? "url(#half)" : "none"}
          />
        ))}
        <span className="ab-rating-num">{r.avgRating}</span>
        <span className="ab-rating-count">({r.totalReviews})</span>
      </div>
    );
  };

  return (
    <div className="ab-container">
      {/* Header */}
      <div className="ab-page-header">
        <div>
          <h2 className="ab-title">Find a Specialist</h2>
          <p className="ab-subtitle">Browse our network of verified healthcare professionals</p>
        </div>
        <div className="ab-results-badge">{doctors.length} doctor{doctors.length !== 1 ? "s" : ""} found</div>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="ab-filter-bar">
        <div className="ab-search-wrap">
          <Search size={18} color="#9ca3af" />
          <input
            className="ab-search-input"
            placeholder="Search by doctor name, specialty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="ab-select-wrap">
          <Briefcase size={15} color="#9ca3af" />
          <select className="ab-select" value={filter.specialty} onChange={(e) => setFilter({ ...filter, specialty: e.target.value })}>
            <option value="All">All Specialties</option>
            {specialties.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="ab-select-wrap">
          <Clock size={15} color="#9ca3af" />
          <select className="ab-select" value={filter.availability} onChange={(e) => setFilter({ ...filter, availability: e.target.value })}>
            <option value="All">Any Availability</option>
            {availabilities.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div className="ab-select-wrap">
          <MapPin size={15} color="#9ca3af" />
          <select className="ab-select" value={filter.city} onChange={(e) => setFilter({ ...filter, city: e.target.value })}>
            <option value="All">All Cities</option>
            {cities.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* LOADING / EMPTY */}
      {loading && (
        <div className="ab-empty-state">
          <Loader2 size={32} color="#16a34a" style={{ animation: "spin 1s linear infinite" }} />
          <p style={{ marginTop: "12px", color: "#6b7280" }}>Loading doctors...</p>
        </div>
      )}
      {!loading && doctors.length === 0 && (
        <div className="ab-empty-state">
          <Search size={40} color="#d1d5db" />
          <p style={{ marginTop: "12px", color: "#6b7280", fontWeight: "500" }}>No doctors found matching your criteria</p>
        </div>
      )}

      {/* DOCTOR CARDS */}
      {!loading && doctors.length > 0 && (
        <div className="ab-grid">
          {doctors.map((dr) => (
            <div
              key={dr._id}
              className="ab-card"
              style={{
                transform: hoveredCard === dr._id ? "translateY(-4px)" : "none",
                boxShadow: hoveredCard === dr._id ? "0 12px 28px rgba(0,0,0,0.1)" : "0 1px 4px rgba(0,0,0,0.06)",
              }}
              onMouseEnter={() => setHoveredCard(dr._id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Avatar */}
              <div className="ab-card-top">
                <div className="ab-dr-avatar">
                  {dr.fullName ? dr.fullName.charAt(0).toUpperCase() : "D"}
                </div>
                {dr.chargesPerSession > 0 && (
                  <div className="ab-fee-badge">Rs. {dr.chargesPerSession}</div>
                )}
              </div>

              <h3 className="ab-dr-name">{dr.fullName}</h3>
              <p className="ab-dr-spec">{dr.specialty || "General Physician"}</p>

              {/* ★ Average Rating */}
              <RatingStars doctorId={dr._id} />

              {/* Tags */}
              <div className="ab-tag-group">
                {dr.yearsOfExperience && (
                  <span className="ab-tag"><Briefcase size={11} /> {dr.yearsOfExperience} yrs exp</span>
                )}
                {dr.qualifications && (
                  <span className="ab-tag"><Award size={11} /> {dr.qualifications}</span>
                )}
                {dr.city && (
                  <span className="ab-tag"><MapPin size={11} /> {dr.city}</span>
                )}
                {dr.availability && (
                  <span className="ab-tag"><Clock size={11} /> {dr.availability}</span>
                )}
              </div>

              <button className="ab-book-btn" onClick={() => openBookingModal(dr)}>
                <Calendar size={16} /> Book Consultation
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ═══════ BOOKING MODAL ═══════ */}
      {showModal && selectedDoctor && (
        <div className="ab-overlay" onClick={closeModal}>
          <div className="ab-modal" onClick={(e) => e.stopPropagation()}>
            {/* Close btn */}
            <button className="ab-close-btn" onClick={closeModal}><X size={20} /></button>

            {/* Success view */}
            {bookingSuccess ? (
              <div className="ab-success-view">
                <div className="ab-success-icon"><CheckCircle size={48} color="#16a34a" /></div>
                <h3 className="ab-success-title">Appointment Booked!</h3>
                <p className="ab-success-text">
                  Your appointment with <strong>Dr. {selectedDoctor.fullName}</strong> has been scheduled.
                  You'll receive a confirmation notification shortly.
                </p>
                <button className="ab-success-btn" onClick={closeModal}>Done</button>
              </div>
            ) : (
              <>
                {/* Doctor info header */}
                <div className="ab-modal-header">
                  <div className="ab-modal-avatar">
                    {selectedDoctor.fullName?.charAt(0).toUpperCase() || "D"}
                  </div>
                  <div>
                    <h3 className="ab-modal-dr-name">Dr. {selectedDoctor.fullName}</h3>
                    <p className="ab-modal-dr-spec">{selectedDoctor.specialty || "General Physician"}</p>
                    <RatingStars doctorId={selectedDoctor._id} />
                  </div>
                </div>

                {/* Info chips */}
                <div className="ab-modal-chips">
                  {selectedDoctor.city && (
                    <div className="ab-chip"><MapPin size={13} /> {selectedDoctor.city}</div>
                  )}
                  {selectedDoctor.chargesPerSession > 0 && (
                    <div className="ab-chip"><DollarSign size={13} /> Rs. {selectedDoctor.chargesPerSession}</div>
                  )}
                  {selectedDoctor.availability && (
                    <div className="ab-chip"><Clock size={13} /> {selectedDoctor.availability}</div>
                  )}
                </div>

                <div className="ab-modal-divider" />

                {/* Form */}
                <form onSubmit={handleBookingSubmit}>
                  <div className="ab-form-grid">
                    {/* Date */}
                    <div className="ab-form-field">
                      <label className="ab-form-label"><Calendar size={14} /> Date *</label>
                      <input
                        type="date" name="date" value={booking.date}
                        onChange={handleBookingChange} required
                        min={new Date().toISOString().split("T")[0]}
                        className="ab-form-input"
                      />
                    </div>

                    {/* Time */}
                    <div className="ab-form-field">
                      <label className="ab-form-label"><Clock size={14} /> Time *</label>
                      <input
                        type="time" name="time" value={booking.time}
                        onChange={handleBookingChange} required
                        className="ab-form-input"
                      />
                    </div>
                  </div>

                  {/* Consultation type */}
                  <div className="ab-form-field">
                    <label className="ab-form-label">Consultation Type</label>
                    <div className="ab-type-row">
                      {[
                        { val: "online", icon: <Video size={16} />, label: "Online" },
                        { val: "in-person", icon: <Building size={16} />, label: "In-Person" },
                      ].map((t) => (
                        <div
                          key={t.val}
                          className={`ab-type-card ${booking.type === t.val ? 'active' : ''}`}
                          onClick={() => setBooking({ ...booking, type: t.val })}
                        >
                          {t.icon} {t.label}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="ab-form-field">
                    <label className="ab-form-label"><FileText size={14} /> Reason for Visit</label>
                    <input
                      type="text" name="reason" placeholder="e.g. Headache, Follow-up, Checkup..."
                      value={booking.reason} onChange={handleBookingChange}
                      className="ab-form-input"
                    />
                  </div>

                  {/* Notes */}
                  <div className="ab-form-field">
                    <label className="ab-form-label">Additional Notes (optional)</label>
                    <textarea
                      name="notes" placeholder="Any extra information for the doctor..."
                      value={booking.notes} onChange={handleBookingChange}
                      className="ab-form-input"
                      style={{ minHeight: "72px", resize: "vertical" }}
                    />
                  </div>

                  <button type="submit" className="ab-submit-btn" disabled={submitting}>
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

/* ═══════════════════ STYLES (REMOVED - Using external CSS) ═══════════════════ */

export default AppointmentBooking;