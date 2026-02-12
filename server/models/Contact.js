const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    relationship: { type: String },
    accessLevel: { type: String, enum: ['full', 'view', 'partial'], default: 'view' },
    addedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Contact', contactSchema);
