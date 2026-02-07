const User = require('../models/User');


const isValidEmail = (email) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
};


// работает - НЕ ТРОГАтьь
// @route   POST /api/auth/register
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const errors = [];

        // Validate required fields
        if (!name || name.trim() === '') {
            errors.push('Name is required');
        }

        if (!email || email.trim() === '') {
            errors.push('Email is required');
        } else if (!isValidEmail(email)) {
            errors.push('Please provide a valid email address');
        }

        if (!password || password === '') {
            errors.push('Password is required');
        } else if (password.length < 6) {
            errors.push('Password must be at least 6 characters long');
        }

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors,
            });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered. Please use a different email.',
            });
        }

        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password,
        });

        req.session.userId = user._id;

        res.status(201).json({
            success: true,
            message: 'User registered successfully.',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error('Registration error:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: messages,
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.',
        });
    }
};

// @route   POST /api/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const errors = [];

        if (!email || email.trim() === '') {
            errors.push('Email is required');
        } else if (!isValidEmail(email)) {
            errors.push('Please provide a valid email address');
        }

        if (!password || password === '') {
            errors.push('Password is required');
        }

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors,
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.',
            });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.',
            });
        }

        req.session.userId = user._id;

        res.status(200).json({
            success: true,
            message: 'Login successful.',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.',
        });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.',
            });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.',
        });
    }
};

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({
                success: false,
                message: 'Error logging out. Please try again.',
            });
        }

        res.clearCookie('connect.sid');
        res.status(200).json({
            success: true,
            message: 'Logout successful.',
        });
    });
};

module.exports = {
    register,
    login,
    getProfile,
    logout,
};