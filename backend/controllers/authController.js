const User = require('../models/User');
const jwt = require('jsonwebtoken');

// generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d', // token expires in 7 days
    });
};

// register new user
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'user with this email already exists',
            });
        }

        // create new user
        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password,
        });

        // create session
        req.session.userId = user._id;

        // generate JWT token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'user registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                bio: user.bio,
                favoriteGenre: user.favoriteGenre,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error('registration error:', error);

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'user with this email already exists',
            });
        }

        res.status(500).json({
            success: false,
            message: 'registration failed. Please try again.',
        });
    }
};

// login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'invalid email or password',
            });
        }

        // check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'invalid email or password',
            });
        }

        // create session
        req.session.userId = user._id;

        // generate JWT token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                bio: user.bio,
                favoriteGenre: user.favoriteGenre,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error('login error:', error);
        res.status(500).json({
            success: false,
            message: 'login failed. Please try again.',
        });
    }
};

// get user profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'user not found',
            });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                bio: user.bio,
                favoriteGenre: user.favoriteGenre,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });
    } catch (error) {
        console.error('profile error:', error);
        res.status(500).json({
            success: false,
            message: 'failed to fetch profile',
        });
    }
};

// update user profile
const updateProfile = async (req, res) => {
    try {
        const { name, bio, favoriteGenre } = req.body;
        const updateData = {};

        if (name !== undefined) updateData.name = name.trim();
        if (bio !== undefined) updateData.bio = bio.trim();
        if (favoriteGenre !== undefined) updateData.favoriteGenre = favoriteGenre.trim();

        const user = await User.findByIdAndUpdate(
            req.userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'user not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'profile updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                bio: user.bio,
                favoriteGenre: user.favoriteGenre,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });
    } catch (error) {
        console.error('update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'failed to update profile',
        });
    }
};

// logout user
const logout = async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error('logout error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'logout failed',
                });
            }

            res.status(200).json({
                success: true,
                message: 'logged out successfully',
            });
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'logout failed',
        });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    logout,
};