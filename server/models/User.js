const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    aadhaarNumber: { type: String },
    avatar: { type: String }, // URL to profile picture
    isVerified: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    lastActive: { type: Date, default: Date.now },
    settings: {
        inactivityPeriod: { type: Number, default: 90 }, // days
        gracePeriod: { type: Boolean, default: true },
        gracePeriodDuration: { type: Number, default: 48 }, // hours
        releaseEmail: { type: String }, // Email to notify upon release
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
