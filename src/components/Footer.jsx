import React from 'react';
import { Link } from 'react-router-dom';
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold gradient-text">SheherConnect</h2>
            <p className="text-gray-400">
              Connecting communities, empowering citizens, and building a better tomorrow.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-orange-500 transition-colors">
                <FaTwitter className="text-xl" />
              </a>
              <a href="#" className="hover:text-orange-500 transition-colors">
                <FaFacebook className="text-xl" />
              </a>
              <a href="#" className="hover:text-orange-500 transition-colors">
                <FaInstagram className="text-xl" />
              </a>
              <a href="#" className="hover:text-orange-500 transition-colors">
                <FaLinkedin className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Community
                </Link>
              </li>
              <li>
                <Link to="/tenders" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Tenders
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/guidelines" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Guidelines
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-orange-500 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for the latest updates.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90 transition-opacity"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 SheherConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 