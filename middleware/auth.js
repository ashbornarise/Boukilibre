const jwt = require('jsonwebtoken');

function requireAdmin(req, res, next) {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
        return res.status(401).json({ error: 'Authentification requise' });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if (payload.role !== 'admin') {
            return res.status(403).json({ error: 'Acces refuse' });
        }
        req.admin = payload;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token invalide ou expire' });
    }
}

module.exports = { requireAdmin };
