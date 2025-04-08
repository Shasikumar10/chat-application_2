import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Correctly using useNavigate

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();  // Replaced history with useNavigate

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // You could also decode the token and verify it if needed
      setUser({ token });  // Store the token or user data if needed
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('token', userData.token);
    navigate('/chat');  // Correctly using navigate instead of history.push
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    navigate('/login');  // Correctly using navigate instead of history.push
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
