import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUserShield, FaLock, FaArrowLeft } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Define the API base URL
const base = 'http://localhost:6001';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    // Clear any error messages on component load
    setErrorMessage('');
    
    // Check if admin is already logged in
    const token = localStorage.getItem('adminToken');
    if (token) {
      // Verify token validity
      const verifyToken = async () => {
        try {
          console.log('Verifying admin token...');
          
          // Make direct axios call without interceptors to troubleshoot
          const res = await axios({
            method: 'get',
            url: `${base}/api/auth/admin/verify`,
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          console.log('Admin token verification response:', res.data);
          
          if (res.data.valid) {
            console.log('Admin token is valid, redirecting to:', localStorage.getItem('redirectUrl') || '/admin/dashboard');
            const redirectUrl = localStorage.getItem('redirectUrl') || '/admin/dashboard';
            navigate(redirectUrl);
            localStorage.removeItem('redirectUrl');
          } else {
            console.warn('Token exists but is not valid');
            localStorage.removeItem('adminToken');
          }
        } catch (error) {
          console.error('Admin token verification failed:', error.response?.data || error.message);
          localStorage.removeItem('adminToken');
        }
      };
      verifyToken();
    } else {
      console.log('No admin token found, showing login form');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      console.log('Attempting admin login with:', { email: formData.email, url: `${base}/api/auth/admin/login` });
      
      // Make direct axios call without interceptors to troubleshoot
      const response = await axios({
        method: 'post',
        url: `${base}/api/auth/admin/login`,
        data: formData
      });
      
      console.log('Admin login response:', response.data);
      
      if (!response.data.token) {
        throw new Error('No token received from server');
      }
      
      const { token } = response.data;
      
      // Store the token
      localStorage.setItem('adminToken', token);
      console.log('Admin token stored in localStorage');
      
      // Also set it in axios defaults for immediate use
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Get the redirect URL or default to admin dashboard
      const redirectUrl = localStorage.getItem('redirectUrl') || '/admin/dashboard';
      localStorage.removeItem('redirectUrl');
      
      toast.success('Admin login successful!');
      console.log('Redirecting to', redirectUrl);
      
      try {
        navigate(redirectUrl);
      } catch (navError) {
        console.error('Navigation error:', navError);
        // Fallback if navigation fails
        window.location.href = redirectUrl;
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Login failed. Please try again.';
      console.error('Login error details:', errorMsg);
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-6 text-white">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-white hover:text-gray-200">
                <FaArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Admin Login</h1>
                <p className="text-sm opacity-90">Access the admin dashboard</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-6">
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
                {errorMessage}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUserShield className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="admin@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <FaUserShield />
                    Login
                  </>
                )}
              </button>
              
              {import.meta.env.DEV && (
                <div className="text-center mt-4">
                  <button 
                    type="button"
                    onClick={() => {
                      // For testing only in development
                      const testToken = "test-admin-token-for-development-only";
                      localStorage.setItem('adminToken', testToken);
                      console.log('Set test admin token:', testToken);
                      toast.success('Test admin login successful!');
                      navigate('/admin/dashboard');
                    }}
                    className="text-xs text-blue-500 underline"
                  >
                    Test Login (Dev Only)
                  </button>
                </div>
              )}
              
              <div className="text-center mt-4">
                <p className="text-xs text-gray-500">
                  Having trouble logging in? Contact the system administrator.
                </p>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin; 