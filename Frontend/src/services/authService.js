// src/services/authService.js

// TEMPORARY fake login function
// Later this will call backend API using axios

export const login = (email, password, role) => {
  if (!email || !password) {
    return {
      success: false,
      message: "Email and password are required"
    };
  }

  return {
    success: true,
    token: "fake-jwt-token",
    role: role
  };
};

export const saveAuth = (token, role) => {
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
};

export const getRole = () => {
  return localStorage.getItem("role");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};
