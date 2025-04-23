import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaArrowLeft, FaUserShield } from 'react-icons/fa';
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-hot-toast';
const base = "http://localhost:6001";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [showAdminOption, setShowAdminOption] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    // Check if redirected from a user-only page like Report Issue
    const userOnlyLogin = localStorage.getItem('userOnlyLogin');
    if (userOnlyLogin === 'true') {
      // Hide admin option
      setShowAdminOption(false);
      localStorage.removeItem('userOnlyLogin');
    }
    
    // Check if redirected from Add Tender 
    const redirectToAdmin = localStorage.getItem('loginAsAdmin');
    if (redirectToAdmin === 'true') {
      // Clear this flag and redirect to admin login
      localStorage.removeItem('loginAsAdmin');
      navigate('/admin/login');
      return;
    }
    
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      // Verify token
      axios.get(`${base}/api/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(() => {
        navigate('/'); // Redirect to homepage
      })
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${base}/api/auth/login`, formData);
      
      // Store token and user info
      localStorage.setItem("token", response.data.token);
      
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      // Set default authorization header for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
      
      toast.success('Login successful!');
      
      // Redirect to home or original destination
      const redirectUrl = localStorage.getItem('redirectUrl') || '/';
      localStorage.removeItem('redirectUrl');
      
      navigate(redirectUrl);
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const redirectToAdminLogin = () => {
    // Redirect to admin login page
    navigate('/admin/login');
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
                <h1 className="text-2xl font-bold">Login</h1>
                <p className="text-sm opacity-90">
                  Access your SheherConnect account
                </p>
              </div>
            </div>
          </div>

          {/* Admin login redirect - only shown when not coming from user-only page */}
          {showAdminOption && (
            <div className="bg-gray-50 px-6 py-3 flex justify-between items-center border-b border-gray-200">
              <span className="text-sm font-medium text-gray-600">
                User Login
              </span>
              <button
                type="button"
                onClick={redirectToAdminLogin}
                className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 rounded-full text-sm font-medium text-orange-600 hover:bg-orange-200"
              >
                <FaUserShield size={16} />
                Admin Login
              </button>
            </div>
          )}

          {/* Form */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="example@email.com"
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
                    <FaUser />
                    Login
                  </>
                )}
              </button>
              
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/signup" className="text-orange-500 hover:text-orange-600 font-medium">
                  Sign Up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
