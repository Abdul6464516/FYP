import { useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "../context/UserContext";

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, isLoggedIn, loading } = useUser();
  const toastShown = useRef(false);

  const hasCorrectRole = !allowedRole || (user && user.role === allowedRole);

  useEffect(() => {
    if (loading) return; // wait until session is restored

    if (!toastShown.current) {
      if (!isLoggedIn || !user) {
        toast.error("You must be logged in to access your dashboard");
        toastShown.current = true;
      } else if (!hasCorrectRole) {
        toast.error("You are not authorized to access this dashboard");
        toastShown.current = true;
      }
    }
  }, [loading, isLoggedIn, user, hasCorrectRole]);

  // Wait for session restore before making any decision
  if (loading) {
    return null;
  }

  // Not authenticated → go to login
  if (!isLoggedIn || !user) {
    return <Navigate to="/" replace />;
  }

  // Authenticated but wrong role → redirect to their own dashboard
  if (!hasCorrectRole) {
    const roleDashboard = {
      patient: "/patient",
      doctor: "/doctor",
      admin: "/admin",
    };
    return <Navigate to={roleDashboard[user.role] || "/"} replace />;
  }

  return children;
};

export default ProtectedRoute;
