import api from './apiClient';

// Fetch all doctors with optional filters
export async function fetchDoctors({ search, specialty, gender } = {}) {
  try {
    const params = {};
    if (search) params.search = search;
    if (specialty && specialty !== 'All') params.specialty = specialty;
    if (gender && gender !== 'All') params.gender = gender;

    const res = await api.get('/doctor/list', { params });
    return res.data;
  } catch (err) {
    const msg = err?.response?.data?.message || err.message || 'Failed to fetch doctors';
    throw new Error(msg);
  }
}

// Fetch logged-in doctor's own profile
export async function getDoctorProfile() {
  try {
    const res = await api.get('/doctor/profile');
    return res.data;
  } catch (err) {
    const msg = err?.response?.data?.message || err.message || 'Failed to fetch profile';
    throw new Error(msg);
  }
}

// Update logged-in doctor's profile
export async function updateDoctorProfile(profileData) {
  try {
    const res = await api.put('/doctor/profile', profileData);
    return res.data;
  } catch (err) {
    const msg = err?.response?.data?.message || err.message || 'Failed to update profile';
    throw new Error(msg);
  }
}
