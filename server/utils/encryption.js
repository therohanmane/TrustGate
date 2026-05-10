'use strict';

const crypto = require('crypto');
const { MASTER_ENCRYPTION_KEY } = require('../config/env');

const ALGORITHM = 'aes-256-cbc';
const KEY = Buffer.from(MASTER_ENCRYPTION_KEY, 'hex'); // 32 bytes

/**
 * encryptBuffer — Encrypts a file buffer with AES-256-CBC.
 *
 * Returns:
 *   { iv: string, encryptedData: Buffer }
 *
 * Each file gets a unique random IV. The master key is never stored
 * alongside the ciphertext — it lives only in the environment.
 */
const encryptBuffer = (buffer) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
    return {
        iv: iv.toString('hex'),
        encryptedData: encrypted,
    };
};

/**
 * decryptBuffer — Decrypts a ciphertext buffer.
 *
 * @param {Buffer|string} encryptedData  The encrypted bytes (or base64 string)
 * @param {string} ivHex                 The IV that was used during encryption (hex)
 * @returns {Buffer}                     Original plaintext bytes
 */
const decryptBuffer = (encryptedData, ivHex) => {
    const iv = Buffer.from(ivHex, 'hex');
    const dataBuffer = Buffer.isBuffer(encryptedData)
        ? encryptedData
        : Buffer.from(encryptedData, 'base64');
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    return Buffer.concat([decipher.update(dataBuffer), decipher.final()]);
};

module.exports = { encryptBuffer, decryptBuffer };
