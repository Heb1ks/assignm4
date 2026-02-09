const express = require('express');
const router = express.Router();
const {
    createReview,
    getUserReviews,
    getAllReviews,
    getReviewById,
    updateReview,
    deleteReview,
} = require('../controllers/reviewController');
const { isAuthenticated } = require('../middleware/auth');
const { validateReview, validateReviewUpdate } = require('../validators/reviewValidator');

// All review routes are protected
router.post('/', isAuthenticated, validateReview, createReview);
router.get('/', isAuthenticated, getUserReviews); // My reviews only
router.get('/all', isAuthenticated, getAllReviews); // All reviews from everyone
router.get('/:id', isAuthenticated, getReviewById);
router.put('/:id', isAuthenticated, validateReviewUpdate, updateReview);
router.delete('/:id', isAuthenticated, deleteReview);

module.exports = router;