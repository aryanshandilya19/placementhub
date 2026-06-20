# PlacementHub

A production-grade MERN application for placement preparation tracking.

## Project Structure
placementhub/

├── client/     # React + Vite frontend

└── server/     # Node.js + Express backend
## Getting Started

### Backend
```bash
cd server
cp .env.example .env
npm install
npm run dev
```

### Frontend
```bash
cd client
cp .env.example .env
npm install
npm run dev
```

## Tech Stack
- **Frontend**: React, Vite, Zustand, Axios, React Router
- **Backend**: Node.js, Express, MongoDB Atlas
- **Auth**: JWT, Refresh Tokens
- **Storage**: Cloudinary
- **Deployment**: Vercel (frontend), Render (backend)