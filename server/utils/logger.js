const Log = require('../models/Log');

const logActivity = async (userId, action, details, req) => {
    try {
        const ip = req?.headers['x-forwarded-for'] || req?.connection?.remoteAddress;
        const device = req?.headers['user-agent'];

        await Log.create({
            user: userId,
            action,
            details,
            ip,
            device
        });
    } catch (error) {
        console.error('Logging failed:', error);
    }
};

module.exports = logActivity;
