import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart, Shield, Clock, Video, Users, Star, ChevronRight,
  Stethoscope, Activity, CalendarCheck, Pill, Phone, ArrowRight,
  CheckCircle, MessageCircle, Award, Zap
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: <Video size={28} />, title: "Video Consultations", desc: "Connect with doctors from the comfort of your home via secure HD video calls.", color: "#2563eb", bg: "#eff6ff" },
    { icon: <CalendarCheck size={28} />, title: "Easy Scheduling", desc: "Book appointments in seconds. Get reminders so you never miss a visit.", color: "#16a34a", bg: "#f0fdf4" },
    { icon: <Pill size={28} />, title: "Digital Prescriptions", desc: "Receive prescriptions digitally. Download, view, and manage your medications.", color: "#7c3aed", bg: "#f5f3ff" },
    { icon: <Activity size={28} />, title: "Health Records", desc: "Your complete medical history in one place — secure, private, always accessible.", color: "#ea580c", bg: "#fff7ed" },
    { icon: <Shield size={28} />, title: "Secure & Private", desc: "Enterprise-grade encryption keeps your health data safe and confidential.", color: "#0891b2", bg: "#ecfeff" },
    { icon: <MessageCircle size={28} />, title: "Real-time Chat", desc: "Message your doctor, share reports, and get quick responses anytime.", color: "#db2777", bg: "#fdf2f8" },
  ];

  const stats = [
    { value: "10,000+", label: "Happy Patients", icon: <Heart size={22} /> },
    { value: "500+", label: "Expert Doctors", icon: <Stethoscope size={22} /> },
    { value: "24/7", label: "Available Support", icon: <Clock size={22} /> },
    { value: "98%", label: "Satisfaction Rate", icon: <Star size={22} /> },
  ];

  const steps = [
    { num: "01", title: "Create Account", desc: "Sign up in under a minute — it's free and easy.", icon: <Users size={24} /> },
    { num: "02", title: "Find Your Doctor", desc: "Browse specialists by category, rating, or availability.", icon: <Stethoscope size={24} /> },
    { num: "03", title: "Book Appointment", desc: "Pick a time that works and confirm your booking instantly.", icon: <CalendarCheck size={24} /> },
    { num: "04", title: "Get Consultation", desc: "Meet your doctor via video call and receive your prescription.", icon: <Video size={24} /> },
  ];

  const testimonials = [
    { name: "Sarah Ahmed", role: "Patient", text: "This platform changed how I manage my health. Booking is seamless and doctors are amazing!", avatar: "S", rating: 5 },
    { name: "Dr. Ali Khan", role: "Cardiologist", text: "A wonderful tool for managing patients. The prescription system saves me hours every week.", avatar: "A", rating: 5 },
    { name: "Fatima Noor", role: "Patient", text: "Video consultations are a lifesaver! I got treated without leaving my home during flu season.", avatar: "F", rating: 5 },
  ];

  return (
    <div style={styles.page}>
      {/* ───── NAVBAR ───── */}
      <nav style={{ ...styles.navbar, ...(scrolled ? styles.navbarScrolled : {}) }}>
        <div style={styles.navInner}>
          <div style={styles.logo} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div style={styles.logoIcon}><Heart size={20} color="#fff" fill="#fff" /></div>
            <span style={styles.logoText}>Telemedicine</span>
          </div>
          <div style={styles.navLinks}>
            <a href="#features" style={styles.navLink}>Features</a>
            <a href="#how-it-works" style={styles.navLink}>How It Works</a>
            <a href="#testimonials" style={styles.navLink}>Testimonials</a>
          </div>
          <div style={styles.navBtns}>
            <button style={styles.navSignIn} onClick={() => navigate("/login")}>Sign In</button>
            <button style={styles.navSignUp} onClick={() => navigate("/signup")}>
              Sign Up <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </nav>

      {/* ───── HERO ───── */}
      <section style={styles.hero}>
        {/* Decorative blobs */}
        <div style={styles.blob1} />
        <div style={styles.blob2} />
        <div style={styles.blob3} />

        <div style={styles.heroInner}>
          <div style={styles.heroLeft}>
            <div style={styles.heroBadge}>
              <Zap size={14} color="#16a34a" /> #1 Healthcare Platform
            </div>
            <h1 style={styles.heroTitle}>
              Your Health,{" "}
              <span style={styles.heroGradient}>Our Priority</span>
            </h1>
            <p style={styles.heroSubtitle}>
              Experience world-class healthcare from anywhere. Connect with top doctors,
              book appointments, get prescriptions — all in one secure platform.
            </p>
            <div style={styles.heroBtns}>
              <button style={styles.heroBtn} onClick={() => navigate("/signup")}>
                Get Started Free <ArrowRight size={18} />
              </button>
              <button style={styles.heroOutline} onClick={() => navigate("/login")}>
                Sign In
              </button>
            </div>
            <div style={styles.heroTrust}>
              <div style={styles.avatarStack}>
                {["#16a34a", "#2563eb", "#7c3aed", "#ea580c"].map((c, i) => (
                  <div key={i} style={{ ...styles.stackAvatar, backgroundColor: c, zIndex: 4 - i, marginLeft: i > 0 ? "-10px" : "0" }}>
                    {["M", "S", "A", "F"][i]}
                  </div>
                ))}
              </div>
              <span style={{ fontSize: "14px", color: "#6b7280" }}>
                <strong style={{ color: "#111827" }}>10,000+</strong> patients trust us
              </span>
            </div>
          </div>

          <div style={styles.heroRight}>
            <div style={styles.heroCard}>
              {/* Healthcare illustration card */}
              <div style={styles.heroImgContainer}>
                <div style={styles.heroImgBg}>
                  <Stethoscope size={80} color="#16a34a" strokeWidth={1.2} />
                </div>
                <div style={styles.floatingCard1}>
                  <CheckCircle size={16} color="#16a34a" />
                  <span style={{ fontSize: "12px", fontWeight: "600", color: "#15803d" }}>Appointment Confirmed</span>
                </div>
                <div style={styles.floatingCard2}>
                  <Video size={16} color="#2563eb" />
                  <span style={{ fontSize: "12px", fontWeight: "600", color: "#1d4ed8" }}>Video Call Ready</span>
                </div>
                <div style={styles.floatingCard3}>
                  <Heart size={16} color="#dc2626" fill="#dc2626" />
                  <span style={{ fontSize: "12px", fontWeight: "600", color: "#111827" }}>98% Satisfaction</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── STATS BAR ───── */}
      <section style={styles.statsSection}>
        <div style={styles.statsInner}>
          {stats.map((s, i) => (
            <div key={i} style={styles.statItem}>
              <div style={styles.statIcon}>{s.icon}</div>
              <div>
                <div style={styles.statValue}>{s.value}</div>
                <div style={styles.statLabel}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───── FEATURES ───── */}
      <section id="features" style={styles.featuresSection}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionBadge}>Features</span>
          <h2 style={styles.sectionTitle}>Everything You Need for Better Health</h2>
          <p style={styles.sectionSub}>
            Our comprehensive platform brings together all the tools you need for seamless healthcare management.
          </p>
        </div>
        <div style={styles.featuresGrid}>
          {features.map((f, i) => (
            <div
              key={i}
              style={{
                ...styles.featureCard,
                borderColor: activeFeature === i ? f.color : "#f3f4f6",
                transform: activeFeature === i ? "translateY(-4px)" : "translateY(0)",
                boxShadow: activeFeature === i ? `0 12px 30px ${f.color}15` : "0 1px 3px rgba(0,0,0,0.04)",
              }}
              onMouseEnter={() => setActiveFeature(i)}
            >
              <div style={{ ...styles.featureIcon, backgroundColor: f.bg, color: f.color }}>
                {f.icon}
              </div>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── HOW IT WORKS ───── */}
      <section id="how-it-works" style={styles.howSection}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionBadge}>How It Works</span>
          <h2 style={styles.sectionTitle}>Get Started in 4 Simple Steps</h2>
          <p style={styles.sectionSub}>
            From sign-up to consultation — it only takes a few minutes.
          </p>
        </div>
        <div style={styles.stepsGrid}>
          {steps.map((s, i) => (
            <div key={i} style={styles.stepCard}>
              <div style={styles.stepNum}>{s.num}</div>
              <div style={styles.stepIconWrap}>{s.icon}</div>
              <h3 style={styles.stepTitle}>{s.title}</h3>
              <p style={styles.stepDesc}>{s.desc}</p>
              {i < steps.length - 1 && <div style={styles.stepArrow}><ChevronRight size={20} color="#d1d5db" /></div>}
            </div>
          ))}
        </div>
      </section>

      {/* ───── TESTIMONIALS ───── */}
      <section id="testimonials" style={styles.testimonialSection}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionBadge}>Testimonials</span>
          <h2 style={styles.sectionTitle}>Loved by Patients & Doctors</h2>
          <p style={styles.sectionSub}>
            Hear what our community has to say about their experience.
          </p>
        </div>
        <div style={styles.testimonialGrid}>
          {testimonials.map((t, i) => (
            <div key={i} style={styles.testimonialCard}>
              <div style={styles.testimonialStars}>
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={16} color="#f59e0b" fill="#f59e0b" />
                ))}
              </div>
              <p style={styles.testimonialText}>"{t.text}"</p>
              <div style={styles.testimonialAuthor}>
                <div style={{ ...styles.testimonialAvatar, backgroundColor: ["#16a34a", "#2563eb", "#7c3aed"][i] }}>
                  {t.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: "600", color: "#111827", fontSize: "14px" }}>{t.name}</div>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaInner}>
          <div style={styles.ctaBlob} />
          <h2 style={styles.ctaTitle}>Ready to Take Control of Your Health?</h2>
          <p style={styles.ctaSub}>
            Join thousands of patients who trust telemedicine for their healthcare needs. It's free to get started.
          </p>
          <div style={styles.ctaBtns}>
            <button style={styles.ctaBtn} onClick={() => navigate("/signup")}>
              Create Free Account <ArrowRight size={18} />
            </button>
            <button style={styles.ctaOutline} onClick={() => navigate("/login")}>
              Sign In Instead
            </button>
          </div>
        </div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <div style={styles.footerBrand}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <div style={styles.logoIcon}><Heart size={18} color="#fff" fill="#fff" /></div>
              <span style={{ fontWeight: "700", fontSize: "18px", color: "#111827" }}>telemedicine</span>
            </div>
            <p style={{ fontSize: "13px", color: "#6b7280", lineHeight: "1.6", maxWidth: "280px" }}>
              Making quality healthcare accessible to everyone, everywhere. Your trusted digital health companion.
            </p>
          </div>
          <div style={styles.footerCol}>
            <h4 style={styles.footerHead}>Platform</h4>
            <a href="#features" style={styles.footerLink}>Features</a>
            <a href="#how-it-works" style={styles.footerLink}>How It Works</a>
            <a href="#testimonials" style={styles.footerLink}>Testimonials</a>
          </div>
          <div style={styles.footerCol}>
            <h4 style={styles.footerHead}>Account</h4>
            <span style={styles.footerLink} onClick={() => navigate("/login")}>Sign In</span>
            <span style={styles.footerLink} onClick={() => navigate("/signup")}>Sign Up</span>
          </div>
          <div style={styles.footerCol}>
            <h4 style={styles.footerHead}>Contact</h4>
            <span style={styles.footerLink}><Phone size={13} /> +92 300 1234567</span>
            <span style={styles.footerLink}>support@telemedicine.pk</span>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <span>© 2026 telemedicine. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
};

