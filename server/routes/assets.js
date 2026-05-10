'use strict';

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const crypto = require('crypto');

const Asset = require('../models/Asset');
const Contact = require('../models/Contact');
const { protect } = require('../middleware/authMiddleware');
const { apiLimiter } = require('../middleware/rateLimiter');
const { assetRules, handleValidation } = require('../middleware/validate');
const { encryptBuffer, decryptBuffer } = require('../utils/encryption');
const logActivity = require('../utils/logger');

router.use(apiLimiter);

// ── Multer — store encrypted files in uploads/assets/ ────────────────────────
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'assets');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.memoryStorage(); // Buffer-only; we encrypt before writing

const upload = multer({
    storage,
    limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB
    fileFilter: (_req, file, cb) => {
        // Block dangerous MIME types
        const blocked = [
            'application/x-msdownload',
            'application/x-executable',
            'application/x-sh',
            'text/javascript',
        ];
        if (blocked.includes(file.mimetype)) {
            return cb(new Error('This file type is not permitted for security reasons.'));
        }
        cb(null, true);
    },
});

// ── GET /api/assets ───────────────────────────────────────────────────────────
router.get('/', protect, async (req, res) => {
    try {
        const assets = await Asset.find({ user: req.user._id })
            .select('-iv')          // Never expose IV in list
            .sort({ uploadedAt: -1 });
        return res.json(assets);
    } catch (err) {
        return res.status(500).json({ message: 'Failed to fetch assets.' });
    }
});

// ── POST /api/assets — upload & encrypt ──────────────────────────────────────
router.post('/', protect, upload.single('file'), assetRules, handleValidation, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file provided.' });
        }

        const { name, category, description } = req.body;

        // Encrypt the file buffer
        const { iv, encryptedData } = encryptBuffer(req.file.buffer);

        // Safe filename — no original name on disk
        const safeFilename = `${crypto.randomBytes(16).toString('hex')}.enc`;
        const filePath = path.join(UPLOAD_DIR, safeFilename);
        fs.writeFileSync(filePath, encryptedData);

        const asset = await Asset.create({
            user: req.user._id,
            name: name || req.file.originalname,
            description,
            category: category || 'document',
            fileUrl: path.join('uploads', 'assets', safeFilename),
            fileType: req.file.mimetype,
            size: (req.file.size / 1024).toFixed(2) + ' KB',
            iv,
            isEncrypted: true,
            status: 'secure',
        });

        await logActivity(req.user._id, 'UPLOAD_ASSET', `Asset uploaded: ${asset.name}`, req);

        // Return asset without IV
        const response = asset.toObject();
        delete response.iv;

        return res.status(201).json(response);
    } catch (err) {
        console.error('[Assets] Upload error:', err);
        return res.status(500).json({ message: err.message || 'Upload failed.' });
    }
});

// ── GET /api/assets/:id/download — decrypt & stream ──────────────────────────
router.get('/:id/download', protect, async (req, res) => {
    try {
        const asset = await Asset.findById(req.params.id);

        if (!asset) {
            return res.status(404).json({ message: 'Asset not found.' });
        }

        if (asset.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorised to access this asset.' });
        }

        const filePath = path.join(__dirname, '..', asset.fileUrl);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found on server.' });
        }

        const encryptedBuffer = fs.readFileSync(filePath);
        const decryptedBuffer = asset.isEncrypted && asset.iv
            ? decryptBuffer(encryptedBuffer, asset.iv)
            : encryptedBuffer;

        res.set({
            'Content-Type': asset.fileType || 'application/octet-stream',
            'Content-Disposition': `attachment; filename="${encodeURIComponent(asset.name)}"`,
            'Content-Length': decryptedBuffer.length,
            'X-Content-Type-Options': 'nosniff',
        });

        await logActivity(req.user._id, 'DOWNLOAD_ASSET', `Asset downloaded: ${asset.name}`, req);

        return res.send(decryptedBuffer);
    } catch (err) {
        console.error('[Assets] Download error:', err);
        return res.status(500).json({ message: 'Download failed.' });
    }
});

// ── POST /api/assets/:id/assign — assign trusted contacts ────────────────────
router.post('/:id/assign', protect, async (req, res) => {
    try {
        const asset = await Asset.findById(req.params.id);

        if (!asset) return res.status(404).json({ message: 'Asset not found.' });
        if (asset.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorised.' });
        }

        const { contactIds } = req.body; // Array of contact ObjectIds
        if (!Array.isArray(contactIds)) {
            return res.status(400).json({ message: 'contactIds must be an array.' });
        }

        // Verify all contacts belong to this user
        const contacts = await Contact.find({
            _id: { $in: contactIds },
            user: req.user._id,
        });

        if (contacts.length !== contactIds.length) {
            return res.status(400).json({ message: 'One or more contact IDs are invalid.' });
        }

        asset.assignedContacts = contactIds;
        await asset.save();

        await logActivity(req.user._id, 'ASSIGN_CONTACTS', `Assigned ${contactIds.length} contact(s) to asset: ${asset.name}`, req);

        return res.json({ message: 'Contacts assigned.', assignedContacts: asset.assignedContacts });
    } catch (err) {
        return res.status(500).json({ message: 'Assignment failed.' });
    }
});

// ── DELETE /api/assets/:id ────────────────────────────────────────────────────
router.delete('/:id', protect, async (req, res) => {
    try {
        const asset = await Asset.findById(req.params.id);

        if (!asset) return res.status(404).json({ message: 'Asset not found.' });
        if (asset.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorised to delete this asset.' });
        }

        // Remove file from disk
        const filePath = path.join(__dirname, '..', asset.fileUrl);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        await asset.deleteOne();
        await logActivity(req.user._id, 'DELETE_ASSET', `Asset deleted: ${asset.name}`, req);

        return res.json({ message: 'Asset removed.' });
    } catch (err) {
        return res.status(500).json({ message: 'Delete failed.' });
    }
});

module.exports = router;
