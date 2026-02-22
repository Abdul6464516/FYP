import React, { useState, useEffect } from 'react';
import { getDoctorProfile, updateDoctorProfile } from '../../services/doctorAction';
import { useUser } from '../../context/UserContext';
import { toast } from 'react-toastify';

const DoctorProfile = () => {
  const { updateUserContext } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [original, setOriginal] = useState(null);

  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    username: '',
    gender: '',
    phone: '',
    specialty: '',
    qualifications: '',
    yearsOfExperience: '',
    availability: '',
    chargesPerSession: '',
    city: '',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getDoctorProfile();
        const u = data.user;
        const fields = {
          fullName: u.fullName || '',
          email: u.email || '',
          username: u.username || '',
          gender: u.gender || '',
          phone: u.phone || '',
          specialty: u.specialty || '',
          qualifications: u.qualifications || '',
          yearsOfExperience: u.yearsOfExperience ?? '',
          availability: u.availability || '',
          chargesPerSession: u.chargesPerSession ?? '',
          city: u.city || '',
        };
        setProfile(fields);
        setOriginal(fields);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Check if any field changed from original
  const hasChanges = original && Object.keys(profile).some(
    (key) => String(profile[key]) !== String(original[key])
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        fullName: profile.fullName,
        gender: profile.gender,
        phone: profile.phone,
        specialty: profile.specialty,
        qualifications: profile.qualifications,
        yearsOfExperience: profile.yearsOfExperience,
        availability: profile.availability,
        chargesPerSession: profile.chargesPerSession,
        city: profile.city,
      };
      const data = await updateDoctorProfile(payload);
      const u = data.user;
      const fields = {
        fullName: u.fullName || '',
        email: u.email || '',
        username: u.username || '',
        gender: u.gender || '',
        phone: u.phone || '',
        specialty: u.specialty || '',
        qualifications: u.qualifications || '',
        yearsOfExperience: u.yearsOfExperience ?? '',
        availability: u.availability || '',
        chargesPerSession: u.chargesPerSession ?? '',
        city: u.city || '',
      };
      setProfile(fields);
      setOriginal(fields);
      updateUserContext(u);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>Loading profile...</div>;
  }

  return (
    <div style={docStyles.card}>
      <div style={docStyles.header}>
        <h2 style={docStyles.title}>Professional Profile</h2>
        <p style={docStyles.subtitle}>This information will be visible to patients looking for consultations.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={docStyles.grid}>
          {/* Full Name */}
          <div style={docStyles.field}>
            <label style={docStyles.label}>Full Name</label>
            <input type="text" name="fullName" value={profile.fullName} onChange={handleChange} style={docStyles.input} required placeholder="Dr. John Smith" />
          </div>

          {/* Email (read-only) */}
          <div style={docStyles.field}>
            <label style={docStyles.label}>Email</label>
            <input type="email" value={profile.email} disabled style={{ ...docStyles.input, backgroundColor: '#f3f4f6', cursor: 'not-allowed' }} />
          </div>

          {/* Username (read-only) */}
          <div style={docStyles.field}>
            <label style={docStyles.label}>Username</label>
            <input type="text" value={profile.username} disabled style={{ ...docStyles.input, backgroundColor: '#f3f4f6', cursor: 'not-allowed' }} />
          </div>

          {/* Gender */}
          <div style={docStyles.field}>
            <label style={docStyles.label}>Gender</label>
            <select name="gender" value={profile.gender} onChange={handleChange} style={docStyles.input}>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Phone */}
          <div style={docStyles.field}>
            <label style={docStyles.label}>Phone</label>
            <input type="tel" name="phone" value={profile.phone} onChange={handleChange} style={docStyles.input} placeholder="e.g. +1234567890" />
          </div>

          {/* Specialty */}
          <div style={docStyles.field}>
            <label style={docStyles.label}>Specialty</label>
            <input type="text" name="specialty" value={profile.specialty} onChange={handleChange} style={docStyles.input} placeholder="e.g. Cardiology" />
          </div>

          {/* Qualifications */}
          <div style={docStyles.field}>
            <label style={docStyles.label}>Qualifications</label>
            <input type="text" name="qualifications" value={profile.qualifications} onChange={handleChange} style={docStyles.input} placeholder="e.g. MBBS, MD" />
          </div>

          {/* Years of Experience */}
          <div style={docStyles.field}>
            <label style={docStyles.label}>Years of Experience</label>
            <input type="number" name="yearsOfExperience" value={profile.yearsOfExperience} onChange={handleChange} style={docStyles.input} placeholder="e.g. 10" />
          </div>

          {/* Availability */}
          <div style={docStyles.field}>
            <label style={docStyles.label}>Availability</label>
            <input type="text" name="availability" value={profile.availability} onChange={handleChange} style={docStyles.input} placeholder="e.g. Mon-Fri 9:00-14:00" />
          </div>

          {/* Charges Per Session */}
          <div style={docStyles.field}>
            <label style={docStyles.label}>Charges Per Session ($)</label>
            <input type="number" name="chargesPerSession" value={profile.chargesPerSession} onChange={handleChange} style={docStyles.input} placeholder="e.g. 2000" />
          </div>

          {/* City */}
          <div style={docStyles.field}>
            <label style={docStyles.label}>City</label>
            <input type="text" name="city" value={profile.city} onChange={handleChange} style={docStyles.input} placeholder="e.g. Lahore" />
          </div>
        </div>

        <div style={docStyles.buttonContainer}>
          <button
            type="submit"
            style={{
              ...docStyles.submitBtn,
              ...((!hasChanges || saving) ? docStyles.disabledBtn : {}),
            }}
            disabled={!hasChanges || saving}
          >
            {saving ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

const docStyles = {
  card: { padding: '10px' },
  header: { marginBottom: '25px', borderBottom: '1px solid #eee', paddingBottom: '10px' },
  title: { margin: 0, color: '#28a745', fontSize: '20px' },
  subtitle: { margin: '5px 0 0', color: '#666', fontSize: '13px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  field: { display: 'flex', flexDirection: 'column' },
  label: { marginBottom: '5px', fontWeight: '600', fontSize: '14px', color: '#444' },
  input: { padding: '10px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' },
  buttonContainer: { marginTop: '20px', display: 'flex', justifyContent: 'flex-end' },
  submitBtn: { padding: '10px 24px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: '600', fontSize: '15px', transition: '0.2s' },
  disabledBtn: { backgroundColor: '#a3d9b1', cursor: 'not-allowed', opacity: 0.7 },
};

export default DoctorProfile;