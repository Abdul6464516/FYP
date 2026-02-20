import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getPatientProfile, updatePatientProfile } from '../../services/patientAction';
import { useUser } from '../../context/UserContext';

const PatientProfile = () => {
  const { updateUserContext } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Original profile from backend (to detect changes)
  const [originalProfile, setOriginalProfile] = useState(null);

  // Editable profile state
  const [profile, setProfile] = useState({
    fullName: '',
    age: '',
    gender: '',
    phone: '',
    medicalHistory: '',
  });

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getPatientProfile();
        const user = data.user;
        const fetched = {
          fullName: user.fullName || '',
          age: user.age || '',
          gender: user.gender || '',
          phone: user.phone || '',
          medicalHistory: user.medicalHistory || '',
        };
        setProfile(fetched);
        setOriginalProfile(fetched);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Detect changes whenever profile is edited
  useEffect(() => {
    if (!originalProfile) return;
    const changed =
      profile.fullName !== originalProfile.fullName ||
      String(profile.age) !== String(originalProfile.age) ||
      profile.gender !== originalProfile.gender ||
      profile.phone !== originalProfile.phone ||
      profile.medicalHistory !== originalProfile.medicalHistory;
    setHasChanges(changed);
  }, [profile, originalProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = await updatePatientProfile(profile);
      const user = data.user;
      const updated = {
        fullName: user.fullName || '',
        age: user.age || '',
        gender: user.gender || '',
        phone: user.phone || '',
        medicalHistory: user.medicalHistory || '',
      };
      setProfile(updated);
      setOriginalProfile(updated);
      setHasChanges(false);

      // Also update context with new data
      updateUserContext(updated);

      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={formStyles.card}>
        <p style={{ textAlign: 'center', color: '#777', padding: '40px 0' }}>Loading profile...</p>
      </div>
    );
  }

  return (
    <div style={formStyles.card}>
      <div style={formStyles.header}>
        <h2 style={formStyles.title}>Your Medical Profile</h2>
        <p style={formStyles.subtitle}>View and update your information below.</p>
      </div>

      <form onSubmit={handleUpdate}>
        <div style={formStyles.grid}>
          {/* Name Field */}
          <div style={formStyles.field}>
            <label style={formStyles.label}>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={profile.fullName}
              onChange={handleChange}
              style={formStyles.input}
              required
              placeholder="Enter full name"
            />
          </div>

          {/* Age Field */}
          <div style={formStyles.field}>
            <label style={formStyles.label}>Age</label>
            <input
              type="number"
              name="age"
              value={profile.age}
              onChange={handleChange}
              style={formStyles.input}
              placeholder="Enter age"
            />
          </div>

          {/* Gender Field */}
          <div style={formStyles.field}>
            <label style={formStyles.label}>Gender</label>
            <select
              name="gender"
              value={profile.gender}
              onChange={handleChange}
              style={formStyles.input}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Contact Field */}
          <div style={formStyles.field}>
            <label style={formStyles.label}>Contact Number</label>
            <input
              type="tel"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              style={formStyles.input}
              placeholder="+92 3xx xxxxxxx"
            />
          </div>

          {/* Medical History Field */}
          <div style={{ ...formStyles.field, gridColumn: 'span 2' }}>
            <label style={formStyles.label}>Medical History</label>
            <textarea
              name="medicalHistory"
              value={profile.medicalHistory}
              onChange={handleChange}
              style={{ ...formStyles.input, height: '100px', resize: 'vertical' }}
              placeholder="Any allergies, previous surgeries, or chronic conditions..."
            />
          </div>
        </div>

        <div style={formStyles.buttonContainer}>
          <button
            type="submit"
            disabled={!hasChanges || saving}
            style={{
              ...formStyles.updateBtn,
              opacity: !hasChanges || saving ? 0.5 : 1,
              cursor: !hasChanges || saving ? 'not-allowed' : 'pointer',
            }}
          >
            {saving ? 'Updating...' : 'Update Profile'}
          </button>
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
  buttonContainer: { marginTop: '30px', display: 'flex', justifyContent: 'flex-end' },
  updateBtn: { padding: '12px 25px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', transition: 'opacity 0.2s' },
};

export default PatientProfile;