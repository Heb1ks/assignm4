// API Configuration
const API_CONFIG = {
    BASE_URL: 'http://localhost:5000',
    ENDPOINTS: {
        // Auth endpoints
        REGISTER: '/api/auth/register',
        LOGIN: '/api/auth/login',
        PROFILE: '/api/auth/profile',
        LOGOUT: '/api/auth/logout',

        // User endpoints
        UPDATE_PROFILE: '/api/users/profile',

        // Review endpoints
        REVIEWS: '/api/reviews',
        ALL_REVIEWS: '/api/reviews/all',
        REVIEW_BY_ID: (id) => `/api/reviews/${id}`,

        // Games API endpoints
        POPULAR_GAMES: '/api/games/popular',
        SEARCH_GAMES: '/api/games/search',
        UPCOMING_GAMES: '/api/games/upcoming',
        GAME_DETAILS: (id) => `/api/games/${id}`,
    }
};

// Helper function to build full API URL
const getApiUrl = (endpoint) => {
    if (typeof endpoint === 'function') {
        return (id) => `${API_CONFIG.BASE_URL}${endpoint(id)}`;
    }
    return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS[endpoint]}`;
};

// Token management
const TokenManager = {
    get: () => localStorage.getItem('authToken'),
    set: (token) => localStorage.setItem('authToken', token),
    remove: () => localStorage.removeItem('authToken'),
};