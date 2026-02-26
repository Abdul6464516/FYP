import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authActions";
import { toast } from "react-toastify";
import { useUser } from "../../context/UserContext";
import {
  Heart, Mail, Lock, Eye, EyeOff, ArrowRight, Stethoscope,
  Users, ShieldCheck, ChevronLeft, User, Settings, Loader2,
  CheckCircle, Video, CalendarCheck, AlertCircle
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { loginUserContext } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    role: "patient",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginUser({
        identifier: formData.identifier,
        password: formData.password,
      });
      if (data.user.role !== formData.role) {
        setError(`You are registered as a ${data.user.role}, not a ${formData.role}. Please select the correct role.`);
        setLoading(false);
        return;
      }
      loginUserContext(data.token, data.user);
      toast.success(`Welcome back, ${data.user.fullName}!`);
      setTimeout(() => {
        if (formData.role === "patient") navigate("/patient");
        else if (formData.role === "doctor") navigate("/doctor");
        else if (formData.role === "admin") navigate("/admin");
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: "patient", label: "Patient", icon: <User size={20} />, desc: "Book & manage appointments" },
    { value: "doctor", label: "Doctor", icon: <Stethoscope size={20} />, desc: "Manage your practice" },
    { value: "admin", label: "Admin", icon: <Settings size={20} />, desc: "System administration" },
  ];

  const features = [
    { icon: <Video size={20} />, text: "HD Video Consultations" },
    { icon: <CalendarCheck size={20} />, text: "Smart Appointment Booking" },
    { icon: <ShieldCheck size={20} />, text: "Secure Health Records" },
    { icon: <CheckCircle size={20} />, text: "Digital Prescriptions" },
  ];

  return (
    <div style={s.page}>
      {/* LEFT PANEL */}
      <div style={s.left}>
        <div style={s.leftOverlay} />
        <div style={s.leftContent}>
          {/* Back to home */}
          <div
            style={s.backBtn}
            onClick={() => navigate("/")}
          >
            <ChevronLeft size={18} /> Home
          </div>

          {/* Logo */}
          <div style={s.logoRow}>
            <div style={s.logoIcon}><Heart size={22} color="#fff" fill="#fff" /></div>
            <span style={s.logoText}>Telemedicine</span>
          </div>

          {/* Heading */}
          <h1 style={s.leftTitle}>Welcome Back</h1>
          <p style={s.leftSub}>
            Sign in to access your dashboard, manage appointments, and connect with healthcare professionals.
          </p>

          {/* Feature list */}
          <div style={s.featureList}>
            {features.map((f, i) => (
              <div key={i} style={s.featureItem}>
                <div style={s.featureIcon}>{f.icon}</div>
                <span style={s.featureText}>{f.text}</span>
              </div>
            ))}
          </div>

          {/* Decorative stats */}
          <div style={s.leftStats}>
            <div style={s.leftStat}>
              <div style={s.leftStatVal}>10K+</div>
              <div style={s.leftStatLabel}>Patients</div>
            </div>
            <div style={{ width: "1px", backgroundColor: "rgba(255,255,255,0.2)", height: "36px" }} />
            <div style={s.leftStat}>
              <div style={s.leftStatVal}>500+</div>
              <div style={s.leftStatLabel}>Doctors</div>
            </div>
            <div style={{ width: "1px", backgroundColor: "rgba(255,255,255,0.2)", height: "36px" }} />
            <div style={s.leftStat}>
              <div style={s.leftStatVal}>98%</div>
              <div style={s.leftStatLabel}>Satisfaction</div>
            </div>
          </div>
        </div>

        {/* Decorative blobs */}
        <div style={s.blob1} />
        <div style={s.blob2} />
      </div>

      {/* RIGHT PANEL */}
      <div style={s.right}>
        <div style={s.formWrapper}>
          <div style={s.formHeader}>
            <h2 style={s.formTitle}>Sign In</h2>
            <p style={s.formSub}>Enter your credentials to access your account</p>
          </div>

          {error && (
            <div style={s.errorBox}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {/* Role selector cards */}
          <div style={s.roleRow}>
            {roles.map((r) => (
              <div
                key={r.value}
                style={{
                  ...s.roleCard,
                  borderColor: formData.role === r.value ? "#16a34a" : "#e5e7eb",
                  backgroundColor: formData.role === r.value ? "#f0fdf4" : "#fff",
                  boxShadow: formData.role === r.value ? "0 0 0 3px rgba(22,163,74,0.1)" : "none",
                }}
                onClick={() => setFormData({ ...formData, role: r.value })}
              >
                <div style={{
                  ...s.roleIcon,
                  color: formData.role === r.value ? "#16a34a" : "#9ca3af",
                  backgroundColor: formData.role === r.value ? "#dcfce7" : "#f3f4f6",
                }}>
                  {r.icon}
                </div>
                <div style={{ fontWeight: "600", fontSize: "13px", color: formData.role === r.value ? "#15803d" : "#374151" }}>
                  {r.label}
                </div>
                <div style={{ fontSize: "10px", color: "#9ca3af", marginTop: "1px" }}>{r.desc}</div>
              </div>
            ))}
          </div>

          <form onSubmit={handleLogin} style={{ width: "100%" }}>
            {/* Email/Username */}
            <div style={s.fieldGroup}>
              <label style={s.label}>Email or Username</label>
              <div style={{
                ...s.inputWrap,
                borderColor: focusedField === "identifier" ? "#16a34a" : "#e5e7eb",
                boxShadow: focusedField === "identifier" ? "0 0 0 3px rgba(22,163,74,0.08)" : "none",
              }}>
                <Mail size={18} color={focusedField === "identifier" ? "#16a34a" : "#9ca3af"} />
                <input
                  type="text"
                  name="identifier"
                  placeholder="Enter your email or username"
                  value={formData.identifier}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("identifier")}
                  onBlur={() => setFocusedField("")}
                  required
                  style={s.input}
                />
              </div>
            </div>

            {/* Password */}
            <div style={s.fieldGroup}>
              <label style={s.label}>Password</label>
              <div style={{
                ...s.inputWrap,
                borderColor: focusedField === "password" ? "#16a34a" : "#e5e7eb",
                boxShadow: focusedField === "password" ? "0 0 0 3px rgba(22,163,74,0.08)" : "none",
              }}>
                <Lock size={18} color={focusedField === "password" ? "#16a34a" : "#9ca3af"} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField("")}
                  required
                  style={s.input}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={s.eyeBtn}>
                  {showPassword ? <EyeOff size={18} color="#9ca3af" /> : <Eye size={18} color="#9ca3af" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" style={s.submitBtn} disabled={loading}>
              {loading ? (
                <><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Signing in...</>
              ) : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={s.divider}>
            <div style={s.dividerLine} />
            <span style={s.dividerText}>New here?</span>
            <div style={s.dividerLine} />
          </div>

          {/* Sign up link */}
          <button type="button" style={s.signupBtn} onClick={() => navigate("/signup")}>
            Create a Free Account <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

/* ═══════════════════ STYLES ═══════════════════ */
const s = {
  page: {
    minHeight: "100vh", display: "flex",
    fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
  },

  /* LEFT */
  left: {
    position: "relative", width: "48%", minHeight: "100vh",
    background: "linear-gradient(160deg, #15803d 0%, #16a34a 40%, #0d9488 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "60px 50px", overflow: "hidden",
  },
  leftOverlay: {
    position: "absolute", inset: 0,
    background: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
    pointerEvents: "none",
  },
  leftContent: {
    position: "relative", zIndex: 2, maxWidth: "420px",
  },
  backBtn: {
    display: "inline-flex", alignItems: "center", gap: "4px",
    color: "rgba(255,255,255,0.7)", fontSize: "13px", fontWeight: "500",
    cursor: "pointer", marginBottom: "40px", transition: "color 0.2s",
  },
  logoRow: {
    display: "flex", alignItems: "center", gap: "10px", marginBottom: "32px",
  },
  logoIcon: {
    width: "40px", height: "40px", borderRadius: "12px",
    backgroundColor: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  logoText: {
    fontWeight: "800", fontSize: "22px", color: "#fff", letterSpacing: "-0.5px",
  },
  leftTitle: {
    fontSize: "38px", fontWeight: "800", color: "#fff",
    lineHeight: "1.15", margin: "0 0 14px", letterSpacing: "-1px",
  },
  leftSub: {
    fontSize: "15px", color: "rgba(255,255,255,0.75)", lineHeight: "1.7",
    margin: "0 0 32px",
  },
  featureList: {
    display: "flex", flexDirection: "column", gap: "14px", marginBottom: "40px",
  },
  featureItem: {
    display: "flex", alignItems: "center", gap: "12px",
  },
  featureIcon: {
    width: "38px", height: "38px", borderRadius: "10px",
    backgroundColor: "rgba(255,255,255,0.12)", backdropFilter: "blur(10px)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", flexShrink: 0,
  },
  featureText: {
    fontSize: "14px", color: "rgba(255,255,255,0.9)", fontWeight: "500",
  },
  leftStats: {
    display: "flex", alignItems: "center", gap: "24px",
    padding: "20px 24px", borderRadius: "16px",
    backgroundColor: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  leftStat: { textAlign: "center" },
  leftStatVal: { fontSize: "22px", fontWeight: "800", color: "#fff" },
  leftStatLabel: { fontSize: "11px", color: "rgba(255,255,255,0.6)", fontWeight: "500", marginTop: "2px" },
  blob1: {
    position: "absolute", top: "-120px", right: "-80px",
    width: "300px", height: "300px", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  blob2: {
    position: "absolute", bottom: "-100px", left: "-60px",
    width: "250px", height: "250px", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)",
    pointerEvents: "none",
  },

  /* RIGHT */
  right: {
    flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
    padding: "40px 24px", backgroundColor: "#f9fafb", overflowY: "auto",
  },
  formWrapper: {
    width: "100%", maxWidth: "440px",
    display: "flex", flexDirection: "column", alignItems: "center",
  },
  formHeader: { textAlign: "center", marginBottom: "28px" },
  formTitle: {
    fontSize: "28px", fontWeight: "800", color: "#111827",
    margin: "0 0 6px", letterSpacing: "-0.5px",
  },
  formSub: { fontSize: "14px", color: "#6b7280", margin: 0 },
  errorBox: {
    display: "flex", alignItems: "center", gap: "8px", width: "100%",
    padding: "12px 16px", borderRadius: "12px", marginBottom: "20px",
    backgroundColor: "#fef2f2", border: "1px solid #fecaca",
    color: "#dc2626", fontSize: "13px", fontWeight: "500",
  },

  /* Role cards */
  roleRow: {
    display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px",
    width: "100%", marginBottom: "24px",
  },
  roleCard: {
    display: "flex", flexDirection: "column", alignItems: "center",
    padding: "14px 8px", borderRadius: "14px",
    border: "2px solid #e5e7eb", cursor: "pointer",
    transition: "all 0.2s", textAlign: "center",
  },
  roleIcon: {
    width: "40px", height: "40px", borderRadius: "12px",
    display: "flex", alignItems: "center", justifyContent: "center",
    marginBottom: "6px", transition: "all 0.2s",
  },

  /* Form fields */
  fieldGroup: { width: "100%", marginBottom: "18px" },
  label: {
    display: "block", marginBottom: "7px",
    fontSize: "13px", fontWeight: "600", color: "#374151",
  },
  inputWrap: {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "0 14px", borderRadius: "12px",
    border: "2px solid #e5e7eb", backgroundColor: "#fff",
    transition: "all 0.2s",
  },
  input: {
    flex: 1, border: "none", outline: "none", backgroundColor: "transparent",
    padding: "13px 0", fontSize: "14px", color: "#111827",
    fontFamily: "inherit",
  },
  eyeBtn: {
    background: "none", border: "none", padding: "4px",
    cursor: "pointer", display: "flex", alignItems: "center",
  },
  submitBtn: {
    width: "100%", display: "flex", alignItems: "center",
    justifyContent: "center", gap: "8px",
    padding: "14px", borderRadius: "12px", border: "none",
    background: "linear-gradient(135deg, #16a34a, #15803d)",
    color: "#fff", fontSize: "15px", fontWeight: "700",
    cursor: "pointer", transition: "all 0.3s",
    boxShadow: "0 4px 14px rgba(22,163,74,0.25)",
    marginTop: "4px",
  },
  divider: {
    display: "flex", alignItems: "center", gap: "14px",
    width: "100%", margin: "24px 0",
  },
  dividerLine: { flex: 1, height: "1px", backgroundColor: "#e5e7eb" },
  dividerText: {
    fontSize: "13px", color: "#9ca3af", fontWeight: "500", whiteSpace: "nowrap",
  },
  signupBtn: {
    width: "100%", display: "flex", alignItems: "center",
    justifyContent: "center", gap: "8px",
    padding: "13px", borderRadius: "12px",
    border: "2px solid #e5e7eb", backgroundColor: "#fff",
    color: "#374151", fontSize: "14px", fontWeight: "600",
    cursor: "pointer", transition: "all 0.2s",
  },
};

export default Login;