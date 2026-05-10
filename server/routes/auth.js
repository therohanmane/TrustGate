'use strict';

const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const OtpStore = require('../models/OtpStore');
const { JWT_SECRET, JWT_EXPIRE, CLIENT_URL } = require('../config/env');
const { authLimiter, otpLimiter } = require('../middleware/rateLimiter');
const {
    registerRules,
    loginRules,
    forgotPasswordRules,
    resetPasswordRules,
    sendOtpRules,
    verifyOtpRules,
    handleValidation,
} = require('../middleware/validate');
const { sendPasswordReset, sendOtp } = require('../utils/mailer');
const { protect } = require('../middleware/authMiddleware');
const logActivity = require('../utils/logger');

// ── Helpers ───────────────────────────────────────────────────────────────────

const generateToken = (id) =>
    jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });

// Apply auth rate limiter to the entire auth router
router.use(authLimiter);

// ── POST /api/auth/register ───────────────────────────────────────────────────
router.post('/register', registerRules, handleValidation, async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'An account with this email already exists.' });
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
        });

        await logActivity(user._id, 'REGISTER', 'User registration successful.', req);

        return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'An account with this email already exists.' });
        }
        return res.status(500).json({ message: 'Registration failed. Please try again.' });
    }
});

// ── POST /api/auth/login ──────────────────────────────────────────────────────
router.post('/login', loginRules, handleValidation, async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            // Constant-time generic message (don't reveal which is wrong)
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Reset grace period flags on login
        if (user.gracePeriodWarned) {
            user.gracePeriodWarned = false;
            user.gracePeriodWarnedAt = undefined;
        }
        user.lastActive = new Date();
        await user.save({ validateBeforeSave: false });

        await logActivity(user._id, 'LOGIN', 'User logged in successfully.', req);

        return res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isVerified: user.isVerified,
            releaseTriggered: user.releaseTriggered,
            token: generateToken(user._id),
        });
    } catch (err) {
        return res.status(500).json({ message: 'Login failed. Please try again.' });
    }
});

// ── POST /api/auth/send-otp ───────────────────────────────────────────────────
router.post('/send-otp', otpLimiter, sendOtpRules, handleValidation, async (req, res) => {
    try {
        const { email } = req.body;

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = OtpStore.hashOtp(otp);

        // Upsert OTP record (one per email, TTL 10 min)
        await OtpStore.findOneAndUpdate(
            { email },
            {
                hashedOtp,
                attempts: 0,
                expires: new Date(Date.now() + 10 * 60 * 1000),
            },
            { upsert: true, new: true }
        );

        await sendOtp(email, otp);

        return res.json({ message: 'OTP sent successfully.' });
    } catch (err) {
        console.error('[OTP] Send error:', err.message);
        return res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
    }
});

// ── POST /api/auth/verify-otp ─────────────────────────────────────────────────
router.post('/verify-otp', verifyOtpRules, handleValidation, async (req, res) => {
    try {
        const { email, otp } = req.body;
        const MAX_ATTEMPTS = 3;

        const record = await OtpStore.findOne({ email });

        if (!record) {
            return res.status(400).json({ message: 'No OTP found for this email. Please request a new one.' });
        }

        if (new Date() > record.expires) {
            await OtpStore.deleteOne({ email });
            return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
        }

        if (!record.isValid(otp)) {
            record.attempts += 1;
            await record.save();

            if (record.attempts >= MAX_ATTEMPTS) {
                await OtpStore.deleteOne({ email });
                return res.status(400).json({ message: 'Too many incorrect attempts. Please request a new OTP.' });
            }

            return res.status(400).json({
                message: `Invalid OTP. ${MAX_ATTEMPTS - record.attempts} attempt(s) remaining.`,
            });
        }

        // ✅ Valid — consume it
        await OtpStore.deleteOne({ email });

        // Mark user as verified if they exist
        await User.findOneAndUpdate({ email }, { isVerified: true });

        return res.json({ message: 'Verification successful.' });
    } catch (err) {
        return res.status(500).json({ message: 'Verification failed. Please try again.' });
    }
});

// ── POST /api/auth/forgot-password ───────────────────────────────────────────
router.post('/forgot-password', forgotPasswordRules, handleValidation, async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        // Always return 200 to prevent email enumeration
        if (!user) {
            return res.json({ message: 'If an account with that email exists, a reset link has been sent.' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 min
        await user.save({ validateBeforeSave: false });

        try {
            await sendPasswordReset(email, resetToken);
        } catch (mailErr) {
            // Roll back token if email fails
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
            return res.status(500).json({ message: 'Email could not be sent. Please try again.' });
        }

        return res.json({ message: 'If an account with that email exists, a reset link has been sent.' });
    } catch (err) {
        return res.status(500).json({ message: 'Server error. Please try again.' });
    }
});

// ── POST /api/auth/reset-password/:token ─────────────────────────────────────
router.post('/reset-password/:token', resetPasswordRules, handleValidation, async (req, res) => {
    try {
        const hashedToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: new Date() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Reset link is invalid or has expired.' });
        }

        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(req.body.password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        await logActivity(user._id, 'RESET_PASSWORD', 'Password reset via email token.', req);

        return res.json({ message: 'Password updated successfully. You can now log in.' });
    } catch (err) {
        return res.status(500).json({ message: 'Server error. Please try again.' });
    }
});

// ── POST /api/auth/ping ───────────────────────────────────────────────────────
// Frontend calls this periodically to update lastActive (heartbeat)
router.post('/ping', protect, async (req, res) => {
    // lastActive is already updated by protect middleware
    return res.json({ message: 'Activity recorded.', lastActive: req.user.lastActive });
});

// ── POST /api/auth/verify-aadhaar (mock) ─────────────────────────────────────
router.post('/verify-aadhaar', protect, async (req, res) => {
    try {
        const { number } = req.body;

        if (!number || !/^\d{12}$/.test(number)) {
            return res.status(400).json({ message: 'Aadhaar number must be exactly 12 digits.' });
        }

        // Simulated UIDAI delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        return res.json({
            success: true,
            message: 'Identity verified successfully.',
            aadhaarLast4: number.slice(-4),
        });
    } catch (err) {
        return res.status(500).json({ message: 'Verification failed.' });
    }
});

// ── GET /api/auth/google — initiate Google OAuth ──────────────────────────────
const passport = require('../config/passport');

router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: true,
    })
);

// ── GET /api/auth/google/callback — handle Google response ────────────────────
router.get(
    '/google/callback',
    passport.authenticate('google', { session: true, failureRedirect: `${CLIENT_URL}/login?error=oauth_failed` }),
    async (req, res) => {
        try {
            const { user, token } = req.user;

            await logActivity(user._id, 'OAUTH_LOGIN', 'User signed in via Google OAuth.', req);

            // Redirect to frontend with token in query params (picked up by OAuthCallback page)
            const params = new URLSearchParams({
                token,
                _id:   user._id.toString(),
                name:  user.name,
                email: user.email,
            });

            return res.redirect(`${CLIENT_URL}/oauth/callback?${params.toString()}`);
        } catch (err) {
            console.error('[OAuth] Callback error:', err.message);
            return res.redirect(`${CLIENT_URL}/login?error=oauth_failed`);
        }
    }
);

module.exports = router;
