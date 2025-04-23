import React from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaCalendarAlt, FaRupeeSign } from 'react-icons/fa';
import StatusBadge from './StatusBadge';
import ProgressBar from './ProgressBar';

const ProjectCard = ({ project, onClick }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-orange-100 text-orange-800';
      case 'Stalled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-[#1A1A1A] font-playfair">{project.title}</h3>
          <StatusBadge status={project.status} />
        </div>

        <p className="text-[#5A5A5A] mb-6 line-clamp-2">{project.description}</p>

        <div className="space-y-4">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-[#5A5A5A]">Progress</span>
              <span className="font-medium text-[#1A1A1A]">{project.progress}%</span>
            </div>
            <ProgressBar progress={project.progress} />
          </div>

          {/* Project Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-[#F27C24]" />
              <span className="text-sm text-[#5A5A5A]">{project.ward}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-[#F27C24]" />
              <span className="text-sm text-[#5A5A5A]">
                {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FaRupeeSign className="text-[#F27C24]" />
              <span className="text-sm text-[#5A5A5A]">{project.budget} Cr</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#5A5A5A]">{project.department}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-[#1E3A8A]/10 text-[#1E3A8A] rounded-full text-sm">
              {project.category}
            </span>
            <span className="px-3 py-1 bg-[#1E3A8A]/10 text-[#1E3A8A] rounded-full text-sm">
              {project.department}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard; 