'use strict';

/**
 * firebaseStorage.js — Wrappers for Firebase Cloud Storage operations.
 * Falls back gracefully to local disk if Firebase is not configured.
 */

const path  = require('path');
const fs    = require('fs');
const crypto = require('crypto');
const { getBucket } = require('../config/firebase');

const LOCAL_FALLBACK_DIR = path.join(__dirname, '..', 'uploads', 'assets');

// Ensure local fallback dir exists
if (!fs.existsSync(LOCAL_FALLBACK_DIR)) {
    fs.mkdirSync(LOCAL_FALLBACK_DIR, { recursive: true });
}

/**
 * uploadEncryptedFile — Upload an encrypted buffer to Firebase Storage.
 * Falls back to local disk if Firebase is not configured.
 *
 * @param {Buffer} encryptedBuffer  — Already-AES-256-encrypted data
 * @param {string} userId           — Owner's MongoDB user ID
 * @returns {{ storageUrl: string, storageBackend: 'firebase'|'local' }}
 */
async function uploadEncryptedFile(encryptedBuffer, userId) {
    const safeFilename = `${crypto.randomBytes(16).toString('hex')}.enc`;
    const bucket = getBucket();

    if (bucket) {
        // ── Firebase Cloud Storage path ──────────────────────────────────────
        const destination = `assets/${userId}/${safeFilename}`;
        const file = bucket.file(destination);

        await file.save(encryptedBuffer, {
            metadata: {
                contentType: 'application/octet-stream',
                metadata: { encrypted: 'AES-256-CBC', owner: userId },
            },
        });

        return {
            storageUrl: destination,          // GCS path (not a public URL)
            storageBackend: 'firebase',
        };
    }

    // ── Local disk fallback ──────────────────────────────────────────────────
    const filePath = path.join(LOCAL_FALLBACK_DIR, safeFilename);
    fs.writeFileSync(filePath, encryptedBuffer);

    return {
        storageUrl: path.join('uploads', 'assets', safeFilename),
        storageBackend: 'local',
    };
}

/**
 * downloadEncryptedFile — Download encrypted buffer from Firebase or disk.
 *
 * @param {string} storageUrl       — The value stored in Asset.fileUrl
 * @param {'firebase'|'local'} storageBackend
 * @returns {Buffer}
 */
async function downloadEncryptedFile(storageUrl, storageBackend) {
    if (storageBackend === 'firebase') {
        const bucket = getBucket();
        if (!bucket) throw new Error('Firebase is not configured on this instance.');

        const file = bucket.file(storageUrl);
        const [buffer] = await file.download();
        return buffer;
    }

    // Local disk
    const filePath = path.join(__dirname, '..', storageUrl);
    if (!fs.existsSync(filePath)) throw new Error('File not found on server.');
    return fs.readFileSync(filePath);
}

/**
 * deleteStoredFile — Remove file from Firebase or disk.
 *
 * @param {string} storageUrl
 * @param {'firebase'|'local'} storageBackend
 */
async function deleteStoredFile(storageUrl, storageBackend) {
    if (storageBackend === 'firebase') {
        const bucket = getBucket();
        if (bucket) {
            await bucket.file(storageUrl).delete({ ignoreNotFound: true });
        }
        return;
    }

    const filePath = path.join(__dirname, '..', storageUrl);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}

module.exports = { uploadEncryptedFile, downloadEncryptedFile, deleteStoredFile };
