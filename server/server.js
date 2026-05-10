'use strict';

// ── Load & validate environment FIRST — crashes if any required var is missing ──
require('dotenv').config();
const env = require('./config/env');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const { startInactivityJob } = require('./utils/inactivityJob');
const { initFirebase }        = require('./config/firebase');
const passport                = require('./config/passport');
const session                 = require('express-session');

// ── Initialise Firebase Admin (non-fatal — falls back to local disk) ──────────
initFirebase();

// ── App bootstrap ─────────────────────────────────────────────────────────────
const app = express();

// ── Security headers (helmet) ─────────────────────────────────────────────────
app.use(
    helmet({
        crossOriginResourcePolicy: { policy: 'same-site' },
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                imgSrc: ["'self'", 'data:', 'blob:'],
                scriptSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
            },
        },
    })
);

// ── CORS — only allow configured client origin ────────────────────────────────
app.use(
    cors({
        origin: env.CLIENT_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })
);

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

// ── Session (required only for OAuth redirect handshake — short TTL) ──────────
app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 5 * 60 * 1000, // 5 min — only needed for OAuth redirect
    },
}));

// ── Passport ──────────────────────────────────────────────────────────────────
app.use(passport.initialize());
app.use(passport.session());

// ── Trust proxy (needed for accurate IPs behind nginx/load-balancer) ──────────
app.set('trust proxy', 1);

// ── Static uploads ────────────────────────────────────────────────────────────
// Only avatars are served statically. Encrypted asset files are served
// via the authenticated /api/assets/:id/download endpoint.
app.use(
    '/uploads/avatars',
    express.static(path.join(__dirname, 'uploads', 'avatars'), {
        maxAge: '1d',
        dotfiles: 'deny',
    })
);

// ── MongoDB connection ────────────────────────────────────────────────────────
mongoose
    .connect(env.MONGODB_URI)
    .then(() => {
        console.log('✅  MongoDB connected.');
        // Start inactivity cron AFTER db is ready
        startInactivityJob();
    })
    .catch((err) => {
        console.error('❌  MongoDB connection failed:', err.message);
        process.exit(1);
    });

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/users',    require('./routes/users'));
app.use('/api/assets',   require('./routes/assets'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/safety',   require('./routes/safety'));
app.use('/api/logs',     require('./routes/logs'));

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
    res.json({
        status: 'ok',
        env: env.NODE_ENV,
        time: new Date().toISOString(),
    });
});

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({ message: 'Route not found.' });
});

// ── Global error handler — never leaks stack traces to the client ─────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
    const isDev = env.NODE_ENV === 'development';
    console.error('[Error]', err);

    // Multer errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ message: 'File is too large.' });
    }

    res.status(err.status || 500).json({
        message: err.message || 'An unexpected error occurred.',
        ...(isDev ? { stack: err.stack } : {}),
    });
});

// ── Start server ──────────────────────────────────────────────────────────────
const server = app.listen(env.PORT, () => {
    console.log(`🚀  TrustGate API running on port ${env.PORT} [${env.NODE_ENV}]`);
});

// ── Graceful shutdown ─────────────────────────────────────────────────────────
const shutdown = (signal) => {
    console.log(`\n🛑  Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
        mongoose.connection.close(false, () => {
            console.log('✅  MongoDB connection closed. Goodbye.');
            process.exit(0);
        });
    });
    // Force kill after 10s
    setTimeout(() => process.exit(1), 10_000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));
