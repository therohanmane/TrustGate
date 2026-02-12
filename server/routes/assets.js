const express = require('express');
const router = express.Router();
const Asset = require('../models/Asset');

// GET /api/assets
router.get('/', async (req, res) => {
    // Return mock assets or fetch from DB
    res.json([
        { id: 1, name: "Last_Will_Final.pdf", date: "Oct 24, 2025", size: "2.4 MB", status: "Encrypted" },
        { id: 2, name: "Crypto_Wallet_Keys.txt", date: "Nov 01, 2025", size: "1 KB", status: "Encrypted" },
    ]);
});

// POST /api/assets
router.post('/', async (req, res) => {
    // Handle file upload here (using multer usually)
    res.status(201).json({ message: 'Asset uploaded successfully' });
});

// DELETE /api/assets/:id
router.delete('/:id', async (req, res) => {
    res.json({ message: 'Asset deleted' });
});

module.exports = router;
