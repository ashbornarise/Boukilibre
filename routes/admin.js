const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Admin login - issues a JWT used to authorize product management endpoints
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD || !process.env.JWT_SECRET) {
        return res.status(500).json({
            message: 'Admin non configure. Definissez ADMIN_EMAIL, ADMIN_PASSWORD et JWT_SECRET dans .env'
        });
    }

    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ message: 'Identifiants incorrects' });
    }

    const token = jwt.sign(
        { email, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    res.json({ token, email });
});

module.exports = router;
