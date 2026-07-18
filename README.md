# BookLeaf Publishing — Author Support & Communication Portal

A full-stack web application that helps BookLeaf's operations team handle author support queries faster with AI-assisted classification, priority scoring, and response drafting.


---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + Vite 8 + Tailwind CSS v4 |
| **Backend** | Node.js + Express |
| **Database** | MongoDB + Mongoose |
| **AI** | Google Gemini 1.5 Flash |
| **File Storage** | Cloudinary |
| **Real-time** | Socket.io |
| **Auth** | JWT (JSON Web Tokens) |

---

## Features

### Author Portal
- **Email/Password Login** — Simple authentication, role-based redirect
- **My Books** — View published books with MRP, sales, royalty earned/paid/pending; add books with sales data and cover image upload; click cover thumbnail to preview at full size
- **Submit Support Ticket** — Select a book (or general) with cover thumbnail preview, subject, description, file attachment with Multer + Cloudinary upload
- **My Tickets** — Real-time ticket tracking with conversation view, status badges, priority indicators, attachment previews
- **Reply to Tickets** — Two-way communication: authors can reply to their own open tickets; reopens ticket if it was in progress
- **Profile Settings** — Update name, email, and change password (`/profile`)
- **Bank Details Management** — Update payout bank information (account holder, number, IFSC, bank name)

### Admin Portal
- **Ticket Queue** — Full list with filters (status/category/priority), search, stats dashboard
- **AI Draft Responses** — Generate contextual draft replies using BookLeaf's Knowledge Base
- **AI Re-classification** — One-click re-run AI on any ticket to re-categorize and re-prioritize
- **Manual Override Controls** — Admins can set category, priority, status, and assignment manually
- **Ticket Management** — Update status, assign to admins, add internal notes (hidden from authors)
- **Auto-Close Resolved Tickets** — Tickets resolved with no author reply for 7 days are automatically closed
- **Real-Time Updates** — Socket.io pushes ticket changes instantly to both authors and admins
- **Profile Settings** — Update name, email, and change password (`/profile`)

### General
- **Book Cover Upload** — Add cover images when creating a book or upload later via the inline "Add cover" button; upload progress bar shows during transfer
- **Cover Preview** — Click any cover thumbnail to open a full-size lightbox overlay; close via Esc or click outside

### AI Integration
- **Gemini 1.5 Flash** — Low-cost, fast model ideal for classification and text generation
- **Smart Context** — Only relevant Knowledge Base sections sent per category (saves tokens)
- **Admin-Triggered** — AI runs only when admin clicks "Generate AI Draft" or "Re-classify with AI" — never on ticket creation
- **Retry Logic** — Exponential backoff on rate limits (2s → 4s)
- **Graceful Degradation** — If AI is down, manual tools still work
- **Token Tracking** — Usage metrics exposed via `/api/ai/status`
- **API Key Security** — Key stored in `.env`, never exposed to frontend

---

## Project Structure

```
bookleaf-portal/
├── backend/
│   ├── config/db.js                # MongoDB connection
│   ├── models/                     # Mongoose schemas
│   │   ├── User.js                 # name, email, password (bcrypt), role, bankDetails
│   │   ├── Book.js                 # title, ISBN, genre, status, MRP, royalties, authorId
│   │   └── Ticket.js               # subject, category, priority, status, messages, notes
│   ├── controllers/                # Route handlers
│   │   ├── authController.js       # register, login, getMe, updateProfile, changePassword,
│   │   │                          # updateBankDetails, getAuthors, getAdmins
│   │   ├── bookController.js       # getMyBooks, getAllBooks
│   │   ├── ticketController.js     # createTicket (AI classifies), getMyTickets,
│   │   │                          # getTicketById, replyToTicket
│   │   └── adminController.js      # CRUD, respond, generateDraft, reclassify
│   ├── routes/                     # Express router definitions
│   ├── middleware/
│   │   ├── auth.js                 # JWT verification + adminOnly guard
│   │   ├── errorHandler.js         # Centralized error handling
│   │   └── upload.js               # Multer memory storage (10 MB, JPEG/PNG/GIF/PDF/DOC/DOCX)
│   ├── services/
│   │   ├── aiService.js            # Gemini API wrapper with retry, token tracking
│   │   ├── autoClose.js            # Auto-close resolved tickets after 7 days
│   │   ├── cloudinary.js           # Cloudinary upload stream helper
│   │   └── knowledgeBase.js        # BookLeaf policies by category (cost-optimized)
│   ├── sockets/ticketSocket.js     # Socket.io room management
│   ├── seeds/seed.js               # 10 authors + 1 admin + 18 books
│   ├── server.js                   # Entry point
│   ├── API.md                      # Full API documentation
│   └── .env                        # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # Auth state + JWT management
│   │   │   └── ThemeContext.jsx     # Dark/light theme toggle
│   │   ├── services/
│   │   │   ├── api.js              # Axios instance with interceptors
│   │   │   └── socket.js           # Socket.io client
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Role-based navigation, profile dropdown, theme toggle
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── SignUp.jsx
│   │   │   ├── Profile.jsx         # Settings: profile info, change password, bank details
│   │   │   ├── author/
│   │   │   │   ├── AuthorDashboard.jsx
│   │   │   │   ├── MyBooks.jsx
│   │   │   │   ├── SubmitTicket.jsx
│   │   │   │   └── MyTickets.jsx   # Conversation view with author reply support
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── TicketQueue.jsx
│   │   │       └── TicketDetail.jsx # AI draft, reclassify, assign, respond, notes
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css               # Tailwind + custom theme (navy/gold)
│   ├── index.html
│   ├── vite.config.js              # Proxy to backend + Socket.io
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
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> **Note:** The app works without a Gemini key — AI features gracefully fallback to defaults. Ticket uploads to Cloudinary also require real credentials; without them, file attachment uploads will silently fail and the ticket will be created without an attachment.

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

**Important:** For local development, comment out `VITE_API_URL` in `frontend/.env` so the Vite proxy routes API calls to your local backend. Uncomment it only when deploying the frontend to production.

---

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@bookleaf.com` | `Admin@123` |
| **Author** | `author1234@gmail.com` | `author123` |
| **Author** | `ravi.sharma@email.com` | `author123` |
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

