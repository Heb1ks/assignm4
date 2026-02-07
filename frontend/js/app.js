let currentSection = 'login';
let currentReviews = [];

function showSection(section) {
    document.querySelectorAll('.form-section').forEach(s => s.classList.remove('active'));
    const sectionElement = document.getElementById(`${section}-section`);
    if (sectionElement) {
        sectionElement.classList.add('active');
        currentSection = section;
        hideMessage();

        // load data when switching to certain sections
        if (section === 'profile') {
            loadProfile();
        } else if (section === 'reviews') {
            loadReviews();
        } else if (section === 'games') {
            loadPopularGames();
        }
    }
}

function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';

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

// registr form
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;

    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'creating account';

    const result = await registerUser(name, email, password);

    submitBtn.disabled = false;
    submitBtn.textContent = 'register';

    if (result.success) {
        showMessage(result.data.message, 'success');
        document.getElementById('register-form').reset();
        setTimeout(() => {
            showSection('profile');
        }, 1500);
    } else {
        const errorMessage = result.data.errors
            ? result.data.errors.join(', ')
            : result.data.message || 'registration failed';
        showMessage(errorMessage, 'error');
    }
});

// logn form
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in';

    const result = await loginUser(email, password);

    submitBtn.disabled = false;
    submitBtn.textContent = 'login';

    if (result.success) {
        showMessage(result.data.message, 'success');
        document.getElementById('login-form').reset();
        setTimeout(() => {
            showSection('profile');
        }, 1500);
    } else {
        showMessage(result.data.message || 'login failed', 'error');
    }
});

// profile func
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
        <span class="profile-label">Bio:</span>
        <span class="profile-value">${user.bio || 'Not set'}</span>
      </div>
      <div class="profile-item">
        <span class="profile-label">Favorite Genre:</span>
        <span class="profile-value">${user.favoriteGenre || 'Not set'}</span>
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

function showEditProfile() {
    showSection('edit-profile');
    getUserProfile().then(result => {
        if (result.success) {
            const user = result.data.user;
            document.getElementById('edit-name').value = user.name;
            document.getElementById('edit-bio').value = user.bio || '';
            document.getElementById('edit-genre').value = user.favoriteGenre || '';
        }
    });
}

document.getElementById('edit-profile-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('edit-name').value.trim();
    const bio = document.getElementById('edit-bio').value.trim();
    const favoriteGenre = document.getElementById('edit-genre').value.trim();

    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Updating...';

    const result = await updateUserProfile({ name, bio, favoriteGenre });

    submitBtn.disabled = false;
    submitBtn.textContent = 'Update Profile';

    if (result.success) {
        showMessage(result.data.message, 'success');
        setTimeout(() => {
            showSection('profile');
        }, 1500);
    } else {
        const errorMessage = result.data.errors
            ? result.data.errors.join(', ')
            : result.data.message || 'Update failed';
        showMessage(errorMessage, 'error');
    }
});

// logout
async function logout() {
    const logoutBtn = document.querySelector('.btn-danger');
    if (logoutBtn) {
        logoutBtn.disabled = true;
        logoutBtn.textContent = 'Logging out...';
    }

    const result = await logoutUser();

    if (logoutBtn) {
        logoutBtn.disabled = false;
        logoutBtn.textContent = 'Logout';
    }

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

// review function
async function loadReviews() {
    const reviewsList = document.getElementById('reviews-list');
    reviewsList.innerHTML = '<div class="loading">Loading reviews...</div>';

    const result = await getUserReviews();

    if (result.success) {
        currentReviews = result.data.reviews;

        if (currentReviews.length === 0) {
            reviewsList.innerHTML = '<div class="empty-state">No reviews yet. Create your first review!</div>';
        } else {
            reviewsList.innerHTML = currentReviews.map(review => `
        <div class="review-card">
          <div class="review-header">
            <h3>${review.title}</h3>
            <div class="review-rating">★ ${review.rating}/10</div>
          </div>
          <div class="review-game">${review.gameName}</div>
          ${review.platform ? `<div class="review-platform">Platform: ${review.platform}</div>` : ''}
          ${review.genre ? `<div class="review-genre">Genre: ${review.genre}</div>` : ''}
          <div class="review-content">${review.content}</div>
          <div class="review-footer">
            <span class="review-date">${formatDate(review.createdAt)}</span>
            <div class="review-actions">
              <button class="btn-small btn-edit" onclick="editReview('${review._id}')">Edit</button>
              <button class="btn-small btn-delete" onclick="confirmDeleteReview('${review._id}')">Delete</button>
            </div>
          </div>
        </div>
      `).join('');
        }
    } else {
        reviewsList.innerHTML = `<div class="error-state">${result.data.message || 'Failed to load reviews'}</div>`;
    }
}

function showCreateReview() {
    showSection('create-review');
    document.getElementById('create-review-form').reset();
}

document.getElementById('create-review-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const reviewData = {
        title: document.getElementById('review-title').value.trim(),
        content: document.getElementById('review-content').value.trim(),
        gameName: document.getElementById('review-game').value.trim(),
        rating: parseFloat(document.getElementById('review-rating').value),
        platform: document.getElementById('review-platform').value.trim(),
        genre: document.getElementById('review-genre').value.trim(),
    };

    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating...';

    const result = await createReview(reviewData);

    submitBtn.disabled = false;
    submitBtn.textContent = 'Create Review';

    if (result.success) {
        showMessage('Review created successfully!', 'success');
        setTimeout(() => {
            showSection('reviews');
        }, 1500);
    } else {
        const errorMessage = result.data.errors
            ? result.data.errors.join(', ')
            : result.data.message || 'Failed to create review';
        showMessage(errorMessage, 'error');
    }
});

