import React, { useState } from 'react';

const AdminProfile = () => {
  const [isCreated, setIsCreated] = useState(false);
  const [isEditing, setIsEditing] = useState(true);

  const [profile, setProfile] = useState({
    fullName: '',
    adminId: '',
    department: '',
    email: '',
    accessLevel: 'Super Admin',
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
    alert("Admin Profile saved successfully!");
  };

  return (
    <div style={adminStyles.container}>
      <div style={adminStyles.header}>
        <h2 style={adminStyles.title}>{isCreated ? "Administrator Profile" : "Set Up Admin Profile"}</h2>
        <p style={adminStyles.subtitle}>Manage your system identity and administrative credentials.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={adminStyles.grid}>
          <div style={adminStyles.field}>
            <label style={adminStyles.label}>Full Name</label>
            {isEditing ? (
              <input type="text" name="fullName" value={profile.fullName} onChange={handleChange} style={adminStyles.input} required placeholder="Enter your name" />
            ) : (
              <div style={adminStyles.displayBox}>{profile.fullName}</div>
            )}
          </div>

          <div style={adminStyles.field}>
            <label style={adminStyles.label}>Admin Employee ID</label>
            {isEditing ? (
              <input type="text" name="adminId" value={profile.adminId} onChange={handleChange} style={adminStyles.input} required placeholder="ADM-101" />
            ) : (
              <div style={adminStyles.displayBox}>{profile.adminId}</div>
            )}
          </div>

          <div style={adminStyles.field}>
            <label style={adminStyles.label}>Department</label>
            {isEditing ? (
              <select name="department" value={profile.department} onChange={handleChange} style={adminStyles.input} required>
                <option value="">Select Department</option>
                <option value="IT Operations">IT Operations</option>
                <option value="Management">Management</option>
                <option value="Security">Security</option>
                <option value="Support">Customer Support</option>
              </select>
            ) : (
              <div style={adminStyles.displayBox}>{profile.department}</div>
            )}
          </div>

          <div style={adminStyles.field}>
            <label style={adminStyles.label}>Access Level</label>
            {isEditing ? (
              <select name="accessLevel" value={profile.accessLevel} onChange={handleChange} style={adminStyles.input}>
                <option value="Super Admin">Super Admin</option>
                <option value="Manager">Manager</option>
                <option value="Moderator">Moderator</option>
              </select>
            ) : (
              <div style={adminStyles.displayBox}>{profile.accessLevel}</div>
            )}
          </div>

          <div style={{ ...adminStyles.field, gridColumn: "span 2" }}>
            <label style={adminStyles.label}>System Bio / Responsibility Notes</label>
            {isEditing ? (
              <textarea name="bio" value={profile.bio} onChange={handleChange} style={{ ...adminStyles.input, height: "100px" }} placeholder="Describe your primary responsibilities within the system..." />
            ) : (
              <div style={adminStyles.displayBox}>{profile.bio || "No responsibility notes added."}</div>
            )}
          </div>
        </div>

        <div style={adminStyles.btnContainer}>
          {isEditing ? (
            <button type="submit" style={adminStyles.submitBtn}>Save Admin Details</button>
          ) : (
            <button type="button" onClick={() => setIsEditing(true)} style={adminStyles.editBtn}>Edit Details</button>
          )}
        </div>
      </form>
    </div>
  );
};

const adminStyles = {
  container: { padding: '10px' },
  header: { marginBottom: '25px', borderBottom: '2px solid #007bff', paddingBottom: '10px' },
  title: { margin: 0, color: '#333', fontSize: '20px' },
  subtitle: { margin: '5px 0 0', color: '#666', fontSize: '14px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  field: { display: 'flex', flexDirection: 'column' },
  label: { marginBottom: '8px', fontWeight: 'bold', fontSize: '13px', color: '#444' },
  input: { padding: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' },
  displayBox: { padding: '12px', backgroundColor: '#f4f4f4', borderRadius: '6px', border: '1px solid #eee', color: '#333' },
  btnContainer: { marginTop: '25px', display: 'flex', justifyContent: 'flex-end' },
  submitBtn: { padding: '12px 24px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  editBtn: { padding: '12px 24px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }
};

export default AdminProfile;