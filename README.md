# Gaming Reviews Platform

A full-stack web application for gaming enthusiasts to create, manage, and share game reviews with integrated gaming database API.

## Project Overview

**Project Topic**: Gaming: news, reviews

**Description**: This platform allows users to register, authenticate, create detailed game reviews, and discover popular games through external API integration. Users can manage their personal review collection with full CRUD operations and explore the latest gaming news and releases.

**Key Features**:
- User authentication with JWT and sessions
- Personal profile management with gaming preferences
- Complete review management system (Create, Read, Update, Delete)
- Integration with RAWG Video Games Database API
- Search and discover popular games
- Secure password hashing and protected routes
- Input validation and comprehensive error handling

**Technology Stack**:
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT (jsonwebtoken), bcryptjs, express-session
- **External API**: RAWG Video Games Database
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Deployment**: Render (Backend), Netlify (Frontend), MongoDB Atlas (Database)

---

## Setup and Installation Instructions

### Prerequisites

Before starting, ensure you have:
- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (local installation or MongoDB Atlas account) - [Get MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **RAWG API Key** (free) - [Get API key](https://rawg.io/apidocs)
- **Git** (optional, for version control)

---

### Step 1: Clone or Download the Project

```bash
# If using Git:
git clone <repository-url>
cd gaming-reviews-platform

# Or download and extract the ZIP file
```

---

### Step 2: Install Backend Dependencies

```bash
# Navigate to backend directory
cd backend

# Install all required packages
npm install
```

This will install:
- express
- mongoose
- dotenv
- bcryptjs
- jsonwebtoken
- express-session
- cors
- axios

---

### Step 3: Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
# In backend directory
touch .env
```

Add the following configuration to `.env`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
# For local MongoDB:
MONGO_URI=mongodb://localhost:27017/gaming-reviews-platform

# OR for MongoDB Atlas (recommended):
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/gaming-reviews-platform?retryWrites=true&w=majority

# Security Secrets (change these to your own secure values)
SESSION_SECRET=your_super_secret_session_key_here_min_32_chars
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars

# Frontend URL
FRONTEND_URL=http://localhost:3000

# External API Key
# Get your free key from: https://rawg.io/apidocs
RAWG_API_KEY=your_rawg_api_key_here
```

**Important Notes**:
- Replace `your_super_secret_session_key_here_min_32_chars` with a secure random string
- Replace `your_super_secret_jwt_key_here_min_32_chars` with a different secure random string
- Get RAWG API key by signing up at https://rawg.io/apidocs (free, takes 2 minutes)

**Generate secure secrets** (optional):
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32
```

---

### Step 4: Setup MongoDB

#### Option A: Local MongoDB

1. Install MongoDB on your system
2. Start MongoDB:
   ```bash
   mongod
   ```
3. Use the local connection string in `.env`:
   ```
   MONGO_URI=mongodb://localhost:27017/gaming-reviews-platform
   ```

#### Option B: MongoDB Atlas (Recommended for deployment)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Create a database user:
    - Go to **Database Access**
    - Click **Add New Database User**
    - Set username and password (save these!)
4. Whitelist your IP:
    - Go to **Network Access**
    - Click **Add IP Address**
    - Add `0.0.0.0/0` (allow from anywhere) for development
5. Get connection string:
    - Click **Connect** on your cluster
    - Choose **Connect your application**
    - Copy the connection string
    - Replace `<password>` with your database user password
6. Update `.env` with your Atlas connection string

---

### Step 5: Start the Backend Server

```bash
# Make sure you're in the backend directory
cd backend

# Start in development mode (with auto-restart)
npm run dev

# OR start in production mode
npm start
```

**Expected Output**:
```
Server is running on port 5000
Environment: development
MongoDB Connected: localhost
```

If you see this, your backend is running successfully! ✅

---

### Step 6: Setup and Run Frontend

#### Method 1: Simple File Opening
```bash
# Navigate to frontend directory
cd ../frontend

# Open index.html in your browser
# Simply double-click index.html
# OR drag and drop into browser
```

#### Method 2: Using Python HTTP Server
```bash
cd frontend
python -m http.server 3000
# Then open: http://localhost:3000
```

#### Method 3: Using Node.js http-server
```bash
cd frontend
npx http-server -p 3000
# Then open: http://localhost:3000
```

---

### Step 7: Test the Application

1. **Open** `http://localhost:3000` in your browser
2. **Register** a new account:
    - Name: Your Name
    - Email: test@example.com
    - Password: test123 (minimum 6 characters)
3. **Login** with your credentials
4. **Explore**:
    - View and edit your profile
    - Create game reviews
    - Search for games
    - Discover popular games

---

## API Documentation

### Base URL
```
Development: http://localhost:5000/api
Production: https://your-backend-url.onrender.com/api
```

---

## Public Routes (No Authentication Required)

### 1. Register New User
**POST** `/api/auth/register`

**Access Type**: Public

**Description**: Register a new user account

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Validation Rules**:
- `name`: Required, 2-50 characters
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters

**Success Response (201)**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65f1234567890abcdef12345",
    "name": "John Doe",
    "email": "john@example.com",
    "bio": "",
    "favoriteGenre": "",
    "createdAt": "2026-02-08T10:00:00.000Z"
  }
}
```

**Error Response (400)**:
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

---

### 2. Login User
**POST** `/api/auth/login`

**Access Type**: Public

**Description**: Authenticate existing user and receive JWT token

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65f1234567890abcdef12345",
    "name": "John Doe",
    "email": "john@example.com",
    "bio": "Passionate gamer",
    "favoriteGenre": "RPG",
    "createdAt": "2026-02-08T10:00:00.000Z"
  }
}
```

