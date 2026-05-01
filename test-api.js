const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(bodyParser.json());

let blogs = [
    {
        id: uuidv4(),
        title: 'Getting Started with Express',
        author: 'John Doe',
        content: 'Express is a minimal framework...',
        category: 'Web Development',
        createdAt: new Date().toISOString()
    }
];

app.get('/api/blogs', (req, res) => {
    res.json({ success: true, count: blogs.length, data: blogs });
});

app.post('/api/blogs', (req, res) => {
    const { title, author, content, category } = req.body;
    if (!title || !author || !content || !category) {
        return res.status(400).json({ success: false, message: 'Missing fields' });
    }
    const newBlog = { id: uuidv4(), title, author, content, category, createdAt: new Date().toISOString() };
    blogs.push(newBlog);
    res.status(201).json({ success: true, message: 'Blog created', data: newBlog });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`✅ Blog API running on port ${PORT}`));