/* ═══════════════════════════════════ STYLES ═══════════════════════════════════ */
const styles = {
  page: {
    fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
    backgroundColor: "#fff",
    color: "#111827",
    overflowX: "hidden",
  },

  /* NAVBAR */
  navbar: {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
    padding: "16px 0", transition: "all 0.3s",
    backgroundColor: "rgba(255,255,255,0.6)", backdropFilter: "blur(20px)",
  },
  navbarScrolled: {
    backgroundColor: "rgba(255,255,255,0.95)",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    padding: "12px 0",
  },
  navInner: {
    maxWidth: "1200px", margin: "0 auto", padding: "0 24px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
  },
  logo: {
    display: "flex", alignItems: "center", gap: "10px", cursor: "pointer",
  },
  logoIcon: {
    width: "36px", height: "36px", borderRadius: "10px",
    background: "linear-gradient(135deg, #16a34a, #22d3ee)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  logoText: {
    fontWeight: "800", fontSize: "20px", color: "#111827",
    letterSpacing: "-0.5px",
  },
  navLinks: {
    display: "flex", gap: "32px",
  },
  navLink: {
    fontSize: "14px", fontWeight: "500", color: "#6b7280",
    textDecoration: "none", transition: "color 0.2s",
  },
  navBtns: {
    display: "flex", gap: "10px", alignItems: "center",
  },
  navSignIn: {
    padding: "9px 20px", borderRadius: "10px", border: "1px solid #e5e7eb",
    backgroundColor: "#fff", color: "#374151", fontSize: "14px",
    fontWeight: "600", cursor: "pointer", transition: "all 0.2s",
  },
  navSignUp: {
    display: "flex", alignItems: "center", gap: "6px",
    padding: "9px 20px", borderRadius: "10px", border: "none",
    background: "linear-gradient(135deg, #16a34a, #15803d)",
    color: "#fff", fontSize: "14px", fontWeight: "600",
    cursor: "pointer", transition: "all 0.2s",
  },

  /* HERO */
  hero: {
    position: "relative", paddingTop: "120px", paddingBottom: "60px",
    overflow: "hidden",
  },
  blob1: {
    position: "absolute", top: "-120px", right: "-120px",
    width: "450px", height: "450px", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(22,163,74,0.08) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  blob2: {
    position: "absolute", bottom: "-100px", left: "-100px",
    width: "350px", height: "350px", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  blob3: {
    position: "absolute", top: "40%", left: "50%",
    width: "300px", height: "300px", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(124,58,237,0.04) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  heroInner: {
    maxWidth: "1200px", margin: "0 auto", padding: "0 24px",
    display: "flex", alignItems: "center", gap: "60px",
    flexWrap: "wrap",
  },
  heroLeft: {
    flex: "1 1 480px",
  },
  heroBadge: {
    display: "inline-flex", alignItems: "center", gap: "6px",
    padding: "6px 16px", borderRadius: "30px",
    backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0",
    fontSize: "13px", fontWeight: "600", color: "#15803d",
    marginBottom: "20px",
  },
  heroTitle: {
    fontSize: "52px", fontWeight: "800", lineHeight: "1.1",
    color: "#111827", margin: "0 0 20px", letterSpacing: "-1.5px",
  },
  heroGradient: {
    background: "linear-gradient(135deg, #16a34a, #2563eb)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  heroSubtitle: {
    fontSize: "18px", lineHeight: "1.7", color: "#6b7280",
    margin: "0 0 32px", maxWidth: "500px",
  },
  heroBtns: {
    display: "flex", gap: "14px", flexWrap: "wrap", marginBottom: "32px",
  },
  heroBtn: {
    display: "flex", alignItems: "center", gap: "8px",
    padding: "14px 32px", borderRadius: "12px", border: "none",
    background: "linear-gradient(135deg, #16a34a, #15803d)",
    color: "#fff", fontSize: "16px", fontWeight: "700",
    cursor: "pointer", transition: "all 0.3s",
    boxShadow: "0 4px 14px rgba(22,163,74,0.3)",
  },
  heroOutline: {
    padding: "14px 32px", borderRadius: "12px",
    border: "2px solid #e5e7eb", backgroundColor: "#fff",
    color: "#374151", fontSize: "16px", fontWeight: "700",
    cursor: "pointer", transition: "all 0.2s",
  },
  heroTrust: {
    display: "flex", alignItems: "center", gap: "12px",
  },
  avatarStack: {
    display: "flex",
  },
  stackAvatar: {
    width: "32px", height: "32px", borderRadius: "50%",
    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: "700", fontSize: "13px", border: "2px solid #fff",
  },
  heroRight: {
    flex: "1 1 440px", display: "flex", justifyContent: "center",
  },
  heroCard: {
    position: "relative", width: "100%", maxWidth: "460px",
  },
  heroImgContainer: {
    position: "relative", width: "100%", aspectRatio: "1",
    background: "linear-gradient(135deg, #f0fdf4 0%, #eff6ff 50%, #f5f3ff 100%)",
    borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center",
    border: "1px solid #e5e7eb",
    boxShadow: "0 20px 60px rgba(0,0,0,0.06)",
  },
  heroImgBg: {
    width: "160px", height: "160px", borderRadius: "50%",
    backgroundColor: "rgba(22,163,74,0.08)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  floatingCard1: {
    position: "absolute", top: "20%", left: "-10px",
    display: "flex", alignItems: "center", gap: "8px",
    padding: "10px 16px", borderRadius: "12px",
    backgroundColor: "#fff", boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
    border: "1px solid #e5e7eb", animation: "float 3s ease-in-out infinite",
  },
  floatingCard2: {
    position: "absolute", top: "10%", right: "10px",
    display: "flex", alignItems: "center", gap: "8px",
    padding: "10px 16px", borderRadius: "12px",
    backgroundColor: "#fff", boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
    border: "1px solid #e5e7eb", animation: "float 3s ease-in-out infinite 1s",
  },
  floatingCard3: {
    position: "absolute", bottom: "15%", right: "5%",
    display: "flex", alignItems: "center", gap: "8px",
    padding: "10px 16px", borderRadius: "12px",
    backgroundColor: "#fff", boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
    border: "1px solid #e5e7eb", animation: "float 3s ease-in-out infinite 2s",
  },

  /* STATS */
  statsSection: {
    padding: "0 24px", marginTop: "-20px", marginBottom: "40px",
    position: "relative", zIndex: 2,
  },
  statsInner: {
    maxWidth: "1000px", margin: "0 auto",
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "0", backgroundColor: "#fff", borderRadius: "20px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6",
    overflow: "hidden",
  },
  statItem: {
    display: "flex", alignItems: "center", gap: "14px",
    padding: "28px 24px",
    borderRight: "1px solid #f3f4f6",
  },
  statIcon: {
    width: "48px", height: "48px", borderRadius: "14px",
    backgroundColor: "#f0fdf4", color: "#16a34a",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  statValue: {
    fontSize: "24px", fontWeight: "800", color: "#111827",
    letterSpacing: "-0.5px",
  },
  statLabel: {
    fontSize: "13px", color: "#6b7280", fontWeight: "500",
  },

  /* FEATURES */
  featuresSection: {
    padding: "80px 24px",
  },
  sectionHeader: {
    textAlign: "center", marginBottom: "50px", maxWidth: "600px",
    margin: "0 auto 50px",
  },
  sectionBadge: {
    display: "inline-block", padding: "5px 16px", borderRadius: "30px",
    backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0",
    fontSize: "13px", fontWeight: "600", color: "#15803d",
    marginBottom: "16px",
  },
  sectionTitle: {
    fontSize: "36px", fontWeight: "800", color: "#111827",
    letterSpacing: "-1px", margin: "0 0 14px",
  },
  sectionSub: {
    fontSize: "16px", color: "#6b7280", lineHeight: "1.6", margin: 0,
  },
  featuresGrid: {
    maxWidth: "1100px", margin: "0 auto",
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },
  featureCard: {
    padding: "28px", borderRadius: "16px",
    border: "1.5px solid #f3f4f6", backgroundColor: "#fff",
    transition: "all 0.35s ease", cursor: "default",
  },
  featureIcon: {
    width: "56px", height: "56px", borderRadius: "14px",
    display: "flex", alignItems: "center", justifyContent: "center",
    marginBottom: "16px",
  },
  featureTitle: {
    fontSize: "17px", fontWeight: "700", color: "#111827",
    margin: "0 0 8px",
  },
  featureDesc: {
    fontSize: "14px", color: "#6b7280", lineHeight: "1.6", margin: 0,
  },

  /* HOW IT WORKS */
  howSection: {
    padding: "80px 24px", backgroundColor: "#fafbfc",
  },
  stepsGrid: {
    maxWidth: "1100px", margin: "0 auto",
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "24px",
  },
  stepCard: {
    textAlign: "center", padding: "32px 24px", borderRadius: "16px",
    backgroundColor: "#fff", border: "1px solid #f3f4f6",
    position: "relative",
    boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
  },
  stepNum: {
    fontSize: "42px", fontWeight: "900", color: "#f0fdf4",
    position: "absolute", top: "12px", right: "18px",
    letterSpacing: "-2px", lineHeight: 1,
    background: "linear-gradient(180deg, #dcfce7 0%, transparent 100%)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  stepIconWrap: {
    width: "56px", height: "56px", borderRadius: "50%",
    backgroundColor: "#f0fdf4", color: "#16a34a",
    display: "flex", alignItems: "center", justifyContent: "center",
    margin: "0 auto 16px",
  },
  stepTitle: {
    fontSize: "16px", fontWeight: "700", color: "#111827",
    margin: "0 0 8px",
  },
  stepDesc: {
    fontSize: "13px", color: "#6b7280", lineHeight: "1.6", margin: 0,
  },
  stepArrow: {
    position: "absolute", right: "-14px", top: "50%", transform: "translateY(-50%)",
    zIndex: 1,
  },

  /* TESTIMONIALS */
  testimonialSection: {
    padding: "80px 24px",
  },
  testimonialGrid: {
    maxWidth: "1100px", margin: "0 auto",
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },
  testimonialCard: {
    padding: "28px", borderRadius: "16px",
    border: "1px solid #f3f4f6", backgroundColor: "#fff",
    boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
  },
  testimonialStars: {
    display: "flex", gap: "2px", marginBottom: "14px",
  },
  testimonialText: {
    fontSize: "15px", color: "#374151", lineHeight: "1.7",
    margin: "0 0 20px", fontStyle: "italic",
  },
  testimonialAuthor: {
    display: "flex", alignItems: "center", gap: "12px",
  },
  testimonialAvatar: {
    width: "40px", height: "40px", borderRadius: "50%",
    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: "700", fontSize: "16px",
  },

  /* CTA */
  ctaSection: {
    padding: "40px 24px 80px",
  },
  ctaInner: {
    maxWidth: "800px", margin: "0 auto", textAlign: "center",
    padding: "60px 40px", borderRadius: "24px",
    background: "linear-gradient(135deg, #f0fdf4 0%, #eff6ff 50%, #f5f3ff 100%)",
    border: "1px solid #e5e7eb", position: "relative", overflow: "hidden",
  },
  ctaBlob: {
    position: "absolute", top: "-80px", right: "-80px",
    width: "250px", height: "250px", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(22,163,74,0.1) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  ctaTitle: {
    fontSize: "32px", fontWeight: "800", color: "#111827",
    margin: "0 0 12px", letterSpacing: "-0.5px",
    position: "relative",
  },
  ctaSub: {
    fontSize: "16px", color: "#6b7280", margin: "0 0 30px",
    lineHeight: "1.6", position: "relative",
  },
  ctaBtns: {
    display: "flex", gap: "14px", justifyContent: "center",
    flexWrap: "wrap", position: "relative",
  },
  ctaBtn: {
    display: "flex", alignItems: "center", gap: "8px",
    padding: "14px 32px", borderRadius: "12px", border: "none",
    background: "linear-gradient(135deg, #16a34a, #15803d)",
    color: "#fff", fontSize: "16px", fontWeight: "700",
    cursor: "pointer", boxShadow: "0 4px 14px rgba(22,163,74,0.3)",
  },
  ctaOutline: {
    padding: "14px 32px", borderRadius: "12px",
    border: "2px solid #d1d5db", backgroundColor: "#fff",
    color: "#374151", fontSize: "16px", fontWeight: "700",
    cursor: "pointer",
  },

  /* FOOTER */
  footer: {
    backgroundColor: "#fafbfc", borderTop: "1px solid #f3f4f6",
    padding: "50px 24px 0",
  },
  footerInner: {
    maxWidth: "1100px", margin: "0 auto",
    display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr",
    gap: "40px", paddingBottom: "40px",
  },
  footerBrand: {},
  footerCol: {
    display: "flex", flexDirection: "column", gap: "10px",
  },
  footerHead: {
    fontSize: "14px", fontWeight: "700", color: "#111827",
    margin: "0 0 4px",
  },
  footerLink: {
    fontSize: "13px", color: "#6b7280", textDecoration: "none",
    cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
  },
  footerBottom: {
    borderTop: "1px solid #f3f4f6", padding: "20px 0",
    textAlign: "center", fontSize: "13px", color: "#9ca3af",
  },
};

export default Home;
