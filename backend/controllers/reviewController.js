const Review = require('../models/Review');

// create new review
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
            message: 'review created successfully',
            review: populatedReview,
        });
    } catch (error) {
        console.error('create review error:', error);
        res.status(500).json({
            success: false,
            message: 'failed to create review',
        });
    }
};

// get all reviews for logged-in user
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
        console.error('get reviews error:', error);
        res.status(500).json({
            success: false,
            message: 'failed to fetch reviews',
        });
    }
};

// get single review by ID
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

        // check if user is the author
        if (review.author._id.toString() !== req.userId) {
            return res.status(403).json({
                success: false,
                message: 'you donot have permission to view this review',
            });
        }

        res.status(200).json({
            success: true,
            review,
        });
    } catch (error) {
        console.error('get review error:', error);

        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'invalid review ID',
            });
        }

        res.status(500).json({
            success: false,
            message: 'failed to fetch review',
        });
    }
};

// update review
const updateReview = async (req, res) => {
    try {
        const { title, content, gameName, rating, platform, genre } = req.body;

        // find review
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found',
            });
        }

        // vheck if user is the author
        if (review.author.toString() !== req.userId) {
            return res.status(403).json({
                success: false,
                message: 'you do not have permission to update this review',
            });
        }

        // update fields
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
            message: 'review updated successfully',
            review: updatedReview,
        });
    } catch (error) {
        console.error('update review error:', error);

        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'invalid review ID',
            });
        }

        res.status(500).json({
            success: false,
            message: 'failed to update review',
        });
    }
};

// delete review
const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'review not found',
            });
        }

        // check if user is the author
        if (review.author.toString() !== req.userId) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to delete this review',
            });
        }

        await Review.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'review deleted successfully',
        });
    } catch (error) {
        console.error('delete review error:', error);

        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'Invalid review ID',
            });
        }

        res.status(500).json({
            success: false,
            message: 'failed to delete review',
        });
    }
};

module.exports = {
    createReview,
    getUserReviews,
    getReviewById,
    updateReview,
    deleteReview,
};