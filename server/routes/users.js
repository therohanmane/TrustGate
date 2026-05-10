'use strict';

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const { apiLimiter } = require('../middleware/rateLimiter');
const {
    updateProfileRules,
    changePasswordRules,
    updateSettingsRules,
    handleValidation,
} = require('../middleware/validate');
const logActivity = require('../utils/logger');
const bcrypt = require('bcryptjs');
const { JWT_SECRET, JWT_EXPIRE } = require('../config/env');

router.use(apiLimiter);

// ── Avatar Upload Setup ───────────────────────────────────────────────────────
const AVATAR_DIR = path.join(__dirname, '..', 'uploads', 'avatars');
if (!fs.existsSync(AVATAR_DIR)) fs.mkdirSync(AVATAR_DIR, { recursive: true });

const avatarStorage = multer.diskStorage({
    destination: AVATAR_DIR,
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `avatar-${req.user._id}-${Date.now()}${ext}`);
    },
});

const avatarUpload = multer({
    storage: avatarStorage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
    fileFilter: (_req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|webp/;
        const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
        const mimeOk = allowed.test(file.mimetype);
        if (extOk && mimeOk) return cb(null, true);
        cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed.'));
    },
});

// ── GET /api/users/profile ────────────────────────────────────────────────────
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select(
            '-password -resetPasswordToken -resetPasswordExpire -twoFactorCode'
        );
        if (!user) return res.status(404).json({ message: 'User not found.' });
        return res.json(user);
    } catch (err) {
        return res.status(500).json({ message: 'Failed to fetch profile.' });
    }
});

// ── PUT /api/users/profile ────────────────────────────────────────────────────
router.put('/profile', protect, updateProfileRules, handleValidation, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found.' });

        user.name = req.body.name || user.name;
        user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;

        const updatedUser = await user.save();
        await logActivity(req.user._id, 'UPDATE_PROFILE', 'Profile updated.', req);

        return res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            avatar: updatedUser.avatar,
        });
    } catch (err) {
        return res.status(500).json({ message: 'Profile update failed.' });
    }
});

// ── PUT /api/users/change-password ───────────────────────────────────────────
router.put('/change-password', protect, changePasswordRules, handleValidation, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
            return res.status(400).json({ message: 'Current password is incorrect.' });
        }

        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        await logActivity(req.user._id, 'CHANGE_PASSWORD', 'Password changed.', req);

        return res.json({ message: 'Password updated successfully.' });
    } catch (err) {
        return res.status(500).json({ message: 'Password change failed.' });
    }
});

// ── PUT /api/users/settings ───────────────────────────────────────────────────
router.put('/settings', protect, updateSettingsRules, handleValidation, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found.' });

        const { inactivityPeriod, gracePeriod, gracePeriodDuration, releaseEmail } = req.body;

        if (inactivityPeriod !== undefined) user.settings.inactivityPeriod = inactivityPeriod;
        if (gracePeriod !== undefined) user.settings.gracePeriod = gracePeriod;
        if (gracePeriodDuration !== undefined) user.settings.gracePeriodDuration = gracePeriodDuration;
        if (releaseEmail !== undefined) user.settings.releaseEmail = releaseEmail;

        await user.save();
        await logActivity(req.user._id, 'UPDATE_SETTINGS', 'Inactivity settings updated.', req);

        return res.json({ message: 'Settings saved.', settings: user.settings });
    } catch (err) {
        return res.status(500).json({ message: 'Settings update failed.' });
    }
});

// ── POST /api/users/avatar ────────────────────────────────────────────────────
router.post('/avatar', protect, avatarUpload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No image file provided.' });

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found.' });

        // Delete old avatar from disk
        if (user.avatar) {
            const oldPath = path.join(__dirname, '..', user.avatar);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        user.avatar = path.join('uploads', 'avatars', req.file.filename).replace(/\\/g, '/');
        await user.save({ validateBeforeSave: false });

        await logActivity(req.user._id, 'UPDATE_AVATAR', 'Profile picture updated.', req);

        return res.json({ avatar: `/${user.avatar}` });
    } catch (err) {
        return res.status(500).json({ message: 'Avatar upload failed.' });
    }
});

module.exports = router;
