import axios from 'axios';

// Configure axios defaults
axios.defaults.baseURL = 'https://sheher-backend.onrender.com';

// Add request interceptor for handling auth tokens
axios.interceptors.request.use(
  (config) => {
    // For admin API requests, check if the URL includes /admin/ and use adminToken
    if (config.url.includes('/api/admin') || config.url.includes('/api/auth/admin')) {
      const adminToken = localStorage.getItem('adminToken');
      if (adminToken) {
        config.headers['Authorization'] = `Bearer ${adminToken}`;
        console.log('Using admin token for request to:', config.url);
      }
    } else {
      // For regular API requests, use the regular token
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for handling common errors
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Determine which token to remove based on the URL
      if (error.config.url.includes('/api/admin') || error.config.url.includes('/api/auth/admin')) {
        console.log('Admin token unauthorized, clearing token');
        localStorage.removeItem('adminToken');
        
        // Only redirect to admin login if we're not already on admin login page
        const currentPath = window.location.pathname;
        if (!currentPath.includes('/admin/login')) {
          localStorage.setItem('redirectUrl', currentPath);
          window.location.href = '/admin/login';
        }
      } else {
        // Handle unauthorized access for regular users
        localStorage.removeItem('token');
        // Only redirect to login page if we're not already on a login page and not in an API call
        const currentPath = window.location.pathname;
        if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
          // Store the current path for redirect after login
          localStorage.setItem('redirectUrl', currentPath);
          // Don't automatically redirect - let the component handle it
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axios; 