# BlogPost API

A RESTful API for a blog platform built with **Express.js**, **Prisma ORM**, and **PostgreSQL**. Supports full blog functionality including authentication, posts, comments, likes, and tags.

---

## Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma v5
- **Authentication:** JWT + Cookie-based
- **Validation:** Zod
- **Security:** Helmet, CORS, express-rate-limit
- **Password Hashing:** bcrypt

---

## Project Structure

```
blogPost/
├── app.js                  # Entry point
├── config/
│   └── env.js              # Environment variables
├── controllers/
│   ├── auth.controller.js
│   ├── posts.controllers.js
│   ├── comments.controller.js
│   ├── likes.controller.js
│   └── user.controller.js
├── middlewares/
│   ├── auth.middleware.js      # JWT authorization
│   ├── error.middlewares.js    # Global error handler
│   └── validate.middleware.js  # Zod validation
├── routes/
│   ├── auth.routes.js
│   ├── post.routes.js
│   ├── comments.routes.js
│   ├── likes.routes.js
│   └── user.routes.js
├── validations/
│   ├── auth.validations.js
│   ├── post.validations.js
│   └── comments.validation.js
├── lib/
│   └── prisma.js           # Prisma client instance
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── .env
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL installed and running
- npm

### Installation

**1. Clone the repository:**
```bash
git clone https://github.com/your-username/blogpost-api.git
cd blogpost-api
```

**2. Install dependencies:**
```bash
npm install
```

**3. Set up environment variables:**

Create a `.env` file in the root directory:
```env
PORT=3000
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/blogpost"
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**4. Run database migrations:**
```bash
npx prisma migrate dev
```

**5. Start the server:**
```bash
npm run dev
```

The API will be running at `http://localhost:3000`

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `3000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:password@localhost:5432/blogpost` |
| `JWT_SECRET` | Secret key for JWT signing | `mysecretkey` |
| `JWT_EXPIRES_IN` | JWT expiry duration | `7d` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `NODE_ENV` | Environment mode | `development` or `production` |

---

## API Endpoints

### Auth

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/v1/auth/sign-up` | Register a new user | No |
| POST | `/api/v1/auth/sign-in` | Login a user | No |
| POST | `/api/v1/auth/sign-out` | Logout a user | Yes |

### Users

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/v1/users` | Get all users | Yes |
| GET | `/api/v1/users/:id` | Get user by ID | Yes |
| PUT | `/api/v1/users/:id` | Update user profile | Yes |
| DELETE | `/api/v1/users/:id` | Delete user | Yes |

### Posts

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/v1/posts` | Get all posts (with pagination & search) | No |
| GET | `/api/v1/posts/:id` | Get post by ID | Yes |
| GET | `/api/v1/posts/users/:id` | Get posts by user | Yes |
| POST | `/api/v1/posts` | Create a new post | Yes |
| PUT | `/api/v1/posts/:id` | Update a post | Yes |
| DELETE | `/api/v1/posts/:id` | Delete a post | Yes |

### Comments

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/v1/comments/:postId` | Get comments for a post | Yes |
| POST | `/api/v1/comments/:postId` | Add a comment | Yes |
| PUT | `/api/v1/comments/:id` | Update a comment | Yes |
| DELETE | `/api/v1/comments/:id` | Delete a comment | Yes |

### Likes

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/v1/likes/:postId` | Like a post | Yes |
| DELETE | `/api/v1/likes/:postId` | Unlike a post | Yes |
| GET | `/api/v1/likes/:postId` | Get like count for a post | Yes |

---

## Pagination & Search

Posts support pagination and search via query parameters:

```
GET /api/v1/posts?page=1&limit=10&search=javascript
```

| Parameter | Default | Description |
|---|---|---|
| `page` | `1` | Page number |
| `limit` | `10` | Posts per page |
| `search` | `""` | Search posts by title |

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalPosts": 50,
    "limit": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

## Authentication

The API uses **JWT tokens** stored in HTTP-only cookies. Tokens are also accepted via the `Authorization` header as a Bearer token.

```
Authorization: Bearer <your_token>
```

---

## Rate Limiting

All `/api` routes are rate limited to **100 requests per 15 minutes** per IP address. Exceeding this returns:

```json
{
  "success": false,
  "message": "Too many requests, please try again after 15 minutes"
}
```

---

## Database Schema

| Model | Description |
|---|---|
| `Users` | User accounts |
| `Posts` | Blog posts |
| `Comments` | Post comments |
| `Likes` | Post likes (unique per user per post) |
| `Tags` | Auto-created tags linked to posts |
| `Categories` | Post categories |

---

## Scripts

| Script | Command | Description |
|---|---|---|
| Start (dev) | `npm run dev` | Start server with nodemon |
| Start (prod) | `npm start` | Start server |
| Migrate | `npx prisma migrate dev` | Run database migrations |
| Prisma Studio | `npx prisma studio` | Open database UI |

---

## License

This project is private and not licensed for public use.
