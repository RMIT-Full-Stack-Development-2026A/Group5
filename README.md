# FullStack Programming

A full-stack Tic Tac Toe application with a React + Vite frontend, an Express + MongoDB backend, JWT authentication, and Socket.IO-based online gameplay.

## Features

- Local and online gameplay
- Login and registration with JWT auth
- Role-based admin access
- Profile editing and profile history
- Admin dashboard for users and game sessions
- Socket.IO room-based multiplayer flow

## Project Structure

```text
frontend/
	components/
	config/
	pages/
	public/
	services/

backend/
	src/
		config/
		middleware/
		modules/
			admin/
			auth/
			game/
			player/
```

## Tech Stack

- Frontend: React, Vite, React Router, Bootstrap
- Backend: Node.js, Express, Socket.IO
- Database: MongoDB with Mongoose
- Authentication: JWT
- Utilities: bcrypt, multer, sharp, uuid

## Prerequisites

- Node.js 18+ recommended
- MongoDB connection string
- `.env` file for backend configuration

## Test Accounts

- Admin: `Admin@gmail.com` / `Admin123@`
- User: `test@gmail.com` / `Test123@`

## `.env`

Create `backend/.env` (or use the path expected by your start script) with values like:

```env
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=1d
MONGODB_URI=your_mongodb_connection_string
PORT=3000
CLIENT_URL=http://localhost:5173
```

## Setup

Install dependencies:

```bash
npm install
```

Run both frontend and backend together:

```bash
npm run dev:all
```

Run only the frontend:

```bash
npm run dev
```

Run only the backend:

```bash
npm run dev:server
```

Build the frontend:

```bash
npm run build
```

Lint the project:

```bash
npm run lint
```

## Notes

- The backend API lives under `backend/src/`.
- Multiplayer gameplay uses Socket.IO events for room creation, joining, and move broadcasting.
- Admin features are restricted through backend role checks.
