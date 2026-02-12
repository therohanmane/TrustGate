const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

// Middleware to verify token
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Multer Config for Avatar
const storage = multer.diskStorage({
    destination: './uploads/avatars/',
    filename: function (req, file, cb) {
        cb(null, 'avatar-' + req.user._id + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 2000000 }, // 2MB
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images Only!');
        }
    }
});

const logActivity = require('../utils/logger');

// GET /api/users/profile
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                avatar: user.avatar,
                lastActive: user.lastActive,
                settings: user.settings
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// PUT /api/users/profile
router.put('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.name = req.body.name || user.name;
            user.phone = req.body.phone || user.phone;
            // Email update handling typically requires re-verification, skipping for now or allow if simplistic
            // user.email = req.body.email || user.email; 

            const updatedUser = await user.save();
            await logActivity(req.user._id, 'UPDATE_PROFILE', 'User profile updated', req);

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                avatar: updatedUser.avatar,
                token: jwt.sign({ id: updatedUser._id }, process.env.JWT_SECRET, { expiresIn: '30d' }) // Refresh token usually
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Update failed' });
    }
});

// PUT /api/users/change-password
router.put('/change-password', protect, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        if (user && (await bcrypt.compare(currentPassword, user.password))) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
            await user.save();
            await logActivity(req.user._id, 'CHANGE_PASSWORD', 'Password changed successfully', req);

            res.json({ message: 'Password updated successfully' });
        } else {
            res.status(400).json({ message: 'Invalid current password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// POST /api/users/avatar
router.post('/avatar', protect, upload.single('avatar'), async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.avatar = `/uploads/avatars/${req.file.filename}`;
            await user.save();
            await logActivity(req.user._id, 'UPDATE_AVATAR', 'Profile picture updated', req);

            res.json({ avatar: user.avatar });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Avatar upload failed' });
    }
});

module.exports = router;
