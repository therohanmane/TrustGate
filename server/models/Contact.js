'use strict';

const mongoose = require('mongoose');
const crypto = require('crypto');

const contactSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    name: {
        type: String,
        required: [true, 'Contact name is required.'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Contact email is required.'],
        lowercase: true,
        trim: true,
    },
    phone: { type: String, trim: true },
    relationship: { type: String, trim: true },
    accessLevel: {
        type: String,
        enum: ['full', 'view', 'partial'],
        default: 'view',
    },
    status: {
        type: String,
        enum: ['pending', 'verified', 'active'],
        default: 'pending',
    },
    avatar: { type: String },

    // ── Release tracking ─────────────────────────────────────────────────────
    notifiedAt: { type: Date },         // When the release email was sent
    inviteToken: {                      // Unique token for future contact portal
        type: String,
        default: () => crypto.randomBytes(32).toString('hex'),
        index: true,
    },

    addedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Contact', contactSchema);
