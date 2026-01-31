// Authentication Functions

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
        const response = await fetch(getApiUrl('PROFILE'), {
            method: 'GET',
            credentials: 'include',
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

async function logoutUser() {
    try {
        const response = await fetch(getApiUrl('LOGOUT'), {
            method: 'POST',
            credentials: 'include',
        });

        const data = await response.json();
        return { success: response.ok, data };
    } catch (error) {
        console.error('Logout error:', error);
        return {
            success: false,
            data: { message: 'Network error. Please try again.' }
        };
    }
}