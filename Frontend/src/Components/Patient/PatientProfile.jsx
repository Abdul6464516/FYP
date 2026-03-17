import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getPatientProfile, updatePatientProfile } from '../../services/patientAction';
import { useUser } from '../../context/UserContext';
import './PatientProfile.css';

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
      <div className="patient-profile-card">
        <p className="patient-profile-loading">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="patient-profile-card">
      <div className="patient-profile-header">
        <h2 className="patient-profile-title">Your Medical Profile</h2>
        <p className="patient-profile-subtitle">View and update your information below.</p>
      </div>

      <form onSubmit={handleUpdate}>
        <div className="patient-profile-grid">
          {/* Name Field */}
          <div className="patient-profile-field">
            <label className="patient-profile-label">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={profile.fullName}
              onChange={handleChange}
              className="patient-profile-input"
              required
              placeholder="Enter full name"
            />
          </div>

          {/* Age Field */}
          <div className="patient-profile-field">
            <label className="patient-profile-label">Age</label>
            <input
              type="number"
              name="age"
              value={profile.age}
              onChange={handleChange}
              className="patient-profile-input"
              placeholder="Enter age"
            />
          </div>

          {/* Gender Field */}
          <div className="patient-profile-field">
            <label className="patient-profile-label">Gender</label>
            <select
              name="gender"
              value={profile.gender}
              onChange={handleChange}
              className="patient-profile-input"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Contact Field */}
          <div className="patient-profile-field">
            <label className="patient-profile-label">Contact Number</label>
            <input
              type="tel"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              className="patient-profile-input"
              placeholder="+92 3xx xxxxxxx"
            />
          </div>

          {/* Medical History Field */}
          <div className="patient-profile-field patient-profile-medical-history">
            <label className="patient-profile-label">Medical History</label>
            <textarea
              name="medicalHistory"
              value={profile.medicalHistory}
              onChange={handleChange}
              className="patient-profile-textarea"
              placeholder="Any allergies, previous surgeries, or chronic conditions..."
            />
          </div>
        </div>

        <div className="patient-profile-button-container">
          <button
            type="submit"
            disabled={!hasChanges || saving}
            className="patient-profile-update-btn"
          >
            {saving ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientProfile;