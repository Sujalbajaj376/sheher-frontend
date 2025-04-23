import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter } from 'react-icons/fa';

const FilterPanel = ({ filters, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(true);

  const categories = ['All', 'Infrastructure', 'Environment', 'Health', 'Housing', 'Education', 'Transport'];
  const statuses = ['All', 'In Progress', 'Completed', 'Stalled'];
  const wards = ['All', 'Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5'];

  const handleSearch = (e) => {
    onFilterChange({ ...filters, searchQuery: e.target.value });
  };

  const handleCategoryChange = (category) => {
    onFilterChange({ ...filters, category });
  };

  const handleStatusChange = (status) => {
    onFilterChange({ ...filters, status });
  };

  const handleWardChange = (ward) => {
    onFilterChange({ ...filters, ward });
  };

  const handleBudgetChange = (e) => {
    onFilterChange({ ...filters, budgetRange: [0, parseInt(e.target.value)] });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-xl shadow-sm p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-[#1A1A1A] font-playfair">Filters</h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-[#5A5A5A] hover:text-[#1A1A1A]"
        >
          <FaFilter />
        </button>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search projects..."
              value={filters.searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F27C24] focus:border-transparent"
            />
            <FaSearch className="absolute left-3 top-3 text-[#5A5A5A]" />
          </div>

          {/* Category Filter */}
          <div>
            <h4 className="text-sm font-medium text-[#1A1A1A] mb-2">Category</h4>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    filters.category === category
                      ? 'bg-[#F27C24] text-white'
                      : 'bg-[#1E3A8A]/10 text-[#1E3A8A] hover:bg-[#1E3A8A]/20'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <h4 className="text-sm font-medium text-[#1A1A1A] mb-2">Status</h4>
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    filters.status === status
                      ? 'bg-[#F27C24] text-white'
                      : 'bg-[#1E3A8A]/10 text-[#1E3A8A] hover:bg-[#1E3A8A]/20'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Ward Filter */}
          <div>
            <h4 className="text-sm font-medium text-[#1A1A1A] mb-2">Ward</h4>
            <div className="flex flex-wrap gap-2">
              {wards.map((ward) => (
                <button
                  key={ward}
                  onClick={() => handleWardChange(ward)}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    filters.ward === ward
                      ? 'bg-[#F27C24] text-white'
                      : 'bg-[#1E3A8A]/10 text-[#1E3A8A] hover:bg-[#1E3A8A]/20'
                  }`}
                >
                  {ward}
                </button>
              ))}
            </div>
          </div>

          {/* Budget Range */}
          <div>
            <h4 className="text-sm font-medium text-[#1A1A1A] mb-2">
              Budget Range (₹0 - ₹{filters.budgetRange[1]} Cr)
            </h4>
            <input
              type="range"
              min="0"
              max="1000"
              value={filters.budgetRange[1]}
              onChange={handleBudgetChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FilterPanel; 