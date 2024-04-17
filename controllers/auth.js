// Authentication controller - Auth.js

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



// Passport Local Strategy for username/password authentication
passport.use(new LocalStrategy(
    async function(username, password, done) {
        try {
            const user = await User.findOne({ username });
            if (!user) {
                return done(null, false, { message: 'Incorrect username' });
            }

            const isMatch = await user.verifyPassword(password);
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect password' });
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id); // Serialize user ID to the session
});

passport.deserializeUser(async function(id, done) {
    try {
        const user = await User.findById(id);
        done(null, user); // Deserialize user based on user ID
    } catch (error) {
        done(error);
    }
});

// Validation middleware for signup route
exports.validateSignup = [
    body('username').trim().isLength({ min: 1, max: 30 }).matches(/^[a-zA-Z0-9_-]+$/).escape(),
    body('email').trim().isEmail().normalizeEmail(),
    body('password').trim().isLength({ min: 8 }).escape(),
    body('confirmPassword').trim().escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Handle validation errors
            return res.render('signup', { title: 'Sign-up', errorMessage: errors.array() });
        }
        // Proceed to the next middleware if validation passes
        next();
    }
];

// GET log-in form
exports.auth_user = expressAsyncHandler(async (req, res, next) => {

  if (req.user) {
    console.log('User is authenticated. Redirecting to dashboard...')
    return res.redirect('/dashboard');
  }
  
  console.log('Requesting credentials from user...')
  res.render('auth', { title: 'Authentication' });
});

// POST credentials for log in checks
exports.auth_check = [
    body('username').trim().isLength({ min: 1, max: 30 }).matches(/^[a-zA-Z0-9_-]+$/).escape(),
    body('password').trim().escape(),

    async function(req, res, next) {
        passport.authenticate('local', async function(err, user, info) {
            if (err) { return next(err); }
            if (!user) {
                req.flash('error', 'Invalid username or password.');
                res.render('auth', { title: 'Authentication', errorMessage: req.flash('error') });

                const authLogFailed = new AuthLog({
                    username: req.body.username || '', // Adjust this based on how you handle username input
                    ipAddress: req.ip,
                    userAgent: req.headers['user-agent'],
                    timestamp: new Date(),
                    type: 'login',
                    success: false
                });
                try {
                    await authLogFailed.save();
                } catch (error) {
                    console.error('Error saving failed authentication log:', error);
                }
                return;
            }
            req.logIn(user, async function(err) {
                if (err) { return next(err); }
                try {
                    // Log authentication success here
                    const authLogSuccess = new AuthLog({
                        username: req.user.username,
                        ipAddress: req.ip,
                        userAgent: req.headers['user-agent'],
                        timestamp: new Date(),
                        type: 'login',
                        success: true
                    });
                    await authLogSuccess.save();
                    console.log('Authentication successful. User logged in.');
                    return res.redirect('/dashboard');
                } catch (error) {
                    console.error('Error saving successful authentication log:', error);
                    return next(error);
                }
            });
        })(req, res, next);
    }
];


// GET sign-up form (New User)
exports.auth_new = expressAsyncHandler(async (req, res, next) => {
  console.log('Fetching user sign up form...')  

  try {

    if (req.user) {
        console.log('User is authenticated. Redirecting to dashboard...')
        return res.redirect('/dashboard');
    }
    // Retrieve existing usernames and emails
    const membership = await User.find({}, 'username email');

    // Extract usernames and emails from existing users
    const userCheck = membership.map(user => user.username);
    const addressCheck = membership.map(user => user.email);

    console.log('Existing users:', membership);

    res.render('signup', { 
      title: 'Sign-up',
      errorMessage: {},
      userCheck,
      addressCheck
    });
  } catch (error) {
    next(error);
  }
});

