# ReactTube — Full-Stack Video Streaming Platform


## Project Description

**ReactTube** is a modern full-stack video-sharing and social media platform built with React, Express, MongoDB, and JWT-based authentication. It delivers a polished user experience for video discovery, playback, subscriptions, playlists, likes, comments, upload management, and personal channel administration.

### Problem solved by the project

This project addresses the need for a self-hosted video hosting and community platform that supports creator uploads, subscription management, authenticated user interactions, and personalized watch history in a production-ready stack.

### Real-world use case

- A content creator wants to host videos, manage playlists, and grow a subscriber base.
- A viewer wants to search, watch, like, and comment on videos while keeping their watch history and liked content organized.
- A development team wants a reference implementation of a video streaming product with secure authentication, file uploads, and stateful frontend navigation.

### Key objectives

- Build a responsive video platform with upload and playback features
- Support secure account registration, login, and token-based authorization
- Implement watch history, playlists, likes, and subscriptions
- Use scalable backend patterns and modern frontend tools
- Make the codebase easy to understand, maintain, and extend

## Features

- ✅ User authentication: register, login, logout, refresh token, password reset flow
- ✅ Video upload with thumbnail support using Multer and Cloudinary
- ✅ Video browsing and search
- ✅ Video player with like/dislike, share link, download, and playlist add
- ✅ Channel management and profile editing
- ✅ Subscription system for creator channels
- ✅ Playlist creation, editing, adding/removing videos
- ✅ Watch history tracking
- ✅ Comment management: create, edit, delete comments
- ✅ Responsive UI with desktop sidebar and mobile bottom navigation
- ✅ Toast notifications and modern motion UI effects

## 🛠️ Tech Stack

### Frontend

| Technology       |      Purpose |
|------------------|--------------------------|
| React 19         | Modern UI library for building interactive user interfaces |
| Vite             | Fast frontend build tool and development server |
| Tailwind CSS     | Utility-first CSS framework for responsive styling |
| Redux Toolkit    | Global state management |
| React Router DOM | Client-side routing and navigation |
| Axios            | HTTP client for API communication |
| Framer Motion    | Smooth animations and transitions |
| React Toastify   | Toast notification system |
| SweetAlert2      | Beautiful popup alerts and modals |

---

### Backend

| Technology   |    Purpose   |
|--------------|--------------|
| Node.js      | JavaScript runtime environment |
| Express.js   | Backend framework for REST APIs |
| MongoDB      | NoSQL database |
| Mongoose     | MongoDB object modeling (ODM) |
| JWT          | Authentication and authorization |
| bcrypt       | Password hashing and security |
| Multer       | File upload handling middleware |
| Cloudinary   | Cloud-based media storage |
| dotenv       | Environment variable management |
| cookie-parser| Cookie parsing middleware |

## Architecture Overview

### Frontend flow

1. User opens the app in the browser.
2. React Router renders authenticated routes for home, video player, profile, playlists, liked videos, history, and shorts.
3. NavigationBar dispatches global auth and search actions.
4. Redux Toolkit stores `auth` and `video` state across the application.
5. Components call backend APIs using Axios with `withCredentials` enabled.
6. Video actions update UI instantly by reading from Redux and state hooks.

### Backend flow

1. Express initializes middleware for CORS, JSON parsing, form parsing, static resources, and cookies.
2. Route modules mount under `/api/v1/*`.
3. Protected endpoints use `jwtVerify` middleware to validate cookies or Authorization headers.
4. Controllers execute business logic and interact with MongoDB models.
5. File uploads are handled by Multer and media assets are uploaded to Cloudinary.
6. API response objects are standardized using `ApiResponse` and `ApiError`.

### API communication

- The frontend uses Axios to call backend routes.
- Requests requiring authentication include cookies with JWT access tokens.
- Video listing and search routes return paginated and filtered results.
- Playlist and subscription routes return personalized data.

### Database interaction

- MongoDB stores users, videos, comments, playlists, history, subscriptions, and likes.
- Mongoose schemas define relationships and validation.
- Aggregations and pagination are supported with `mongoose-aggregate-paginate-v2`.

### Authentication flow

