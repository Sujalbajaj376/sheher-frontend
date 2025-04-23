import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaComment, FaShare, FaEllipsisH, FaImage, FaMapMarkerAlt, FaBuilding,FaBus,FaTree,FaCalendarAlt, FaTimes, FaCamera, FaHashtag, FaFire, FaSearch, FaFilter } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';

const PostCard = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  const getInitials = (name) => {
    return name.charAt(0).toUpperCase();
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      setComments([...comments, { text: comment, author: 'You', time: 'Just now' }]);
      setComment('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6 hover:shadow-xl transition-shadow duration-300"
    >
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center space-x-3">
          {post.author.avatar ? (
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-orange-500"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center ring-2 ring-orange-500">
              <span className="text-white text-xl font-semibold">
                {getInitials(post.author.name)}
              </span>
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-800">{post.author.name}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <FaMapMarkerAlt className="text-orange-500" />
              <span>{post.location}</span>
              <span>•</span>
              <span>{post.time}</span>
            </div>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <FaEllipsisH />
        </button>
      </div>

      {/* Post Content */}
      <div className="p-4">
        <p className="text-gray-800 mb-4 leading-relaxed">{post.content}</p>
        
        {/* Post Image */}
        {post.image && (
          <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
            <img
              src={post.image}
              alt="Post"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="text-sm text-orange-500 bg-orange-50 px-3 py-1 rounded-full hover:bg-orange-100 transition-colors cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between border-t border-b border-gray-100 py-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleLike}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isLiked ? 'text-red-500 bg-red-50' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <FaHeart className={isLiked ? 'fill-current' : ''} />
            <span>{likes}</span>
          </motion.button>
          
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <FaComment />
            <span>{post.comments}</span>
          </button>
          
          <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">
            <FaShare />
            <span>Share</span>
          </button>
        </div>

        {/* Comments Section */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <div className="space-y-4 mb-4">
                {comments.map((comment, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <img
                      src={post.author.avatar}
                      alt={comment.author}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="bg-gray-50 rounded-lg px-4 py-2">
                      <p className="font-medium text-sm">{comment.author}</p>
                      <p className="text-gray-600 text-sm">{comment.text}</p>
                      <span className="text-xs text-gray-400">{comment.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <form onSubmit={handleComment} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 px-4 py-2 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  type="submit"
                  className="p-2 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                >
                  <IoMdSend />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    
    // Create new post object
    const newPost = {
      id: Date.now(), // Temporary ID
      author: {
        name: "You",
        avatar: null
      },
      content: content,
      image: image,
      location: location || "Your Location",
      likes: 0,
      comments: 0,
      time: "Just now",
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Call the parent component's callback
    onPostCreated(newPost);
    
    // Reset form
    setContent('');
    setImage(null);
    setLocation('');
    setTags('');
    setLoading(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden"
          >
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Create Post</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4">
              <div className="space-y-4">
                {/* Content Input */}
                <div>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind?"
                    className="w-full h-32 p-4 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    required
                  />
                </div>

                {/* Image Preview */}
                {image && (
                  <div className="relative">
                    <img
                      src={image}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => setImage(null)}
                      className="absolute top-2 right-2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                    >
                      <FaTimes />
                    </button>
                  </div>
                )}

                {/* Location Input */}
                <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-xl">
                  <FaMapMarkerAlt className="text-gray-400" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Add location"
                    className="bg-transparent flex-1 focus:outline-none"
                  />
                </div>

                {/* Tags Input */}
                <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-xl">
                  <FaHashtag className="text-gray-400" />
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Add tags (comma separated)"
                    className="bg-transparent flex-1 focus:outline-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center space-x-4">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <FaCamera className="text-2xl text-gray-400 hover:text-orange-500 transition-colors" />
                    </label>
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !content.trim()}
                    className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Posting...
                      </>
                    ) : (
                      'Post'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const CommunityFeed = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: {
        name: "Priya Sharma",
        avatar: null
      },
      content: "Just witnessed the beautiful lighting ceremony at Hawa Mahal! Our city's heritage is truly magnificent. 🏰✨",
      image: "/hawa.webp",
      location: "Hawa Mahal, Jaipur",
      likes: 234,
      comments: 45,
      time: "2 hours ago",
      tags: ["Heritage", "JaipurDiaries", "Tourism"]
    },
    {
      id: 2,
      author: {
        name: "Rahul Verma",
        avatar: null
      },
      content: "Great progress on the new metro line construction! This will make commuting so much easier for everyone. 🚇",
      image: "metri.webp",
      location: "Civil Lines, Jaipur",
      likes: 156,
      comments: 28,
      time: "5 hours ago",
      tags: ["Infrastructure", "Development", "Transport"]
    },
    {
      id: 3,
      author: {
        name: "Amit Patel",
        avatar: null
      },
      content: "The new public library in Civil Lines is now open! Great place for book lovers. 📚",
      image: "infra.jpg",
      location: "Civil Lines, Jaipur",
      likes: 189,
      comments: 32,
      time: "3 hours ago",
      tags: ["Education", "Culture", "Community"]
    },
    {
      id: 4,
      author: {
        name: "Neha Singh",
        avatar: null
      },
      content: "Beautiful sunset at Jawahar Circle Garden today! Nature at its best. 🌅",
      image: "imgfront.jpg",
      location: "Jawahar Circle, Jaipur",
      likes: 245,
      comments: 41,
      time: "1 hour ago",
      tags: ["Nature", "Parks", "Photography"]
    }
  ]);

  const handlePostCreated = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const trendingTopics = [
    { name: 'City Development', posts: 1234, icon: <FaBuilding className="text-orange-500" /> },
    { name: 'Public Transport', posts: 856, icon: <FaBus className="text-orange-500" /> },
    { name: 'Green Spaces', posts: 642, icon: <FaTree className="text-orange-500" /> },
    { name: 'Local Events', posts: 521, icon: <FaCalendarAlt className="text-orange-500" /> },
  ];

  const filters = ['All', 'Recent', 'Popular', 'Following'];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section with Gradient Background */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl opacity-10" />
          <div className="relative p-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Community Feed</h1>
            <p className="text-gray-600">Connect with your city, share experiences, and stay updated</p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-8 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts, topics, or people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <FaFilter className="text-gray-400" />
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="bg-gray-50 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {filters.map((filter) => (
                <option key={filter} value={filter}>{filter}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Trending Topics with Icons */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FaFire className="text-orange-500" />
              Trending Topics
            </h2>
            <button className="text-orange-500 hover:text-orange-600 transition-colors">
              View All
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trendingTopics.map((topic, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-xl p-4 cursor-pointer hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    {topic.icon}
                  </div>
                  <h3 className="font-medium text-orange-600">{topic.name}</h3>
                </div>
                <p className="text-sm text-gray-500">{topic.posts.toLocaleString()} posts</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Create Post Button with Enhanced Design */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCreatePost(true)}
          className="w-full bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl shadow-lg p-4 mb-8 flex items-center justify-center space-x-4 hover:shadow-xl transition-all"
        >
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <FaImage className="text-white text-xl" />
          </div>
          <span className="text-white font-medium">Share your thoughts with the community</span>
        </motion.button>

        {/* Posts Feed with Enhanced Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {/* Load More Button */}
        <div className="mt-8 text-center">
          <button className="px-6 py-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all text-orange-500 font-medium">
            Load More Posts
          </button>
        </div>

        {/* Create Post Modal */}
        <CreatePostModal
          isOpen={showCreatePost}
          onClose={() => setShowCreatePost(false)}
          onPostCreated={handlePostCreated}
        />
      </div>
    </div>
  );
};

export default CommunityFeed; 