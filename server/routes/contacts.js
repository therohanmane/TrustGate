const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { protect } = require('../middleware/authMiddleware');

// GET /api/contacts
router.get('/', protect, async (req, res) => {
    try {
        const contacts = await Contact.find({ user: req.user._id });
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

const logActivity = require('../utils/logger');

// POST /api/contacts
router.post('/', protect, async (req, res) => {
    try {
        const { name, email, phone, relationship, accessLevel } = req.body;

        const contact = new Contact({
            user: req.user._id,
            name,
            email,
            phone,
            relationship,
            accessLevel,
            status: 'pending' // Default status
        });

        await contact.save();
        await logActivity(req.user._id, 'ADD_CONTACT', `Added contact: ${contact.name} (${contact.relationship})`, req);

        res.status(201).json(contact);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// DELETE /api/contacts/:id
router.delete('/:id', protect, async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        if (contact.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await contact.deleteOne();
        res.json({ message: 'Contact removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
