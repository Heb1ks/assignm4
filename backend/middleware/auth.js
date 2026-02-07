const jwt = require('jsonwebtoken');
const User = require('../models/User');

const isAuthenticated = async (req, res, next) => {
    try {
        // check for session-based auth  //backward compatibility
        if (req.session && req.session.userId) {
            req.userId = req.session.userId;
            return next();
        }

        // check for JWT token in authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'unauthorized. Please login to access this resource.',
            });
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decoded.userId;

            // verify user still exists
            const user = await User.findById(req.userId);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'user not found',
                });
            }

            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'invalid or expired token',
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'authentication error',
        });
    }
};

module.exports = { isAuthenticated };