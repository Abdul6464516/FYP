import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({ new: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert("Passwords do not match!");
      return;
    }
    // API Call would go here: updatePassword(token, passwords.new)
    console.log("Password updated successfully");
    setIsSuccess(true);
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        {!isSuccess ? (
          <>
            <h2 style={styles.title}>Create New Password</h2>
            <p style={styles.subtitle}>Your new password must be different from previous passwords.</p>

            <form onSubmit={handleSubmit}>
              {/* New Password Field */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>New Password</label>
                <div style={styles.inputWrapper}>
                  <Lock size={18} style={styles.icon} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="new"
                    placeholder="At least 8 characters"
                    value={passwords.new}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                  />
                  <div style={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </div>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>Confirm Password</label>
                <div style={styles.inputWrapper}>
                  <Lock size={18} style={styles.icon} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirm"
                    placeholder="Repeat password"
                    value={passwords.confirm}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                  />
                </div>
              </div>

              <button type="submit" style={styles.resetBtn}>Reset Password</button>
            </form>
          </>
        ) : (
          <div style={styles.successContainer}>
            <CheckCircle size={60} color="#28a745" />
            <h2 style={styles.title}>Password Changed!</h2>
            <p style={styles.subtitle}>Your password has been reset successfully. You can now log in with your new password.</p>
            <button onClick={() => navigate("/")} style={styles.resetBtn}>Back to Login</button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f4f6f8", fontFamily: "Arial, sans-serif", padding: "20px" },
  formCard: { width: "100%", maxWidth: "400px", padding: "40px", backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" },
  title: { fontSize: "24px", color: "#333", fontWeight: "bold", marginBottom: "10px", textAlign: "center" },
  subtitle: { fontSize: "14px", color: "#666", textAlign: "center", marginBottom: "30px" },
  inputGroup: { marginBottom: "20px" },
  label: { display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#555" },
  inputWrapper: { position: "relative", display: "flex", alignItems: "center" },
  icon: { position: "absolute", left: "12px", color: "#aaa" },
  eyeIcon: { position: "absolute", right: "12px", color: "#aaa", cursor: "pointer" },
  input: { width: "100%", padding: "12px 40px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "15px", boxSizing: "border-box" },
  resetBtn: { width: "100%", padding: "14px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" },
  successContainer: { display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }
};

export default ResetPassword;