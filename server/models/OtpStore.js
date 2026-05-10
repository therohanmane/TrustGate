'use strict';

const mongoose = require('mongoose');
const crypto = require('crypto');

/**
 * OtpStore — Replaces the bare in-memory {} object.
 * - OTP is stored as a SHA-256 hash (never plaintext).
 * - Automatic TTL expiry via MongoDB TTL index.
 * - Tracks failed attempts to prevent brute-force guessing.
 */
const otpStoreSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: true,
        lowercase: true,
    },
    hashedOtp: {
        type: String,
        required: true,
    },
    attempts: {
        type: Number,
        default: 0,
    },
    expires: {
        type: Date,
        required: true,
        index: { expires: 0 }, // MongoDB TTL: auto-delete when expires < now
    },
}, { timestamps: false });

/** Hash an OTP before storing */
otpStoreSchema.statics.hashOtp = (otp) => {
    return crypto.createHash('sha256').update(otp).digest('hex');
};

/** Verify a submitted OTP against the stored hash */
otpStoreSchema.methods.isValid = function (submittedOtp) {
    const hashed = crypto.createHash('sha256').update(submittedOtp).digest('hex');
    return this.hashedOtp === hashed;
};

module.exports = mongoose.model('OtpStore', otpStoreSchema);