**Error Response (401)**:
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

## Protected Routes (Authentication Required)

**Authentication Header**:
```
Authorization: Bearer <your_jwt_token>
```

All protected routes require this header with a valid JWT token received from login/register.

---

### 3. Get User Profile
**GET** `/api/users/profile`

**Access Type**: Private (requires authentication)

**Description**: Get logged-in user's profile information

**Headers**:
```
Authorization: Bearer <token>
```

**Success Response (200)**:
```json
{
  "success": true,
  "user": {
    "id": "65f1234567890abcdef12345",
    "name": "John Doe",
    "email": "john@example.com",
    "bio": "Passionate gamer and reviewer",
    "favoriteGenre": "RPG",
    "createdAt": "2026-02-08T10:00:00.000Z",
    "updatedAt": "2026-02-08T12:00:00.000Z"
  }
}
```

**Error Response (401)**:
```json
{
  "success": false,
  "message": "Unauthorized. Please login to access this resource."
}
```

---

### 4. Update User Profile
**PUT** `/api/users/profile`

**Access Type**: Private (requires authentication)

**Description**: Update user profile information (name, bio, favorite genre)

**Headers**:
```
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "name": "John Doe Updated",
  "bio": "Passionate gamer, streamer, and game reviewer",
  "favoriteGenre": "Action RPG"
}
```

