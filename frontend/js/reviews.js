async function createReview(reviewData) {
    try {
        const response = await makeAuthRequest(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REVIEWS}`, {
            method: 'POST',
            body: JSON.stringify(reviewData),
        });

        const data = await response.json();
        return { success: response.ok, data };
    } catch (error) {
        console.error('create review error:', error);
        return {
            success: false,
            data: { message: 'network error. Please try again.' }
        };
    }
}

async function getUserReviews() {
    try {
        const response = await makeAuthRequest(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REVIEWS}`, {
            method: 'GET',
        });

        const data = await response.json();
        return { success: response.ok, data };
    } catch (error) {
        console.error('get reviews error:', error);
        return {
            success: false,
            data: { message: 'network error. Please try again.' }
        };
    }
}

async function getReviewById(id) {
    try {
        const response = await makeAuthRequest(`${API_CONFIG.BASE_URL}/api/reviews/${id}`, {
            method: 'GET',
        });

        const data = await response.json();
        return { success: response.ok, data };
    } catch (error) {
        console.error('get review error:', error);
        return {
            success: false,
            data: { message: 'network error. Please try again.' }
        };
    }
}

async function updateReview(id, reviewData) {
    try {
        const response = await makeAuthRequest(`${API_CONFIG.BASE_URL}/api/reviews/${id}`, {
            method: 'PUT',
            body: JSON.stringify(reviewData),
        });

        const data = await response.json();
        return { success: response.ok, data };
    } catch (error) {
        console.error('update review error:', error);
        return {
            success: false,
            data: { message: 'network error. Please try again.' }
        };
    }
}

async function deleteReview(id) {
    try {
        const response = await makeAuthRequest(`${API_CONFIG.BASE_URL}/api/reviews/${id}`, {
            method: 'DELETE',
        });

        const data = await response.json();
        return { success: response.ok, data };
    } catch (error) {
        console.error('delete review error:', error);
        return {
            success: false,
            data: { message: 'network error. Please try again.' }
        };
    }
}