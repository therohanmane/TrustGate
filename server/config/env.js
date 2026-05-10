'use strict';

/**
 * env.js — Centralised environment variable validator.
 * Crashes the process at startup with a clear message if any required
 * variable is missing so we never run with silent insecure defaults.
 */

const REQUIRED = [
    'MONGODB_URI',
    'JWT_SECRET',
    'MASTER_ENCRYPTION_KEY',
    'CLIENT_URL',
    'EMAIL_USER',
    'EMAIL_PASS',
];

const missing = REQUIRED.filter((key) => !process.env[key]);

if (missing.length) {
    console.error('\n❌  Missing required environment variables:\n');
    missing.forEach((k) => console.error(`   • ${k}`));
    console.error('\n   Copy server/.env.example → server/.env and fill in values.\n');
    process.exit(1);
}

// Validate JWT_SECRET strength (must be at least 32 chars)
if (process.env.JWT_SECRET.length < 32) {
    console.error('❌  JWT_SECRET must be at least 32 characters long.');
    process.exit(1);
}

// Validate MASTER_ENCRYPTION_KEY is 64 hex chars (32 bytes)
if (!/^[0-9a-fA-F]{64}$/.test(process.env.MASTER_ENCRYPTION_KEY)) {
    console.error(
        '❌  MASTER_ENCRYPTION_KEY must be exactly 64 hex characters (32 bytes).\n' +
        '   Generate one with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
    );
    process.exit(1);
}

module.exports = {
    PORT: parseInt(process.env.PORT, 10) || 5000,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
    MASTER_ENCRYPTION_KEY: process.env.MASTER_ENCRYPTION_KEY,
    CLIENT_URL: process.env.CLIENT_URL,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    NODE_ENV: process.env.NODE_ENV || 'development',
};
