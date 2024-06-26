// Router.js - Layer 2 Router Module (Primary)

const express = require('express');
const router = express.Router();

const authControl = require('../controllers/auth')
const dashControl = require('../controllers/dash')
const pageControl = require('../controllers/pages')
const avatarControl = require('../controllers/avatar')

/* Redirect GET at main index. */
router.get('/', function(req, res, next) {
  console.log('User must authenticate before rendering dashboard.')
  res.redirect('/dashboard');
});

// GET Dashboard.
router.get('/dashboard', authControl.get_dashboard)

// GET update form
router.get('/status', dashControl.new_status)

// Route to POST updates in dashboard (Profile, status, account info, etc)
router.post('/status', dashControl.post_status)

// Route to GET login form
router.get('/auth', authControl.auth_user);

// Route to POST authentication
router.post('/auth', authControl.auth_check);

// Route to GET sign-up form
router.get('/auth/new', authControl.auth_new);

// Route to POST user sign-up
router.post('/auth/new', authControl.post_new);

// Route to POST user logout
router.get('/auth/out', authControl.user_out);

// Route to GET avatar generator
router.get('/avatar', avatarControl.gen_avatar);

// Route to POST new avatar
router.post('/avatar', avatarControl.post_avatar)

// Route to GET specific document
router.get('/docs/:page', pageControl.get_docs);

// Route to GET docs index
router.get('/docs', pageControl.get_docs);

// Route to GET T&C's
router.get('/terms', pageControl.get_terms);

// Route to GET user profile
// Keep this at the bottom or else the above routes will break!
router.get('/:username', dashControl.show_profile)


module.exports = router;
