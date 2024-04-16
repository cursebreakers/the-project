// Database  Log Models - logModel.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const authLogSchema = new Schema({
    username: { type: String, required: true },
    ipAddress: { type: String, required: true },
    userAgent: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    type: { type: String, enum: ['login', 'signup'], required: true },
    success: { type: Boolean, default: false }
});

const AuthLog = mongoose.model('AuthLog', authLogSchema, 'logs');

module.exports = AuthLog;