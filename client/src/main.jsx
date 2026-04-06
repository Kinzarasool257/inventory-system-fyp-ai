import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Includes Tailwind CSS
import { AuthProvider } from "./context/AuthContext.jsx";
ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
  <React.StrictMode>
    <App />
  </React.StrictMode>
 </AuthProvider>
);