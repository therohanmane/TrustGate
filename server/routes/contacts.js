'use strict';

const express = require('express');
const router = express.Router();

const Contact = require('../models/Contact');
const { protect } = require('../middleware/authMiddleware');
const { apiLimiter } = require('../middleware/rateLimiter');
const { contactRules, handleValidation } = require('../middleware/validate');
const logActivity = require('../utils/logger');

router.use(apiLimiter);

// ── GET /api/contacts ─────────────────────────────────────────────────────────
router.get('/', protect, async (req, res) => {
    try {
        const contacts = await Contact.find({ user: req.user._id })
            .sort({ addedAt: -1 });
        return res.json(contacts);
    } catch (err) {
        return res.status(500).json({ message: 'Failed to fetch contacts.' });
    }
});

// ── POST /api/contacts ────────────────────────────────────────────────────────
router.post('/', protect, contactRules, handleValidation, async (req, res) => {
    try {
        const { name, email, phone, relationship, accessLevel } = req.body;

        // Prevent duplicate contact for same user
        const exists = await Contact.findOne({ user: req.user._id, email });
        if (exists) {
            return res.status(400).json({ message: 'A contact with this email already exists.' });
        }

        const contact = await Contact.create({
            user: req.user._id,
            name,
            email,
            phone,
            relationship,
            accessLevel: accessLevel || 'view',
            status: 'pending',
        });

        await logActivity(
            req.user._id,
            'ADD_CONTACT',
            `Trusted contact added: ${contact.name} (${contact.relationship || 'unspecified'})`,
            req
        );

        return res.status(201).json(contact);
    } catch (err) {
        return res.status(500).json({ message: 'Failed to add contact.', error: err.message });
    }
});

// ── PUT /api/contacts/:id ─────────────────────────────────────────────────────
router.put('/:id', protect, contactRules, handleValidation, async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) return res.status(404).json({ message: 'Contact not found.' });
        if (contact.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorised to edit this contact.' });
        }

        const { name, email, phone, relationship, accessLevel } = req.body;

        contact.name = name || contact.name;
        contact.email = email || contact.email;
        contact.phone = phone !== undefined ? phone : contact.phone;
        contact.relationship = relationship !== undefined ? relationship : contact.relationship;
        contact.accessLevel = accessLevel || contact.accessLevel;

        await contact.save();

        await logActivity(req.user._id, 'UPDATE_CONTACT', `Contact updated: ${contact.name}`, req);

        return res.json(contact);
    } catch (err) {
        return res.status(500).json({ message: 'Failed to update contact.' });
    }
});

// ── DELETE /api/contacts/:id ──────────────────────────────────────────────────
router.delete('/:id', protect, async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) return res.status(404).json({ message: 'Contact not found.' });
        if (contact.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorised to delete this contact.' });
        }

        await contact.deleteOne();

        await logActivity(req.user._id, 'DELETE_CONTACT', `Contact removed: ${contact.name}`, req);

        return res.json({ message: 'Contact removed.' });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to delete contact.' });
    }
});

module.exports = router;
