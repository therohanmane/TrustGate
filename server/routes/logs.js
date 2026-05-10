'use strict';

const express = require('express');
const router = express.Router();

const Log = require('../models/Log');
const { protect } = require('../middleware/authMiddleware');
const { apiLimiter } = require('../middleware/rateLimiter');

router.use(apiLimiter);

// ── GET /api/logs ─────────────────────────────────────────────────────────────
router.get('/', protect, async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
        const skip = (page - 1) * limit;

        const [logs, total] = await Promise.all([
            Log.find({ user: req.user._id })
                .sort({ timestamp: -1 })
                .skip(skip)
                .limit(limit),
            Log.countDocuments({ user: req.user._id }),
        ]);

        return res.json({
            logs,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to fetch logs.' });
    }
});

module.exports = router;
