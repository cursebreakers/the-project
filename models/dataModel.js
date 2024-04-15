// dataModel.js - Data model

const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    username: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
    },
    archive: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Define a virtual property for the user's profile URL
dataSchema.virtual('profileUrl').get(function() {
    return '/' + this.username;
});

// Create the Data model based on the data schema
const Data = mongoose.model('Data', dataSchema, 'userdata');

module.exports = Data;