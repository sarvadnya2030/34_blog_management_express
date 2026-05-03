const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS Middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// In-memory database
let blogs = [
    {
        id: uuidv4(),
        title: 'Getting Started with Express',
        author: 'John Doe',
        content: 'Express is a minimal and flexible Node.js web application framework...',
        category: 'Web Development',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: uuidv4(),
        title: 'REST API Best Practices',
        author: 'Jane Smith',
        content: 'REST APIs should be designed with proper HTTP methods and status codes...',
        category: 'API Design',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

// Routes

// GET all blogs
app.get('/api/blogs', (req, res) => {
    res.json({
        success: true,
        count: blogs.length,
        data: blogs
    });
});

// GET blog by ID
app.get('/api/blogs/:id', (req, res) => {
    const blog = blogs.find(b => b.id === req.params.id);

    if (!blog) {
        return res.status(404).json({
            success: false,
            message: 'Blog not found'
        });
    }

    res.json({
        success: true,
        data: blog
    });
});

// CREATE new blog
app.post('/api/blogs', (req, res) => {
    const { title, author, content, category } = req.body;

    if (!title || !author || !content || !category) {
        return res.status(400).json({
            success: false,
            message: 'Title, author, content, and category are required'
        });
    }

    const newBlog = {
        id: uuidv4(),
        title,
        author,
        content,
        category,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    blogs.push(newBlog);

    res.status(201).json({
        success: true,
        message: 'Blog created successfully',
        data: newBlog
    });
});

// UPDATE blog
app.put('/api/blogs/:id', (req, res) => {
    const blog = blogs.find(b => b.id === req.params.id);

    if (!blog) {
        return res.status(404).json({
            success: false,
            message: 'Blog not found'
        });
    }

    const { title, author, content, category } = req.body;

    if (title) blog.title = title;
    if (author) blog.author = author;
    if (content) blog.content = content;
    if (category) blog.category = category;
    blog.updatedAt = new Date().toISOString();

    res.json({
        success: true,
        message: 'Blog updated successfully',
        data: blog
    });
});

// DELETE blog
app.delete('/api/blogs/:id', (req, res) => {
    const index = blogs.findIndex(b => b.id === req.params.id);

    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: 'Blog not found'
        });
    }

    const deletedBlog = blogs.splice(index, 1);

    res.json({
        success: true,
        message: 'Blog deleted successfully',
        data: deletedBlog[0]
    });
});

// GET blogs by category
app.get('/api/blogs/category/:category', (req, res) => {
    const filtered = blogs.filter(b => b.category.toLowerCase() === req.params.category.toLowerCase());

    res.json({
        success: true,
        count: filtered.length,
        data: filtered
    });
});

// GET blogs by author
app.get('/api/blogs/author/:author', (req, res) => {
    const filtered = blogs.filter(b => b.author.toLowerCase() === req.params.author.toLowerCase());

    res.json({
        success: true,
        count: filtered.length,
        data: filtered
    });
});

// Search blogs
app.get('/api/blogs/search/:query', (req, res) => {
    const query = req.params.query.toLowerCase();
    const results = blogs.filter(b =>
        b.title.toLowerCase().includes(query) ||
        b.content.toLowerCase().includes(query) ||
        b.author.toLowerCase().includes(query)
    );

    res.json({
        success: true,
        count: results.length,
        data: results
    });
});

// Statistics
app.get('/api/stats', (req, res) => {
    const categories = [...new Set(blogs.map(b => b.category))];
    const authors = [...new Set(blogs.map(b => b.author))];

    res.json({
        success: true,
        totalBlogs: blogs.length,
        totalCategories: categories.length,
        totalAuthors: authors.length,
        categories: categories,
        authors: authors
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Blog API is running',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Blog Management API running on http://localhost:${PORT}`);
    console.log(`📝 Test endpoints:`);
    console.log(`   GET http://localhost:${PORT}/api/blogs`);
    console.log(`   POST http://localhost:${PORT}/api/blogs`);
    console.log(`   GET http://localhost:${PORT}/api/blogs/:id`);
    console.log(`   PUT http://localhost:${PORT}/api/blogs/:id`);
    console.log(`   DELETE http://localhost:${PORT}/api/blogs/:id`);
    console.log(`   GET http://localhost:${PORT}/api/health`);
});

module.exports = app;
