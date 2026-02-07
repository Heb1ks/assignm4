function showSection(section) {
    document.querySelectorAll('.form-section').forEach(s => s.classList.remove('active'));
    document.getElementById(`${section}-section`).classList.add('active');
    hideMessage();
}

function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';

    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            hideMessage();
        }, 5000);
    }
}

function hideMessage() {
    const messageDiv = document.getElementById('message');
    messageDiv.style.display = 'none';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Register Form Handler
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;

    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating account...';

    const result = await registerUser(name, email, password);

    submitBtn.disabled = false;
    submitBtn.textContent = 'Register';

    if (result.success) {
        showMessage(result.data.message, 'success');
        document.getElementById('register-form').reset();
        setTimeout(() => {
            loadProfile();
            showSection('profile');
        }, 1500);
    } else {
        // Показываем все ошибки валидации с сервера
        const errorMessage = result.data.errors
            ? result.data.errors.join(', ')
            : result.data.message || 'Registration failed';
        showMessage(errorMessage, 'error');
    }
});

// Login Form Handler
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in...';

    const result = await loginUser(email, password);

    submitBtn.disabled = false;
    submitBtn.textContent = 'Login';

    if (result.success) {
        showMessage(result.data.message, 'success');
        document.getElementById('login-form').reset();
        setTimeout(() => {
            loadProfile();
            showSection('profile');
        }, 1500);
    } else {
        showMessage(result.data.message || 'Login failed', 'error');
    }
});

// Load Profile Function
async function loadProfile() {
    const profileInfo = document.getElementById('profile-info');
    profileInfo.innerHTML = '<div class="profile-loader">Loading profile...</div>';

    const result = await getUserProfile();

    if (result.success) {
        const user = result.data.user;
        profileInfo.innerHTML = `
            <div class="profile-item">
                <span class="profile-label">Name:</span>
                <span class="profile-value">${user.name}</span>
            </div>
            <div class="profile-item">
                <span class="profile-label">Email:</span>
                <span class="profile-value">${user.email}</span>
            </div>
            <div class="profile-item">
                <span class="profile-label">User ID:</span>
                <span class="profile-value">${user.id}</span>
            </div>
            <div class="profile-item">
                <span class="profile-label">Member Since:</span>
                <span class="profile-value">${formatDate(user.createdAt)}</span>
            </div>
        `;
    } else {
        profileInfo.innerHTML = `
            <div style="text-align: center; color: var(--danger-color);">
                ${result.data.message || 'Unable to load profile'}
            </div>
        `;
        setTimeout(() => {
            showSection('login');
        }, 2000);
    }
}

// Logout Function
async function logout() {
    const logoutBtn = document.querySelector('.btn-danger');
    logoutBtn.disabled = true;
    logoutBtn.textContent = 'Logging out...';

    const result = await logoutUser();

    logoutBtn.disabled = false;
    logoutBtn.textContent = 'Logout';

    if (result.success) {
        showMessage(result.data.message, 'success');
        setTimeout(() => {
            showSection('login');
            document.getElementById('login-form').reset();
            document.getElementById('register-form').reset();
        }, 1500);
    } else {
        showMessage(result.data.message || 'Logout failed', 'error');
    }
}

// Check authentication status on page load
window.addEventListener('load', async () => {
    const result = await getUserProfile();

    if (result.success) {
        loadProfile();
        showSection('profile');
    } else {
        showSection('login');
    }
});