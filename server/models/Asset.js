const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String, enum: ['document', 'media', 'password', 'other'], default: 'document' },
    fileUrl: { type: String, required: true }, // Path to file or encrypted content
    fileType: { type: String },
    size: { type: String },
    status: { type: String, enum: ['secure', 'pending_release', 'released'], default: 'secure' },
    uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Asset', assetSchema);
