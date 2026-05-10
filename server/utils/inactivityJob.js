'use strict';

const cron = require('node-cron');
const User = require('../models/User');
const Asset = require('../models/Asset');
const Contact = require('../models/Contact');
const { sendGracePeriodWarning, sendReleaseNotification } = require('./mailer');
const logActivity = require('./logger');

/**
 * runInactivityCheck — Core logic, run on schedule.
 *
 * Flow:
 *  1. Find all active users whose lastActive + inactivityPeriod is in the past.
 *  2a. If gracePeriod is enabled and we haven't sent a warning yet → send warning, mark gracePeriodWarned.
 *  2b. If gracePeriod is disabled OR warning was sent and grace window also expired → TRIGGER RELEASE.
 *  3. Release: update user status, update assets, email every trusted contact.
 */
const runInactivityCheck = async () => {
    console.log('[InactivityJob] Running check at', new Date().toISOString());

    try {
        const now = new Date();

        // All non-triggered, active users
        const users = await User.find({
            status: 'active',
            releaseTriggered: { $ne: true },
        });

        for (const user of users) {
            const inactivityMs = (user.settings.inactivityPeriod || 90) * 24 * 60 * 60 * 1000;
            const lastActiveAt = new Date(user.lastActive);
            const inactiveDeadline = new Date(lastActiveAt.getTime() + inactivityMs);

            if (now < inactiveDeadline) continue; // Still within active window

            // ── Grace period handling ────────────────────────────────────────
            if (user.settings.gracePeriod && !user.gracePeriodWarned) {
                // Send first warning
                try {
                    await sendGracePeriodWarning(user);
                } catch (mailErr) {
                    console.error('[InactivityJob] Grace-period email failed for', user.email, mailErr.message);
                }

                user.gracePeriodWarned = true;
                user.gracePeriodWarnedAt = new Date();
                await user.save({ validateBeforeSave: false });

                await logActivity(
                    user._id,
                    'GRACE_PERIOD_WARNING',
                    `Inactivity detected. Grace period warning sent to ${user.email}.`,
                    null
                );
                continue; // Check again next run
            }

            if (user.settings.gracePeriod && user.gracePeriodWarned) {
                const graceDurationMs = (user.settings.gracePeriodDuration || 48) * 60 * 60 * 1000;
                const graceExpires = new Date(user.gracePeriodWarnedAt.getTime() + graceDurationMs);
                if (now < graceExpires) continue; // Still in grace window
            }

            // ── TRIGGER RELEASE ─────────────────────────────────────────────
            console.log('[InactivityJob] 🚨 Triggering release for user:', user.email);

            user.status = 'inactive';
            user.releaseTriggered = true;
            user.releaseTriggeredAt = new Date();
            await user.save({ validateBeforeSave: false });

            // Update all assets
            await Asset.updateMany(
                { user: user._id, status: 'secure' },
                { $set: { status: 'released' } }
            );

            // Fetch contacts and assigned assets
            const contacts = await Contact.find({ user: user._id });
            const assets = await Asset.find({ user: user._id });

            // Email each contact
            for (const contact of contacts) {
                // Assets assigned to this contact (or all assets for full access)
                const assignedAssets = contact.accessLevel === 'full'
                    ? assets
                    : assets.filter(a =>
                        a.assignedContacts && a.assignedContacts.some(
                            (id) => id.toString() === contact._id.toString()
                        )
                    );

                try {
                    await sendReleaseNotification(contact, assignedAssets, user);
                    contact.notifiedAt = new Date();
                    await contact.save({ validateBeforeSave: false });
                } catch (mailErr) {
                    console.error('[InactivityJob] Release email failed for', contact.email, mailErr.message);
                }
            }

            await logActivity(
                user._id,
                'RELEASE_TRIGGERED',
                `Dead Man\'s Switch activated. ${contacts.length} contact(s) notified. ${assets.length} asset(s) released.`,
                null
            );
        }

        console.log('[InactivityJob] Check complete.');
    } catch (err) {
        console.error('[InactivityJob] Fatal error:', err);
    }
};

/**
 * startInactivityJob — Schedules the cron job.
 * Runs every hour at minute 0.
 * Override with INACTIVITY_CRON env var (standard cron syntax).
 */
const startInactivityJob = () => {
    const schedule = process.env.INACTIVITY_CRON || '0 * * * *';
    cron.schedule(schedule, runInactivityCheck);
    console.log(`[InactivityJob] Scheduled: "${schedule}"`);
};

module.exports = { startInactivityJob, runInactivityCheck };
