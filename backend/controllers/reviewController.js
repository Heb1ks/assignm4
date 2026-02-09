const Review = require('../models/Review');

// Create new review
const createReview = async (req, res) => {
    try {
        const { title, content, gameName, rating, platform, genre } = req.body;

        const review = await Review.create({
            title: title.trim(),
            content: content.trim(),
            gameName: gameName.trim(),
            rating,
            platform: platform ? platform.trim() : '',
            genre: genre ? genre.trim() : '',
            author: req.userId,
        });

        const populatedReview = await Review.findById(review._id).populate(
            'author',
            'name email'
        );

        res.status(201).json({
            success: true,
            message: 'Review created successfully',
            review: populatedReview,
        });
    } catch (error) {
        console.error('Create review error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create review',
        });
    }
};

// Get all reviews for logged-in user (their own reviews)
const getUserReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ author: req.userId })
            .populate('author', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reviews.length,
            reviews,
        });
    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch reviews',
        });
    }
};

// Get all reviews from all users (public feed)
const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('author', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reviews.length,
            reviews,
            currentUserId: req.userId, // Send current user ID to frontend
        });
    } catch (error) {
        console.error('Get all reviews error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch reviews',
        });
    }
};

// Get single review by ID
const getReviewById = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id).populate(
            'author',
            'name email'
        );

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found',
            });
        }

        // Check if user is the author
        if (review.author._id.toString() !== req.userId) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to view this review',
            });
        }

        res.status(200).json({
            success: true,
            review,
        });
    } catch (error) {
        console.error('Get review error:', error);

        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'Invalid review ID',
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to fetch review',
        });
    }
};

// Update review
const updateReview = async (req, res) => {
    try {
        const { title, content, gameName, rating, platform, genre } = req.body;

        // Find review
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found',
            });
        }

        // Check if user is the author
        if (review.author.toString() !== req.userId) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to update this review',
            });
        }

        // Update fields
        const updateData = {};
        if (title !== undefined) updateData.title = title.trim();
        if (content !== undefined) updateData.content = content.trim();
        if (gameName !== undefined) updateData.gameName = gameName.trim();
        if (rating !== undefined) updateData.rating = rating;
        if (platform !== undefined) updateData.platform = platform.trim();
        if (genre !== undefined) updateData.genre = genre.trim();

        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('author', 'name email');

        res.status(200).json({
            success: true,
            message: 'Review updated successfully',
            review: updatedReview,
        });
    } catch (error) {
        console.error('Update review error:', error);

        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'Invalid review ID',
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to update review',
        });
    }
};

// Delete review
const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found',
            });
        }

        // Check if user is the author
        if (review.author.toString() !== req.userId) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to delete this review',
            });
        }

        await Review.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Review deleted successfully',
        });
    } catch (error) {
        console.error('Delete review error:', error);

        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'Invalid review ID',
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to delete review',
        });
    }
};

module.exports = {
    createReview,
    getUserReviews,
    getAllReviews,
    getReviewById,
    updateReview,
    deleteReview,
};