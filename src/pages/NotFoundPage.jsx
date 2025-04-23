import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHome, FaArrowLeft, FaExclamationTriangle, FaSearch, FaRoad, FaCompass } from 'react-icons/fa';

const NotFoundPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [showTip, setShowTip] = useState(false);
  
  // Quick links for navigation
  const quickLinks = [
    { to: '/', label: 'Home', icon: <FaHome className="mr-1" /> },
    { to: '/community', label: 'Community' },
    { to: '/projects', label: 'Projects' },
    { to: '/tenders', label: 'Tenders' }
  ];

  // Cycle through tips every 5 seconds
  useEffect(() => {
    setShowTip(true);
    const timer = setInterval(() => {
      setShowTip(prev => !prev);
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  
  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      // This would ideally connect to a search API
      // For now, just redirect to home with a query param
      navigate(`/?search=${encodeURIComponent(searchValue)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto w-full"
      >
        {/* Illustration Element */}
        <motion.div 
          className="w-full flex justify-center mb-8"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ 
            repeat: Infinity, 
            repeatType: "reverse", 
            duration: 2
          }}
        >
          <div className="relative w-48 h-48 flex items-center justify-center">
            <motion.div 
              className="absolute inset-0 bg-orange-100 rounded-full opacity-20"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ 
                repeat: Infinity,
                duration: 3
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
                <motion.path
                  d="M50 20 L70 40 L70 70 L30 70 L30 40 Z"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 0.5 }}
                />
                <motion.circle
                  cx="50"
                  cy="38"
                  r="5"
                  fill="#f97316"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.5 }}
                />
                <motion.path
                  d="M48 55 L52 55"
                  stroke="#f97316"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 2 }}
                />
                <motion.path
                  d="M46 62 L54 62"
                  stroke="#f97316"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 2.2 }}
                />
              </svg>
            </div>
          </div>
        </motion.div>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-8 relative">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative flex items-center justify-center flex-col">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white/20 backdrop-blur-sm rounded-full p-5 mb-4"
              >
                <FaExclamationTriangle className="text-white text-4xl" />
              </motion.div>
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-7xl font-bold text-white"
              >
                404
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-white/90 text-xl font-medium mt-2"
              >
                Page Not Found
              </motion.p>
            </div>
          </div>
            
          {/* Content */}
          <div className="p-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800">Oops! You've ventured into unknown territory</h2>
              <p className="text-gray-600 mt-2 max-w-md mx-auto">
                The page you are looking for might have been removed, had its name changed, 
                or is temporarily unavailable.
              </p>
              
              <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-100 text-orange-800 text-sm">
                <div className="flex items-center gap-2">
                  <FaSearch className="text-orange-500 flex-shrink-0" />
                  <span className="font-medium">Attempted path:</span> 
                  <code className="bg-orange-100 px-2 py-0.5 rounded truncate max-w-[200px] sm:max-w-xs">{location.pathname}</code>
                </div>
                
                <AnimatePresence mode="wait">
                  {showTip && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 flex items-start gap-2 text-left"
                    >
                      <FaRoad className="text-orange-500 mt-1 flex-shrink-0" />
                      <p className="text-xs text-orange-700">
                        <span className="font-semibold">Tip:</span> Check if you typed the URL correctly. URLs are case sensitive and should not contain spaces.
                      </p>
                    </motion.div>
                  )}
                  {!showTip && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 flex items-start gap-2 text-left"
                    >
                      <FaCompass className="text-orange-500 mt-1 flex-shrink-0" />
                      <p className="text-xs text-orange-700">
                        <span className="font-semibold">Tip:</span> Try using the search below or navigate to one of our main sections.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Search Box */}
              <form onSubmit={handleSearch} className="mt-6">
                <div className="relative max-w-md mx-auto">
                  <input
                    type="text"
                    placeholder="Search for content..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 text-white text-sm px-3 py-1 rounded-lg"
                  >
                    Search
                  </motion.button>
                </div>
              </form>
            </div>
            
            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(-1)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
              >
                <FaArrowLeft />
                Go Back
              </motion.button>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                  <FaHome />
                  Back to Home
                </Link>
              </motion.div>
            </div>
            
            {/* Quick Links */}
            <div className="mt-8 border-t border-gray-100 pt-6">
              <p className="text-sm font-medium text-gray-600 mb-3 text-center">
                Or check out these popular pages:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {quickLinks.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 transition-colors hover:scale-105"
                  >
                    {link.icon} {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          If you think this is an error, please <a href="#" className="text-orange-500 hover:underline">contact support</a>.
        </p>
      </motion.div>
    </div>
  );
};

export default NotFoundPage; 