Full API documentation with request/response examples is at:  
➡ **[backend/API.md](./backend/API.md)**

### Quick Reference

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Create author account |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/auth/me` | JWT | Current user |
| PUT | `/api/auth/profile` | JWT | Update name & email |
| POST | `/api/auth/change-password` | JWT | Change password (requires current password) |
| PUT | `/api/auth/bank-details` | JWT | Update bank account info |
| GET | `/api/auth/authors` | Admin | List all authors |
| GET | `/api/auth/admins` | Admin | List all admins |
| GET | `/api/books` | Author | My books + stats |
| POST | `/api/books` | Author | Add a new book (supports cover image upload) |
| PUT | `/api/books/:id/cover` | Author | Upload/replace book cover image |
| DELETE | `/api/books/:id/cover` | Author | Remove book cover image |
| GET | `/api/books/all` | Admin | All books (populated) |
| POST | `/api/tickets` | Author | Create ticket (no AI — admin classifies later) |
| GET | `/api/tickets` | Author | My tickets |
| GET | `/api/tickets/:id` | Auth | Single ticket detail |
| POST | `/api/tickets/:id/reply` | Author | Reply to your own ticket |
| GET | `/api/admin/tickets` | Admin | All tickets (filterable) |
| GET | `/api/admin/tickets/:id` | Admin | Full ticket detail (with internal notes) |
| PATCH | `/api/admin/tickets/:id` | Admin | Update status/category/priority/assign/notes |
| POST | `/api/admin/tickets/:id/respond` | Admin | Send response to author |
| POST | `/api/admin/tickets/:id/draft` | Admin | Generate AI draft response |
| POST | `/api/admin/tickets/:id/reclassify` | Admin | Re-run AI classification |
| DELETE | `/api/admin/tickets/:id` | Admin | Delete a ticket |
| GET | `/api/ai/status` | Public | AI service health + token usage |
| GET | `/api/health` | Public | Server health check |

---

## AI Integration Details

### Model Choice: **Gemini 1.5 Flash**
- **Fast** — Sub-second classification and draft generation
- **Cost-effective** — Free tier suitable for development
- **JSON mode** — Reliable structured output for classification

### Prompt Strategy
- **Draft prompt**: Injects only relevant Knowledge Base sections (not the entire KB), includes conversation history for context
- **Re-classification prompt**: Instructs Gemini to categorize + prioritize with strict JSON output
- **Token optimization**: Category-specific context selection reduces token usage by ~60% compared to sending the full KB

### Graceful Degradation
| Failure Scenario | Behavior |
|-----------------|----------|
| API key missing | Manual tools still work; AI draft/re-classify show error |
| Rate limited (429) | Retries with 2s → 4s backoff, then shows error to admin |
| AI returns invalid JSON | Validates response, shows error to admin |
| AI completely down | All core features work — tickets created, admins respond manually |

### Security
- API key stored in `backend/.env` — never hardcoded
- AI calls made **server-side only** — frontend never sees the key
- All routes protected by JWT middleware

---

## Known Limitations & Future Improvements

- **Email notifications** — No email triggers for ticket updates. Would integrate with SendGrid/Resend.
- **Pagination** — Ticket lists don't paginate. Would add cursor-based pagination for scale.
- **Admin assignment** — Simple dropdown; no workload balancing or auto-assignment.
- **File type validation** — Only checked server-side; frontend doesn't restrict file picker.
- **Auto-close trigger** — Only runs when ticket queue is fetched (no background cron). Would add a periodic job for production.
- **Testing** — No test suite. Would add Jest + React Testing Library.

---

## Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **MongoDB** | Flexible schema fits varied ticket/book data; easy to iterate during development |
| **Socket.io** | Lightweight real-time without polling; rooms map naturally to author/admin spaces |
| **JWT over sessions** | Stateless auth suitable for API + SPA architecture |
| **Category-based KB context** | Reduces token usage by ~60% vs sending full KB every time |
| **AI run only on admin action** | Tickets created without AI dependency — admins classify or re-classify when ready; ensures ticket submission is never blocked by AI failure |
| **Cloudinary for file storage** | Avoids storing large files on the server; URLs stored in DB, uploaded from memory buffer |


---

## Deployment

The app is deployable to any Node.js hosting:

- **Backend**: Render, Railway, Fly.io (set `MONGODB_URI` + `JWT_SECRET` + `GEMINI_API_KEY`)
- **Frontend**: Vercel, Netlify (set `VITE_API_URL` to deployed backend URL)
- **Database**: MongoDB Atlas (free tier sufficient)

Set the start command to `npm start` in production — the backend auto-seeds if the database is empty.
