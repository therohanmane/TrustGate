'use strict';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required.'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
    },
    phone: { type: String, trim: true },
    aadhaarNumber: { type: String },
    avatar: { type: String },

    isVerified: { type: Boolean, default: false },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },

    // ── Inactivity tracking ──────────────────────────────────────────────────
    lastActive: {
        type: Date,
        default: Date.now,
        index: true,  // queried by inactivity cron
    },

    // Dead Man's Switch state
    releaseTriggered: { type: Boolean, default: false },
    releaseTriggeredAt: { type: Date },

    // Grace-period state (set by inactivity job)
    gracePeriodWarned: { type: Boolean, default: false },
    gracePeriodWarnedAt: { type: Date },

    // ── User-configurable settings ───────────────────────────────────────────
    settings: {
        inactivityPeriod: { type: Number, default: 90 },       // days
        gracePeriod: { type: Boolean, default: true },
        gracePeriodDuration: { type: Number, default: 48 },    // hours
        releaseEmail: { type: String },
    },

    // ── 2FA fields (for future use, schema-complete now) ────────────────────
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorCode: { type: String },
    twoFactorExpire: { type: Date },

    // ── Password reset ───────────────────────────────────────────────────────
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },

    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
