import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaFileUpload, FaFilePdf, FaBuilding, FaCalendarAlt, FaUserTie, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Set default axios base URL if not already set
if (!axios.defaults.baseURL) {
  axios.defaults.baseURL = 'https://sheher-backend.onrender.com';
}

// Mock tenders data
const mockTenders = [
  {
    _id: '1',
    title: 'Construction of Community Center',
    department: 'Public Works',
    type: 'Open',
    description: 'Invitation for bids for the construction of a new community center in the downtown area. The project includes a multi-purpose hall, library, and recreational facilities.',
    deadline: '2024-06-15',
    fileUrl: '/sample.pdf'
  },
  {
    _id: '2',
    title: 'Road Maintenance Contract',
    department: 'Transportation',
    type: 'Limited',
    description: 'Annual maintenance contract for city roads and highways. The contract includes pothole repairs, resurfacing, and general maintenance work.',
    deadline: '2024-05-30',
    fileUrl: '/sample.pdf'
  },
  {
    _id: '3',
    title: 'School Furniture Supply',
    department: 'Education',
    type: 'Open',
    description: 'Supply of furniture for 10 new classrooms in public schools. The tender includes desks, chairs, and storage units meeting specific safety standards.',
    deadline: '2024-07-10',
    fileUrl: '/sample.pdf'
  },
  {
    _id: '4',
    title: 'Waste Management Services',
    department: 'Sanitation',
    type: 'Open',
    description: 'Comprehensive waste management services for the city, including collection, transportation, and disposal of municipal solid waste.',
    deadline: '2024-06-25',
    fileUrl: '/sample.pdf'
  },
  {
    _id: '5',
    title: 'IT Infrastructure Upgrade',
    department: 'Information Technology',
    type: 'Limited',
    description: 'Upgrade of city hall IT infrastructure including servers, networking equipment, and security systems.',
    deadline: '2024-07-05',
    fileUrl: '/sample.pdf'
  },
  {
    _id: '6',
    title: 'Park Renovation Project',
    department: 'Parks & Recreation',
    type: 'Open',
    description: 'Complete renovation of Central Park including landscaping, playground equipment, and walking trails.',
    deadline: '2024-08-15',
    fileUrl: '/sample.pdf'
  }
];

const TenderCard = ({ tender }) => (
    <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5 }}
    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
  >
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">{tender.title}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full flex items-center gap-1">
              <FaBuilding className="text-xs" />
              {tender.department}
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full flex items-center gap-1">
              <FaUserTie className="text-xs" />
              {tender.type}
            </span>
          </div>
            </div>
          </div>
      
      <p className="text-gray-600 mb-4 line-clamp-3">{tender.description}</p>
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500 flex items-center gap-1">
          <FaCalendarAlt className="text-orange-500" />
          <span>Deadline: {new Date(tender.deadline).toLocaleDateString()}</span>
        </div>
        <a
          href={tender.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium"
        >
          <FaFilePdf />
          View Document
        </a>
      </div>
    </div>
        </motion.div>
);

const AddTenderForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    description: '',
    type: 'Open',
    deadline: '',
    file: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
      toast.error('Please login as admin first');
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key]) data.append(key, formData[key]);
    });

    try {
      await axios.post('/api/tenders', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Tender added successfully!');
      setFormData({
        title: '',
        department: '',
        description: '',
        type: 'Open',
        deadline: '',
        file: null
      });
      onSuccess();
      onClose();
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Please login as admin first');
        localStorage.removeItem('adminToken');
        onClose();
      } else {
        toast.error('Failed to add tender. Please try again.');
        console.error('Error adding tender:', error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Add New Tender</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes size={24} />
            </button>
                </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                >
                  <option value="Open">Open</option>
                  <option value="Limited">Limited</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows="3"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Document (PDF/DOCX)</label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    accept=".pdf,.doc,.docx"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <FaFileUpload />
                Upload Tender
              </button>
            </div>
          </form>
            </div>
          </motion.div>
    </div>
  );
};

const TendersPage = () => {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();

  const fetchTenders = async () => {
    try {
      // For demo purposes, using mock data
      // In production, you would use the actual API call:
      // const response = await axios.get('/api/tenders');
      // setTenders(response.data);
      
      // Simulate API delay
      setTimeout(() => {
        setTenders(mockTenders);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching tenders:', error);
      toast.error('Failed to load tenders');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenders();
  }, []);

  const handleAddTender = () => {
    try {
      console.log('Add Tender button clicked, redirecting to admin login');
      
      // Set redirect URL to return after login
      localStorage.setItem('redirectUrl', '/tenders');
      
      // Redirect to admin login page
      try {
        navigate('/admin/login');
      } catch (navError) {
        console.error('React Router navigation error:', navError);
        // Fallback to direct window location change
        window.location.href = '/admin/login';
      }
    } catch (error) {
      console.error('Navigation error:', error);
      toast.error('Failed to navigate to admin login. Please try again.');
      
      // Ultimate fallback
      setTimeout(() => {
        window.location.href = '/admin/login';
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section with Orange Gradient */}
      <div className="relative bg-gradient-to-r from-orange-500 to-pink-500">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 py-24">
          <div className="text-white text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Government Tenders</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Browse and apply for government tenders in your city. Find opportunities that match your expertise.
            </p>
          </div>
        </div>
        </div>

      {/* White Section with Content */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Available Tenders</h2>
              <p className="text-gray-600">Find and apply for tenders that match your expertise</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddTender}
              className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-lg hover:shadow-xl"
            >
              <FaFileUpload />
              Add New Tender
            </motion.button>
        </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading tenders...</p>
            </div>
          ) : tenders.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {tenders.map((tender, index) => (
                <motion.div
                  key={tender._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <TenderCard tender={tender} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-600">No tenders available</h3>
              <p className="text-gray-500 mt-2">Please check back later for updates</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Tender Form Modal */}
      <AnimatePresence>
        {showAddForm && (
          <AddTenderForm
            onClose={() => setShowAddForm(false)}
            onSuccess={fetchTenders}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TendersPage; 