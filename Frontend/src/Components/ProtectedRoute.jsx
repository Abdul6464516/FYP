import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { toast } from 'react-toastify';

const roleDashboard = {
  patient: '/patient',
  doctor: '/doctor',
  admin: '/admin',
};

const ProtectedRoute = ({ allowedRole, children }) => {
  const { user, isLoggedIn } = useUser();

  const isUnauthorized = isLoggedIn && user && user.role !== allowedRole;

  useEffect(() => {
    if (!isLoggedIn || !user) {
        console.log("Hey",user,isLoggedIn);
    } else if (isUnauthorized) {
      toast.error(`Access denied! Redirecting to your ${user.role} dashboard`);
    }
  }, [isLoggedIn, user, isUnauthorized]);

  // Not logged in — redirect to login
  if (!isLoggedIn || !user) {
    return <Navigate to="/" replace />;
  }

  // Logged in but wrong role — redirect to their own dashboard
  if (isUnauthorized) {
    return <Navigate to={roleDashboard[user.role] || '/'} replace />;
  }

  // Authorized — render the page
  return children;
};

export default ProtectedRoute;
