const express = require('express');
const router = express.Router();
const {
    register,
    login,
    getProfile,
    updateProfile,
    logout
} = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/auth');
const {
    validateRegister,
    validateLogin,
    validateProfileUpdate
} = require('../validators/authValidator');

// public routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

// protected routes
router.get('/profile', isAuthenticated, getProfile);
router.put('/profile', isAuthenticated, validateProfileUpdate, updateProfile);
router.post('/logout', isAuthenticated, logout);

module.exports = router;