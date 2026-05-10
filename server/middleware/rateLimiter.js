'use strict';

const rateLimit = require('express-rate-limit');

/** Standard JSON response for rate-limit hits */
const rateLimitHandler = (req, res) => {
    res.status(429).json({
        message: 'Too many requests — please wait and try again.',
        retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
    });
};

/**
 * authLimiter — Applied to all /api/auth/* routes.
 * 10 requests per 15-minute window per IP.
 */
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitHandler,
    message: 'Too many auth attempts — please wait 15 minutes.',
});

/**
 * otpLimiter — Applied specifically to /api/auth/send-otp.
 * 3 OTP sends per 10-minute window per IP.
 */
const otpLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 3,
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitHandler,
    message: 'Too many OTP requests — please wait 10 minutes.',
});

/**
 * apiLimiter — General API rate limit.
 * 100 requests per 15-minute window per IP.
 */
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitHandler,
});

module.exports = { authLimiter, otpLimiter, apiLimiter };
