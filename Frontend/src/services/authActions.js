import api from './apiClient';

export async function registerUser(userData) {
  try {
    const res = await api.post('/auth/register', userData);
    return res.data;
  } catch (err) {
    const msg = err?.response?.data?.message || err.message || 'Registration failed';
    throw new Error(msg);
  }
}

export async function loginUser(credentials) {
  try {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  } catch (err) {
    const msg = err?.response?.data?.message || err.message || 'Login failed';
    throw new Error(msg);
  }
}

export async function fetchCurrentUser() {
  try {
    const res = await api.get('/auth/me');
    return res.data;
  } catch (err) {
    const msg = err?.response?.data?.message || err.message || 'Unauthorized';
    throw new Error(msg);
  }
}
