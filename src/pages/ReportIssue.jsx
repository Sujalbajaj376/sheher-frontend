import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCamera, FaMapMarkerAlt, FaCheck, FaPen } from 'react-icons/fa';

const steps = [
  { id: 1, title: 'Take Photo', icon: FaCamera },
  { id: 2, title: 'Description', icon: FaPen },
  { id: 3, title: 'Location', icon: FaMapMarkerAlt },
  { id: 4, title: 'Submit', icon: FaCheck }
];

const ReportIssue = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    photo: null,
    description: '',
    category: '',
    location: '',
    address: ''
  });

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="photo-upload"
                onChange={(e) => setFormData({ ...formData, photo: e.target.files[0] })}
              />
              <label
                htmlFor="photo-upload"
                className="cursor-pointer flex flex-col items-center space-y-4"
              >
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                  <FaCamera className="text-2xl text-orange-500" />
                </div>
                <div>
                  <p className="font-medium">Upload Photo</p>
                  <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                </div>
              </label>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                <option value="roads">Roads</option>
                <option value="sanitation">Sanitation</option>
                <option value="electricity">Electricity</option>
                <option value="water">Water Supply</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Describe the issue in detail..."
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area/Locality
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter area or locality name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Complete Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter complete address..."
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <FaCheck className="text-3xl text-green-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
              <p className="text-gray-600">
                Your issue has been reported successfully. We will look into it and take necessary action.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Reference Number</p>
              <p className="font-medium">#REF-2024-0123</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 gradient-text">Report an Issue</h1>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8 relative">
          <div className="absolute top-1/2 h-0.5 w-full bg-gray-200 -z-10" />
          {steps.map((step) => (
            <motion.div
              key={step.id}
              className={`flex flex-col items-center ${
                step.id === currentStep
                  ? 'text-orange-500'
                  : step.id < currentStep
                  ? 'text-green-500'
                  : 'text-gray-400'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  step.id === currentStep
                    ? 'bg-orange-100'
                    : step.id < currentStep
                    ? 'bg-green-100'
                    : 'bg-gray-100'
                }`}
              >
                <step.icon className="text-xl" />
              </div>
              <span className="text-sm font-medium">{step.title}</span>
            </motion.div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handleBack}
            className={`px-6 py-2 rounded-lg ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
            disabled={currentStep === 1}
          >
            Back
          </button>
          {currentStep < steps.length && (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportIssue; 