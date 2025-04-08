import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated import for React 18
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root')); // createRoot instead of render

root.render(
  <Router>
    <AuthProvider>
      <App />
    </AuthProvider>
  </Router>
);
