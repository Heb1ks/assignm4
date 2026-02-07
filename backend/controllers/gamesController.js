const axios = require('axios');

// RAWG API configuration
const RAWG_API_KEY = process.env.RAWG_API_KEY;
const RAWG_BASE_URL = 'https://api.rawg.io/api';

// get popular games
const getPopularGames = async (req, res) => {
    try {
        const { page = 1, page_size = 10 } = req.query;

        const response = await axios.get(`${RAWG_BASE_URL}/games`, {
            params: {
                key: RAWG_API_KEY,
                page,
                page_size,
                ordering: '-rating',
                dates: '2023-01-01,2026-12-31',
            },
        });

        res.status(200).json({
            success: true,
            count: response.data.count,
            games: response.data.results.map((game) => ({
                id: game.id,
                name: game.name,
                released: game.released,
                rating: game.rating,
                background_image: game.background_image,
                platforms: game.platforms?.map((p) => p.platform.name),
                genres: game.genres?.map((g) => g.name),
            })),
        });
    } catch (error) {
        console.error('get popular games error:', error.message);
        res.status(500).json({
            success: false,
            message: 'failed to fetch popular games',
        });
    }
};

// search games
const searchGames = async (req, res) => {
    try {
        const { query, page = 1, page_size = 10 } = req.query;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'search query is required',
            });
        }

        const response = await axios.get(`${RAWG_BASE_URL}/games`, {
            params: {
                key: RAWG_API_KEY,
                search: query,
                page,
                page_size,
            },
        });

        res.status(200).json({
            success: true,
            count: response.data.count,
            games: response.data.results.map((game) => ({
                id: game.id,
                name: game.name,
                released: game.released,
                rating: game.rating,
                background_image: game.background_image,
                platforms: game.platforms?.map((p) => p.platform.name),
                genres: game.genres?.map((g) => g.name),
            })),
        });
    } catch (error) {
        console.error('search games error:', error.message);
        res.status(500).json({
            success: false,
            message: 'failed to search games',
        });
    }
};

// Get game details
const getGameDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const response = await axios.get(`${RAWG_BASE_URL}/games/${id}`, {
            params: {
                key: RAWG_API_KEY,
            },
        });

        const game = response.data;

        res.status(200).json({
            success: true,
            game: {
                id: game.id,
                name: game.name,
                description: game.description_raw,
                released: game.released,
                rating: game.rating,
                background_image: game.background_image,
                platforms: game.platforms?.map((p) => p.platform.name),
                genres: game.genres?.map((g) => g.name),
                developers: game.developers?.map((d) => d.name),
                publishers: game.publishers?.map((p) => p.name),
                metacritic: game.metacritic,
                website: game.website,
            },
        });
    } catch (error) {
        console.error('get game details error:', error.message);

        if (error.response && error.response.status === 404) {
            return res.status(404).json({
                success: false,
                message: 'game not found',
            });
        }

        res.status(500).json({
            success: false,
            message: 'failed to fetch game details',
        });
    }
};

// Get upcoming games
const getUpcomingGames = async (req, res) => {
    try {
        const { page = 1, page_size = 10 } = req.query;
        const today = new Date().toISOString().split('T')[0];
        const nextYear = new Date();
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        const nextYearDate = nextYear.toISOString().split('T')[0];

        const response = await axios.get(`${RAWG_BASE_URL}/games`, {
            params: {
                key: RAWG_API_KEY,
                page,
                page_size,
                dates: `${today},${nextYearDate}`,
                ordering: 'released',
            },
        });

        res.status(200).json({
            success: true,
            count: response.data.count,
            games: response.data.results.map((game) => ({
                id: game.id,
                name: game.name,
                released: game.released,
                rating: game.rating,
                background_image: game.background_image,
                platforms: game.platforms?.map((p) => p.platform.name),
                genres: game.genres?.map((g) => g.name),
            })),
        });
    } catch (error) {
        console.error('get upcoming games error:', error.message);
        res.status(500).json({
            success: false,
            message: 'failed to fetch upcoming games',
        });
    }
};

module.exports = {
    getPopularGames,
    searchGames,
    getGameDetails,
    getUpcomingGames,
};