import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authActions";
import { toast } from "react-toastify";
import { useUser } from "../../context/UserContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Heart, User, Mail, Lock, Eye, EyeOff, ArrowRight, Stethoscope,
  Phone, MapPin, Calendar, FileText, Clock, DollarSign, Award,
  ChevronLeft, Loader2, AlertCircle, UserPlus, ShieldCheck,
  CheckCircle, Briefcase, GraduationCap, Settings, XCircle, Info
} from "lucide-react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRegex = /^[a-zA-Z0-9._-]{3,30}$/;
const phoneRegex = /^\d{11}$/;
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const signUpSchema = z
  .object({
    fullName: z.string().trim().min(3, "Full name must be at least 3 characters"),
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters")
      .regex(usernameRegex, "Username can contain letters, numbers, dot, underscore, and dash"),
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .regex(emailRegex, "Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(strongPasswordRegex, "Password must include uppercase, lowercase, and a number"),
    role: z.enum(["patient", "doctor", "admin"]),

    age: z.string().optional(),
    gender: z.string().optional(),
    phone: z.string().optional(),
    medicalHistory: z.string().max(500, "Medical history should be under 500 characters").optional().or(z.literal("")),
    city: z.string().optional(),

    specialty: z.string().optional(),
    qualifications: z.string().optional(),
    yearsOfExperience: z.string().optional(),
    availability: z.string().optional(),
    chargesPerSession: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const role = data.role;

    if (role === "patient") {
      const ageNum = Number(data.age);
      if (!data.age || Number.isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Age must be between 1 and 120", path: ["age"] });
      }
      if (!data.gender) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Gender is required", path: ["gender"] });
      }
      if (!data.phone || !phoneRegex.test(data.phone)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Phone number must be exactly 11 digits", path: ["phone"] });
      }
      if (!data.city || data.city.trim().length < 2) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "City is required", path: ["city"] });
      }
    }

    if (role === "doctor") {
      if (!data.specialty || data.specialty.trim().length < 2) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Specialty is required", path: ["specialty"] });
      }
      if (!data.gender) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Gender is required", path: ["gender"] });
      }
      if (!data.phone || !phoneRegex.test(data.phone)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Phone number must be exactly 11 digits", path: ["phone"] });
      }
      if (!data.qualifications || data.qualifications.trim().length < 2) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Qualifications are required", path: ["qualifications"] });
      }

      const exp = Number(data.yearsOfExperience);
      if (!data.yearsOfExperience || Number.isNaN(exp) || exp < 0 || exp > 60) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Experience must be between 0 and 60 years", path: ["yearsOfExperience"] });
      }

      const fee = Number(data.chargesPerSession);
      if (!data.chargesPerSession || Number.isNaN(fee) || fee <= 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Session fee must be a positive number", path: ["chargesPerSession"] });
      }

      if (!data.availability || data.availability.trim().length < 3) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Availability is required", path: ["availability"] });
      }
      if (!data.city || data.city.trim().length < 2) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "City is required", path: ["city"] });
      }
    }

    if (role === "admin") {
      if (!data.phone || !phoneRegex.test(data.phone)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Phone number must be exactly 11 digits", path: ["phone"] });
      }
      if (!data.city || data.city.trim().length < 2) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "City is required", path: ["city"] });
      }
    }
  });

