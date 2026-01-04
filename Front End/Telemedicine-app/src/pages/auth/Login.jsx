import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "patient",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const extractedName = formData.email.split("@")[0];
    const displayName = extractedName.charAt(0).toUpperCase() + extractedName.slice(1);

    localStorage.setItem("userEmail", formData.email);
    localStorage.setItem("userRole", formData.role);
    localStorage.setItem("userName", displayName);
    localStorage.setItem("isLoggedIn", "true");

    if (formData.role === "patient") {
      navigate("/patient");
    } else if (formData.role === "doctor") {
      navigate("/doctor");
    } else if (formData.role === "admin") {
      navigate("/admin");
    }
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  // Function to handle forgot password click
  const handleForgotPassword = () => {
    navigate("/forgot-password"); 
    // alert("Redirecting to password reset page...");
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleLogin}>
        <h2 style={styles.title}>Login</h2>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="example@mail.com"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <div style={styles.labelWrapper}>
            <label style={styles.label}>Password</label>
            {/* Added Forgot Password Link */}
            <span 
              onClick={handleForgotPassword} 
              style={styles.forgotLink}
            >
              Forgot password?
            </span>
          </div>
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

        <button type="submit" style={styles.loginBtn}>
          Sign In
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
  // Added wrapper to align label and link
  labelWrapper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#555",
  },
  // Style for the new link
  forgotLink: {
    fontSize: "12px",
    color: "#007bff",
    cursor: "pointer",
    fontWeight: "500",
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
};

export default Login;