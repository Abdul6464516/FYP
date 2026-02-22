import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // On mount, restore session from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('userData');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        setIsLoggedIn(true);
      } catch {
        // corrupted data — clear it
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  // Called after successful login or signup
  const loginUserContext = (tokenValue, userData) => {
    setToken(tokenValue);
    setUser(userData);
    setIsLoggedIn(true);

    localStorage.setItem('token', tokenValue);
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
  };

  // Called on logout
  const logoutUser = () => {
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
    localStorage.clear();
  };

  // Called when profile is updated (e.g. PatientProfile)
  const updateUserContext = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('userData', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <UserContext.Provider value={{ user, token, isLoggedIn, loading, loginUserContext, logoutUser, updateUserContext }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
