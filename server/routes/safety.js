'use strict';

const express = require('express');
const router = express.Router();

const SafetyAlert = require('../models/SafetyAlert');
const Log = require('../models/Log');
const { protect } = require('../middleware/authMiddleware');
const { apiLimiter } = require('../middleware/rateLimiter');
const logActivity = require('../utils/logger');

router.use(apiLimiter);

// ── POST /api/safety/sos ──────────────────────────────────────────────────────
router.post('/sos', protect, async (req, res) => {
    try {
        const { location } = req.body;

        if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
            return res.status(400).json({ message: 'Valid location (lat, lng) is required for SOS.' });
        }

        const alert = await SafetyAlert.create({
            user: req.user._id,
            type: 'SOS',
            location,
            message: 'Emergency SOS triggered. User requires immediate assistance.',
            status: 'sent',
        });

        await logActivity(
            req.user._id,
            'SOS_TRIGGERED',
            `SOS triggered at coordinates: ${location.lat}, ${location.lng}`,
            req
        );

        return res.status(201).json({ message: 'SOS Alert sent.', alertId: alert._id });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to trigger SOS.' });
    }
});

// ── POST /api/safety/log ──────────────────────────────────────────────────────
router.post('/log', protect, async (req, res) => {
    try {
        const { action, details } = req.body;

        if (!action) return res.status(400).json({ message: 'Action is required.' });

        await Log.create({
            user: req.user._id,
            action,
            details,
            ip: req.ip,
            device: req.headers['user-agent'],
        });

        return res.status(201).json({ message: 'Logged.' });
    } catch (err) {
        return res.status(500).json({ message: 'Logging failed.' });
    }
});

// ── GET /api/safety/logs ──────────────────────────────────────────────────────
router.get('/logs', protect, async (req, res) => {
    try {
        const limit = Math.min(100, parseInt(req.query.limit, 10) || 50);
        const logs = await Log.find({ user: req.user._id })
            .sort({ timestamp: -1 })
            .limit(limit);
        return res.json(logs);
    } catch (err) {
        return res.status(500).json({ message: 'Failed to fetch safety logs.' });
    }
});

// ── GET /api/safety/alerts ────────────────────────────────────────────────────
router.get('/alerts', protect, async (req, res) => {
    try {
        const alerts = await SafetyAlert.find({ user: req.user._id })
            .sort({ triggeredAt: -1 })
            .limit(50);
        return res.json(alerts);
    } catch (err) {
        return res.status(500).json({ message: 'Failed to fetch alerts.' });
    }
});

module.exports = router;
