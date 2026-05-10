'use strict';

/**
 * firebase.js — Firebase Admin SDK initializer.
 * Reads service-account JSON from FIREBASE_SERVICE_ACCOUNT env var (stringified JSON)
 * or from the path in FIREBASE_SERVICE_ACCOUNT_PATH.
 */

const admin = require('firebase-admin');

let bucket;

function initFirebase() {
    if (admin.apps.length) {
        bucket = admin.storage().bucket();
        return;
    }

    let credential;

    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        // Injected as JSON string (recommended for production / Docker)
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        credential = admin.credential.cert(serviceAccount);
    } else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
        // Path to a local JSON file (dev convenience)
        const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
        credential = admin.credential.cert(serviceAccount);
    } else {
        console.warn(
            '[Firebase] No service account configured — Firebase Storage disabled. ' +
            'Set FIREBASE_SERVICE_ACCOUNT or FIREBASE_SERVICE_ACCOUNT_PATH in .env'
        );
        return;
    }

    admin.initializeApp({
        credential,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });

    bucket = admin.storage().bucket();
    console.log('✅  Firebase Admin initialised. Storage bucket:', process.env.FIREBASE_STORAGE_BUCKET);
}

function getBucket() {
    return bucket || null;
}

module.exports = { initFirebase, getBucket };