1. User registers with email, password, avatar, and profile details.
2. Passwords are hashed before persistence using bcrypt.
3. Backend issues JWT access and refresh tokens.
4. `jwtVerify` middleware validates access tokens on protected routes.
5. User profile and protected actions require valid authorization.

### State management flow

- `authSlice` manages user session, login, logout, fetch current user, profile updates, and password actions.
- `videoSlice` manages home video list and search results.
- Components dispatch async thunks and read from Redux to render data.

## Folder Structure

```
Youtube/
├── Backend/
│   ├── package.json
│   ├── src/
│   │   ├── app.js
│   │   ├── index.js
│   │   ├── db/
│   │   │   └── index.js
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── public/
├── Frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.jsx
│   │   ├── main.jsx
│   │   ├── app/
│   │   │   └── store.js
│   │   ├── components/
│   │   ├── features/
│   │   │   └── auth/
│   │   ├── pages/
│   │   └── utils/
└── README.md
```

### Important folders/files

- `Backend/src/app.js` — Express server and route registration
- `Backend/src/index.js` — App startup and database connection
- `Backend/src/models/` — Mongoose schemas for Users, Videos, Comments, Playlists, History, Subscriptions, Likes
- `Backend/src/routes/` — RESTful API route definitions
- `Backend/src/controllers/` — Request handling and business logic
- `Backend/src/middlewares/auth.middleware.js` — JWT protection middleware
- `Backend/src/utils/cloudinary.js` — Cloudinary upload helper
- `Frontend/src/index.jsx` — App routing and top-level auth guard
- `Frontend/src/app/store.js` — Redux store configuration
- `Frontend/src/features/auth/authSlice.js` — Authentication async logic
- `Frontend/src/features/auth/videoSlice.js` — Video list and search logic
- `Frontend/src/components/` — Reusable UI components
- `Frontend/src/pages/` — Route pages for login, profile, playlists, history, likes, shorts

## Installation & Setup

### 1. Clone repository

```bash
git clone https://github.com/<your-username>/Youtube.git
cd Youtube
```

### 2. Install backend dependencies

```bash
cd Backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../Frontend
npm install
```

### 4. Configure environment variables

Create `.env` files for `Backend` and `Frontend`.

### 5. Start the backend

```bash
cd ../Backend
npm run dev
```

### 6. Start the frontend

```bash
cd ../Frontend
npm run dev
```

### 7. Build frontend for production

```bash
cd Frontend
npm run build
```

## Environment Variables

### Backend `.env`

