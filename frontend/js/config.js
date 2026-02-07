// API Configuration
const API_CONFIG = {
    BASE_URL: 'https://gaming-review-service-hbxa.onrender.com',
    ENDPOINTS: {
        // auth endpoints
        REGISTER: '/api/auth/register',
        LOGIN: '/api/auth/login',
        PROFILE: '/api/auth/profile',
        LOGOUT: '/api/auth/logout',

        // user endpoints
        UPDATE_PROFILE: '/api/users/profile',

        // review endpoints
        REVIEWS: '/api/reviews',
        REVIEW_BY_ID: (id) => `/api/reviews/${id}`,

        // games API endpoints
        POPULAR_GAMES: '/api/games/popular',
        SEARCH_GAMES: '/api/games/search',
        UPCOMING_GAMES: '/api/games/upcoming',
        GAME_DETAILS: (id) => `/api/games/${id}`,
    }
};

// helper function to build full API URL
const getApiUrl = (endpoint) => {
    if (typeof endpoint === 'function') {
        return (id) => `${API_CONFIG.BASE_URL}${endpoint(id)}`;
    }
    return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS[endpoint]}`;
};

// token management
const TokenManager = {
    get: () => localStorage.getItem('authToken'),
    set: (token) => localStorage.setItem('authToken', token),
    remove: () => localStorage.removeItem('authToken'),
};