# PlacementHub

A production-grade full-stack MERN application for placement preparation tracking — built to help engineering students manage company applications, track DSA progress, and visualize their placement journey.

🌐 **Live Demo:** [https://placementhub-two.vercel.app](https://placementhub-two.vercel.app)
🔗 **API:** [https://placementhub-api.onrender.com](https://placementhub-api.onrender.com)
❤️ **Health Check:** [https://placementhub-api.onrender.com/health](https://placementhub-api.onrender.com/health)

---

## Features

### Authentication & Security
- JWT-based authentication with access tokens (15 min) and refresh tokens (7 days)
- Refresh token rotation — every refresh issues a new token pair
- Email verification on registration
- Forgot password / reset password via email
- HttpOnly cookies for refresh token storage (XSS protection)
- Rate limiting on auth, upload, and global API endpoints
- Role-based access control (Student / Admin)
- NoSQL injection sanitization middleware
- Helmet security headers

### Company Application Tracker
- Add, edit, and delete job applications
- Track status: Applied → OA → Interview → Offer / Rejected / Ghosted
- Log interview rounds with outcomes and notes
- Filter by status and search by company or role
- Real-time stats: total, offer rate, status breakdown

### DSA Progress Tracker
- Log problems from LeetCode, GFG, Codeforces, CodeChef
- Track difficulty (Easy / Medium / Hard) and status (Todo / Solving / Done)
- Tag problems with topics (DP, Arrays, Graphs, etc.)
- Streak tracking — consecutive days with at least one problem solved
- Filter by difficulty, status, and search by title

### Analytics Dashboard
- Applications per month (bar chart)
- Application status distribution (donut chart)
- DSA difficulty breakdown (donut chart)
- Top problem tags by frequency (horizontal bar chart)
- Key stats: total applications, offer rate, DSA solved, current streak

### User Profile
- Edit name, college, branch, graduation year, bio, social links
- Avatar upload with automatic face-crop (Cloudinary)
- Resume upload and management (PDF, Cloudinary)

### Admin Panel
- Platform-wide stats: total users, verified/unverified, total applications
- User management table with search
- Change user roles (Student ↔ Admin)
- Delete users with cascading data cleanup
- RBAC enforced on both frontend and backend

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | UI framework and build tool |
| React Router v6 | Client-side routing |
| Zustand | Global state management |
| Axios | HTTP client with interceptors |
| Recharts | Analytics charts |
| react-hot-toast | Toast notifications |
| lucide-react | Icon library |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | Web server and API |
| MongoDB Atlas + Mongoose | Database and ODM |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |
| Zod | Request validation |
| Helmet | Security headers |
| express-rate-limit | Rate limiting |
| Winston | Structured logging |
| Multer + Cloudinary | File upload pipeline |
| Nodemailer | Transactional email |

### Infrastructure
| Service | Purpose |
|---|---|
| Vercel | Frontend hosting |
| Render | Backend hosting |
| MongoDB Atlas | Cloud database |
| Cloudinary | File and image storage |

---

## Project Structure

```
placementhub/
├── client/                         # React + Vite frontend
│   └── src/
│       ├── api/                    # Axios instance + API functions
│       ├── components/             # Reusable UI components
│       │   ├── common/             # Spinner, EmptyState, ConfirmModal
│       │   ├── layout/             # Navbar, AppLayout
│       │   └── ui/                 # StatCard, StatusBadge
│       ├── features/               # Feature-based modules
│       │   ├── auth/               # Login, Register, Verify, Forgot/Reset
│       │   ├── profile/            # Profile page + hooks
│       │   ├── applications/       # Application tracker
│       │   ├── dsa/                # DSA tracker
│       │   ├── analytics/          # Analytics dashboard
│       │   └── admin/              # Admin panel
│       ├── routes/                 # AppRoutes, ProtectedRoute, AdminRoute
│       └── store/                  # Zustand auth store
│
└── server/                         # Node.js + Express backend
    └── src/
        ├── config/                 # DB, Cloudinary, Email config
        ├── controllers/            # Route handlers
        ├── middlewares/            # Auth, RBAC, validation, rate limit
        ├── models/                 # Mongoose schemas
        ├── routes/                 # Express route definitions
        ├── services/               # Business logic (email, Cloudinary)
        ├── utils/                  # ApiError, ApiResponse, asyncHandler
        └── validators/             # Zod schemas
```

---

## API Reference

```
Base URL: https://placementhub-api.onrender.com/api/v1

AUTH
  POST   /auth/register
  POST   /auth/login
  POST   /auth/logout
  POST   /auth/refresh-token
  GET    /auth/verify-email/:token
  POST   /auth/forgot-password
  POST   /auth/reset-password/:token

USERS                               [protected]
  GET    /users/me
  PATCH  /users/me
  POST   /users/me/avatar
  POST   /users/me/resume
  DELETE /users/me/resume

APPLICATIONS                        [protected]
  GET    /applications
  POST   /applications
  GET    /applications/:id
  PATCH  /applications/:id
  DELETE /applications/:id
  GET    /applications/stats

DSA                                 [protected]
  GET    /dsa
  GET    /dsa/stats
  POST   /dsa/problems
  PATCH  /dsa/problems/:id
  DELETE /dsa/problems/:id

ANALYTICS                           [protected]
  GET    /analytics/dashboard

ADMIN                               [admin only]
  GET    /admin/stats
  GET    /admin/users
  GET    /admin/users/:id
  PATCH  /admin/users/:id/role
  DELETE /admin/users/:id
```

---

## Running Locally

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account
- Gmail account with App Password

### Backend

```bash
cd server
cp .env.example .env
# Fill in all values in .env
npm install
npm run dev
```

### Frontend

```bash
cd client
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api/v1
npm install
npm run dev
```

Open `http://localhost:5173`

### Environment Variables

#### Backend (`server/.env`)

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=
CLIENT_URL=http://localhost:5173
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASS=
EMAIL_FROM=
```

#### Frontend (`client/.env`)

```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

## Security Practices

- Passwords hashed with bcrypt (10 salt rounds)
- JWT secrets are 64-character cryptographically random hex strings
- Access tokens expire in 15 minutes — short window limits damage if stolen
- Refresh tokens stored in httpOnly cookies — inaccessible to JavaScript (XSS protection)
- Refresh token rotation — stolen tokens are invalidated on next legitimate use
- All refresh tokens revoked on logout and password reset
- Profile update endpoint whitelists allowed fields — prevents role escalation via API
- Every DB query scoped to `req.user._id` — prevents horizontal privilege escalation
- NoSQL injection sanitization on all request inputs
- Rate limiting: 20 auth attempts / 15 min, 5 password resets / hour, 200 general / 15 min
- Stack traces hidden in production responses
- CORS locked to specific frontend origin

---

## Deployment

| Service | URL |
|---|---|
| Frontend | https://placementhub-two.vercel.app |
| Backend | https://placementhub-api.onrender.com |
| Database | MongoDB Atlas (cloud) |
| Files | Cloudinary CDN |

---

## Author

**Aryan Shandilya**
B.Tech Computer Science — Graduating 2027

- GitHub: [@aryanshandilya](https://github.com/aryanshandilya)
- LinkedIn: [linkedin.com/in/aryanshandilya](https://linkedin.com/in/aryanshandilya)

---

## License

MIT