**Validation Rules**:
- `name`: 2-50 characters (optional)
- `bio`: Maximum 200 characters (optional)
- `favoriteGenre`: Maximum 50 characters (optional)

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "65f1234567890abcdef12345",
    "name": "John Doe Updated",
    "email": "john@example.com",
    "bio": "Passionate gamer, streamer, and game reviewer",
    "favoriteGenre": "Action RPG",
    "createdAt": "2026-02-08T10:00:00.000Z",
    "updatedAt": "2026-02-08T13:00:00.000Z"
  }
}
```

---

### 5. Create Review
**POST** `/api/reviews`

**Access Type**: Private (requires authentication)

**Description**: Create a new game review

**Headers**:
```
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "title": "Amazing Open World Experience",
  "content": "The Witcher 3 is an incredible RPG with stunning visuals, engaging story, and deep gameplay mechanics. The side quests are as compelling as the main story. Highly recommended for RPG fans.",
  "gameName": "The Witcher 3: Wild Hunt",
  "rating": 9.5,
  "platform": "PC",
  "genre": "Action RPG"
}
```

**Validation Rules**:
- `title`: Required, 3-100 characters
- `content`: Required, 10-5000 characters
- `gameName`: Required, max 100 characters
- `rating`: Required, number between 1-10
- `platform`: Optional, max 50 characters
- `genre`: Optional, max 50 characters

**Success Response (201)**:
```json
{
  "success": true,
  "message": "Review created successfully",
  "review": {
    "_id": "65f1234567890abcdef67890",
    "title": "Amazing Open World Experience",
    "content": "The Witcher 3 is an incredible RPG...",
    "gameName": "The Witcher 3: Wild Hunt",
    "rating": 9.5,
    "platform": "PC",
    "genre": "Action RPG",
    "author": {
      "_id": "65f1234567890abcdef12345",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2026-02-08T14:00:00.000Z",
    "updatedAt": "2026-02-08T14:00:00.000Z"
  }
}
```

---

### 6. Get All User Reviews
**GET** `/api/reviews`

**Access Type**: Private (requires authentication)

**Description**: Get all reviews created by the logged-in user

**Headers**:
```
Authorization: Bearer <token>
```

**Success Response (200)**:
```json
{
  "success": true,
  "count": 2,
  "reviews": [
    {
      "_id": "65f1234567890abcdef67890",
      "title": "Amazing Open World Experience",
      "content": "The Witcher 3 is an incredible RPG...",
      "gameName": "The Witcher 3: Wild Hunt",
      "rating": 9.5,
      "platform": "PC",
      "genre": "Action RPG",
      "author": {
        "_id": "65f1234567890abcdef12345",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2026-02-08T14:00:00.000Z",
      "updatedAt": "2026-02-08T14:00:00.000Z"
    },
    {
      "_id": "65f1234567890abcdef67891",
      "title": "Masterpiece of Game Design",
      "content": "Elden Ring combines the best elements...",
      "gameName": "Elden Ring",
      "rating": 10,
      "platform": "PS5",
      "genre": "Souls-like RPG",
      "author": {
        "_id": "65f1234567890abcdef12345",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2026-02-08T15:00:00.000Z",
      "updatedAt": "2026-02-08T15:00:00.000Z"
    }
  ]
}
```

---

### 7. Get Single Review
**GET** `/api/reviews/:id`

**Access Type**: Private (requires authentication)

**Description**: Get a specific review by ID (only if user is the author)

**Headers**:
```
Authorization: Bearer <token>
```

**URL Parameters**:
- `id`: MongoDB ObjectId of the review

**Example**: `GET /api/reviews/65f1234567890abcdef67890`

**Success Response (200)**:
```json
{
  "success": true,
  "review": {
    "_id": "65f1234567890abcdef67890",
    "title": "Amazing Open World Experience",
    "content": "The Witcher 3 is an incredible RPG...",
    "gameName": "The Witcher 3: Wild Hunt",
    "rating": 9.5,
    "platform": "PC",
    "genre": "Action RPG",
    "author": {
      "_id": "65f1234567890abcdef12345",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2026-02-08T14:00:00.000Z",
    "updatedAt": "2026-02-08T14:00:00.000Z"
  }
}
```

**Error Response (404)**:
```json
{
  "success": false,
  "message": "Review not found"
}
```

**Error Response (403)**:
```json
{
  "success": false,
  "message": "You do not have permission to view this review"
}
```

---

### 8. Update Review
**PUT** `/api/reviews/:id`

**Access Type**: Private (requires authentication)

**Description**: Update an existing review (only if user is the author)

**Headers**:
```
Authorization: Bearer <token>
```

**URL Parameters**:
- `id`: MongoDB ObjectId of the review

**Request Body** (all fields optional):
```json
{
  "title": "Updated Review Title",
  "rating": 9.8,
  "platform": "PC, PS5"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Review updated successfully",
  "review": {
    "_id": "65f1234567890abcdef67890",
    "title": "Updated Review Title",
    "content": "The Witcher 3 is an incredible RPG...",
    "gameName": "The Witcher 3: Wild Hunt",
    "rating": 9.8,
    "platform": "PC, PS5",
    "genre": "Action RPG",
    "author": {
      "_id": "65f1234567890abcdef12345",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2026-02-08T14:00:00.000Z",
    "updatedAt": "2026-02-08T16:00:00.000Z"
  }
}
```

**Error Response (403)**:
```json
{
  "success": false,
  "message": "You do not have permission to update this review"
}
```

---

### 9. Delete Review
**DELETE** `/api/reviews/:id`

**Access Type**: Private (requires authentication)

**Description**: Delete a review (only if user is the author)

**Headers**:
```
Authorization: Bearer <token>
```

**URL Parameters**:
- `id`: MongoDB ObjectId of the review

**Example**: `DELETE /api/reviews/65f1234567890abcdef67890`

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Review deleted successfully"
}
```

**Error Response (403)**:
```json
{
  "success": false,
  "message": "You do not have permission to delete this review"
}
```

---

### 10. Logout User
**POST** `/api/auth/logout`

**Access Type**: Private (requires authentication)

**Description**: Logout user and destroy session

**Headers**:
```
Authorization: Bearer <token>
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

##External API Integration Routes (RAWG Games Database)

### 11. Get Popular Games
**GET** `/api/games/popular`

**Access Type**: Private (requires authentication)

**Description**: Get list of popular games from RAWG database

**Headers**:
```
Authorization: Bearer <token>
```

**Query Parameters**:
- `page`: Page number (default: 1)
- `page_size`: Results per page (default: 10, max: 40)

**Example**: `GET /api/games/popular?page=1&page_size=5`

**Success Response (200)**:
```json
{
  "success": true,
  "count": 500,
  "games": [
    {
      "id": 3498,
      "name": "Grand Theft Auto V",
      "released": "2013-09-17",
      "rating": 4.47,
      "background_image": "https://media.rawg.io/media/games/456/456dea5e1c7e3cd07060c14e96612001.jpg",
      "platforms": ["PC", "PlayStation 4", "Xbox One", "PlayStation 3", "Xbox 360"],
      "genres": ["Action", "Adventure"]
    },
    {
      "id": 3328,
      "name": "The Witcher 3: Wild Hunt",
      "released": "2015-05-18",
      "rating": 4.66,
      "background_image": "https://media.rawg.io/media/games/618/618c2031a07bbff6b4f611f10b6bcdbc.jpg",
      "platforms": ["PC", "PlayStation 4", "Xbox One", "Nintendo Switch"],
      "genres": ["Action", "Adventure", "RPG"]
    }
  ]
}
```

---

### 12. Search Games
**GET** `/api/games/search`

**Access Type**: Private (requires authentication)

**Description**: Search for games by name

**Headers**:
```
Authorization: Bearer <token>
```

**Query Parameters**:
- `query`: Search query (required)
- `page`: Page number (default: 1)
- `page_size`: Results per page (default: 10, max: 40)

**Example**: `GET /api/games/search?query=witcher&page=1&page_size=5`

**Success Response (200)**:
```json
{
  "success": true,
  "count": 15,
  "games": [
    {
      "id": 1942,
      "name": "The Witcher",
      "released": "2007-10-26",
      "rating": 4.07,
      "background_image": "https://media.rawg.io/media/games/...",
      "platforms": ["PC"],
      "genres": ["Action", "RPG"]
    }
  ]
}
```

---

### 13. Get Upcoming Games
**GET** `/api/games/upcoming`

**Access Type**: Private (requires authentication)

**Description**: Get list of upcoming game releases

**Headers**:
```
Authorization: Bearer <token>
```

**Query Parameters**:
- `page`: Page number (default: 1)
- `page_size`: Results per page (default: 10, max: 40)

**Example**: `GET /api/games/upcoming?page=1&page_size=10`

**Success Response (200)**:
```json
{
  "success": true,
  "count": 100,
  "games": [
    {
      "id": 452345,
      "name": "Upcoming Game Title",
      "released": "2026-06-15",
      "rating": 0,
      "background_image": "https://media.rawg.io/media/games/...",
      "platforms": ["PC", "PlayStation 5", "Xbox Series S/X"],
      "genres": ["Action", "Adventure"]
    }
  ]
}
```

---

### 14. Get Game Details
**GET** `/api/games/:id`

**Access Type**: Private (requires authentication)

**Description**: Get detailed information about a specific game

**Headers**:
```
Authorization: Bearer <token>
```

**URL Parameters**:
- `id`: RAWG game ID (number)

**Example**: `GET /api/games/3498`

**Success Response (200)**:
```json
{
  "success": true,
  "game": {
    "id": 3498,
    "name": "Grand Theft Auto V",
    "description": "Rockstar Games went bigger, since their previous instalment of the series...",
    "released": "2013-09-17",
    "rating": 4.47,
    "background_image": "https://media.rawg.io/media/games/456/456dea5e1c7e3cd07060c14e96612001.jpg",
    "platforms": ["PC", "PlayStation 4", "Xbox One"],
    "genres": ["Action", "Adventure"],
    "developers": ["Rockstar North"],
    "publishers": ["Rockstar Games"],
    "metacritic": 92,
    "website": "http://www.rockstargames.com/V/"
  }
}
```

---

## Summary Table: All API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login user |
| GET | `/api/users/profile` | Private | Get user profile |
| PUT | `/api/users/profile` | Private | Update user profile |
| POST | `/api/reviews` | Private | Create review |
| GET | `/api/reviews` | Private | Get all user reviews |
| GET | `/api/reviews/:id` | Private | Get single review |
| PUT | `/api/reviews/:id` | Private | Update review |
| DELETE | `/api/reviews/:id` | Private | Delete review |
| POST | `/api/auth/logout` | Private | Logout user |
| GET | `/api/games/popular` | Private | Get popular games |
| GET | `/api/games/search` | Private | Search games |
| GET | `/api/games/upcoming` | Private | Get upcoming games |
| GET | `/api/games/:id` | Private | Get game details |

---

## Authentication Methods

This API supports two authentication methods:

### 1. JWT Token (Recommended)
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Session-based (Legacy Support)
- Session cookie automatically managed by browser
- Include `credentials: 'include'` in fetch requests

---

## Error Responses

### Common Error Codes

**400 Bad Request**:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Email is required",
    "Password must be at least 6 characters long"
  ]
}
```

**401 Unauthorized**:
```json
{
  "success": false,
  "message": "Unauthorized. Please login to access this resource."
}
```

**403 Forbidden**:
```json
{
  "success": false,
  "message": "You do not have permission to access this resource"
}
```

**404 Not Found**:
```json
{
  "success": false,
  "message": "Resource not found"
}
```

**500 Internal Server Error**:
```json
{
  "success": false,
  "message": "Something went wrong!"
}
```

---

## Testing the API

### Using cURL

**Register**:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

**Login**:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

**Get Profile** (replace TOKEN):
```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman or Thunder Client

1. Import endpoints from API documentation
2. Set up environment variable for `token`
3. Test each endpoint sequentially
4. Verify responses match documentation

---

## Deployment Instructions

### Deploy Backend to Render

1. Push code to GitHub
2. Create account on [Render](https://render.com)
3. Create new Web Service
4. Connect GitHub repository
5. Configure:
    - Build Command: `npm install`
    - Start Command: `npm start`
6. Add Environment Variables (see `.env.example`)
7. Deploy

### Deploy Frontend to Netlify

1. Update `frontend/js/config.js` with production backend URL
2. Drag and drop `frontend` folder to [Netlify](https://netlify.com)
3. Or connect GitHub repository

### MongoDB Atlas Setup

1. Create cluster at [MongoDB Atlas](https://mongodb.com/cloud/atlas)
2. Create database user
3. Whitelist IP: `0.0.0.0/0`
4. Get connection string
5. Update `MONGO_URI` in Render environment variables

---

## Project Structure

```
gaming-reviews-platform/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── reviewController.js   # Review CRUD operations
│   │   └── gamesController.js    # External API integration
│   ├── middleware/
│   │   └── auth.js               # JWT authentication middleware
│   ├── models/
│   │   ├── User.js               # User schema
│   │   └── Review.js             # Review schema
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   ├── userRoutes.js         # User endpoints
│   │   ├── reviewRoutes.js       # Review endpoints
│   │   └── gamesRoutes.js        # Games API endpoints
│   ├── validators/
│   │   ├── authValidator.js      # Auth validation
│   │   └── reviewValidator.js    # Review validation
│   ├── .env                      # Environment variables
│   ├── .env.example              # Environment template
│   ├── package.json              # Dependencies
│   └── server.js                 # Main server file
├── frontend/
│   ├── css/
│   │   └── style.css             # Styling
│   ├── js/
│   │   ├── config.js             # API configuration
│   │   ├── auth.js               # Auth functions
│   │   ├── reviews.js            # Review functions
│   │   ├── games.js              # Games API functions
│   │   └── app.js                # Main application logic
│   └── index.html                # Main HTML file
└── README.md                     # This file
```

---

## Troubleshooting

### MongoDB Connection Failed
- Ensure MongoDB is running (`mongod`)
- Check `MONGO_URI` in `.env`
- For Atlas: verify network access and user credentials

### JWT Token Invalid
- Check `JWT_SECRET` is set in `.env`
- Ensure token is included in Authorization header
- Token expires after 7 days - login again

### CORS Errors
- Update `FRONTEND_URL` in backend `.env`
- Restart backend server after changes
- Check CORS configuration in `server.js`

### RAWG API Not Working
- Verify `RAWG_API_KEY` is set correctly
- Check rate limits (free tier: 20,000/month)
- Get new key at https://rawg.io/apidocs


---
