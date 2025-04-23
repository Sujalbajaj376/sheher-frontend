import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
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
        <a
          href={news.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-orange-500 hover:text-orange-600 font-medium flex items-center gap-2"
        >
          Read More
          <FaArrowRight />
        </a>
      </div>
    </div>
  </motion.div>
);

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const city = 'Jaipur';

  useEffect(() => {
    const getNews = async () => {
      try {
        setLoading(true);
        const articles = await fetchCityNews(city);
        setNews(articles);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };
    getNews();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Link
              to="/"
              className="text-white hover:text-gray-200 flex items-center gap-2"
            >
              <FaArrowLeft />
              Back to Home
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">All News</h1>
          <p className="text-white/90">Stay updated with the latest news from {city}</p>
        </div>
      </div>

      {/* News Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading news...</p>
          </div>
        ) : news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
    </div>
  );
};

export default NewsPage; 