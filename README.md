# BookLeaf Publishing — Author Support & Communication Portal

A full-stack web application that helps BookLeaf's operations team handle author support queries faster with AI-assisted classification, priority scoring, and response drafting.

Built for the **BookLeaf Publishing Technical Assignment**.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + Vite 8 + Tailwind CSS v4 |
| **Backend** | Node.js + Express |
| **Database** | MongoDB + Mongoose |
| **AI** | Google Gemini 1.5 Flash |
| **Real-time** | Socket.io |
| **Auth** | JWT (JSON Web Tokens) |

---

## Features

### Author Portal
- **Email/Password Login** — Simple authentication, role-based redirect
- **My Books** — View published books with MRP, sales, royalty earned/paid/pending
- **Submit Support Ticket** — Select a book (or general), subject, description, file attachment UI
- **My Tickets** — Real-time ticket tracking with conversation view, status badges, priority indicators

### Admin Portal
- **Ticket Queue** — Full list with filters (status/category/priority), search, stats dashboard
- **AI Auto-Classification** — New tickets are automatically categorized and prioritized via Gemini
- **AI Draft Responses** — Generate contextual draft replies using BookLeaf's Knowledge Base
- **Override Controls** — Admins can override AI category, priority, and edit drafts before sending
- **Ticket Management** — Update status, assign to admins, add internal notes (hidden from authors)
- **Real-Time Updates** — Socket.io pushes ticket changes instantly to both authors and admins

### AI Integration
- **Gemini 1.5 Flash** — Low-cost, fast model ideal for classification and text generation
- **Smart Context** — Only relevant Knowledge Base sections sent per category (saves tokens)
- **Retry Logic** — Exponential backoff on rate limits (2s → 4s)
- **Graceful Degradation** — If AI is down, tickets still work with sensible defaults
- **Token Tracking** — Usage metrics exposed via `/api/ai/status`
- **API Key Security** — Key stored in `.env`, never exposed to frontend

---

## Project Structure

