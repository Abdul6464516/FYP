import React, { useState } from 'react';
import { Star, Send, User, MessageSquare, CheckCircle } from 'lucide-react';

const FeedbackSystem = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState("");

  const recentConsultations = [
    { id: 1, name: "Dr. Sarah Smith", specialty: "Cardiology", date: "Dec 28, 2025" },
    { id: 2, name: "Dr. James Wilson", specialty: "General Physician", date: "Dec 15, 2025" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0 || !selectedDoctor) {
      alert("Please select a doctor and provide a rating.");
      return;
    }
    // Simulation of API call
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={styles.successContainer}>
        <CheckCircle size={60} color="#28a745" />
        <h3>Thank you for your feedback!</h3>
        <p>Your review helps us improve our healthcare services.</p>
        <button onClick={() => setSubmitted(false)} style={styles.resetBtn}>Submit Another Review</button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Rate Your Consultation</h3>
      <p style={styles.subtitle}>Select a recent doctor and let us know about your experience.</p>

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Doctor Selection */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Select Doctor</label>
          <select 
            style={styles.select} 
            value={selectedDoctor} 
            onChange={(e) => setSelectedDoctor(e.target.value)}
          >
            <option value="" >-- Choose a Doctor --</option>
            {recentConsultations.map(doc => (
              <option  key={doc.id} value={doc.name}>{doc.name} ({doc.specialty})</option>
            ))}
          </select>
        </div>

        {/* Star Rating */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Your Rating</label>
          <div style={styles.starRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                style={styles.starBtn}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                <Star 
                  size={32} 
                  fill={(hover || rating) >= star ? "#ffc107" : "none"} 
                  color={(hover || rating) >= star ? "#ffc107" : "#ccc"} 
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment Box */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Share your thoughts (Optional)</label>
          <textarea
            style={styles.textarea}
            placeholder="How was the consultation? Did the doctor address your concerns?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <button type="submit" style={styles.submitBtn}>
          <Send size={18} /> Submit Feedback
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: { padding: '10px', maxWidth: '600px' },
  title: { margin: '0 0 10px 0', color: '#2d3748' },
  subtitle: { color: '#718096', marginBottom: '30px', fontSize: '14px' },
  form: { display: 'flex', flexDirection: 'column', gap: '25px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '14px', fontWeight: 'bold', color: '#4a5568' },
  select: { padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#fff', outline: 'none' },
  starRow: { display: 'flex', gap: '8px' },
  starBtn: { border: 'none', background: 'none', cursor: 'pointer', padding: 0 },
  textarea: { padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', minHeight: '120px', outline: 'none', fontFamily: 'inherit' },
  submitBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '14px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' },
  successContainer: { textAlign: 'center', padding: '60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' },
  resetBtn: { marginTop: '10px', padding: '10px 20px', border: '1px solid #28a745', background: 'none', color: '#28a745', borderRadius: '8px', cursor: 'pointer' }
};

export default FeedbackSystem;