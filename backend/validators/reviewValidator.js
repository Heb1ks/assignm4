const validateReview = (req, res, next) => {
    const { title, content, gameName, rating, platform, genre } = req.body;
    const errors = [];

    // title valid
    if (!title || title.trim().length === 0) {
        errors.push('review title is required');
    } else if (title.trim().length < 3) {
        errors.push('title must be at least 3 characters ');
    } else if (title.trim().length > 100) {
        errors.push('title cannot exceed 100 characters');
    }

    // content valid
    if (!content || content.trim().length === 0) {
        errors.push('review content is required');
    } else if (content.trim().length < 10) {
        errors.push('content must be at least 10 characters ');
    } else if (content.trim().length > 5000) {
        errors.push('content cannot exceed 5000 characters');
    }

    // game name valid
    if (!gameName || gameName.trim().length === 0) {
        errors.push('game name is required');
    } else if (gameName.trim().length > 100) {
        errors.push('game name cannot exceed 100 characters');
    }

    // rating valid
    if (rating === undefined || rating === null) {
        errors.push('rating is required');
    } else if (typeof rating !== 'number' || rating < 1 || rating > 10) {
        errors.push('rating must be a number between 1 and 10');
    }

    // platform valid (optional)
    if (platform !== undefined && platform.length > 50) {
        errors.push('platform cannot exceed 50 characters');
    }

    // genre valdi (optional)
    if (genre !== undefined && genre.length > 50) {
        errors.push('genre cannot exceed 50 characters');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors,
        });
    }

    next();
};

const validateReviewUpdate = (req, res, next) => {
    const { title, content, gameName, rating, platform, genre } = req.body;
    const errors = [];

    // oonly validate fields that are being updated
    if (title !== undefined) {
        if (title.trim().length < 3) {
            errors.push('title must be at least 3 characters');
        } else if (title.trim().length > 100) {
            errors.push('title cannot exceed 100 characters');
        }
    }

    if (content !== undefined) {
        if (content.trim().length < 10) {
            errors.push('content must be at least 10 characters');
        } else if (content.trim().length > 5000) {
            errors.push('content cannot exceed 5000 characters');
        }
    }

    if (gameName !== undefined && gameName.trim().length > 100) {
        errors.push('game name cannot exceed 100 characters');
    }

    if (rating !== undefined) {
        if (typeof rating !== 'number' || rating < 1 || rating > 10) {
            errors.push('rating must be a number between 1 and 10');
        }
    }

    if (platform !== undefined && platform.length > 50) {
        errors.push('platform cannot exceed 50 characters');
    }

    if (genre !== undefined && genre.length > 50) {
        errors.push('genre cannot exceed 50 characters');
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
    validateReview,
    validateReviewUpdate,
};