```
bookleaf-portal/
├── backend/
│   ├── config/db.js              # MongoDB connection
│   ├── models/                   # Mongoose schemas
│   │   ├── User.js               # name, email, password (bcrypt), role, bankDetails
│   │   ├── Book.js               # title, ISBN, genre, status, MRP, royalties, authorId
│   │   └── Ticket.js             # subject, category, priority, status, messages, notes
│   ├── controllers/              # Route handlers
│   │   ├── authController.js     # register, login, getMe, getAuthors, getAdmins
│   │   ├── bookController.js     # getMyBooks, getAllBooks
│   │   ├── ticketController.js   # createTicket (AI classifies), getMyTickets, getTicketById
│   │   └── adminController.js    # CRUD, respond, generateDraft, reclassify
│   ├── routes/                   # Express router definitions
│   ├── middleware/
│   │   ├── auth.js               # JWT verification + adminOnly guard
│   │   └── errorHandler.js       # Centralized error handling
│   ├── services/
│   │   ├── aiService.js          # Gemini API wrapper with retry, token tracking
│   │   └── knowledgeBase.js      # BookLeaf policies by category (cost-optimized)
│   ├── sockets/ticketSocket.js   # Socket.io room management
│   ├── seeds/seed.js             # 10 authors + 1 admin + 18 books
│   ├── server.js                 # Entry point
│   ├── API.md                    # Full API documentation
│   └── .env                      # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── context/AuthContext.jsx   # Auth state + JWT management
│   │   ├── services/
│   │   │   ├── api.js               # Axios instance with interceptors
│   │   │   └── socket.js            # Socket.io client
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Role-based navigation
│   │   │   └── LoadingSpinner.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── SignUp.jsx
│   │   │   ├── author/
│   │   │   │   ├── AuthorDashboard.jsx
│   │   │   │   ├── MyBooks.jsx
│   │   │   │   ├── SubmitTicket.jsx
│   │   │   │   └── MyTickets.jsx
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── TicketQueue.jsx
│   │   │       └── TicketDetail.jsx  # AI draft, reclassify, assign, respond
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js            # Proxy to backend
│   └── package.json
│
└── .gitignore
```

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- Gemini API key ([Get one free](https://aistudio.google.com/apikey))

### 1. Clone & Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

Edit `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bookleaf
JWT_SECRET=your_random_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

> **Note:** The app works without a Gemini key — AI features gracefully fallback to defaults. Tickets, responses, and all core features function normally.

### 3. Start the Application

```bash
# Terminal 1: Backend (port 5000)
cd backend
npm start

# Terminal 2: Frontend (port 5173)
cd frontend
npm run dev
```

The backend auto-seeds sample data on the first run. Open `http://localhost:5173` in your browser.

---

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@bookleaf.com` | `Admin@123` |
| **Author** | `ravi.sharma@email.com` | `author123` |
| **Author** | `priya.patel@email.com` | `author123` |
| *(All 10 authors share the same password)* | | `author123` |

---

## Sample Data

The database is seeded with **10 authors** and **18 books** in varied states:
- ✅ Published books earning royalties (some paid, some pending)
- ✅ Books with zero payouts (below ₹1,000 threshold)
- ✅ Books still in production (Cover Design, Typesetting, Proofreading)
- ✅ Various genres, MRPs, and sales figures

---

## API Documentation

Full API documentation (all 16 endpoints with request/response examples) is at:  
➡ **[backend/API.md](./backend/API.md)**

### Quick Reference

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Create author account |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/auth/me` | JWT | Current user |
| GET | `/api/auth/admins` | Admin | List admins |
| GET | `/api/books` | Author | My books + stats |
| POST | `/api/tickets` | Author | Create ticket (AI classifies) |
| GET | `/api/tickets` | Author | My tickets |
| GET | `/api/admin/tickets` | Admin | All tickets (filterable) |
| PATCH | `/api/admin/tickets/:id` | Admin | Update status/assign/notes |
| POST | `/api/admin/tickets/:id/draft` | Admin | Generate AI draft |
| POST | `/api/admin/tickets/:id/reclassify` | Admin | Re-run AI classification |
| GET | `/api/ai/status` | Public | AI service health + token usage |

---

## AI Integration Details

### Model Choice: **Gemini 1.5 Flash**
- **Fast** — Sub-second classification and draft generation
- **Cost-effective** — Free tier suitable for development
- **JSON mode** — Reliable structured output for classification

### Prompt Strategy
- **Classification prompt**: Instructs Gemini to categorize + prioritize with strict JSON output
- **Draft prompt**: Injects only relevant Knowledge Base sections (not the entire KB), includes conversation history for context
- **Token optimization**: Category-specific context selection reduces token usage by ~60% compared to sending the full KB

### Graceful Degradation
| Failure Scenario | Behavior |
|-----------------|----------|
| API key missing | Defaults to "General Inquiry" / "Medium" priority |
| Rate limited (429) | Retries with 2s → 4s backoff, then falls back |
| AI returns invalid JSON | Validates response, falls back to defaults |
| AI completely down | All features work — tickets created, admins respond manually |

### Security
- API key stored in `backend/.env` — never hardcoded
- AI calls made **server-side only** — frontend never sees the key
- All routes protected by JWT middleware

---

## Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **MongoDB** | Flexible schema fits varied ticket/book data; easy to iterate during development |
| **Socket.io** | Lightweight real-time without polling; rooms map naturally to author/admin spaces |
| **JWT over sessions** | Stateless auth suitable for API + SPA architecture |
| **Category-based KB context** | Reduces token usage by ~60% vs sending full KB every time |
| **AI fallback on ticket creation** | Ensures ticket is never lost due to AI failure — critical for production reliability |

---

## Known Limitations & Future Improvements

- **File uploads** — UI present but actual upload not implemented. Would use Multer + S3/Cloudinary.
- **Email notifications** — No email triggers for ticket updates. Would integrate with SendGrid/Resend.
- **Pagination** — Ticket lists don't paginate. Would add cursor-based pagination for scale.
- **Admin assignment** — Simple dropdown; no workload balancing or auto-assignment.
- **Testing** — No test suite. Would add Jest + React Testing Library.

---

## Deployment

The app is deployable to any Node.js hosting:

- **Backend**: Render, Railway, Fly.io (set `MONGODB_URI` + `JWT_SECRET` + `GEMINI_API_KEY`)
- **Frontend**: Vercel, Netlify (set `VITE_API_URL` to deployed backend URL)
- **Database**: MongoDB Atlas (free tier sufficient)

Set the start command to `npm start` in production — the backend auto-seeds if the database is empty.
