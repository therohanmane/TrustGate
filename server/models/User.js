const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    lastActive: { type: Date, default: Date.now },
    settings: {
        inactivityPeriod: { type: Number, default: 30 }, // days
        gracePeriod: { type: Boolean, default: true },
        gracePeriodDuration: { type: Number, default: 48 }, // hours
    },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
