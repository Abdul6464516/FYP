import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authActions";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { useUser } from "../../context/UserContext";

const SignUp = () => {
  const navigate = useNavigate();
  const { loginUserContext } = useUser();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    role: "patient",
    // patient fields
    age: "",
    gender: "",
    phone: "",
    medicalHistory: "",
    // doctor fields
    specialty: "",
    qualifications: "",
    yearsOfExperience: "",
    availability: "",
    chargesPerSession: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Reset gender when role changes so dropdown resets properly
    if (name === 'role') {
      setFormData({ ...formData, role: value, gender: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Build payload based on role
      const payload = {
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      if (formData.role === 'patient') {
        payload.age = formData.age;
        payload.gender = formData.gender;
        payload.phone = formData.phone;
        payload.medicalHistory = formData.medicalHistory;
      }

      if (formData.role === 'doctor') {
        payload.gender = formData.gender;
        payload.specialty = formData.specialty;
        payload.qualifications = formData.qualifications;
        payload.yearsOfExperience = formData.yearsOfExperience;
        payload.availability = formData.availability;
        payload.chargesPerSession = formData.chargesPerSession;
      }

      const data = await registerUser(payload);

      // Store user data in context (replaces all localStorage calls)
      loginUserContext(data.token, data.user);

      // Show success toast and navigate after a short delay
      toast.success(`${formData.username} has created account`);

      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSignup}>
        <h2 style={styles.title}>Sign Up</h2>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.inputGroup}>
          <label style={styles.label}>Full Name</label>
          <input
            type="text"
            name="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Username</label>
          <input
            type="text"
            name="username"
            placeholder="Choose a username"
            value={formData.username}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Password</label>
          <div style={styles.passwordContainer}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.passwordInput}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Register As</label>
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

        {formData.role === 'patient' && (
          <>
            <div style={styles.row}>
              <div style={{ ...styles.inputGroup, ...styles.half }}>
                <label style={styles.label}>Age</label>
                <input
                  type="number"
                  name="age"
                  placeholder="e.g. 29"
                  value={formData.age}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={{ ...styles.inputGroup, ...styles.half }}>
                <label style={styles.label}>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} style={styles.input}>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div style={styles.row}>
              <div style={{ ...styles.inputGroup, ...styles.half }}>
                <label style={styles.label}>Contact Number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="e.g. +1234567890"
                  value={formData.phone}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={{ ...styles.inputGroup, ...styles.half }}>
                <label style={styles.label}>Medical History (optional)</label>
                <textarea
                  name="medicalHistory"
                  placeholder="Brief medical history or conditions"
                  value={formData.medicalHistory}
                  onChange={handleChange}
                  style={{ ...styles.input, height: '80px' }}
                />
              </div>
            </div>
          </>
        )}

        {formData.role === 'doctor' && (
          <>
            <div style={styles.row}>
              <div style={{ ...styles.inputGroup, ...styles.half }}>
                <label style={styles.label}>Specialty</label>
                <input
                  type="text"
                  name="specialty"
                  placeholder="e.g. Cardiology"
                  value={formData.specialty}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={{ ...styles.inputGroup, ...styles.half }}>
                <label style={styles.label}>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} style={styles.input}>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Qualifications</label>
              <input
                type="text"
                name="qualifications"
                placeholder="e.g. MBBS, MD"
                value={formData.qualifications}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Years of Experience</label>
              <input
                type="number"
                name="yearsOfExperience"
                placeholder="e.g. 5"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.row}>
              <div style={{ ...styles.inputGroup, ...styles.half }}>
                <label style={styles.label}>Availability (brief)</label>
                <input
                  type="text"
                  name="availability"
                  placeholder="e.g. Mon-Fri 9:00-14:00"
                  value={formData.availability}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={{ ...styles.inputGroup, ...styles.half }}>
                <label style={styles.label}>Charges Per Session (Rs)</label>
                <input
                  type="number"
                  name="chargesPerSession"
                  placeholder="e.g. 2000"
                  value={formData.chargesPerSession}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
            </div>
          </>
        )}

        <button type="submit" style={styles.signupBtn} disabled={loading}>
          {loading ? 'Creating...' : 'Create Account'}
        </button>

        <button
          type="button"
          style={styles.loginBtn}
          onClick={() => navigate("/")}
        >
          Back to Login
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
    width: "540px",
    maxWidth: '95%',
    padding: "32px",
    background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(250,250,255,0.95))",
    borderRadius: "14px",
    boxShadow: "0 15px 40px rgba(20,30,60,0.12)",
    border: '1px solid rgba(0,0,0,0.04)',
  },
  title: {
    textAlign: "center",
    marginBottom: "18px",
    fontSize: "28px",
    fontWeight: "800",
    color: "#28a745",
    background: 'linear-gradient(90deg,#6a8cff,#00d4ff)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
   
  },
  inputGroup: {
    marginBottom: "15px",
  },
  passwordContainer: {
    position: 'relative',
    width: '100%',
  },
  passwordInput: {
    width: '100%',
    padding: '12px',
    paddingRight: '45px',
    borderRadius: '8px',
    border: '1px solid #e6eefc',
    boxSizing: 'border-box',
    fontSize: '15px',
  },
  eyeIcon: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    padding: '4px',
    cursor: 'pointer',
    color: '#666',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  row: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  half: {
    flex: 1,
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #e6eefc",
    boxSizing: "border-box",
    fontSize: "15px",
  },
  signupBtn: {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(90deg,#4caf50,#28a745)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "15px",
  },
  loginBtn: {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(90deg,#3b82f6,#007bff)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
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

export default SignUp;