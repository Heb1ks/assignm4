const express = require('express');
const router = express.Router();
const { register, login, getProfile, logout } = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);

router.get('/profile', isAuthenticated, getProfile);
router.post('/logout', isAuthenticated, logout);

module.exports = router;