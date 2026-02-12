const express = require('express');
const router = express.Router();
const SafetyAlert = require('../models/SafetyAlert');
const Log = require('../models/Log');
const { protect } = require('../middleware/authMiddleware');

// POST /api/safety/sos
router.post('/sos', protect, async (req, res) => {
    try {
        const { location } = req.body;

        // Create Alert
        const alert = await SafetyAlert.create({
            user: req.user._id,
            type: 'SOS',
            location,
            message: 'Emergency SOS Triggered! User needs immediate assistance.',
            status: 'sent'
        });

        // Log Action
        await Log.create({
            user: req.user._id,
            action: 'SOS_TRIGGERED',
            details: `Coordinates: ${location?.lat}, ${location?.lng}`,
            ip: req.ip
        });

        res.status(201).json({ message: 'SOS Alert Sent Successfully', alertId: alert._id });
    } catch (error) {
        res.status(500).json({ message: 'Failed to trigger SOS' });
    }
});

// POST /api/safety/log (Generic Logger for frontend actions)
router.post('/log', protect, async (req, res) => {
    try {
        const { action, details } = req.body;

        await Log.create({
            user: req.user._id,
            action,
            details,
            ip: req.ip,
            device: req.headers['user-agent']
        });

        res.status(201).json({ message: 'Logged' });
    } catch (error) {
        res.status(500).json({ message: 'Logging failed' });
    }
});

// GET /api/safety/logs
router.get('/logs', protect, async (req, res) => {
    try {
        const logs = await Log.find({ user: req.user._id }).sort({ timestamp: -1 }).limit(50);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch logs' });
    }
});

module.exports = router;
