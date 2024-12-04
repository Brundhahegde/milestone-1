
// const express = require('express');
// const fs = require('fs');
// const path = require('path');

// const app = express();
// app.use(express.json());

// const articlesFile = path.join(__dirname, 'articles.json');
// let articles = [];

// // Load articles from file
// if (fs.existsSync(articlesFile)) {
//     console.log('Loading articles from file...');
//     const data = fs.readFileSync(articlesFile);
//     articles = JSON.parse(data);
// } else {
//     console.log('No persistence file found. Starting fresh.');
// }

// // Save articles to file
// function saveArticles() {
//     fs.writeFileSync(articlesFile, JSON.stringify(articles, null, 2));
// }

// // POST /articles - Add a new article
// app.post('/articles', (req, res) => {
//     const { title, content, tags } = req.body;
//     if (!title || !content || !tags) {
//         return res.status(400).json({ error: 'Title, content, and tags are required.' });
//     }

//     const newArticle = {
//         id: articles.length + 1,
//         title,
//         content,
//         tags,
//         date: new Date()
//     };

//     articles.push(newArticle);
//     saveArticles();
//     res.status(201).json(newArticle);
// });

// // GET /articles/:id - Fetch article by ID
// app.get('/articles/:id', (req, res) => {
//     const articleId = parseInt(req.params.id);
//     const article = articles.find((a) => a.id === articleId);

//     if (!article) {
//         return res.status(404).send({ error: 'Article not found' });
//     }

//     res.json(article);
// });

// // Start the server
// const PORT = 3000;
// app.listen(PORT, () => {
//     console.log(`Mini Search Engine is running on http://localhost:${PORT}`);
// });

const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Array to store articles
let articles = [];

// Load articles from a JSON file
const loadArticles = () => {
    if (fs.existsSync('articles.json')) {
        const data = fs.readFileSync('articles.json', 'utf8');
        articles = JSON.parse(data);
        console.log("Articles loaded from file.");
    } else {
        console.log("No persistence file found. Starting fresh.");
    }
};

// Save articles to a JSON file
const saveArticles = () => {
    fs.writeFileSync('articles.json', JSON.stringify(articles, null, 2));
    console.log("Articles saved to file.");
};

// Load articles on startup
loadArticles();

// Add Article (POST /articles)
app.post('/articles', (req, res) => {
    const { title, content, tags, date } = req.body;

    if (!title || !content || !Array.isArray(tags)) {
        return res.status(400).json({ error: "Invalid input. Title, content, and tags are required." });
    }

    const article = {
        id: articles.length + 1, // Auto-increment ID
        title,
        content,
        tags,
        date: date || new Date().toISOString() // Use provided date or default to current date
    };

    articles.push(article);
    saveArticles();
    res.status(201).json({ message: "Article added successfully!", article });
});

// Get Article by ID (GET /articles/:id)
app.get('/articles/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const article = articles.find(a => a.id === id);

    if (!article) {
        return res.status(404).json({ error: "Article not found." });
    }

    res.json(article);
});

// Search Articles (GET /articles/search)
app.get('/articles/search', (req, res) => {
    const { keyword, tag, sortBy } = req.query;
    let filteredArticles = articles;

    // Filter by keyword in title or content
    if (keyword) {
        filteredArticles = filteredArticles.filter(article =>
            article.title.includes(keyword) || article.content.includes(keyword)
        );
    }

    // Filter by tag
    if (tag) {
        filteredArticles = filteredArticles.filter(article => article.tags.includes(tag));
    }

    // Sort results
    if (sortBy === 'relevance' && keyword) {
        filteredArticles = filteredArticles.sort((a, b) => {
            const aRelevance = (a.content.match(new RegExp(keyword, 'gi')) || []).length;
            const bRelevance = (b.content.match(new RegExp(keyword, 'gi')) || []).length;
            return bRelevance - aRelevance; // Higher relevance comes first
        });
    } else if (sortBy === 'date') {
        filteredArticles = filteredArticles.sort((a, b) => new Date(b.date) - new Date(a.date)); // Latest first
    }

    res.json(filteredArticles);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Mini Search Engine is running on http://localhost:${PORT}`);
});
