// Dashboard controller module - dash.js

const passport = require('passport');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
const expressAsyncHandler = require("express-async-handler");
const { body, validationResult } = require('express-validator');
const requestIp = require('request-ip');
const geoip = require('geoip-lite');

const mongoose = require('mongoose');

const User = require('../models/userModel')
const AuthLog = require('../models/logModel');
const Data = require('../models/dataModel')


const statusValidator = [
    body('newStatus')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Status must be between 1 and 100 characters.')
        .custom((value, { req }) => {
            // Check if the status contains any forbidden strings

            let forbiddenStrings = [`""`, `''`,];

            const containsForbidden = forbiddenStrings.some(str => value.includes(str));
            if (containsForbidden) {
                throw new Error('Status contains prohibited content.');
            }
            return true;
        })
        .escape(), // Escape HTML characters
];

// GET User profile
exports.show_profile = async (req, res, next) => {

    console.log(req.params);

    try {
        const { username } = req.params;
        const user = await User.findOne({ username });

        if (!user) {
            console.error('User not found');
            return res.render('no_url', { message: `"${username}" does not appear to be on the cursebreaker network.`, username });
        }

        // Find the associated data for the user
        const userData = await Data.findOne({ user: user._id });

        if (!userData) {
            console.error('User data not found');
            return res.status(404).json({ message: 'User data not found' });
        }

        // Render the profile page with the user data
        console.log('User Profile:', userData)

        res.render('profile', { title: 'Profile', userData });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).render('error', { title: 'Server Error' });
    }
}; 


// GET status update page
exports.new_status = expressAsyncHandler(async (req, res, next) => {
    if (!req.user) {
      console.log('User not authenticated. Redirecting...')
      return res.redirect('/dashboard');
    }

    res.render('new_status', { title: 'New Status' });
});

// POST new status
exports.post_status = [
    statusValidator,
    expressAsyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        if (!req.user) {
            console.log('User not authenticated. Redirecting...')
            return res.redirect('/dashboard');
          }

        if (!errors.isEmpty()) {
            // Handle validation errors
            return res.status(400).json({ errors: errors.array() });
        }

        const { newStatus } = req.body;

        try {
            // Get the user ID from the authenticated user (assuming you have authentication middleware)
            const userId = req.user._id;

            // Find the user's data
            const userData = await Data.findOne({ user: userId });

            if (!userData) {
                console.error('User data not found');
                return res.status(404).json({ message: 'User data not found' });
            }

            // Move the current status to history if it exists
            if (userData.status) {
                userData.archive.push(userData.status);
            }

            // Update the status with the new one
            userData.status = newStatus;

            // Save the updated data
            await userData.save();

            // Redirect to the dashboard or any other page
            res.redirect('/dashboard'); // Change '/dashboard' to your actual dashboard URL
        } catch (error) {
            console.error('Error updating status:', error);
            next(error);
        }
    }),
];


module.exports = {
    new_status: exports.new_status,
    post_status: exports.post_status,
    show_profile: exports.show_profile
};