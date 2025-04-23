import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import './App.css'; // Import App.css for styles like gradient-text

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import NewsPage from './pages/NewsPage';
import ProjectsPage from './pages/ProjectsPage';
import CommunityFeed from './pages/CommunityFeed';
import TendersPage from './pages/TendersPage';
import ReportIssue from './pages/ReportIssue';

import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFoundPage from './pages/NotFoundPage';

import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

// Protected user route
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  return user ? children : <Navigate to="/login" />;
};

// Protected admin route
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    localStorage.setItem('redirectUrl', window.location.pathname);
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

// Prevent logged-in users from accessing login/signup
const AuthRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  return user ? <Navigate to="/" /> : children;
};

function App() {
  useEffect(() => {
    // Set up axios authorization headers for initial page load
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Setting regular user token in axios defaults');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    // Also set up adminToken if it exists
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      console.log('Admin token found in localStorage');
      
      // We'll use axios interceptors to handle admin routes in axiosConfig.js
      // Just printing info here for debugging
      console.log('Admin token:', adminToken.substring(0, 10) + '...');
    }
    
    // Add event listener to handle storage changes (logout in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'adminToken' && !e.newValue) {
        console.log('Admin token removed in another tab');
        if (window.location.pathname.includes('/admin/')) {
          window.location.href = '/admin/login';
        }
      }
      if (e.key === 'token' && !e.newValue) {
        console.log('User token removed in another tab');
        if (window.location.pathname.includes('/report-issue')) {
          window.location.href = '/login';
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <Toaster position="top-right" />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/community" element={<CommunityFeed />} />
            <Route path="/tenders" element={<TendersPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/report-issue"
              element={
                <ProtectedRoute>
                  <ReportIssue />
                </ProtectedRoute>
              }
            />
            <Route
              path="/login"
              element={
                <AuthRoute>
                  <Login />
                </AuthRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <AuthRoute>
                  <Signup />
                </AuthRoute>
              }
            />
            <Route path="/test-404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
