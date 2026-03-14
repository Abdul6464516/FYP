import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, User, Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import { getAdminProfile, updateAdminProfile } from '../../services/adminActions';

const AdminProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    username: '',
    phone: '',
    city: '',
  });

  const [originalProfile, setOriginalProfile] = useState({});

  // Fetch admin profile on component mount
  useEffect(() => {
    fetchAdminProfile();
  }, []);

  // Detect changes whenever profile is edited
  useEffect(() => {
    if (!originalProfile || !Object.keys(originalProfile).length) return;
    const changed =
      profile.fullName !== originalProfile.fullName ||
      profile.phone !== originalProfile.phone ||
      profile.city !== originalProfile.city;
    setHasChanges(changed);
  }, [profile, originalProfile]);

  const fetchAdminProfile = async () => {
    try {
      setLoading(true);
      const adminData = await getAdminProfile();
      setProfile({
        fullName: adminData.fullName || '',
        email: adminData.email || '',
        username: adminData.username || '',
        phone: adminData.phone || '',
        city: adminData.city || '',
      });
      setOriginalProfile({
        fullName: adminData.fullName || '',
        email: adminData.email || '',
        username: adminData.username || '',
        phone: adminData.phone || '',
        city: adminData.city || '',
      });
    } catch (err) {
      toast.error(err.message || 'Failed to load admin profile', {
        position: 'top-right',
        autoClose: 3000,
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedProfile = { ...profile, [name]: value };
    setProfile(updatedProfile);
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: '' });
    }
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{11}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = {};
    
    // Validate full name
    if (!profile.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }

    // Validate phone
    if (!profile.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!validatePhone(profile.phone)) {
      errors.phone = 'Phone number must be exactly 11 digits';
    }

    // Validate city
    if (!profile.city.trim()) {
      errors.city = 'City is required';
    }

    // If there are errors, set them and return
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setSaving(true);

    try {
      await updateAdminProfile(profile);
      setOriginalProfile({ ...profile });
      setHasChanges(false);
      toast.success('Admin profile updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      toast.error(err.message || 'Failed to update admin profile', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={adminStyles.container}>
        <div style={adminStyles.loadingMessage}>Loading admin profile...</div>
      </div>
    );
  }

  return (
    <div style={adminStyles.container}>
      <div style={adminStyles.header}>
        <h2 style={adminStyles.title}>Administrator Profile</h2>
        <p style={adminStyles.subtitle}>Manage your administrator account information and details.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={adminStyles.grid}>
          <div style={adminStyles.field}>
            <label style={adminStyles.label}>Full Name</label>
            <div style={{
              ...adminStyles.inputWrap,
              borderColor: fieldErrors.fullName ? '#dc2626' : '#d1d5db',
            }}>
              <User size={18} color={fieldErrors.fullName ? '#dc2626' : '#16a34a'} />
              <input
                type="text"
                name="fullName"
                value={profile.fullName}
                onChange={handleChange}
                style={adminStyles.input}
                required
                placeholder="Enter your full name"
              />
            </div>
            {fieldErrors.fullName && <p style={adminStyles.fieldError}>{fieldErrors.fullName}</p>}
          </div>

          <div style={adminStyles.field}>
            <label style={adminStyles.label}>Email Address</label>
            <div style={adminStyles.displayBoxReadOnly}>
              <Mail size={16} color="#9ca3af" />
              <span>{profile.email}</span>
            </div>
            <p style={adminStyles.readOnlyText}>Email cannot be changed</p>
          </div>

          <div style={adminStyles.field}>
            <label style={adminStyles.label}>Username</label>
            <div style={adminStyles.displayBoxReadOnly}>
              <Lock size={16} color="#9ca3af" />
              <span>{profile.username}</span>
            </div>
            <p style={adminStyles.readOnlyText}>Username cannot be changed</p>
          </div>

          <div style={adminStyles.field}>
            <label style={adminStyles.label}>Phone Number</label>
            <div style={{
              ...adminStyles.inputWrap,
              borderColor: fieldErrors.phone ? '#dc2626' : '#d1d5db',
            }}>
              <Phone size={18} color={fieldErrors.phone ? '#dc2626' : '#16a34a'} />
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                style={adminStyles.input}
                placeholder="e.g. 03001234567"
                required
              />
            </div>
            {fieldErrors.phone && <p style={adminStyles.fieldError}>{fieldErrors.phone}</p>}
          </div>

          <div style={adminStyles.field}>
            <label style={adminStyles.label}>City</label>
            <div style={{
              ...adminStyles.inputWrap,
              borderColor: fieldErrors.city ? '#dc2626' : '#d1d5db',
            }}>
              <MapPin size={18} color={fieldErrors.city ? '#dc2626' : '#16a34a'} />
              <input
                type="text"
                name="city"
                value={profile.city}
                onChange={handleChange}
                style={adminStyles.input}
                placeholder="Enter your city"
                required
              />
            </div>
            {fieldErrors.city && <p style={adminStyles.fieldError}>{fieldErrors.city}</p>}
          </div>

          <div style={adminStyles.field}>
            <label style={adminStyles.label}>Role</label>
            <div style={adminStyles.displayBox}>System Administrator</div>
          </div>
        </div>

        <div style={adminStyles.btnContainer}>
          <button 
            type="submit" 
            disabled={!hasChanges || saving}
            style={{
              ...adminStyles.submitBtn,
              opacity: !hasChanges || saving ? 0.6 : 1,
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

const adminStyles = {
  container: { padding: '10px' },
  header: { marginBottom: '25px', borderBottom: '2px solid #16a34a', paddingBottom: '10px' },
  title: { margin: 0, color: '#333', fontSize: '20px' },
  subtitle: { margin: '5px 0 0', color: '#666', fontSize: '14px' },
  grid: { 
    display: 'grid', 
    gridTemplateColumns: '1fr 1fr', 
    gap: '20px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: '16px',
    },
  },
  field: { display: 'flex', flexDirection: 'column' },
  label: { marginBottom: '8px', fontWeight: 'bold', fontSize: '13px', color: '#444' },
  inputWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 14px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '14px',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  },
  input: {
    flex: 1,
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    padding: '0',
    fontSize: '14px',
    fontFamily: 'inherit',
    color: '#333',
  },
  displayBox: {
    padding: '12px',
    backgroundColor: '#f4f4f4',
    borderRadius: '6px',
    border: '1px solid #eee',
    color: '#333',
    fontSize: '14px',
  },
  displayBoxReadOnly: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 14px',
    backgroundColor: '#f9fafb',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    color: '#6b7280',
    fontSize: '14px',
  },
  readOnlyText: {
    fontSize: '12px',
    color: '#9ca3af',
    marginTop: '4px',
  },
  fieldError: {
    marginTop: '6px',
    color: '#dc2626',
    fontSize: '12px',
    fontWeight: '500',
  },
  errorMessage: {
    padding: '12px 16px',
    backgroundColor: '#fee2e2',
    border: '1px solid #fca5a5',
    borderRadius: '6px',
    color: '#991b1b',
    marginBottom: '20px',
    fontSize: '14px',
  },
  successMessage: {
    padding: '12px 16px',
    backgroundColor: '#dcfce7',
    border: '1px solid #86efac',
    borderRadius: '6px',
    color: '#166534',
    marginBottom: '20px',
    fontSize: '14px',
  },
  loadingMessage: {
    padding: '20px',
    textAlign: 'center',
    color: '#666',
    fontSize: '14px',
  },
  btnContainer: { 
    marginTop: '25px', 
    display: 'flex', 
    gap: '12px', 
    justifyContent: 'flex-end',
    '@media (max-width: 768px)': {
      justifyContent: 'stretch',
      flexDirection: 'column',
    },
  },
  submitBtn: {
    padding: '12px 24px',
    backgroundColor: '#16a34a',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background 0.2s',
  },
  editBtn: {
    padding: '12px 24px',
    backgroundColor: '#16a34a',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background 0.2s',
  },
  cancelBtn: {
    padding: '12px 24px',
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background 0.2s',
  },
};

export default AdminProfile;