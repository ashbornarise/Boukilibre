const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./lib/db');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static files - only used for local dev (npm run dev). On Vercel, static files
// are served directly by the platform and never reach this Express app.
// Only expose the actual site assets, never the backend source (routes/, models/, lib/...).
const ROOT_PAGES = [
    'index.html', 'catalog.html', 'product.html', 'blog.html', 'about.html',
    'faq.html', 'contact.html', 'checkout.html', 'robots.txt', 'sitemap.xml'
];

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
ROOT_PAGES.forEach((file) => {
    app.get(`/${file}`, (req, res) => res.sendFile(path.join(__dirname, file)));
});

['css', 'js', 'images', 'admin'].forEach((dir) => {
    app.use(`/${dir}`, express.static(path.join(__dirname, dir), { dotfiles: 'deny' }));
});

// Routes
const ebooksRoutes = require('./routes/ebooks');
const ordersRoutes = require('./routes/orders');
const newsletterRoutes = require('./routes/newsletter');
const contactRoutes = require('./routes/contact');
const adminRoutes = require('./routes/admin');
const downloadRoutes = require('./routes/download');

// Ensure the DB connection is ready before any /api route touches Mongoose
app.use('/api', async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        res.status(503).json({ error: 'Database unavailable', message: error.message });
    }
});

app.use('/api/ebooks', ebooksRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/download', downloadRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Boukilibre API is running' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

module.exports = app;
