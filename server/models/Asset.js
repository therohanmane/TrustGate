'use strict';

const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    name: {
        type: String,
        required: [true, 'Asset name is required.'],
        trim: true,
    },
    description: { type: String, trim: true },
    category: {
        type: String,
        enum: ['document', 'media', 'password', 'other'],
        default: 'document',
    },

    // ── File storage ─────────────────────────────────────────────────────────
    fileUrl: {
        type: String,
        required: true,
    },                                  // Path to the encrypted file on disk
    fileType: { type: String },
    size: { type: String },

    // ── AES-256-CBC encryption fields ────────────────────────────────────────
    iv: { type: String },               // Hex IV used during encryption
    isEncrypted: { type: Boolean, default: false },

    // ── Lifecycle ────────────────────────────────────────────────────────────
    status: {
        type: String,
        enum: ['secure', 'pending_release', 'released'],
        default: 'secure',
    },

    // ── Contact assignments ──────────────────────────────────────────────────
    assignedContacts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact',
    }],

    uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Asset', assetSchema);
