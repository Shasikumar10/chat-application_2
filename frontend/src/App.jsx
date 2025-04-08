import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom'; // Add Navigate import
import Login from './pages/Login';
import Register from './pages/Register'; 
import Chat from './pages/Chat'; 

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />  {/* Redirect root to login */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  );
};

export default App;
