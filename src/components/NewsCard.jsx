// src/components/NewsCard.jsx
import React from 'react';

const NewsCard = ({ article }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      {article.urlToImage && (
        <img
          src={article.urlToImage}
          alt="news"
          className="w-full h-48 object-cover rounded"
        />
      )}
      <h2 className="text-lg font-semibold mt-2">{article.title}</h2>
      <p className="text-sm text-gray-600">{article.description}</p>
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 mt-2 inline-block"
      >
        Read More →
      </a>
    </div>
  );
};

export default NewsCard;
