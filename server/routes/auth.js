const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // In a real app, hash password here
        const newUser = new User({ name, email, password });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully', userId: newUser._id });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check user & password (mock)
        if (email === 'demo@example.com' && password === 'password') {
            res.json({ token: 'mock-jwt-token', user: { id: 'mock-id', name: 'Demo User' } });
        } else {
            // Allow any login for demo purposes if not specific hardcoded one
            res.json({ token: 'mock-jwt-token', user: { id: 'mock-id', name: 'Demo User' } });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
