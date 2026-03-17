import React, { useState, useRef, useEffect } from "react";
import { LogOut, User } from "lucide-react";

const ProfileDropdown = ({ userName, userRole, onLogout, onProfile, avatarIcon }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    setDropdownOpen(false);
    onProfile();
  };

  const handleLogoutClick = () => {
    setDropdownOpen(false);
    onLogout();
  };

  return (
    <div style={styles.container} ref={dropdownRef}>
      {/* Profile Avatar Button */}
      <button
        style={styles.avatarBtn}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        title={userName}
      >
        <div style={styles.avatar}>
          {avatarIcon}
        </div>
      </button>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div style={styles.dropdown}>
          {/* User Info */}
          <div style={styles.userInfo}>
            <div style={styles.dropdownAvatar}>
              {avatarIcon}
            </div>
            <div style={styles.userDetails}>
              <div style={styles.fullName}>{userName}</div>
              <div style={styles.role}>{userRole}</div>
            </div>
          </div>

          <div style={styles.divider} />

          {/* Profile Button */}
          <button style={styles.dropdownItem} onClick={handleProfileClick}>
            <User size={16} />
            <span>View Profile</span>
          </button>

          {/* Logout Button */}
          <button style={styles.dropdownItem} onClick={handleLogoutClick}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  avatarBtn: {
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    padding: "4px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #0d9488, #0f766e)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
  },
  dropdown: {
    position: "absolute",
    top: "calc(100% + 12px)",
    right: 0,
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    border: "1px solid #e5e7eb",
    zIndex: 1000,
    minWidth: "240px",
    overflow: "hidden",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px",
  },
  dropdownAvatar: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #0d9488, #0f766e)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  userDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  fullName: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#111827",
  },
  role: {
    fontSize: "12px",
    color: "#6b7280",
    fontWeight: "500",
    textTransform: "capitalize",
  },
  divider: {
    height: "1px",
    backgroundColor: "#e5e7eb",
  },
  dropdownItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    width: "100%",
    padding: "12px 16px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontSize: "14px",
    color: "#374151",
    fontWeight: "500",
    transition: "all 0.2s",
    textAlign: "left",
  },
  dropdownItemHover: {
    backgroundColor: "#f9fafb",
    color: "#16a34a",
  },
};

export default ProfileDropdown;
