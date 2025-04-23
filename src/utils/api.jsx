// src/utils/api.js

const API_KEY = '7824ef6420be42e2ba60e43b7d7854ef'; // replace with your real API key
const BASE_URL = 'https://newsapi.org/v2';

export const fetchCityNews = async (city, limit = 3) => {
  try {
    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    // Add sortBy parameter to get latest news
    // Add pageSize parameter to get more results
    // Add language parameter to ensure we get English results
    const response = await fetch(
      `${BASE_URL}/everything?q=${city}&apiKey=${API_KEY}&sortBy=publishedAt&pageSize=${limit * 2}&language=en&timestamp=${timestamp}`
    );
    const data = await response.json();
    // Shuffle the articles to get different results each time
    const shuffledArticles = data.articles.sort(() => Math.random() - 0.5);
    // Return the requested number of articles
    return shuffledArticles.slice(0, limit);
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
};
