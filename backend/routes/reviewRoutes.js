const express = require('express');
const router = express.Router();
const {
    createReview,
    getUserReviews,
    getReviewById,
    updateReview,
    deleteReview,
} = require('../controllers/reviewController');
const { isAuthenticated } = require('../middleware/auth');
const { validateReview, validateReviewUpdate } = require('../validators/reviewValidator');

router.post('/', isAuthenticated, validateReview, createReview);
router.get('/', isAuthenticated, getUserReviews);
router.get('/:id', isAuthenticated, getReviewById);
router.put('/:id', isAuthenticated, validateReviewUpdate, updateReview);
router.delete('/:id', isAuthenticated, deleteReview);

module.exports = router;