// POST authentication checks, validation for user signups
exports.post_new = [
    // Apply validation middleware
    exports.validateSignup,
    async function(req, res, next) {
        const { username, email, password, confirmPassword } = req.body;
        const errorMessage = {};

        // Check for duplicate email
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            errorMessage.email = 'Email already exists';
        }

        // Check for duplicate username
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            errorMessage.username = 'Username already exists';
        }

        // Password validation
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
        if (!passwordRegex.test(password)) {
            errorMessage.password = 'Passwords must be at least 8 characters and contain at least one uppercase, one lowercase letter, one number, and one special character';
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            errorMessage.confirmPassword = 'Passwords do not match';
        }

        if (Object.keys(errorMessage).length > 0) {
            const authLogSignupFailed = new AuthLog({
                username,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                timestamp: new Date(),
                success: false,
                type: 'signup'
            });

            await authLogSignupFailed.save();

            // Render the form with error messages
            return res.render('signup', { title: 'Sign-up', errorMessage, username, email, password });
        }

        try {
            // Hash password before storing it in the database
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new user
            const newUser = new User({
                username,
                email,
                password: hashedPassword
            });

            // Save user to the database
            await newUser.save();

            // Log in the new user
            req.logIn(newUser, async function(err) {
                if (err) { return next(err); }

                // Create user starter data
                const newUserData = new Data({
                    user: newUser._id, 
                    status: "Hello World!",
                    username, 
                });

                await newUserData.save();

                const authLogSignupSuccess = new AuthLog({
                    username,
                    ipAddress: req.ip,
                    userAgent: req.headers['user-agent'],
                    timestamp: new Date(),
                    success: true,
                    type: 'signup'
                });

                await authLogSignupSuccess.save();

                // Redirect to dashboard upon successful signup
                return res.redirect('/dashboard');
            });
        } catch (error) {
            // Handle database error
            console.error('Error saving user:', error);
            return next(error);
        }
    }
];

// GET Dashboard if user is authenticated
exports.get_dashboard = expressAsyncHandler(async (req, res, next) => {
    try {
        // Check if user is authenticated
        if (!req.user) {
            // User is not authenticated, redirect to login page
            console.log('User not authenticated. Redirecting to login...');
            return res.redirect('/auth');
        }

        // Fetch user data with the associated data (if using population in Mongoose)
        const userId = req.user._id; // Assuming user ID is available in the request object
        const user = await User.findById(userId);

        const userData = await Data.findOne({ user: userId });
        console.log('Gathering your session data...', userData)

        if (!userData) {
            console.error('User data not found');
            return res.status(404).json({ message: 'User data not found' });
        }
        
        // Get IP and agent of the user
        const userIP = requestIp.getClientIp(req);
        const userAgent = req.headers['user-agent'];

        // Assuming location based on IP (replace with actual logic)
        const geo = geoip.lookup(userIP);
        const userLoc = geo ? `${geo.city}, ${geo.region}, ${geo.country}` : 'Unknown Location';

        // Assuming local time (replace with actual logic)
        const userTime = new Date().toLocaleTimeString('en-US');

        // Username from user data
        const userName = userData.username;

        const userStatus = userData.status;

        // Render the dashboard with user data
        console.log('User authenticated. Rendering dashboard...');
        res.render('dashboard', { title: 'Dashboard', avatar: userData.avatar, userIP, userAgent, userLoc, userTime, userName, userStatus });
    } catch (error) {
        console.error('Error rendering dashboard:', error);
        next(error);
    }
});


// GET user logout
exports.user_out = (req, res, next) => {
    // Call the logout function with a callback
    req.logout(function(err) {
        if (err) {
            console.error('Error logging out:', err);
            return next(err); // Assuming next is defined in the middleware chain
        }
        console.log('User logged out successfully.');
        res.redirect('/'); // Redirect to home page after logout
    });
};


module.exports = {
    auth_user: exports.auth_user,
    auth_new: exports.auth_new,
    auth_check: exports.auth_check,
    post_new: exports.post_new,
    get_dashboard: exports.get_dashboard,
    user_out: exports.user_out
};