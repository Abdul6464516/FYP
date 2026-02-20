import { useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem("token");
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const userRole = localStorage.getItem("userRole");
  const toastShown = useRef(false);

  const isAuthenticated = token && isLoggedIn === "true";
  const hasCorrectRole = !allowedRole || userRole === allowedRole;

  useEffect(() => {
    if (!toastShown.current) {
      if (!isAuthenticated) {
        toast.error("You must login to access your dashboard");
        toastShown.current = true;
      } else if (!hasCorrectRole) {
        toast.error("You are not authorized to access this dashboard");
        toastShown.current = true;
      }
    }
  }, [isAuthenticated, hasCorrectRole]);

  // Not authenticated at all → go to login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Authenticated but wrong role → go to login
  if (!hasCorrectRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
