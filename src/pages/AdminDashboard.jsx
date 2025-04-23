import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaFileUpload, FaFilePdf, FaBuilding, FaCalendarAlt, FaUserTie, 
  FaTrash, FaEdit, FaSignOutAlt, FaTimes, FaChartLine, 
  FaClipboardList, FaCheckCircle, FaExclamationTriangle, FaTachometerAlt,
  FaSearch, FaFilter, FaEllipsisH, FaSort, FaThLarge, FaList
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Set default axios base URL if not already set
if (!axios.defaults.baseURL) {
  axios.defaults.baseURL = 'http://localhost:6001';
}

const StatCard = ({ icon, title, value, color, trend }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className={`bg-white p-5 rounded-xl shadow-md overflow-hidden border border-gray-100 hover:border-${color}-200 transition-all relative`}
  >
    <div className={`absolute top-0 left-0 w-full h-1 bg-${color}-500`}></div>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-3xl font-bold mt-1 text-gray-800">{value}</h3>
        {trend && (
          <p className={`text-xs mt-1 ${trend >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
          </p>
        )}
      </div>
      <div className={`text-${color}-500 p-3 bg-${color}-50 rounded-xl`}>
        {icon}
      </div>
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const [tenders, setTenders] = useState([]);
  const [filteredTenders, setFilteredTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        console.error('No admin token found, redirecting to login');
        navigate('/admin/login');
        return;
      }
      
      try {
        console.log('Checking admin status with token');
        // Continue with fetch tenders
        fetchTenders();
      } catch (error) {
        console.error('Error checking admin status:', error);
        toast.error('Authentication error. Please login again.');
        handleLogout();
      }
    };
    
    checkAdminStatus();
  }, [navigate]);

  const fetchTenders = async () => {
    try {
      setLoading(true);
      const adminToken = localStorage.getItem('adminToken');
      console.log('Fetching tenders with admin token');
      
      // Use direct axios call to troubleshoot
      const response = await axios({
        method: 'get',
        url: '/api/tenders',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      
      console.log('Tenders fetched successfully:', response.data.length);
      setTenders(response.data);
      setFilteredTenders(response.data);
    } catch (error) {
      console.error('Error fetching tenders:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        handleLogout();
      } else {
        toast.error('Failed to load tenders');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Filter tenders based on search term and filter type
    let result = tenders;
    
    if (searchTerm) {
      result = result.filter(tender => 
        tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tender.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tender.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterType !== 'All') {
      result = result.filter(tender => tender.type === filterType);
    }
    
    if (activeTab === 'upcoming') {
      result = result.filter(tender => new Date(tender.deadline) > new Date());
    } else if (activeTab === 'expired') {
      result = result.filter(tender => new Date(tender.deadline) < new Date());
    }
    
    setFilteredTenders(result);
  }, [searchTerm, filterType, tenders, activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const handleDeleteTender = async (tenderId) => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      console.log('Deleting tender with ID:', tenderId);
      
      // Use direct axios call to troubleshoot
      await axios({
        method: 'delete',
        url: `/api/tenders/${tenderId}`,
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      
      toast.success('Tender deleted successfully');
      fetchTenders();
    } catch (error) {
      console.error('Error deleting tender:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        handleLogout();
      } else {
        toast.error('Failed to delete tender');
      }
    }
  };

  // Calculate statistics
  const activeCount = tenders.filter(tender => new Date(tender.deadline) > new Date()).length;
  const expiredCount = tenders.filter(tender => new Date(tender.deadline) < new Date()).length;
  const openCount = tenders.filter(tender => tender.type === 'Open').length;
  const limitedCount = tenders.filter(tender => tender.type === 'Limited').length;

  const TenderGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {filteredTenders.map((tender) => (
        <motion.div
          key={tender._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -5 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all group"
        >
          <div className="p-5">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-bold text-gray-800 line-clamp-1 group-hover:text-orange-500 transition-colors">{tender.title}</h3>
              <div className="flex gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-blue-500 hover:text-blue-600 bg-blue-50 p-1.5 rounded-full"
                  title="Edit"
                >
                  <FaEdit size={14} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDeleteTender(tender._id)}
                  className="text-red-500 hover:text-red-600 bg-red-50 p-1.5 rounded-full"
                  title="Delete"
                >
                  <FaTrash size={14} />
                </motion.button>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="px-2 py-1 bg-orange-100 text-orange-600 rounded-full text-xs flex items-center gap-1">
                <FaBuilding className="text-xs" />
                {tender.department}
              </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center gap-1">
                <FaUserTie className="text-xs" />
                {tender.type}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${
                new Date(tender.deadline) > new Date() 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-red-100 text-red-600'
              }`}>
                <FaCalendarAlt className="text-xs" />
                {new Date(tender.deadline).toLocaleDateString()}
              </span>
            </div>
            
            <p className="text-gray-600 mt-3 text-sm line-clamp-2">{tender.description}</p>
            
            <div className="flex justify-end mt-4">
              <a
                href={tender.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-orange-500 hover:text-orange-600 font-medium bg-orange-50 px-3 py-1 rounded-full"
              >
                <FaFilePdf />
                View Document
              </a>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const TenderList = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredTenders.map((tender) => (
            <motion.tr 
              key={tender._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ backgroundColor: "#f9fafb" }}
              className="hover:bg-gray-50"
            >
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="text-sm font-medium text-gray-900">{tender.title}</div>
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-600">
                  {tender.department}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-600">
                  {tender.type}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  new Date(tender.deadline) > new Date() 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                }`}>
                  {new Date(tender.deadline).toLocaleDateString()}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <a
                    href={tender.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-500 hover:text-orange-600 bg-orange-50 p-1.5 rounded-full"
                  >
                    <FaFilePdf size={14} />
                  </a>
                  <button
                    className="text-blue-500 hover:text-blue-600 bg-blue-50 p-1.5 rounded-full"
                  >
                    <FaEdit size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteTender(tender._id)}
                    className="text-red-500 hover:text-red-600 bg-red-50 p-1.5 rounded-full"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="bg-gray-50">
      {/* Left sidebar - simplified and sized to avoid main header overlap */}
      <div className="fixed left-0 top-[72px] h-[calc(100vh-72px)] w-[220px] bg-white shadow-md z-10 hidden md:block">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Admin Panel</h2>
        </div>
        
        <div className="mt-4">
          <motion.button
            whileHover={{ x: 5 }}
            className="flex items-center w-full px-4 py-3 text-left text-gray-800 bg-orange-50 border-l-4 border-orange-500"
          >
            <FaTachometerAlt className="mr-3 text-orange-500" />
            Dashboard
          </motion.button>
          <motion.button
            whileHover={{ x: 5 }}
            className="flex items-center w-full px-4 py-3 text-left text-gray-600 hover:bg-gray-50"
          >
            <FaClipboardList className="mr-3 text-gray-500" />
            Tenders
          </motion.button>
        </div>
      </div>

      {/* Main Content - adjusted to account for top navbar */}
      <div className="md:ml-[220px] pt-4 min-h-[calc(100vh-72px)]">
        {/* Dashboard Content */}
        <div className="px-6 pb-6">
          {/* Page title and welcome message */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's an overview of your tenders.</p>
          </div>
          
          {/* Stats Section with enhanced cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            <StatCard 
              icon={<FaClipboardList size={24} />} 
              title="Total Tenders" 
              value={tenders.length} 
              color="blue" 
              trend={12}
            />
            <StatCard 
              icon={<FaCheckCircle size={24} />} 
              title="Active Tenders" 
              value={activeCount} 
              color="green" 
              trend={8}
            />
            <StatCard 
              icon={<FaExclamationTriangle size={24} />} 
              title="Expired Tenders" 
              value={expiredCount} 
              color="yellow" 
              trend={-5}
            />
            <StatCard 
              icon={<FaBuilding size={24} />} 
              title="Open Tenders" 
              value={openCount} 
              color="orange" 
              trend={15}
            />
          </div>

          {/* Tender Management Section with improved UI */}
          <div className="bg-white rounded-xl shadow-md mb-8 border border-gray-100">
            <div className="p-5 border-b border-gray-100">
              <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Tender Management</h2>
                  <p className="text-gray-600">Manage all tenders in one place</p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center gap-3 flex-wrap md:flex-nowrap">
                  <div className="relative w-full md:w-auto">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent w-full"
                    />
                  </div>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 w-full md:w-auto"
                  >
                    <option value="All">All Types</option>
                    <option value="Open">Open</option>
                    <option value="Limited">Limited</option>
                  </select>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all w-full md:w-auto"
                  >
                    <FaFileUpload />
                    Add Tender
                  </motion.button>
                </div>
              </div>

              {/* Enhanced Tabs and View toggles */}
              <div className="flex justify-between items-center border-b border-gray-200 mt-6">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-2 font-medium ${activeTab === 'all' 
                      ? 'text-orange-500 border-b-2 border-orange-500' 
                      : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    All Tenders
                  </button>
                  <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`px-4 py-2 font-medium ${activeTab === 'upcoming' 
                      ? 'text-orange-500 border-b-2 border-orange-500' 
                      : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Upcoming
                  </button>
                  <button
                    onClick={() => setActiveTab('expired')}
                    className={`px-4 py-2 font-medium ${activeTab === 'expired' 
                      ? 'text-orange-500 border-b-2 border-orange-500' 
                      : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Expired
                  </button>
                </div>

                {/* View toggle buttons */}
                <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 ${viewMode === 'grid' 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                    title="Grid view"
                  >
                    <FaThLarge size={14} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 ${viewMode === 'list' 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                    title="List view"
                  >
                    <FaList size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Tender List with conditional render based on view mode */}
            <div className="p-5">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading tenders...</p>
                </div>
              ) : filteredTenders.length > 0 ? (
                viewMode === 'grid' ? <TenderGrid /> : <TenderList />
              ) : (
                <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  <FaClipboardList className="mx-auto text-gray-400 text-4xl" />
                  <h3 className="text-xl font-semibold text-gray-600 mt-4">No tenders found</h3>
                  <p className="text-gray-500 mt-2 max-w-md mx-auto">
                    {searchTerm ? 'Try adjusting your search terms or filters' : 'Add your first tender to get started with the platform'}
                  </p>
                  {!searchTerm && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowAddForm(true)}
                      className="mt-4 inline-flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
                    >
                      <FaFileUpload />
                      Add Your First Tender
                    </motion.button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Tender Form Modal - Enhanced */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Add New Tender</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-500 hover:text-gray-700 bg-gray-100 p-2 rounded-full"
                >
                  <FaTimes size={18} />
                </motion.button>
              </div>
              
              {/* Form would go here - using existing form */}
              
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 