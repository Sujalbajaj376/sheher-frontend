// src/pages/Home.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaNewspaper, FaUsers, FaCity, FaMapMarkerAlt, FaSync, FaHashtag } from 'react-icons/fa';
import { fetchCityNews } from '../utils/api';

const NewsCard = ({ news }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
  >
    <div className="h-48 relative overflow-hidden">
      <img
        src={news.urlToImage || '/images/news-placeholder.jpg'}
        alt={news.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
    </div>
    <div className="p-6">
      <h3 className="text-xl font-bold mb-2 line-clamp-2">{news.title}</h3>
      <p className="text-gray-600 mb-4 line-clamp-3">{news.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">{new Date(news.publishedAt).toLocaleDateString()}</span>
        <Link
          to={news.url}
          target="_blank"
          className="text-orange-500 hover:text-orange-600 font-medium flex items-center gap-2"
        >
          Read More
          <FaArrowRight />
        </Link>
      </div>
    </div>
  </motion.div>
);

const HomePage = () => {
  const [city, setCity] = useState('Mumbai');
  const [news, setNews] = useState([]);
  const [showAllNews, setShowAllNews] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      setRefreshing(true);
      const articles = await fetchCityNews(city, showAllNews ? 12 : 3);
      setNews(articles);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('Unable to fetch news articles.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [city, showAllNews]);

  const handleRefresh = useCallback(() => {
    fetchNews();
  }, [fetchNews]);

  // Get user's location once when component mounts
  useEffect(() => {
    const getLocation = async () => {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
              );
              const data = await response.json();
              const cityName = data.address.city || data.address.town || data.address.village || 'Unknown Location';
              setCity(cityName);
            },
            () => {
              setError('Unable to get your location. Using default city.');
              setCity('Jaipur');
            }
          );
        } else {
          setError('Geolocation is not supported. Using default city.');
          setCity('Jaipur');
        }
      } catch (err) {
        console.error('Location error:', err);
        setError('Location fetch error. Using default city.');
        setCity('Jaipur');
      }
    };

    getLocation();
  }, []);

  // Fetch news whenever city changes or component mounts
  useEffect(() => {
    fetchNews();
  }, [city, fetchNews]);

  // Add auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (city && city !== 'Loading...') {
        fetchNews();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [city, fetchNews]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Gradient Background */}
      <div className="relative h-[60vh] bg-gradient-to-r from-orange-500 to-pink-500">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
          <div className="text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 mb-4"
            >
              <FaMapMarkerAlt className="text-2xl" />
              <span className="text-xl font-medium">{city}</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl font-bold mb-4"
            >
              Welcome to Your City
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl mb-8"
            >
              Stay updated with the latest news and developments in your area
            </motion.p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      )}

      {/* Latest News Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Latest News</h2>
              {lastUpdated && (
                <p className="text-sm text-gray-500 mt-1">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium disabled:opacity-50"
              >
                <FaSync className={`${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={() => setShowAllNews(!showAllNews)}
                className="text-orange-500 hover:text-orange-600 font-medium"
              >
                {showAllNews ? 'Show Less' : 'View All News'}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading news...</p>
            </div>
          ) : news.length > 0 ? (
            <div className={`grid ${showAllNews ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-3'} gap-8`}>
              {news.map((article, index) => (
                <NewsCard key={index} news={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-600">No news available</h3>
              <p className="text-gray-500 mt-2">Please check back later for updates</p>
            </div>
          )}
        </div>
      </section>

      {/* Trending Topics Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Trending Topics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Development', 'Infrastructure', 'Events', 'Education'].map((topic) => (
              <motion.div
                key={topic}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl shadow-md p-6 text-center cursor-pointer hover:shadow-lg transition-shadow"
              >
                <FaHashtag className="text-3xl text-orange-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800">{topic}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
