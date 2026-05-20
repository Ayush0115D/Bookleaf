# BookLeaf Portal — API Documentation

## Base URL

Development: `http://localhost:5000/api`
Production: `<deployed-url>/api`

## Authentication

All endpoints except `/auth/login` and `/auth/register` require a JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

Tokens expire in **7 days**. Get a token from `POST /api/auth/login`.

## Role-Based Access

| Role | Can Access |
|------|-----------|
| `author` | Own data only — their books, their tickets |
| `admin` | All data — all books, all tickets, AI features |

---

## Auth Endpoints

### `POST /api/auth/register`
Create a new author account.

**Body:**
```json
{
  "name": "Your Name",
  "email": "you@email.com",
  "password": "yourpassword"
}
```

**Response (201):**
```json
{
  "token": "jwt_token_here",
  "user": { "id": "...", "name": "...", "email": "...", "role": "author" }
}
```

### `POST /api/auth/login`
Authenticate and receive a JWT token.

**Body:**
```json
{
  "email": "admin@bookleaf.com",
  "password": "Admin@123"
}
```

**Response (200):**
```json
{
  "token": "jwt_token_here",
  "user": { "id": "...", "name": "...", "email": "...", "role": "admin", "bankDetails": {} }
}
```

### `GET /api/auth/me`
Get the currently authenticated user's profile.

**Auth:** Required

**Response (200):**
```json
{ "user": { "id": "...", "name": "...", "email": "...", "role": "author" } }
```

### `GET /api/auth/authors`
List all authors. **Auth:** Admin only.

### `GET /api/auth/admins`
List all admins. **Auth:** Admin only.

---

## Book Endpoints

### `GET /api/books`
Get the authenticated author's books with summary stats.

**Auth:** Author

**Response (200):**
```json
{
  "books": [
    {
      "_id": "...",
      "title": "Whispers of the Ganges",
      "isbn": "978-81-1234-001-1",
      "genre": "Fiction",
      "status": "Published & Live",
      "mrp": 399,
      "copiesSold": 1200,
      "royaltyEarned": 120000,
      "royaltyPaid": 80000,
      "royaltyPending": 40000,
      "authorId": "..."
    }
  ],
  "summary": {
    "totalBooks": 2,
    "totalRoyaltyEarned": 180000,
    "totalRoyaltyPaid": 110000,
    "totalRoyaltyPending": 70000,
    "totalCopiesSold": 2000
  }
}
```

### `GET /api/books/all`
Get all books across all authors. **Auth:** Admin only.

---

## Ticket Endpoints (Author)

### `POST /api/tickets`
Create a new support ticket. Triggers **AI auto-classification** and **priority scoring**.

**Auth:** Author

**Body:**
```json
{
  "bookId": "optional_book_id_or_null",
  "subject": "Royalty not received for 6 months",
  "description": "I published my book 6 months ago..."
}
```

**Response (201):**
```json
{
  "ticket": { "ticket_object" },
  "aiResult": {
    "category": "Royalty & Payments",
    "priority": "Critical",
    "reasoning": "Royalty non-payment for 6+ months"
  }
}
```

### `GET /api/tickets`
Get all tickets for the authenticated author.

**Auth:** Author

### `GET /api/tickets/:id`
Get a single ticket by ID (internal notes are hidden from authors).

**Auth:** Author/Admin

---

## Ticket Endpoints (Admin)

### `GET /api/admin/tickets`
Get all tickets with filtering. **Auth:** Admin

**Query Parameters:** `status`, `category`, `priority`, `authorId`, `search`

**Response (200):**
```json
{
  "tickets": [ "array_of_tickets" ],
  "stats": {
    "open": 5,
    "inProgress": 3,
    "resolved": 10,
    "closed": 2,
    "total": 20
  }
}
```

### `GET /api/admin/tickets/:id`
Get full ticket detail including internal notes and author bank details.

**Auth:** Admin

### `PATCH /api/admin/tickets/:id`
Update ticket fields. **Auth:** Admin

**Body (partial — include only fields to update):**
```json
{
  "status": "In Progress",
  "category": "Royalty & Payments",
  "priority": "High",
  "assignedTo": "admin_user_id_or_null",
  "internalNote": "This note is not visible to the author"
}
```

### `POST /api/admin/tickets/:id/respond`
Send a response to the author. Auto-changes status to "In Progress" if currently "Open".

**Auth:** Admin

**Body:**
```json
{
  "text": "Thank you for reaching out. Your royalty concern has been escalated..."
}
```

### `POST /api/admin/tickets/:id/draft`
Generate an **AI-drafted response** using Gemini + Knowledge Base context.

**Auth:** Admin

**Response (200):**
```json
{
  "draft": "AI-generated response text..."
}
```

### `POST /api/admin/tickets/:id/reclassify`
Re-run **AI classification** on the ticket (category + priority).

**Auth:** Admin

**Response (200):**
```json
{
  "ticket": { "populated_ticket" },
  "aiResult": {
    "category": "Royalty & Payments",
    "priority": "Critical",
    "reasoning": "..."
  }
}
```

### `DELETE /api/admin/tickets/:id`
Delete a ticket. **Auth:** Admin

---

## System Endpoints

### `GET /api/health`
Health check.

**Response:**
```json
{ "status": "ok", "timestamp": "2026-05-20T..." }
```

### `GET /api/ai/status`
Get AI service status and token usage.

**Response:**
```json
{
  "available": true,
  "model": "gemini-1.5-flash",
  "tokenUsage": { "classification": 10, "draft": 5, "total": 15000 },
  "uptime": 3600
}
```

---

## Real-Time Events (Socket.io)

The server emits the following Socket.io events:

| Event | Emitted To | When |
|-------|-----------|------|
| `ticket:created` | Author's room (`author:{id}`) + Admin room | New ticket submitted |
| `ticket:updated` | Author's room (`author:{id}`) | Ticket status/response changed |
| `ticket:new` | Admin room (`admin:room`) | New ticket for admin notification |

### Client Connection

```js
const socket = io('/');
socket.emit('join:author', authorId);   // Authors join their room
socket.emit('join:admin');             // Admins join the admin room
```

---

## Error Responses

All errors follow this format:
```json
{
  "error": "Human-readable error message",
  "details": []  // Optional — validation error details
}
```

| Status Code | Meaning |
|------------|---------|
| 400 | Validation failed — missing/invalid fields |
| 401 | Missing or invalid token |
| 403 | Insufficient permissions (not admin) |
| 404 | Resource not found |
| 409 | Duplicate resource (e.g., email already exists) |
| 500 | Internal server error |
