const express = require('express');
const router = express.Router();
const {
    getPopularGames,
    searchGames,
    getGameDetails,
    getUpcomingGames,
} = require('../controllers/gamesController');
const { isAuthenticated } = require('../middleware/auth');

router.get('/popular', isAuthenticated, getPopularGames);
router.get('/search', isAuthenticated, searchGames);
router.get('/upcoming', isAuthenticated, getUpcomingGames);
router.get('/:id', isAuthenticated, getGameDetails);

module.exports = router;