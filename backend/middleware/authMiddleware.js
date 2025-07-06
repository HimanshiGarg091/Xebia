const jwt = require('jsonwebtoken');

// Use environment variable for secret in production!
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

function authMiddleware(req, res, next) {
const authHeader = req.headers.authorization;
  // Expect header format: "Bearer <token>"
const token = authHeader && authHeader.split(' ')[1];
if (!token) return res.status(401).json({ error: 'No token provided' });

try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.id }; // id should match what you put in token
    next();
} catch (err) {
    res.status(401).json({ error: 'Invalid token' });
}
}

module.exports = authMiddleware;
