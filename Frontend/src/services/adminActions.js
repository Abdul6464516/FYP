import  api  from './apiClient';


export const getAdminProfile = async () => {
  try {
    const response = await api.get('/admin/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    throw error.response?.data || { message: 'Failed to fetch admin profile' };
  }
};


export const updateAdminProfile = async (profileData) => {
  try {
    const response = await api.put('/admin/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating admin profile:', error);
    throw error.response?.data || { message: 'Failed to update admin profile' };
  }
};


export const getAllAdmins = async () => {
  try {
    const response = await api.get('/admin/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching admins:', error);
    throw error.response?.data || { message: 'Failed to fetch admins' };
  }
};

export const getAdminById = async (adminId) => {
  try {
    const response = await api.get(`/admin/${adminId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching admin:', error);
    throw error.response?.data || { message: 'Failed to fetch admin' };
  }
};


export const createAdmin = async (adminData) => {
  try {
    const response = await api.post('/admin/create', adminData);
    return response.data;
  } catch (error) {
    console.error('Error creating admin:', error);
    throw error.response?.data || { message: 'Failed to create admin' };
  }
};


export const deleteAdmin = async (adminId) => {
  try {
    const response = await api.delete(`/admin/${adminId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting admin:', error);
    throw error.response?.data || { message: 'Failed to delete admin' };
  }
};


// Get all pending doctors for verification
export const getPendingDoctors = async () => {
  try {
    const response = await api.get('/admin/verification/pending-doctors');
    return response.data;
  } catch (error) {
    console.error('Error fetching pending doctors:', error);
    throw error.response?.data || { message: 'Failed to fetch pending doctors' };
  }
};


// Get all pending patients for verification
export const getPendingPatients = async () => {
  try {
    const response = await api.get('/admin/verification/pending-patients');
    return response.data;
  } catch (error) {
    console.error('Error fetching pending patients:', error);
    throw error.response?.data || { message: 'Failed to fetch pending patients' };
  }
};


// Verify a doctor or patient
export const verifyUser = async (userId) => {
  try {
    const response = await api.put(`/admin/verification/verify/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error verifying user:', error);
    throw error.response?.data || { message: 'Failed to verify user' };
  }
};


// Reject a doctor or patient
export const rejectUser = async (userId, reason = '') => {
  try {
    const response = await api.put(`/admin/verification/reject/${userId}`, { reason });
    return response.data;
  } catch (error) {
    console.error('Error rejecting user:', error);
    throw error.response?.data || { message: 'Failed to reject user' };
  }
};


// Get all doctors with all verification statuses
export const getAllDoctors = async () => {
  try {
    const response = await api.get('/admin/verification/all-doctors');
    return response.data;
  } catch (error) {
    console.error('Error fetching all doctors:', error);
    throw error.response?.data || { message: 'Failed to fetch all doctors' };
  }
};


// Get all patients with all verification statuses
export const getAllPatients = async () => {
  try {
    const response = await api.get('/admin/verification/all-patients');
    return response.data;
  } catch (error) {
    console.error('Error fetching all patients:', error);
    throw error.response?.data || { message: 'Failed to fetch all patients' };
  }
};
