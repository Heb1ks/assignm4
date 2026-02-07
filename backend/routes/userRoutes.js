const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/auth');
const { validateProfileUpdate } = require('../validators/authValidator');


router.get('/profile', isAuthenticated, getProfile);
router.put('/profile', isAuthenticated, validateProfileUpdate, updateProfile);

module.exports = router;