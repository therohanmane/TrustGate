'use strict';

const { body, param, query, validationResult } = require('express-validator');

/**
 * handleValidation — Middleware to collect express-validator errors
 * and return a structured 422 response with field-level details.
 */
const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: 'Validation failed.',
            errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
        });
    }
    next();
};

// ── Auth ──────────────────────────────────────────────────────────────────────

const registerRules = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required.')
        .isLength({ min: 2, max: 80 }).withMessage('Name must be 2–80 characters.'),
    body('email')
        .trim()
        .isEmail().withMessage('A valid email is required.')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters.')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter.')
        .matches(/[0-9]/).withMessage('Password must contain at least one number.')
        .matches(/[^A-Za-z0-9]/).withMessage('Password must contain at least one special character.'),
    body('phone')
        .optional()
        .matches(/^\+?[0-9]{7,15}$/).withMessage('Phone must be 7–15 digits.'),
];

const loginRules = [
    body('email')
        .trim()
        .isEmail().withMessage('A valid email is required.')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required.'),
];

const forgotPasswordRules = [
    body('email')
        .trim()
        .isEmail().withMessage('A valid email is required.')
        .normalizeEmail(),
];

const resetPasswordRules = [
    param('token')
        .notEmpty().withMessage('Reset token is required.'),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters.')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter.')
        .matches(/[0-9]/).withMessage('Password must contain at least one number.')
        .matches(/[^A-Za-z0-9]/).withMessage('Password must contain at least one special character.'),
];

const sendOtpRules = [
    body('email')
        .trim()
        .isEmail().withMessage('A valid email is required.')
        .normalizeEmail(),
];

const verifyOtpRules = [
    body('email')
        .trim()
        .isEmail().withMessage('A valid email is required.')
        .normalizeEmail(),
    body('otp')
        .isLength({ min: 6, max: 6 }).withMessage('OTP must be exactly 6 digits.')
        .isNumeric().withMessage('OTP must be numeric.'),
];

// ── Contacts ─────────────────────────────────────────────────────────────────

const contactRules = [
    body('name')
        .trim()
        .notEmpty().withMessage('Contact name is required.')
        .isLength({ max: 80 }).withMessage('Name must be at most 80 characters.'),
    body('email')
        .trim()
        .isEmail().withMessage('A valid email is required.')
        .normalizeEmail(),
    body('phone')
        .optional()
        .matches(/^\+?[0-9]{7,15}$/).withMessage('Phone must be 7–15 digits.'),
    body('relationship')
        .optional()
        .isLength({ max: 50 }).withMessage('Relationship must be at most 50 characters.'),
    body('accessLevel')
        .optional()
        .isIn(['full', 'view', 'partial']).withMessage('Access level must be full, view, or partial.'),
];

// ── Assets ────────────────────────────────────────────────────────────────────

const assetRules = [
    body('name')
        .optional()
        .trim()
        .isLength({ max: 120 }).withMessage('Asset name must be at most 120 characters.'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Description must be at most 500 characters.'),
    body('category')
        .optional()
        .isIn(['document', 'media', 'password', 'other']).withMessage('Invalid category.'),
];

// ── Users / Settings ─────────────────────────────────────────────────────────

const updateProfileRules = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 80 }).withMessage('Name must be 2–80 characters.'),
    body('phone')
        .optional()
        .matches(/^\+?[0-9]{7,15}$/).withMessage('Phone must be 7–15 digits.'),
];

const changePasswordRules = [
    body('currentPassword')
        .notEmpty().withMessage('Current password is required.'),
    body('newPassword')
        .isLength({ min: 8 }).withMessage('New password must be at least 8 characters.')
        .matches(/[A-Z]/).withMessage('Must contain at least one uppercase letter.')
        .matches(/[0-9]/).withMessage('Must contain at least one number.')
        .matches(/[^A-Za-z0-9]/).withMessage('Must contain at least one special character.'),
];

const updateSettingsRules = [
    body('inactivityPeriod')
        .optional()
        .isInt({ min: 1, max: 3650 }).withMessage('Inactivity period must be 1–3650 days.'),
    body('gracePeriod')
        .optional()
        .isBoolean().withMessage('Grace period must be a boolean.'),
    body('gracePeriodDuration')
        .optional()
        .isInt({ min: 1, max: 720 }).withMessage('Grace period duration must be 1–720 hours.'),
    body('releaseEmail')
        .optional()
        .trim()
        .isEmail().withMessage('Release email must be a valid email.')
        .normalizeEmail(),
];

module.exports = {
    handleValidation,
    registerRules,
    loginRules,
    forgotPasswordRules,
    resetPasswordRules,
    sendOtpRules,
    verifyOtpRules,
    contactRules,
    assetRules,
    updateProfileRules,
    changePasswordRules,
    updateSettingsRules,
};
