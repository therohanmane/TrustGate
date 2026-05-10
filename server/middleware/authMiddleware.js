'use strict';

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../config/env');

/**
 * protect — Verifies the Bearer JWT, attaches req.user.
 * Single source of truth — no more inline duplicates.
 */
const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Not authorised — no token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'Not authorised — account not found.' });
        }

        // Update lastActive on every authenticated request (heartbeat)
        user.lastActive = new Date();
        await user.save({ validateBeforeSave: false });

        req.user = user;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Not authorised — token has expired.' });
        }
        return res.status(401).json({ message: 'Not authorised — token is invalid.' });
    }
};

/**
 * authorizeRoles — Role-Based Access Control (RBAC) middleware.
 * Usage: router.get('/admin-only', protect, authorizeRoles('admin'), handler)
 *
 * @param {...string} roles — Allowed roles, e.g. 'admin', 'user'
 */
const authorizeRoles = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({
            message: `Access denied — requires role: ${roles.join(' or ')}.`,
        });
    }
    next();
};

module.exports = { protect, authorizeRoles };
