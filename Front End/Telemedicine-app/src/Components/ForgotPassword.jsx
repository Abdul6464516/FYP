import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would normally call your API to send the reset email
    console.log("Password reset link sent to:", email);
    setIsSubmitted(true);
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        {!isSubmitted ? (
          <>
            <button onClick={() => navigate("/")} style={styles.backBtn}>
              <ArrowLeft size={18} /> Back to Login
            </button>
            
            <h2 style={styles.title}>Reset Password</h2>
            <p style={styles.subtitle}>
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Email Address</label>
                <div style={styles.inputWrapper}>
                  <Mail size={18} style={styles.icon} />
                  <input
                    type="email"
                    placeholder="example@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={styles.input}
                  />
                </div>
              </div>

              <button type="submit" style={styles.resetBtn}>
                Send Reset Link
              </button>
            </form>
          </>
        ) : (
          <div style={styles.successContainer}>
            <CheckCircle size={60} color="#28a745" />
            <h2 style={styles.title}>Check your email</h2>
            <p style={styles.subtitle}>
              We've sent a password reset link to <strong>{email}</strong>. 
              Please check your inbox and follow the instructions.
            </p>
            <button onClick={() => navigate("/")} style={styles.resetBtn}>
              Return to Login
            </button>
          </div>
        )}
      </div>
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
    padding: "20px"
  },
  formCard: {
    width: "100%",
    maxWidth: "400px",
    padding: "40px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
  },
  backBtn: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    background: "none",
    border: "none",
    color: "#666",
    cursor: "pointer",
    fontSize: "14px",
    marginBottom: "20px",
    padding: "0"
  },
  title: {
    fontSize: "24px",
    color: "#333",
    fontWeight: "bold",
    marginBottom: "10px",
    textAlign: "center"
  },
  subtitle: {
    fontSize: "14px",
    color: "#666",
    textAlign: "center",
    marginBottom: "30px",
    lineHeight: "1.5"
  },
  inputGroup: {
    marginBottom: "25px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#555",
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center"
  },
  icon: {
    position: "absolute",
    left: "12px",
    color: "#aaa"
  },
  input: {
    width: "100%",
    padding: "12px 12px 12px 40px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
  },
  resetBtn: {
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
  successContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center"
  }
};

export default ForgotPassword;