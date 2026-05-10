'use strict';

/**
 * passport.js — Google OAuth 2.0 strategy via Passport.
 *
 * Flow:
 *   GET /api/auth/google           → redirect to Google consent screen
 *   GET /api/auth/google/callback  → Google redirects here after consent
 *   → JWT is generated → redirect to CLIENT_URL/oauth/callback?token=<jwt>&name=<name>&email=<email>
 */

const passport     = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt          = require('jsonwebtoken');
const User         = require('../models/User');
const { JWT_SECRET, JWT_EXPIRE, CLIENT_URL } = require('./env');

const generateToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });

passport.use(
    new GoogleStrategy(
        {
            clientID:     process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL:  `${process.env.SERVER_URL || 'http://localhost:5000'}/api/auth/google/callback`,
            scope: ['profile', 'email'],
        },
        async (_accessToken, _refreshToken, profile, done) => {
            try {
                const email     = profile.emails?.[0]?.value;
                const name      = profile.displayName || 'Google User';
                const avatar    = profile.photos?.[0]?.value || '';
                const googleId  = profile.id;

                if (!email) {
                    return done(new Error('Google account has no email address.'));
                }

                // Find existing user or create one (upsert by email or googleId)
                let user = await User.findOne({ $or: [{ googleId }, { email }] });

                if (user) {
                    // Link Google ID if logging in with same email for the first time via OAuth
                    if (!user.googleId) {
                        user.googleId  = googleId;
                        user.isVerified = true;
                        if (!user.avatar && avatar) user.avatar = avatar;
                        user.lastActive = new Date();
                        await user.save({ validateBeforeSave: false });
                    }
                } else {
                    // New user — create without a password (OAuth-only account)
                    user = await User.create({
                        name,
                        email,
                        googleId,
                        avatar,
                        isVerified: true,       // Google already verified the email
                        password: 'GOOGLE_OAUTH_NO_PASSWORD', // placeholder — bcrypt never needed
                    });
                }

                return done(null, { user, token: generateToken(user._id) });
            } catch (err) {
                return done(err);
            }
        }
    )
);

// Minimal session serialization (only used during OAuth redirect)
passport.serializeUser((payload, done)   => done(null, payload));
passport.deserializeUser((payload, done) => done(null, payload));

module.exports = passport;
