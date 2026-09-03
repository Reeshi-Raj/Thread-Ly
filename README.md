# Thread-Ly

> A focused social space designed to keep your feed limited to the people who actually matter to you.

Thread-Ly is a full-stack social networking application built with React, Node.js, Express, and MongoDB. It allows users to share posts, connect with friends and family, engage through likes and threaded conversations, and receive relevant notifications — without the noise of an algorithmically crowded feed.

The idea behind Thread-Ly is to create a more intentional social media experience. Instead of filling your feed with posts from random people, your feed is limited to people you actually care about — your close friends and family. This helps reduce unnecessary screen time and discourages endless doom-scrolling, allowing you to focus on the updates that genuinely matter to you.

---

## Features

- Create an account and authenticate using JWT with secure HTTP-only cookies
- Browse a personalized feed containing posts from followed users
- Create text posts with optional image uploads
- Like and soft-delete posts
- View posts created by a specific user
- Comment on posts and create nested replies
- Like and soft-delete comments and replies
- Track reply counts for comments
- View user profiles and follower/following counts
- Follow and unfollow users
- Update profile information and upload profile pictures
- Receive notifications for:
  - New followers
  - Post likes
  - Comment likes
  - Reply likes
  - Comments on your posts
  - Replies to your comments
- Mark notifications as read
- Navigate directly from notifications to the related post or comment
- Paginated feeds, user posts, comments, and replies
- Responsive UI for desktop and mobile screen sizes

---

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- TanStack React Query
- Tailwind CSS
- Axios
- React Hot Toast
- React Icons

### Backend

- Node.js
- Express 5
- MongoDB
- Mongoose
- JWT
- HTTP-only Cookies
- Cloudinary
- Multer
- CORS
- cookie-parser

---

## Key Engineering Decisions

### JWT Authentication with HTTP-only Cookies

Authentication is implemented using JWTs stored in HTTP-only cookies instead of exposing tokens directly to client-side JavaScript.

Protected routes use authentication middleware to validate the JWT and attach the authenticated user to the request.

### MongoDB Transactions

MongoDB transactions are used for operations that modify multiple related documents and therefore require consistency.

For example:

- Follow / unfollow updates both users
- Creating a reply updates the comment and its parent's reply count
- Deleting a reply updates the reply and its parent's reply count
- Deleting a post removes related database references atomically

This ensures that either all related database operations succeed or none of them are committed.

### Soft Deletion

Posts and comments are soft-deleted instead of being permanently removed.

Deleted content is marked using an `isDeleted` flag while the original document remains in the database.

This helps preserve:

- Existing conversations
- Reply relationships
- Notification references
- Database consistency

For example, a deleted comment is displayed as:

> This comment was deleted.

while its replies and relationships remain intact.

### Cloudinary Media Management

Images are stored on Cloudinary rather than directly inside MongoDB.

The application also handles cleanup scenarios such as:

- Removing old profile pictures after successful replacement
- Removing deleted post images
- Cleaning up newly uploaded images when a database operation fails

### React Query Server-State Management

TanStack React Query is used for:

- API data fetching
- Server-state caching
- Mutations
- Cache invalidation
- Optimistic/immediate UI updates where appropriate

For example, after creating a post, the feed cache is refreshed so the newly created post appears without manually reloading the page.

### Pagination

Large collections are not loaded at once.

Pagination is implemented for:

- Feed posts
- User posts
- Post comments
- Comment replies

This keeps API responses smaller and makes the application more scalable as the amount of data grows.

---

## Project Structure

```text
Thread-Ly/
│
├── backend/
│   ├── config/              # Database, Cloudinary, and upload configuration
│   ├── controllers/         # Request handlers and business logic
│   ├── middlewares/         # Authentication and error handling
│   ├── models/              # Mongoose schemas
│   ├── routes/              # REST API routes
│   ├── utils/               # Tokens, notifications, and media helpers
│   └── server.js            # Express entry point
│
├── frontend/
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── context/         # Authentication context
│       ├── layouts/         # Public and authenticated layouts
│       ├── pages/           # Application screens
│       ├── services/        # API service modules
│       └── App.jsx          # Routes and application entry point
│
├── screenshots/             # Application screenshots
└── README.md

Getting Started
Prerequisites

Make sure you have the following installed:

Node.js 18 or newer
npm
MongoDB (local or hosted)
A Cloudinary account for image uploads

1. Clone the Repository
git clone https://github.com/Reeshi-Raj/Thread-Ly.git

cd Thread-Ly

2. Install Backend Dependencies
cd backend

npm install

3. Install Frontend Dependencies
cd ../frontend

npm install
Environment Variables
Backend

Create:

backend/.env

Add:

PORT=5000

MONGO_URI=your_mongodb_uri

JWT_SECRET=replace-with-a-long-random-secret

NODE_ENV=development

CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
Frontend

Create:

frontend/.env

Add:

VITE_API_URL=http://localhost:5000/api

The frontend uses credentialed requests for cookie-based authentication.

During local development, the frontend runs on Vite's default:

http://localhost:5173

The backend CORS configuration should allow this origin.

Running the Application

Open two terminals from the repository root.

Terminal 1 — Backend
cd backend

npm run dev

The backend will run on:

http://localhost:5000
Terminal 2 — Frontend
cd frontend

npm run dev

The frontend will run on:

http://localhost:5173

Open the frontend URL in your browser.

Available Scripts

Backend
Command	Description
npm run dev	Start the API with Nodemon
npm start	Start the API with Node.js

Frontend
Command	Description
npm run dev	Start the Vite development server
npm run build	Create a production build
npm run preview	Preview the production build locally
npm run lint	Run ESLint

Production Notes
Never commit .env files or real credentials to version control.
Use a strong, unique JWT_SECRET in production.
Set NODE_ENV=production so authentication cookies can use the secure flag.
Update the backend CORS origin when deploying the frontend.
Point VITE_API_URL to the deployed API URL, including the /api prefix.
Configure valid Cloudinary credentials before enabling image uploads in production.
Use HTTPS in production so secure authentication cookies can be transmitted safely.


# Future Improvements

Some possible future improvements include:

Real-time notifications using Socket.io
Notification pagination
Improved image optimization and previews
More advanced feed controls
Production deployment and monitoring
Additional moderation and privacy controls