async function getPopularGames(page = 1, pageSize = 10) {
    try {
        const response = await makeAuthRequest(
            `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.POPULAR_GAMES}?page=${page}&page_size=${pageSize}`,
            { method: 'GET' }
        );

        const data = await response.json();
        return { success: response.ok, data };
    } catch (error) {
        console.error('Get popular games error:', error);
        return {
            success: false,
            data: { message: 'Network error. Please try again.' }
        };
    }
}

async function searchGames(query, page = 1, pageSize = 10) {
    try {
        const response = await makeAuthRequest(
            `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SEARCH_GAMES}?query=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}`,
            { method: 'GET' }
        );

        const data = await response.json();
        return { success: response.ok, data };
    } catch (error) {
        console.error('search games error:', error);
        return {
            success: false,
            data: { message: 'network error. Please try again.' }
        };
    }
}

async function getUpcomingGames(page = 1, pageSize = 10) {
    try {
        const response = await makeAuthRequest(
            `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.UPCOMING_GAMES}?page=${page}&page_size=${pageSize}`,
            { method: 'GET' }
        );

        const data = await response.json();
        return { success: response.ok, data };
    } catch (error) {
        console.error('get upcoming games error:', error);
        return {
            success: false,
            data: { message: 'network error. Please try again.' }
        };
    }
}

async function getGameDetails(id) {
    try {
        const response = await makeAuthRequest(
            `${API_CONFIG.BASE_URL}/api/games/${id}`,
            { method: 'GET' }
        );

        const data = await response.json();
        return { success: response.ok, data };
    } catch (error) {
        console.error('get game details error:', error);
        return {
            success: false,
            data: { message: 'network error. Please try again.' }
        };
    }
}