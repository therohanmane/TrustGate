const mongoose = require('mongoose');

const safetyAlertSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['SOS', 'LOCATION_SHARE', 'SILENT_ALERT'], required: true },
    location: {
        lat: { type: Number },
        lng: { type: Number },
        address: { type: String },
    },
    message: { type: String },
    status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' },
    triggeredAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SafetyAlert', safetyAlertSchema);