```env
PORT=8000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/reacttube?retryWrites=true&w=majority
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
CORS_ORIGIN=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Frontend `.env`

```env
VITE_URL=http://localhost:8000/api/v1
```

> Note: Keep secrets out of source control and use a secure vault for production deployments.

## API Documentation

### Authentication & User

| Method | Endpoint | Purpose | Body | Auth |
|---|---|---|---|---|
| POST | `/api/v1/users/register` | Register new user | `multipart/form-data`: `username`, `email`, `fullName`, `password`, `avatar`, `coverImage` | No |
| POST | `/api/v1/users/login` | Log in user | `{ email, password }` | No |
| POST | `/api/v1/users/logout` | Log out current user | - | Yes |
| POST | `/api/v1/users/refresh-token` | Refresh access token | - | Yes |
| POST | `/api/v1/users/forget-password` | Request password reset | `{ email }` | No |
| GET | `/api/v1/users/current-user` | Get authenticated profile | - | Yes |
| PATCH | `/api/v1/users/update-account` | Update profile | `{ fullName, email, username }` | Yes |
| PATCH | `/api/v1/users/avatar` | Update avatar | `multipart/form-data`: `avatar` | Yes |
| PATCH | `/api/v1/users/cover-image` | Update cover image | `multipart/form-data`: `coverImage` | Yes |
| GET | `/api/v1/users/c/:username` | Get channel profile by username | - | Yes |
| GET | `/api/v1/users/history` | Get user watch history | - | Yes |

### Video

| Method | Endpoint | Purpose | Body | Auth |
|---|---|---|---|---|
| GET | `/api/v1/videos` | Fetch all videos | - | Yes |
| GET | `/api/v1/videos/:videoId` | Fetch single video | - | Yes |
| POST | `/api/v1/videos` | Upload new video | `multipart/form-data`: `title`, `description`, `videoFile`, `thumbnail` | Yes |
| PATCH | `/api/v1/videos/:videoId` | Update video metadata & thumbnail | `multipart/form-data`: optional `thumbnail`, `title`, `description` | Yes |
| DELETE | `/api/v1/videos/:videoId` | Delete a video | - | Yes |
| PATCH | `/api/v1/videos/publish/:videoId` | Toggle publish status | - | Yes |

### Reactions & Likes

| Method | Endpoint | Purpose | Body | Auth |
|---|---|---|---|---|
| GET | `/api/v1/likes/v/:videoId/count` | Get video like/dislike counts | - | Yes |
| POST | `/api/v1/likes/v/:videoId` | Toggle like/dislike | `{ reactionType: 'like'  'dislike' }` | Yes |
| GET | `/api/v1/likes/videos` | Get liked videos | - | Yes |

### Comments

| Method | Endpoint | Purpose | Body | Auth |
|---|---|---|---|---|
| GET | `/api/v1/comments/:videoId` | Fetch comments for video | - | Yes |
| POST | `/api/v1/comments/:videoId` | Add comment | `{ content }` | Yes |
| PATCH | `/api/v1/comments/c/:commentId` | Update comment | `{ content }` | Yes |
| DELETE | `/api/v1/comments/c/:commentId` | Delete comment | - | Yes |

### Subscriptions

| Method | Endpoint | Purpose | Body | Auth |
|---|---|---|---|---|
| GET | `/api/v1/subscriptions/status/:channelId` | Check if current user subscribed | - | Yes |
| POST | `/api/v1/subscriptions/c/:channelId` | Subscribe/unsubscribe channel | - | Yes |
| GET | `/api/v1/subscriptions/c/:channelId` | Get subscribers for channel | - | Yes |
| GET | `/api/v1/subscriptions/u/:subscriberId` | Get user subscription list | - | Yes |

### Playlists

| Method | Endpoint | Purpose | Body | Auth |
|---|---|---|---|---|
| POST | `/api/v1/playlists` | Create playlist | `{ name, description }` | Yes |
| GET | `/api/v1/playlists/:playlistId` | Fetch playlist | - | Yes |
| PATCH | `/api/v1/playlists/:playlistId` | Update playlist | `{ name, description }` | Yes |
| DELETE | `/api/v1/playlists/:playlistId` | Delete playlist | - | Yes |
| PATCH | `/api/v1/playlists/add/:videoId/:playlistId` | Add video to playlist | - | Yes |
| PATCH | `/api/v1/playlists/remove/:videoId/:playlistId` | Remove video from playlist | - | Yes |
| GET | `/api/v1/playlists/user/:userId` | Get user playlists | - | Yes |

### History

| Method | Endpoint | Purpose | Body | Auth |
|---|---|---|---|---|
| GET | `/api/v1/history` | Retrieve watch history | - | Yes |
| POST | `/api/v1/history/add` | Add video to watch history | `{ videoId }` | Yes |

## Screenshots

> Add screenshots or demo images here after you generate them.

- `screenshot-home.png` — Home feed and video cards
- `screenshot-video-player.png` — Video player with like and playlist actions
- `screenshot-profile.png` — User channel and profile management
- `screenshot-playlists.png` — Playlist creation and management

## Deployment Guide

### Frontend

1. Build the production assets:

```bash
cd Frontend
npm run build
```

2. Deploy the `dist/` folder to Vercel, Netlify, or any static hosting provider.
3. Make sure `VITE_URL` points to the deployed backend URL.

### Backend

1. Deploy the `Backend` folder to a Node hosting provider that supports ES modules.
2. Ensure `serverless-http` is configured if using Vercel serverless functions.
3. Set backend environment variables in the host configuration.

### Database

1. Create a MongoDB Atlas cluster or self-hosted MongoDB instance.
2. Set `MONGODB_URI` in the backend environment.
3. Use a secure database user and network IP access policy.

### Environment variables

- Use a `.env` file for local development.
- Use provider secrets and vaults for production.
- Avoid committing `.env` to source control.

## Security Features

- **JWT Authentication**: Access tokens validate user sessions, and refresh tokens enable session extension.
- **Password hashing**: User passwords are hashed with `bcrypt` before persisting.
- **Protected routes**: Backend routes are guarded by `jwtVerify` middleware.
- **File upload controls**: `Multer` serves file uploads and Cloudinary handles asset storage.
- **Authorization checks**: Controllers verify ownership before update/delete actions.
- **Cookie and header support**: Tokens can be read from cookies or Authorization headers.
- **Error handling**: Custom `ApiError` responses standardize API failures.

## Performance Optimizations

- `express.json()` and `express.urlencoded()` request limits prevent large payload abuse.
- API calls use credentials with Axios for secure session reuse.
- Redux Toolkit centralizes state and reduces unnecessary re-renders.
- Cloudinary offloads media storage and bandwidth from the server.
- `mongoose-aggregate-paginate-v2` enables efficient data access patterns.
- Client layout uses Tailwind with responsive mobile/desktop breakpoints.

## Future Improvements

- Add server-side pagination, infinite scroll, and search suggestions
- Add video transcoding and streaming support for large uploads
- Implement a complete password reset token + email flow
- Add role-based admin dashboard for video and user moderation
- Add real-time comments and notifications using WebSockets
- Add analytics dashboards for creators and content engagement
- Add automated tests (unit, integration, and e2e)
- Add server-side rendering or SEO metadata support

## Resume Ready Description

**Project Summary**
Built a full-stack video streaming platform with React, Redux Toolkit, Express, MongoDB, JWT authentication, Cloudinary file uploads, playlists, history, subscriptions, and social interactions.

**Resume bullets**
- Developed a full-stack video-sharing web app using React 19, Vite, Tailwind CSS, Express.js, MongoDB, and JWT-based authentication.
- Implemented secure user registration, login, profile updates, cloud-based file uploads, watch history, playlists, likes, comments, and subscription management.
- Designed RESTful APIs, middleware authentication, and stateful frontend routing for a production-style streaming product.

## Interview Preparation

### Common questions

- What architecture did you use for this project?
- How does JWT authentication work in this app?
- Why did you choose Redux Toolkit over React Context?
- How does the video upload flow work from frontend to backend?
- How did you secure protected routes and user data?
- Which performance optimizations did you implement?
- How would you scale this platform for more users?
- What would you improve if you had more time?

### Best answers

- I used a React frontend with Redux Toolkit and React Router for state and navigation, while the backend uses Express with Mongoose for database interaction.
- JWT is generated at login, stored in cookies, and verified by middleware on protected routes to secure user sessions.
- Redux Toolkit enables predictable state updates, centralized async thunks, and clearer separation of state logic compared to Context.
- Video uploads use `multipart/form-data` on the frontend, Multer on the backend, and Cloudinary for media storage.
- Protected endpoints are wrapped by `jwtVerify`, and user account actions verify ownership using stored user IDs.
- I limited payload size, used centralized state, and stored static content separately to keep the app responsive.

### Challenges faced

- Securing authentication while supporting both cookie and header-based JWT usage.
- Managing file upload flow for both video and thumbnail assets.
- Creating a polished responsive UI with desktop and mobile navigation.
- Maintaining consistent API responses across multiple controllers.

### Technical decisions

- Used React Router for route-based pages and mobile-friendly navigation.
- Chose Mongoose models for strong schema validation and relationship support.
- Added Cloudinary to reduce server storage load and simplify media management.
- Kept frontend state in Redux Toolkit for user and video data consistency.

### Learnings from the project

- Building full-stack flows end-to-end improves understanding of authentication and API design.
- Token-based security requires disciplined middleware and error handling.
- Modern React tooling such as Vite and Tailwind enables faster development and cleaner UI.
- Integrating file uploads and cloud storage exposes important production concerns.

## Author

**Ravish Kumar**

- GitHub: https://github.com/ravishkr7369
- Email: ravishkr7369@gmail.com
- LinkedIn: https://linkedin.com/in/iamravish

---

> ReactTube is designed as a recruiter-friendly portfolio project and a strong full-stack reference for modern web development.
