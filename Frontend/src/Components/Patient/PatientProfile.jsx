import React, { useState } from 'react';

const PatientProfile = () => {
  // State to check if profile has been created yet
  const [isCreated, setIsCreated] = useState(false);
  // State to toggle Edit mode
  const [isEditing, setIsEditing] = useState(true);

  // Form State
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    gender: '',
    contact: '',
    medicalHistory: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsCreated(true);
    setIsEditing(false);
    console.log("Data Submitted to Local State:", profile);
    alert("Profile saved successfully!");
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div style={formStyles.card}>
      <div style={formStyles.header}>
        <h2 style={formStyles.title}>
          {isCreated ? "Your Medical Profile" : "Create Your Profile"}
        </h2>
        <p style={formStyles.subtitle}>
          {isEditing ? "Please fill in your details below." : "View or update your information."}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={formStyles.grid}>
          {/* Name Field */}
          <div style={formStyles.field}>
            <label style={formStyles.label}>Full Name</label>
            {isEditing ? (
              <input type="text" name="name" value={profile.name} onChange={handleChange} style={formStyles.input} required placeholder="Enter full name" />
            ) : (
              <div style={formStyles.displayBox}>{profile.name}</div>
            )}
          </div>

          {/* Age Field */}
          <div style={formStyles.field}>
            <label style={formStyles.label}>Age</label>
            {isEditing ? (
              <input type="number" name="age" value={profile.age} onChange={handleChange} style={formStyles.input} required placeholder="Enter age" />
            ) : (
              <div style={formStyles.displayBox}>{profile.age}</div>
            )}
          </div>

          {/* Gender Field */}
          <div style={formStyles.field}>
            <label style={formStyles.label}>Gender</label>
            {isEditing ? (
              <select name="gender" value={profile.gender} onChange={handleChange} style={formStyles.input} required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <div style={formStyles.displayBox}>{profile.gender}</div>
            )}
          </div>

          {/* Contact Field */}
          <div style={formStyles.field}>
            <label style={formStyles.label}>Contact Number</label>
            {isEditing ? (
              <input type="tel" name="contact" value={profile.contact} onChange={handleChange} style={formStyles.input} required placeholder="+92 3xx xxxxxxx" />
            ) : (
              <div style={formStyles.displayBox}>{profile.contact}</div>
            )}
          </div>

          {/* Medical History Field */}
          <div style={{ ...formStyles.field, gridColumn: "span 2" }}>
            <label style={formStyles.label}>Medical History</label>
            {isEditing ? (
              <textarea name="medicalHistory" value={profile.medicalHistory} onChange={handleChange} style={{ ...formStyles.input, height: "100px" }} placeholder="Any allergies, previous surgeries, or chronic conditions..." />
            ) : (
              <div style={{ ...formStyles.displayBox, minHeight: "80px" }}>{profile.medicalHistory || "No history provided."}</div>
            )}
          </div>
        </div>

        <div style={formStyles.buttonContainer}>
          {isEditing ? (
            <button type="submit" style={formStyles.submitBtn}>
              {isCreated ? "Update & Save" : "Create Profile"}
            </button>
          ) : (
            <button type="button" onClick={handleEdit} style={formStyles.editBtn}>
              Edit Details
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

const formStyles = {
  card: { padding: '20px' },
  header: { marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '10px' },
  title: { margin: 0, color: '#333', fontSize: '22px' },
  subtitle: { margin: '5px 0 0', color: '#777', fontSize: '14px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  field: { display: 'flex', flexDirection: 'column' },
  label: { marginBottom: '8px', fontWeight: 'bold', fontSize: '14px', color: '#555' },
  input: { padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '15px', outline: 'none' },
  displayBox: { padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '6px', border: '1px solid #eee', color: '#333', minHeight: '20px' },
  buttonContainer: { marginTop: '30px', display: 'flex', justifyContent: 'flex-end' },
  submitBtn: { padding: '12px 25px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
  editBtn: { padding: '12px 25px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }
};

export default PatientProfile;