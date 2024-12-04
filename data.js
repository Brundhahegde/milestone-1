const fs = require('fs');

// In-memory array to store articles
let articles = [];

// Function to load articles from a file
const loadArticles = () => {
  try {
    const data = fs.readFileSync('articles.json', 'utf-8');
    articles = JSON.parse(data);
  } catch (err) {
    console.log("No persistence file found. Starting fresh.");
  }
};

// Function to save articles to a file
const saveArticles = () => {
  fs.writeFileSync('articles.json', JSON.stringify(articles, null, 2));
};

// Add a new article to the in-memory storage
const addArticle = (title, content, tags) => {
  const id = articles.length + 1;
  const date = new Date().toISOString();
  const newArticle = { id, title, content, tags, date };
  articles.push(newArticle);
  saveArticles(); // Persist data
  return newArticle;
};

// Search articles by keyword in title or content
const searchArticles = (keyword, sortBy = 'relevance') => {
  const results = articles.filter(article =>
    article.title.includes(keyword) || article.content.includes(keyword)
  );

  // Sort results based on relevance or date
  if (sortBy === 'relevance') {
    results.sort((a, b) => {
      const countKeyword = (text) => text.split(keyword).length - 1;
      const relevanceA = countKeyword(a.title) + countKeyword(a.content);
      const relevanceB = countKeyword(b.title) + countKeyword(b.content);
      return relevanceB - relevanceA;
    });
  } else if (sortBy === 'date') {
    results.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  return results;
};

// Get an article by its ID
const getArticleById = (id) => articles.find(article => article.id === id);

module.exports = { loadArticles, addArticle, searchArticles, getArticleById };
