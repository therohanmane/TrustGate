const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Helper to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret_key_123', {
        expiresIn: '30d',
    });
};

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// In-memory OTP Store (For demo purposes)
const otpStore = {};

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate Reset Token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Hash and set to resetPasswordToken
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 Minutes

        await user.save();

        // Create reset url
        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

        const message = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Password Reset Request</h2>
                <p>You requested a password reset. Please click the link below to verify:</p>
                <a href="${resetUrl}" style="background: #4da6ff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
                <p style="margin-top: 20px; font-size: 12px; color: gray;">If you did not make this request, please ignore this email.</p>
            </div>
        `;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'TrustGate Password Reset',
            html: message
        });

        res.json({ message: 'Email sent' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Email could not be sent' });
    }
});

// POST /api/auth/reset-password/:token
router.post('/reset-password/:token', async (req, res) => {
    try {
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid token' });
        }

        // Set new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/auth/send-otp
router.post('/send-otp', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP with 10 min expiry
        otpStore[email] = {
            otp,
            expires: Date.now() + 10 * 60 * 1000
        };

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'TrustGate Verification Code',
            html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Verify your Email</h2>
                    <p>Your verification code for TrustGate is:</p>
                    <h1 style="color: #4da6ff; letter-spacing: 5px;">${otp}</h1>
                    <p>This code expires in 10 minutes.</p>
                   </div>`
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: 'OTP sent successfully' });

    } catch (error) {
        console.error('Email Error:', error);
        res.status(500).json({ message: 'Failed to send OTP', error: error.message });
    }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!otpStore[email]) {
            return res.status(400).json({ message: 'No OTP found for this email' });
        }

        const { otp: storedOtp, expires } = otpStore[email];

        if (Date.now() > expires) {
            delete otpStore[email];
            return res.status(400).json({ message: 'OTP expired' });
        }

        if (storedOtp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // OTP Valid
        delete otpStore[email]; // Verify once
        res.json({ message: 'Verification successful' });

    } catch (error) {
        res.status(500).json({ message: 'Verification failed' });
    }
});

const logActivity = require('../utils/logger');

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone
        });

        if (user) {
            await logActivity(user._id, 'REGISTER', 'User registration successful', req);
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Update last active
            user.lastActive = Date.now();
            await user.save();

            await logActivity(user._id, 'LOGIN', 'User logged in successfully', req);

            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// POST /api/auth/verify-aadhaar (Mock)
router.post('/verify-aadhaar', async (req, res) => {
    try {
        const { number, userId } = req.body;

        // Simulating UIDAI verification delay
        setTimeout(async () => {
            // Update user status
            // In a real app, we would verify the Aadhaar number with an external API
            // For this project, we assume any 12 digit number is valid
            res.json({ success: true, message: 'Identity verified successfully', aadhaarLast4: number.slice(-4) });
        }, 1000);

    } catch (error) {
        res.status(500).json({ message: 'Verification failed' });
    }
});

module.exports = router;
