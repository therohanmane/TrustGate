'use strict';

const nodemailer = require('nodemailer');
const { EMAIL_USER, EMAIL_PASS, CLIENT_URL } = require('../config/env');

/** Single shared transporter — created once at startup */
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});

// ── Shared styles ─────────────────────────────────────────────────────────────
const styles = `
  body { font-family: 'Arial', sans-serif; background: #0a0a0a; color: #e0e0e0; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 40px auto; background: #111; border: 1px solid #1e1e1e; border-radius: 12px; overflow: hidden; }
  .header { background: linear-gradient(135deg, #00f3ff22, #bc13fe22); border-bottom: 1px solid #1e1e1e; padding: 32px; text-align: center; }
  .header h1 { margin: 0; font-size: 24px; background: linear-gradient(90deg, #00f3ff, #bc13fe); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .body { padding: 32px; }
  .body p { line-height: 1.7; color: #aaa; }
  .code { font-size: 36px; letter-spacing: 10px; font-weight: bold; color: #00f3ff; text-align: center; padding: 20px 0; }
  .btn { display: inline-block; background: linear-gradient(135deg, #00f3ff, #bc13fe); color: #000 !important; font-weight: bold; padding: 14px 32px; border-radius: 8px; text-decoration: none; margin: 16px 0; }
  .footer { padding: 24px 32px; border-top: 1px solid #1e1e1e; text-align: center; font-size: 12px; color: #555; }
  .asset-list { background: #0a0a0a; border-radius: 8px; padding: 16px; margin: 16px 0; }
  .asset-item { padding: 8px 0; border-bottom: 1px solid #1e1e1e; color: #ccc; font-size: 14px; }
  .asset-item:last-child { border-bottom: none; }
`;

const baseHtml = (title, bodyContent) => `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><style>${styles}</style></head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔐 TrustGate</h1>
      <p style="color:#666;margin:4px 0 0">${title}</p>
    </div>
    <div class="body">${bodyContent}</div>
    <div class="footer">
      © 2026 TrustGate — Controlled Digital Asset Release System<br>
      If you did not request this, please ignore this email.
    </div>
  </div>
</body>
</html>`;

// ── Email senders ─────────────────────────────────────────────────────────────

/**
 * sendPasswordReset — Sends a styled password-reset link.
 */
const sendPasswordReset = async (email, resetToken) => {
    const url = `${CLIENT_URL}/reset-password/${resetToken}`;
    const html = baseHtml('Password Reset Request', `
      <p>You requested a password reset for your TrustGate account.</p>
      <p>Click the button below to set a new password. This link expires in <strong>10 minutes</strong>.</p>
      <div style="text-align:center">
        <a href="${url}" class="btn">Reset Password</a>
      </div>
      <p>Or copy this link: <a href="${url}" style="color:#00f3ff;word-break:break-all">${url}</a></p>
    `);
    await transporter.sendMail({
        from: `"TrustGate Security" <${EMAIL_USER}>`,
        to: email,
        subject: '🔐 TrustGate — Password Reset Request',
        html,
    });
};

/**
 * sendOtp — Sends a 6-digit OTP verification code.
 */
const sendOtp = async (email, otp) => {
    const html = baseHtml('Email Verification', `
      <p>Your TrustGate verification code is:</p>
      <div class="code">${otp}</div>
      <p style="text-align:center;font-size:13px">This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
    `);
    await transporter.sendMail({
        from: `"TrustGate Security" <${EMAIL_USER}>`,
        to: email,
        subject: '🔐 TrustGate — Your Verification Code',
        html,
    });
};

/**
 * sendGracePeriodWarning — Alert sent to the account owner when inactivity is detected.
 * Gives them a chance to check in before the release fires.
 */
const sendGracePeriodWarning = async (user) => {
    const pingUrl = `${CLIENT_URL}/dashboard`;
    const html = baseHtml('Inactivity Warning', `
      <p>Hi <strong>${user.name}</strong>,</p>
      <p>We noticed you haven't logged into TrustGate in a while. Your account is configured to release your assets if you remain inactive.</p>
      <p>If you are safe and active, please log in immediately to reset your inactivity timer:</p>
      <div style="text-align:center">
        <a href="${pingUrl}" class="btn">I Am Active</a>
      </div>
      <p>If no activity is detected within <strong>${user.settings.gracePeriodDuration} hours</strong>, your assets will be released to your trusted contacts.</p>
    `);
    await transporter.sendMail({
        from: `"TrustGate System" <${EMAIL_USER}>`,
        to: user.email,
        subject: '⚠️ TrustGate — Inactivity Warning: Action Required',
        html,
    });
};

/**
 * sendReleaseNotification — Sent to each trusted contact when assets are released.
 * Lists all assets assigned to them with access level context.
 */
const sendReleaseNotification = async (contact, assets, vaultOwner) => {
    const assetItems = assets.map(a =>
        `<div class="asset-item">📄 <strong>${a.name}</strong> — ${a.category} (${a.size || 'unknown size'})</div>`
    ).join('');

    const html = baseHtml('Digital Asset Release', `
      <p>Hi <strong>${contact.name}</strong>,</p>
      <p>You have been designated as a trusted contact by <strong>${vaultOwner.name}</strong> on TrustGate.</p>
      <p>Due to a period of inactivity, the following digital assets have been released to you:</p>
      <div class="asset-list">
        ${assetItems || '<p style="color:#555">No assets were assigned specifically to you.</p>'}
      </div>
      <p>Your access level: <strong style="color:#00f3ff">${contact.accessLevel.toUpperCase()}</strong></p>
      <p>Please contact the TrustGate account holder's family or legal representative to arrange access.</p>
      <p style="color:#555;font-size:13px">This message was sent automatically by the TrustGate Dead Man's Switch system.</p>
    `);
    await transporter.sendMail({
        from: `"TrustGate Vault" <${EMAIL_USER}>`,
        to: contact.email,
        subject: `🔐 TrustGate — Digital Assets Released by ${vaultOwner.name}`,
        html,
    });
};

module.exports = {
    sendPasswordReset,
    sendOtp,
    sendGracePeriodWarning,
    sendReleaseNotification,
};
