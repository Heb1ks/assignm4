// helper function to make authenticated requests
async function makeAuthRequest(url, options = {}) {
    const token = TokenManager.get();

    const defaultOptions = {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    };

    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };

    return fetch(url, mergedOptions);
}

async function registerUser(name, email, password) {
    try {
        const response = await fetch(getApiUrl('REGISTER'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (response.ok && data.token) {
            TokenManager.set(data.token);
        }

        return { success: response.ok, data };
    } catch (error) {
        console.error('Registration error:', error);
        return {
            success: false,
            data: { message: 'Network error. Please try again.' }
        };
    }
}

async function loginUser(email, password) {
    try {
        const response = await fetch(getApiUrl('LOGIN'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok && data.token) {
            TokenManager.set(data.token);
        }

        return { success: response.ok, data };
    } catch (error) {
        console.error('Login error:', error);
        return {
            success: false,
            data: { message: 'Network error. Please try again.' }
        };
    }
}

async function getUserProfile() {
    try {
        const response = await makeAuthRequest(getApiUrl('PROFILE'), {
            method: 'GET',
        });

        const data = await response.json();
        return { success: response.ok, data };
    } catch (error) {
        console.error('Profile error:', error);
        return {
            success: false,
            data: { message: 'Network error. Please try again.' }
        };
    }
}

async function updateUserProfile(profileData) {
    try {
        const response = await makeAuthRequest(getApiUrl('UPDATE_PROFILE'), {
            method: 'PUT',
            body: JSON.stringify(profileData),
        });

        const data = await response.json();
        return { success: response.ok, data };
    } catch (error) {
        console.error('Update profile error:', error);
        return {
            success: false,
            data: { message: 'Network error. Please try again.' }
        };
    }
}

async function logoutUser() {
    try {
        const response = await makeAuthRequest(getApiUrl('LOGOUT'), {
            method: 'POST',
        });

        const data = await response.json();

        if (response.ok) {
            TokenManager.remove();
        }

        return { success: response.ok, data };
    } catch (error) {
        console.error('Logout error:', error);
        TokenManager.remove();
        return {
            success: false,
            data: { message: 'Network error. Please try again.' }
        };
    }
}