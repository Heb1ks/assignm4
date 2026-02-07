const validateRegister = (req, res, next) => {
    const { name, email, password } = req.body;
    const errors = [];

    // name valid
    if (!name || name.trim().length === 0) {
        errors.push('name is required');
    } else if (name.trim().length < 2) {
        errors.push('name must be at least 2 characters ');
    } else if (name.trim().length > 50) {
        errors.push('name cannot exceed 50 characters');
    }

    // email valid
    if (!email || email.trim().length === 0) {
        errors.push('email is required');
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        errors.push('provide valid email');
    }

    // pass valid
    if (!password || password.length === 0) {
        errors.push('password is required');
    } else if (password.length < 6) {
        errors.push('password must be at least 6 characters');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'validation failed',
            errors,
        });
    }

    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    const errors = [];

    if (!email || email.trim().length === 0) {
        errors.push('email is required');
    }

    if (!password || password.length === 0) {
        errors.push('password is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'validation failed',
            errors,
        });
    }

    next();
};

const validateProfileUpdate = (req, res, next) => {
    const { name, bio, favoriteGenre } = req.body;
    const errors = [];

    if (name !== undefined) {
        if (name.trim().length < 2) {
            errors.push('name must be at least 2 characters');
        } else if (name.trim().length > 50) {
            errors.push('name cannot exceed 50 characters');
        }
    }

    if (bio !== undefined && bio.length > 200) {
        errors.push('bio cannot exceed 200 characters');
    }

    if (favoriteGenre !== undefined && favoriteGenre.length > 50) {
        errors.push('favorite genre cannot exceed 50 characters');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'validation failed',
            errors,
        });
    }

    next();
};

module.exports = {
    validateRegister,
    validateLogin,
    validateProfileUpdate,
};