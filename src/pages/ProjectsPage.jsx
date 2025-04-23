import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaFilter, FaMapMarkerAlt, FaCalendarAlt, FaRupeeSign, FaBuilding, FaUsers, FaChartLine } from 'react-icons/fa';
import ProjectCard from '../components/ProjectCard';
import FilterPanel from '../components/FilterPanel';
import StatusBadge from '../components/StatusBadge';
import ProgressBar from '../components/ProgressBar';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    category: 'All',
    status: 'All',
    ward: 'All',
    budgetRange: [0, 1000],
    searchQuery: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    ongoing: 0,
    budget: 0
  });

  // Mock data - Replace with actual API call
  useEffect(() => {
    const mockProjects = [
      {
        id: 1,
        title: "Smart City Infrastructure",
        description: "Development of smart city infrastructure including IoT sensors and traffic management systems.",
        category: "Infrastructure",
        status: "In Progress",
        ward: "Ward 1",
        department: "Public Works",
        startDate: "2023-01-15",
        endDate: "2024-12-31",
        budget: 250,
        progress: 45,
        location: "Central Business District",
        milestones: [
          { date: "2023-03-15", title: "Initial Survey", completed: true },
          { date: "2023-06-30", title: "Design Approval", completed: true },
          { date: "2023-12-31", title: "Phase 1 Completion", completed: false },
          { date: "2024-06-30", title: "Phase 2 Completion", completed: false },
          { date: "2024-12-31", title: "Project Completion", completed: false }
        ]
      },
      {
        id: 2,
        title: "Green Park Development",
        description: "Creation of a new eco-friendly park with sustainable features and community spaces.",
        category: "Environment",
        status: "Completed",
        ward: "Ward 2",
        department: "Parks & Recreation",
        startDate: "2022-06-01",
        endDate: "2023-05-30",
        budget: 75,
        progress: 100,
        location: "East Side Park Area",
        milestones: [
          { date: "2022-08-15", title: "Land Preparation", completed: true },
          { date: "2022-11-30", title: "Planting Phase", completed: true },
          { date: "2023-02-28", title: "Facility Construction", completed: true },
          { date: "2023-05-30", title: "Final Inspection", completed: true }
        ]
      },
      {
        id: 3,
        title: "Public Transport Upgrade",
        description: "Modernization of public transport system with new buses and digital payment integration.",
        category: "Transportation",
        status: "In Progress",
        ward: "Ward 3",
        department: "Transport",
        startDate: "2023-03-01",
        endDate: "2024-06-30",
        budget: 180,
        progress: 30,
        location: "City Transport Hub",
        milestones: [
          { date: "2023-05-15", title: "Bus Procurement", completed: true },
          { date: "2023-08-30", title: "System Integration", completed: false },
          { date: "2024-02-28", title: "Testing Phase", completed: false },
          { date: "2024-06-30", title: "Full Deployment", completed: false }
        ]
      },
      {
        id: 4,
        title: "Digital Education Hub",
        description: "Establishment of a modern digital learning center with state-of-the-art facilities.",
        category: "Education",
        status: "Planning",
        ward: "Ward 4",
        department: "Education",
        startDate: "2024-01-01",
        endDate: "2025-12-31",
        budget: 120,
        progress: 10,
        location: "Education District",
        milestones: [
          { date: "2024-03-15", title: "Site Selection", completed: true },
          { date: "2024-06-30", title: "Design Finalization", completed: false },
          { date: "2024-12-31", title: "Construction Start", completed: false },
          { date: "2025-12-31", title: "Facility Launch", completed: false }
        ]
      },
      {
        id: 5,
        title: "Healthcare Center Expansion",
        description: "Expansion of existing healthcare facilities with new specialized departments.",
        category: "Healthcare",
        status: "In Progress",
        ward: "Ward 5",
        department: "Health",
        startDate: "2023-07-01",
        endDate: "2024-12-31",
        budget: 300,
        progress: 25,
        location: "Medical District",
        milestones: [
          { date: "2023-09-15", title: "Architectural Design", completed: true },
          { date: "2024-03-31", title: "Construction Phase 1", completed: false },
          { date: "2024-09-30", title: "Equipment Installation", completed: false },
          { date: "2024-12-31", title: "Facility Opening", completed: false }
        ]
      },
      {
        id: 6,
        title: "Waste Management System",
        description: "Implementation of an advanced waste segregation and recycling system.",
        category: "Environment",
        status: "Planning",
        ward: "Ward 6",
        department: "Sanitation",
        startDate: "2024-02-01",
        endDate: "2025-06-30",
        budget: 95,
        progress: 5,
        location: "City-wide Implementation",
        milestones: [
          { date: "2024-04-15", title: "System Design", completed: false },
          { date: "2024-08-31", title: "Equipment Procurement", completed: false },
          { date: "2025-02-28", title: "Pilot Testing", completed: false },
          { date: "2025-06-30", title: "Full Implementation", completed: false }
        ]
      }
    ];

    setProjects(mockProjects);
    setFilteredProjects(mockProjects);
    calculateStats(mockProjects);
  }, []);

  const calculateStats = (projects) => {
    const total = projects.length;
    const completed = projects.filter(p => p.status === "Completed").length;
    const ongoing = projects.filter(p => p.status === "In Progress").length;
    const budget = projects.reduce((sum, p) => sum + p.budget, 0);

    setStats({ total, completed, ongoing, budget });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    const filtered = projects.filter(project => {
      const matchesCategory = newFilters.category === 'All' || project.category === newFilters.category;
      const matchesStatus = newFilters.status === 'All' || project.status === newFilters.status;
      const matchesWard = newFilters.ward === 'All' || project.ward === newFilters.ward;
      const matchesBudget = project.budget >= newFilters.budgetRange[0] && project.budget <= newFilters.budgetRange[1];
      const matchesSearch = project.title.toLowerCase().includes(newFilters.searchQuery.toLowerCase()) ||
                          project.description.toLowerCase().includes(newFilters.searchQuery.toLowerCase());

      return matchesCategory && matchesStatus && matchesWard && matchesBudget && matchesSearch;
    });

    setFilteredProjects(filtered);
    calculateStats(filtered);
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* Page Header with Gradient */}
      <div className="bg-gradient-to-r from-[#F27C24] to-[#1E3A8A] text-white">
        <div className="max-w-7xl mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
          >
            <div>
              <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-3">
                Government Projects & Tracking
              </h1>
              <p className="text-white/90 font-inter text-lg">
                Stay informed about local initiatives across Jaipur
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="w-full md:w-96">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={filters.searchQuery}
                  onChange={(e) => handleFilterChange({ ...filters, searchQuery: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" />
              </div>
            </div>
          </motion.div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-12">
            <motion.div 
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  <FaBuilding className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-white/80 text-sm">Total Projects</p>
                  <p className="text-white font-bold text-2xl">{stats.total}</p>
                </div>
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  <FaChartLine className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-white/80 text-sm">Completed</p>
                  <p className="text-white font-bold text-2xl">{Math.round((stats.completed / stats.total) * 100)}%</p>
                </div>
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  <FaUsers className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-white/80 text-sm">Ongoing</p>
                  <p className="text-white font-bold text-2xl">{Math.round((stats.ongoing / stats.total) * 100)}%</p>
                </div>
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  <FaRupeeSign className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-white/80 text-sm">Budget Tracked</p>
                  <p className="text-white font-bold text-2xl">₹{stats.budget} Cr</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 -mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Panel */}
          <div className="lg:w-1/4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-8"
            >
              <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
            </motion.div>
          </div>

          {/* Project Grid */}
          <div className="lg:w-3/4">
            <AnimatePresence>
              {filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredProjects.map((project) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProjectCard
                        project={project}
                        onClick={() => handleProjectClick(project)}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="bg-white rounded-xl p-8 shadow-sm">
                    <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">No Projects Found</h3>
                    <p className="text-[#5A5A5A]">Try adjusting your filters or search criteria</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Feedback Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 bg-[#F27C24] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow"
      >
        <FaSearch className="text-xl" />
      </motion.button>
    </div>
  );
};

export default ProjectsPage; 