function editReview(id) {
    const review = currentReviews.find(r => r._id === id);
    if (!review) return;

    showSection('edit-review');
    document.getElementById('edit-review-id').value = review._id;
    document.getElementById('edit-review-title').value = review.title;
    document.getElementById('edit-review-content').value = review.content;
    document.getElementById('edit-review-game').value = review.gameName;
    document.getElementById('edit-review-rating').value = review.rating;
    document.getElementById('edit-review-platform').value = review.platform || '';
    document.getElementById('edit-review-genre').value = review.genre || '';
}

document.getElementById('edit-review-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('edit-review-id').value;
    const reviewData = {
        title: document.getElementById('edit-review-title').value.trim(),
        content: document.getElementById('edit-review-content').value.trim(),
        gameName: document.getElementById('edit-review-game').value.trim(),
        rating: parseFloat(document.getElementById('edit-review-rating').value),
        platform: document.getElementById('edit-review-platform').value.trim(),
        genre: document.getElementById('edit-review-genre').value.trim(),
    };

    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Updating...';

    const result = await updateReview(id, reviewData);

    submitBtn.disabled = false;
    submitBtn.textContent = 'Update Review';

    if (result.success) {
        showMessage('Review updated successfully!', 'success');
        setTimeout(() => {
            showSection('reviews');
        }, 1500);
    } else {
        const errorMessage = result.data.errors
            ? result.data.errors.join(', ')
            : result.data.message || 'Failed to update review';
        showMessage(errorMessage, 'error');
    }
});

function confirmDeleteReview(id) {
    if (confirm('Are you sure you want to delete this review?')) {
        deleteReviewHandler(id);
    }
}

async function deleteReviewHandler(id) {
    const result = await deleteReview(id);

    if (result.success) {
        showMessage('Review deleted successfully!', 'success');
        loadReviews();
    } else {
        showMessage(result.data.message || 'Failed to delete review', 'error');
    }
}

// games func
async function loadPopularGames() {
    const gamesList = document.getElementById('games-list');
    gamesList.innerHTML = '<div class="loading">Loading popular games...</div>';

    const result = await getPopularGames();

    if (result.success) {
        displayGames(result.data.games);
    } else {
        gamesList.innerHTML = `<div class="error-state">${result.data.message || 'Failed to load games'}</div>`;
    }
}

async function searchGamesHandler() {
    const query = document.getElementById('game-search').value.trim();

    if (!query) {
        loadPopularGames();
        return;
    }

    const gamesList = document.getElementById('games-list');
    gamesList.innerHTML = '<div class="loading">Searching games...</div>';

    const result = await searchGames(query);

    if (result.success) {
        displayGames(result.data.games);
    } else {
        gamesList.innerHTML = `<div class="error-state">${result.data.message || 'Search failed'}</div>`;
    }
}

function displayGames(games) {
    const gamesList = document.getElementById('games-list');

    if (games.length === 0) {
        gamesList.innerHTML = '<div class="empty-state">No games found</div>';
        return;
    }

    gamesList.innerHTML = games.map(game => `
    <div class="game-card">
      ${game.background_image ? `<img src="${game.background_image}" alt="${game.name}" class="game-image">` : ''}
      <div class="game-info">
        <h3>${game.name}</h3>
        <div class="game-rating">★ ${game.rating || 'N/A'}</div>
        ${game.released ? `<div class="game-released">Released: ${game.released}</div>` : ''}
        ${game.platforms ? `<div class="game-platforms">${game.platforms.slice(0, 3).join(', ')}</div>` : ''}
        ${game.genres ? `<div class="game-genres">${game.genres.slice(0, 3).join(', ')}</div>` : ''}
      </div>
    </div>
  `).join('');
}

// check ayth status
window.addEventListener('load', async () => {
    const token = TokenManager.get();

    if (token) {
        const result = await getUserProfile();
        if (result.success) {
            showSection('profile');
        } else {
            TokenManager.remove();
            showSection('login');
        }
    } else {
        showSection('login');
    }
});