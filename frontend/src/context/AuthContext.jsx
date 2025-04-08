import React, { createContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Decode and verify token if needed, and set the user state
      // Set user state with decoded information if necessary
      setUser({ token }); // Just as an example, adjust based on how you structure the user data
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('token', userData.token);
    history.push('/chat'); // Redirect to chat page or dashboard
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    history.push('/login'); // Redirect to login page
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