const SignUp = () => {
  const navigate = useNavigate();
  const { loginUserContext } = useUser();

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [step, setStep] = useState(1); // Step 1: account, Step 2: role details
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      password: "",
      role: "patient",
      age: "",
      gender: "",
      phone: "",
      medicalHistory: "",
      city: "",
      specialty: "",
      qualifications: "",
      yearsOfExperience: "",
      availability: "",
      chargesPerSession: "",
    },
  });

  const formData = watch();

  const handleSignup = async (values) => {
    setServerError("");
    setLoading(true);

    try {
      const payload = {
        fullName: values.fullName.trim(),
        username: values.username.trim(),
        email: values.email.trim(),
        password: values.password,
        role: values.role,
      };

      if (values.role === "patient") {
        Object.assign(payload, {
          age: values.age,
          gender: values.gender,
          phone: values.phone,
          medicalHistory: values.medicalHistory,
          city: values.city,
        });
      }
      if (values.role === "doctor") {
        Object.assign(payload, {
          gender: values.gender,
          phone: values.phone,
          specialty: values.specialty,
          qualifications: values.qualifications,
          yearsOfExperience: values.yearsOfExperience,
          availability: values.availability,
          chargesPerSession: values.chargesPerSession,
          city: values.city,
        });
      }

      if (values.role === "admin") {
        Object.assign(payload, {
          phone: values.phone,
          city: values.city,
        });
      }

      const data = await registerUser(payload);

      // Check verification status
      if (data.user.role !== "admin" && data.user.verificationStatus === "pending") {
        setVerificationMessage(`Your ${data.user.role} account has been created successfully! Please wait for the administrator to verify your account before you can access the system.`);
        setShowVerificationModal(true);
        setLoading(false);
        return;
      }

      // If verified or admin, proceed with login
      loginUserContext(data.token, data.user);
      toast.success(`${values.username} has created account`);

      setTimeout(() => {
        if (data.user.role === "patient") navigate("/patient");
        else if (data.user.role === "doctor") navigate("/doctor");
        else if (data.user.role === "admin") navigate("/admin");
        else navigate("/login");
      }, 1000);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationModalOk = () => {
    setShowVerificationModal(false);
    setVerificationMessage("");
    // Clear localStorage and redirect to home
    localStorage.clear();
    navigate("/");
  };

  // Verification modal content
  const getVerificationModalContent = () => {
    return {
      icon: <Info size={48} color="#3b82f6" />,
      title: "Account Created!",
      message: verificationMessage,
      buttonText: "Back to Home"
    };
  };

  const canGoStep2 =
    formData.fullName?.trim()?.length >= 3 &&
    usernameRegex.test(formData.username || "") &&
    emailRegex.test(formData.email || "") &&
    strongPasswordRegex.test(formData.password || "");

  const canSubmitRoleFields =
    (formData.role === "admin" &&
      phoneRegex.test(formData.phone || "") &&
      !!formData.city?.trim()) ||
    (formData.role === "patient" &&
      Number(formData.age) >= 1 &&
      Number(formData.age) <= 120 &&
      !!formData.gender &&
      phoneRegex.test(formData.phone || "") &&
      !!formData.city?.trim()) ||
    (formData.role === "doctor" &&
      !!formData.specialty?.trim() &&
      !!formData.gender &&
      phoneRegex.test(formData.phone || "") &&
      !!formData.qualifications?.trim() &&
      Number(formData.yearsOfExperience) >= 0 &&
      Number(formData.yearsOfExperience) <= 60 &&
      Number(formData.chargesPerSession) > 0 &&
      !!formData.availability?.trim() &&
      !!formData.city?.trim());

  const roles = [
    { value: "patient", label: "Patient", icon: <User size={22} />, desc: "Book appointments & manage health" },
    { value: "doctor", label: "Doctor", icon: <Stethoscope size={22} />, desc: "Manage patients & prescriptions" },
    { value: "admin", label: "Admin", icon: <Settings size={22} />, desc: "System administration" },
  ];

  const perks = [
    { icon: <CheckCircle size={18} />, text: "Free to sign up" },
    { icon: <ShieldCheck size={18} />, text: "Your data stays private" },
    { icon: <Calendar size={18} />, text: "Book in seconds" },
    { icon: <Award size={18} />, text: "Trusted by 10K+ users" },
  ];

  const getInputWrapStyle = (name) => ({
    ...s.inputWrap,
    borderColor: errors[name] ? "#dc2626" : focusedField === name ? "#16a34a" : "#e5e7eb",
    boxShadow: focusedField === name ? "0 0 0 3px rgba(22,163,74,0.08)" : "none",
  });

  /* ─── Input field helper ─── */
  const renderField = (name, label, icon, type = "text", placeholder = "", required = false) => (
    <div style={s.fieldGroup} className="field-group">
      <label style={s.label} className="label">{label}</label>
      <div style={getInputWrapStyle(name)} className="input-wrap">
        {icon}
        <input
          type={type}
          placeholder={placeholder}
          {...register(name, {
            onFocus: () => setFocusedField(name),
            onBlur: () => setFocusedField(""),
          })}
          required={required}
          style={s.input}
          className="input"
        />
      </div>
      {errors[name] && <p style={s.fieldError}>{errors[name]?.message}</p>}
    </div>
  );

  const renderSelect = (name, label, icon, options) => (
    <div style={s.fieldGroup} className="field-group">
      <label style={s.label} className="label">{label}</label>
      <div style={getInputWrapStyle(name)} className="input-wrap">
        {icon}
        <select
          {...register(name, {
            onFocus: () => setFocusedField(name),
            onBlur: () => setFocusedField(""),
          })}
          style={{ ...s.input, cursor: "pointer" }} className="input"
        >
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      {errors[name] && <p style={s.fieldError}>{errors[name]?.message}</p>}
    </div>
  );

  return (
    <div style={s.page} className="auth-page">
      {/* LEFT PANEL */}
      <div style={s.left} className="auth-left">
        <div style={s.leftOverlay} />
        <div style={s.leftContent}>
          <div style={s.backBtn} onClick={() => navigate("/")}>
            <ChevronLeft size={18} /> Home
          </div>

          <div style={s.logoRow}>
            <div style={s.logoIcon}><Heart size={22} color="#fff" fill="#fff" /></div>
            <span style={s.logoText}>Telemedicine</span>
          </div>

          <h1 style={s.leftTitle}>Join Our Healthcare Community</h1>
          <p style={s.leftSub}>
            Create your account and get access to world-class healthcare services — all from one platform.
          </p>

          <div style={s.perkList}>
            {perks.map((p, i) => (
              <div key={i} style={s.perkItem}>
                <div style={s.perkIcon}>{p.icon}</div>
                <span style={s.perkText}>{p.text}</span>
              </div>
            ))}
          </div>

          {/* Step indicator */}
          <div style={s.stepIndicator}>
            <div style={s.stepDotRow}>
              <div style={{ ...s.stepDot, backgroundColor: "#fff" }}>1</div>
              <div style={{ ...s.stepLine, backgroundColor: step >= 2 ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.15)" }} />
              <div style={{ ...s.stepDot, backgroundColor: step >= 2 ? "#fff" : "rgba(255,255,255,0.25)", color: step >= 2 ? "#15803d" : "rgba(255,255,255,0.6)" }}>2</div>
            </div>
            <div style={s.stepLabels}>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)", fontWeight: "600" }}>Account Info</span>
              <span style={{ fontSize: "12px", color: step >= 2 ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)", fontWeight: "500" }}>Role Details</span>
            </div>
          </div>
        </div>

        <div style={s.blob1} />
        <div style={s.blob2} />
      </div>

      {/* RIGHT PANEL */}
      <div style={s.right} className="auth-right">
        <div style={s.formWrapper} className="form-wrapper">
          <div style={s.formHeader}>
            <h2 style={s.formTitle} className="form-title">{step === 1 ? "Create Account" : `${formData.role === "doctor" ? "Doctor" : formData.role === "admin" ? "Admin" : "Patient"} Details`}</h2>
            <p style={s.formSub}>
              {step === 1
                ? "Fill in your basic information to get started"
                : `Complete your ${formData.role} profile`}
            </p>
          </div>

          {serverError && (
            <div style={s.errorBox}>
              <AlertCircle size={16} /> {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(handleSignup)} style={{ width: "100%" }}>
            {/* ── STEP 1: Account Info ── */}
            {step === 1 && (
              <>
                {/* Role selector */}
                <div style={s.roleRow} className="role-row">
                  {roles.map((r) => (
                    <div
                      key={r.value}
                      style={{
                        ...s.roleCard,
                        borderColor: formData.role === r.value ? "#16a34a" : "#e5e7eb",
                        backgroundColor: formData.role === r.value ? "#f0fdf4" : "#fff",
                        boxShadow: formData.role === r.value ? "0 0 0 3px rgba(22,163,74,0.1)" : "none",
                      }}
                      className="role-card"
                      onClick={() => {
                        setValue("role", r.value, { shouldValidate: true, shouldDirty: true });
                        setValue("gender", "", { shouldValidate: true, shouldDirty: true });
                      }}
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
                      <div style={{ fontSize: "10px", color: "#9ca3af", marginTop: "1px", lineHeight: "1.3" }}>{r.desc}</div>
                    </div>
                  ))}
                </div>

                <input type="hidden" {...register("role")} />

                {renderField("fullName", "Full Name", <User size={18} color={focusedField === "fullName" ? "#16a34a" : "#9ca3af"} />, "text", "Enter your full name", true)}
                {renderField("username", "Username", <UserPlus size={18} color={focusedField === "username" ? "#16a34a" : "#9ca3af"} />, "text", "Choose a unique username", true)}
                {renderField("email", "Email Address", <Mail size={18} color={focusedField === "email" ? "#16a34a" : "#9ca3af"} />, "email", "name@example.com", true)}

                {/* Password with toggle */}
                <div style={s.fieldGroup}>
                  <label style={s.label}>Password</label>
                  <div style={getInputWrapStyle("password")}>
                    <Lock size={18} color={focusedField === "password" ? "#16a34a" : "#9ca3af"} />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      {...register("password", {
                        onFocus: () => setFocusedField("password"),
                        onBlur: () => setFocusedField(""),
                      })}
                      required style={s.input}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={s.eyeBtn}>
                      {showPassword ? <EyeOff size={18} color="#9ca3af" /> : <Eye size={18} color="#9ca3af" />}
                    </button>
                  </div>
                  {errors.password && <p style={s.fieldError}>{errors.password.message}</p>}
                </div>

                <button
                  type="button"
                  style={{
                    ...s.nextBtn,
                    opacity: canGoStep2 ? 1 : 0.5,
                    cursor: canGoStep2 ? "pointer" : "not-allowed",
                  }}
                  onClick={async () => {
                    const ok = await trigger(["fullName", "username", "email", "password", "role"]);
                    if (ok) setStep(2);
                  }}
                  disabled={!canGoStep2}
                >
                  Continue <ArrowRight size={18} />
                </button>
              </>
            )}

            {/* ── STEP 2: Role-specific fields ── */}
            {step === 2 && (
              <>
                {/* Back button */}
                <div style={s.stepBackBtn} onClick={() => setStep(1)}>
                  <ChevronLeft size={16} /> Back to account info
                </div>

                {/* Patient fields */}
                {formData.role === "patient" && (
                  <>
                    <div style={s.twoCol} className="two-col">
                      {renderField("age", "Age", <Calendar size={18} color={focusedField === "age" ? "#16a34a" : "#9ca3af"} />, "number", "e.g. 29")}
                      {renderSelect("gender", "Gender", <User size={18} color={focusedField === "gender" ? "#16a34a" : "#9ca3af"} />, [
                        { value: "", label: "Select" }, { value: "male", label: "Male" },
                        { value: "female", label: "Female" }, { value: "other", label: "Other" },
                      ])}
                    </div>
                    <div style={s.twoCol} className="two-col">
                      {renderField("phone", "Phone", <Phone size={18} color={focusedField === "phone" ? "#16a34a" : "#9ca3af"} />, "tel", "+92 300 1234567")}
                      {renderField("city", "City", <MapPin size={18} color={focusedField === "city" ? "#16a34a" : "#9ca3af"} />, "text", "e.g. Lahore")}
                    </div>
                    <div style={s.fieldGroup} className="field-group">
                      <label style={s.label} className="label">Medical History (optional)</label>
                      <div style={{
                        ...s.inputWrap, alignItems: "flex-start", padding: "12px 14px",
                        borderColor: errors.medicalHistory
                          ? "#dc2626"
                          : focusedField === "medicalHistory"
                            ? "#16a34a"
                            : "#e5e7eb",
                        boxShadow: focusedField === "medicalHistory" ? "0 0 0 3px rgba(22,163,74,0.08)" : "none",
                      }} className="input-wrap">
                        <FileText size={18} color={focusedField === "medicalHistory" ? "#16a34a" : "#9ca3af"} style={{ marginTop: "2px" }} />
                        <textarea
                          placeholder="Brief medical history or conditions"
                          {...register("medicalHistory", {
                            onFocus: () => setFocusedField("medicalHistory"),
                            onBlur: () => setFocusedField(""),
                          })}
                          style={{ ...s.input, resize: "vertical", minHeight: "70px" }} className="input"
                        />
                      </div>
                      {errors.medicalHistory && <p style={s.fieldError}>{errors.medicalHistory.message}</p>}
                    </div>
                  </>
                )}

                {/* Doctor fields */}
                {formData.role === "doctor" && (
                  <>
                    <div style={s.twoCol} className="two-col">
                      {renderField("specialty", "Specialty", <Briefcase size={18} color={focusedField === "specialty" ? "#16a34a" : "#9ca3af"} />, "text", "e.g. Cardiology")}
                      {renderSelect("gender", "Gender", <User size={18} color={focusedField === "gender" ? "#16a34a" : "#9ca3af"} />, [
                        { value: "", label: "Select" }, { value: "male", label: "Male" },
                        { value: "female", label: "Female" }, { value: "other", label: "Other" },
                      ])}
                    </div>
                    {renderField("phone", "Phone", <Phone size={18} color={focusedField === "phone" ? "#16a34a" : "#9ca3af"} />, "tel", "+92 300 1234567")}
                    {renderField("qualifications", "Qualifications", <GraduationCap size={18} color={focusedField === "qualifications" ? "#16a34a" : "#9ca3af"} />, "text", "e.g. MBBS, MD")}
                    <div style={s.twoCol} className="two-col">
                      {renderField("yearsOfExperience", "Experience (years)", <Award size={18} color={focusedField === "yearsOfExperience" ? "#16a34a" : "#9ca3af"} />, "number", "e.g. 5")}
                      {renderField("chargesPerSession", "Session Fee (Rs.)", <DollarSign size={18} color={focusedField === "chargesPerSession" ? "#16a34a" : "#9ca3af"} />, "number", "e.g. 2000")}
                    </div>
                    <div style={s.twoCol} className="two-col">
                      {renderField("availability", "Availability", <Clock size={18} color={focusedField === "availability" ? "#16a34a" : "#9ca3af"} />, "text", "e.g. Mon-Fri 9-2")}
                      {renderField("city", "City", <MapPin size={18} color={focusedField === "city" ? "#16a34a" : "#9ca3af"} />, "text", "e.g. Karachi")}
                    </div>
                  </>
                )}

                {/* Admin fields */}
                {formData.role === "admin" && (
                  <>
                    <div style={s.twoCol} className="two-col">
                      {renderField("phone", "Contact Number", <Phone size={18} color={focusedField === "phone" ? "#16a34a" : "#9ca3af"} />, "tel", "+92 300 1234567")}
                      {renderField("city", "City", <MapPin size={18} color={focusedField === "city" ? "#16a34a" : "#9ca3af"} />, "text", "e.g. Lahore")}
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  style={{ ...s.submitBtn, ...((loading || !canSubmitRoleFields) ? s.submitBtnDisabled : {}) }}
                  disabled={loading || !canSubmitRoleFields}
                >
                  {loading ? (
                    <><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Creating Account...</>
                  ) : (
                    <>Create Account <ArrowRight size={18} /></>
                  )}
                </button>
              </>
            )}
          </form>

          {/* Divider */}
          <div style={s.divider}>
            <div style={s.dividerLine} />
            <span style={s.dividerText}>Already have an account?</span>
            <div style={s.dividerLine} />
          </div>

          <button type="button" style={s.loginBtn} onClick={() => navigate("/login")}>
            Sign In Instead <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Verification Modal */}
      {showVerificationModal && (
        <div style={s.modalOverlay}>
          <div style={s.modalContent}>
            <div style={s.modalIconContainer}>
              {getVerificationModalContent()?.icon}
            </div>
            <h3 style={s.modalTitle}>{getVerificationModalContent()?.title}</h3>
            <p style={s.modalMessage}>{getVerificationModalContent()?.message}</p>
            <button
              onClick={handleVerificationModalOk}
              style={s.modalButton}
            >
              {getVerificationModalContent()?.buttonText}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideUp { 
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          } 
          to { 
            opacity: 1; 
            transform: translateY(0); 
          } 
        }
      `}</style>
    </div>
  );
};

/* ═══════════════════ STYLES ═══════════════════ */
const s = {
  page: {
    minHeight: "100vh", display: "flex",
    fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
    "@media (max-width: 768px)": {
      flexDirection: "column",
    },
  },

  /* LEFT */
  left: {
    position: "relative", width: "44%", minHeight: "100vh",
    background: "linear-gradient(160deg, #15803d 0%, #16a34a 40%, #0d9488 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "60px 44px", overflow: "hidden",
    "@media (max-width: 768px)": {
      width: "100%",
      minHeight: "auto",
      padding: "40px 20px",
    },
  },
  leftOverlay: {
    position: "absolute", inset: 0,
    background: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
    pointerEvents: "none",
  },
  leftContent: {
    position: "relative", zIndex: 2, maxWidth: "380px",
  },
  backBtn: {
    display: "inline-flex", alignItems: "center", gap: "4px",
    color: "rgba(255,255,255,0.7)", fontSize: "13px", fontWeight: "500",
    cursor: "pointer", marginBottom: "40px",
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
    fontSize: "34px", fontWeight: "800", color: "#fff",
    lineHeight: "1.15", margin: "0 0 14px", letterSpacing: "-1px",
  },
  leftSub: {
    fontSize: "15px", color: "rgba(255,255,255,0.75)", lineHeight: "1.7",
    margin: "0 0 30px",
  },
  perkList: {
    display: "flex", flexDirection: "column", gap: "12px", marginBottom: "36px",
  },
  perkItem: { display: "flex", alignItems: "center", gap: "12px" },
  perkIcon: {
    width: "36px", height: "36px", borderRadius: "10px",
    backgroundColor: "rgba(255,255,255,0.12)", backdropFilter: "blur(10px)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", flexShrink: 0,
  },
  perkText: { fontSize: "14px", color: "rgba(255,255,255,0.9)", fontWeight: "500" },
  stepIndicator: {
    padding: "20px 24px", borderRadius: "16px",
    backgroundColor: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  stepDotRow: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: "0",
    marginBottom: "8px",
  },
  stepDot: {
    width: "30px", height: "30px", borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: "700", fontSize: "13px", color: "#15803d",
    transition: "all 0.3s",
  },
  stepLine: {
    width: "60px", height: "3px", borderRadius: "2px", transition: "background 0.3s",
  },
  stepLabels: {
    display: "flex", justifyContent: "space-between", padding: "0 10px",
  },
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
    flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center",
    padding: "40px 24px", backgroundColor: "#f9fafb", overflowY: "auto",
    maxHeight: "100vh",
  },
  formWrapper: {
    width: "100%", maxWidth: "480px", paddingTop: "20px", paddingBottom: "40px",
    display: "flex", flexDirection: "column", alignItems: "center",
  },
  formHeader: { textAlign: "center", marginBottom: "24px" },
  formTitle: {
    fontSize: "26px", fontWeight: "800", color: "#111827",
    margin: "0 0 6px", letterSpacing: "-0.5px",
  },
  formSub: { fontSize: "14px", color: "#6b7280", margin: 0 },
  errorBox: {
    display: "flex", alignItems: "center", gap: "8px", width: "100%",
    padding: "12px 16px", borderRadius: "12px", marginBottom: "18px",
    backgroundColor: "#fef2f2", border: "1px solid #fecaca",
    color: "#dc2626", fontSize: "13px", fontWeight: "500",
  },

  /* Role cards */
  roleRow: {
    display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px",
    width: "100%", marginBottom: "22px",
  },
  roleCard: {
    display: "flex", flexDirection: "column", alignItems: "center",
    padding: "14px 8px", borderRadius: "14px",
    border: "2px solid #e5e7eb", cursor: "pointer",
    transition: "all 0.2s", textAlign: "center",
  },
  roleIcon: {
    width: "44px", height: "44px", borderRadius: "12px",
    display: "flex", alignItems: "center", justifyContent: "center",
    marginBottom: "6px", transition: "all 0.2s",
  },

  /* Fields */
  fieldGroup: { width: "100%", marginBottom: "16px" },
  label: {
    display: "block", marginBottom: "6px",
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
    padding: "12px 0", fontSize: "14px", color: "#111827",
    fontFamily: "inherit",
  },
  eyeBtn: {
    background: "none", border: "none", padding: "4px",
    cursor: "pointer", display: "flex", alignItems: "center",
  },
  twoCol: {
    display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", width: "100%",
  },
  stepBackBtn: {
    display: "inline-flex", alignItems: "center", gap: "4px",
    color: "#6b7280", fontSize: "13px", fontWeight: "500",
    cursor: "pointer", marginBottom: "18px",
  },
  adminNotice: {
    textAlign: "center", padding: "32px 20px",
    backgroundColor: "#f0fdf4", borderRadius: "14px",
    border: "1px solid #bbf7d0", marginBottom: "20px",
  },

  /* Buttons */
  nextBtn: {
    width: "100%", display: "flex", alignItems: "center",
    justifyContent: "center", gap: "8px",
    padding: "14px", borderRadius: "12px", border: "none",
    background: "linear-gradient(135deg, #16a34a, #15803d)",
    color: "#fff", fontSize: "15px", fontWeight: "700",
    transition: "all 0.3s",
    boxShadow: "0 4px 14px rgba(22,163,74,0.25)",
    marginTop: "4px",
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
  submitBtnDisabled: {
    opacity: 0.55,
    cursor: "not-allowed",
    boxShadow: "none",
  },
  fieldError: {
    marginTop: "6px",
    color: "#dc2626",
    fontSize: "12px",
    fontWeight: "500",
  },
  divider: {
    display: "flex", alignItems: "center", gap: "14px",
    width: "100%", margin: "22px 0",
  },
  dividerLine: { flex: 1, height: "1px", backgroundColor: "#e5e7eb" },
  dividerText: {
    fontSize: "13px", color: "#9ca3af", fontWeight: "500", whiteSpace: "nowrap",
  },
  loginBtn: {
    width: "100%", display: "flex", alignItems: "center",
    justifyContent: "center", gap: "8px",
    padding: "13px", borderRadius: "12px",
    border: "2px solid #e5e7eb", backgroundColor: "#fff",
    color: "#374151", fontSize: "14px", fontWeight: "600",
    cursor: "pointer", transition: "all 0.2s",
  },

  /* Modal styles */
  modalOverlay: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex",
    alignItems: "center", justifyContent: "center", zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#fff", borderRadius: "16px", padding: "40px 32px",
    maxWidth: "420px", width: "90%", textAlign: "center",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    animation: "slideUp 0.3s ease-out",
  },
  modalIconContainer: {
    display: "flex", justifyContent: "center", marginBottom: "20px",
  },
  modalTitle: {
    fontSize: "24px", fontWeight: "800", color: "#111827",
    margin: "0 0 12px", letterSpacing: "-0.5px",
  },
  modalMessage: {
    fontSize: "15px", color: "#6b7280", lineHeight: "1.6",
    margin: "0 0 28px",
  },
  modalButton: {
    width: "100%", display: "flex", alignItems: "center",
    justifyContent: "center", gap: "8px",
    padding: "14px", borderRadius: "12px", border: "none",
    background: "linear-gradient(135deg, #16a34a, #15803d)",
    color: "#fff", fontSize: "15px", fontWeight: "700",
    cursor: "pointer", transition: "all 0.3s",
    boxShadow: "0 4px 14px rgba(22,163,74,0.25)",
  },
};

export default SignUp;