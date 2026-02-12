const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// GET /api/contacts
router.get('/', async (req, res) => {
    res.json([
        { id: 1, name: "Sarah Johnson", email: "sarah.j@example.com", relation: "Spouse", access: "Full Access" },
        { id: 2, name: "Michael Chen", email: "m.chen@lawfirm.com", relation: "Lawyer", access: "View Only" },
    ]);
});

// POST /api/contacts
router.post('/', async (req, res) => {
    res.status(201).json({ message: 'Contact added successfully' });
});

// DELETE /api/contacts/:id
router.delete('/:id', async (req, res) => {
    res.json({ message: 'Contact removed' });
});

module.exports = router;
