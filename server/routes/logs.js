const express = require('express');
const router = express.Router();
const Log = require('../models/Log');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify token (Duplicate of protect in other files, ideally should be in utils/middleware.js)
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// GET /api/logs
router.get('/', protect, async (req, res) => {
    try {
        const logs = await Log.find({ user: req.user._id })
            .sort({ timestamp: -1 })
            .limit(50); // Limit to last 50 logs
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
