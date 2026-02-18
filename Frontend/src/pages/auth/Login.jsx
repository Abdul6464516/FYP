import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authActions";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    role: "patient",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await loginUser({
        identifier: formData.identifier,
        password: formData.password,
      });

      // Verify selected role matches backend role
      if (data.user.role !== formData.role) {
        setError(`You are registered as a ${data.user.role}, not a ${formData.role}. Please select the correct role.`);
        setLoading(false);
        return;
      }

      // Save the session data to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('userEmail', data.user.email);
      localStorage.setItem('userRole', data.user.role);
      localStorage.setItem('userName', data.user.fullName);
      localStorage.setItem('isLoggedIn', 'true');

      console.log('Login successful for:', data.user.fullName);

      // Show success toast
      toast.success(`Welcome back, ${data.user.fullName}!`);

      // Navigate based on selected role after a short delay
      setTimeout(() => {
        if (formData.role === 'patient') {
          navigate('/patient');
        } else if (formData.role === 'doctor') {
          navigate('/doctor');
        } else if (formData.role === 'admin') {
          navigate('/admin');
        }
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleLogin}>
        <h2 style={styles.title}>Login</h2>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.inputGroup}>
          <label style={styles.label}>Email or Username</label>
          <input
            type="text"
            name="identifier"
            placeholder="Email or username"
            value={formData.identifier}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Login As</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button type="submit" style={styles.loginBtn} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <div style={styles.divider}>
          <span style={styles.dividerText}>OR</span>
        </div>

        <button
          type="button"
          style={styles.signupBtn}
          onClick={handleSignup}
        >
          Create New Account
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f6f8",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  form: {
    width: "380px",
    padding: "40px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "28px",
    color: "#333",
    fontWeight: "bold",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
  },
  loginBtn: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  divider: {
    textAlign: "center",
    margin: "20px 0",
    borderBottom: "1px solid #eee",
    lineHeight: "0.1em",
  },
  dividerText: {
    backgroundColor: "#fff",
    padding: "0 10px",
    color: "#aaa",
    fontSize: "12px",
  },
  signupBtn: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '10px 14px',
    borderRadius: '8px',
    marginBottom: '15px',
    fontSize: '14px',
  },
};

export default Login;