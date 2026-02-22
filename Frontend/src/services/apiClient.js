import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token from localStorage to every request if present
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch (err) {
<<<<<<< HEAD
    console.log("error ",err)
=======
    console.log("error",err)
>>>>>>> aa52f11851a34ca6a11e92ed6e6a4981dabc374a
  }
  return config;
});

export default api;
