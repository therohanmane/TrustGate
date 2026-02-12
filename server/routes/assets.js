const express = require('express');
const router = express.Router();
const Asset = require('../models/Asset');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Multer Storage Engines
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Make sure this folder exists
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// GET /api/assets
router.get('/', protect, async (req, res) => {
    try {
        const assets = await Asset.find({ user: req.user._id });
        res.json(assets);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// POST /api/assets (Upload)
router.post('/', protect, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { name, category, description } = req.body;

        const asset = new Asset({
            user: req.user._id,
            name: name || req.file.originalname,
            description,
            category: category || 'document',
            fileUrl: req.file.path,
            fileType: req.file.mimetype,
            size: (req.file.size / 1024).toFixed(2) + ' KB', // Convert to KB
            status: 'secure'
        });

        await asset.save();
        res.status(201).json(asset);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// DELETE /api/assets/:id
router.delete('/:id', protect, async (req, res) => {
    try {
        const asset = await Asset.findById(req.params.id);

        if (!asset) {
            return res.status(404).json({ message: 'Asset not found' });
        }

        // Check user
        if (asset.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await asset.deleteOne();
        res.json({ message: 'Asset removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
