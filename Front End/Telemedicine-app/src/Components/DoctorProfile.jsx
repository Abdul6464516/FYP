import React, { useState } from 'react';

const DoctorProfile = () => {
  const [isCreated, setIsCreated] = useState(false);
  const [isEditing, setIsEditing] = useState(true);

  const [profile, setProfile] = useState({
    name: '',
    specialization: '',
    qualification: '',
    experience: '',
    consultationFee: '',
    bio: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsCreated(true);
    setIsEditing(false);
    alert("Professional profile updated successfully!");
  };

  return (
    <div style={docStyles.card}>
      <div style={docStyles.header}>
        <h2 style={docStyles.title}>{isCreated ? "Professional Profile" : "Complete Your Doctor Profile"}</h2>
        <p style={docStyles.subtitle}>This information will be visible to patients looking for consultations.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={docStyles.grid}>
          <div style={docStyles.field}>
            <label style={docStyles.label}>Full Name (with Dr. prefix)</label>
            {isEditing ? (
              <input type="text" name="name" value={profile.name} onChange={handleChange} style={docStyles.input} required placeholder="Dr. John Smith" />
            ) : (
              <div style={docStyles.displayBox}>{profile.name}</div>
            )}
          </div>

          <div style={docStyles.field}>
            <label style={docStyles.label}>Specialization</label>
            {isEditing ? (
              <select name="specialization" value={profile.specialization} onChange={handleChange} style={docStyles.input} required>
                <option value="">Select Specialty</option>
                <option value="Cardiologist">Cardiologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="General Physician">General Physician</option>
                <option value="Pediatrician">Pediatrician</option>
              </select>
            ) : (
              <div style={docStyles.displayBox}>{profile.specialization}</div>
            )}
          </div>

          <div style={docStyles.field}>
            <label style={docStyles.label}>Qualifications</label>
            {isEditing ? (
              <input type="text" name="qualification" value={profile.qualification} onChange={handleChange} style={docStyles.input} required placeholder="MBBS, MD, FCPS" />
            ) : (
              <div style={docStyles.displayBox}>{profile.qualification}</div>
            )}
          </div>

          <div style={docStyles.field}>
            <label style={docStyles.label}>Experience (Years)</label>
            {isEditing ? (
              <input type="number" name="experience" value={profile.experience} onChange={handleChange} style={docStyles.input} required placeholder="e.g. 10" />
            ) : (
              <div style={docStyles.displayBox}>{profile.experience} Years</div>
            )}
          </div>

          <div style={docStyles.field}>
            <label style={docStyles.label}>Consultation Fee ($)</label>
            {isEditing ? (
              <input type="number" name="consultationFee" value={profile.consultationFee} onChange={handleChange} style={docStyles.input} required placeholder="e.log. 50" />
            ) : (
              <div style={docStyles.displayBox}>${profile.consultationFee}</div>
            )}
          </div>

          <div style={{ ...docStyles.field, gridColumn: "span 2" }}>
            <label style={docStyles.label}>Professional Bio</label>
            {isEditing ? (
              <textarea name="bio" value={profile.bio} onChange={handleChange} style={{ ...docStyles.input, height: "100px" }} placeholder="Briefly describe your expertise and achievements..." />
            ) : (
              <div style={{ ...docStyles.displayBox, minHeight: "80px" }}>{profile.bio || "No bio provided."}</div>
            )}
          </div>
        </div>

        <div style={docStyles.buttonContainer}>
          {isEditing ? (
            <button type="submit" style={docStyles.submitBtn}>Save Profile</button>
          ) : (
            <button type="button" onClick={() => setIsEditing(true)} style={docStyles.editBtn}>Edit Profile</button>
          )}
        </div>
      </form>
    </div>
  );
};

const docStyles = {
  card: { padding: '10px' },
  header: { marginBottom: '25px', borderBottom: '1px solid #eee', paddingBottom: '10px' },
  title: { margin: 0, color: '#007bff', fontSize: '20px' },
  subtitle: { margin: '5px 0 0', color: '#666', fontSize: '13px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  field: { display: 'flex', flexDirection: 'column' },
  label: { marginBottom: '5px', fontWeight: '600', fontSize: '14px', color: '#444' },
  input: { padding: '10px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '14px' },
  displayBox: { padding: '10px', backgroundColor: '#fcfcfc', borderRadius: '5px', border: '1px solid #f0f0f0', color: '#333' },
  buttonContainer: { marginTop: '20px', display: 'flex', justifyContent: 'flex-end' },
  submitBtn: { padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  editBtn: { padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }
};

export default DoctorProfile;