import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import OAuthCallback from './pages/OAuthCallback';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                    element={<Landing />} />
        <Route path="/login"               element={<Login />} />
        <Route path="/signup"              element={<Signup />} />
        <Route path="/forgot-password"     element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/dashboard/*"         element={<Dashboard />} />
        <Route path="/oauth/callback"       element={<OAuthCallback />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
