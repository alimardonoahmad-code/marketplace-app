# Web Marketplace Platform

A full-stack online marketplace platform (like Amazon/Ozon/Wildberries) built with NestJS, Next.js, PostgreSQL, and Redis.

## Features

### User Roles
- **Buyer** — browse, cart, checkout, reviews, wishlist, order tracking
- **Seller** — product management, stock, orders, analytics
- **Admin** — user management, product moderation, analytics
- **Courier** — delivery management

### Core Features
- JWT Authentication with role-based access control
- Product CRUD with categories, images, pricing, discounts, stock
- Advanced search with filters (price, category, rating, seller)
- Shopping cart with quantity management
- Order system with status tracking (pending → confirmed → shipped → delivered)
- Payment: Cash on Delivery + Online (mock)
- Reviews & ratings (1-5 stars)
- Wishlist
- Admin dashboard with analytics
- Seller dashboard
- Courier delivery panel
- Redis caching
- Responsive modern UI

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | NestJS, TypeORM, PostgreSQL |
| Frontend | Next.js 14, Tailwind CSS, Zustand |
| Cache | Redis |
| Auth | JWT + bcrypt |
| Deploy | Docker Compose |

## Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose

### 1. Start Database & Redis

```bash
docker-compose up -d
```

### 2. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run seed    # Create demo data
npm run start:dev
```

API runs at `http://localhost:3001/api`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:3000`

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@marketplace.com | password123 |
| Seller | seller@marketplace.com | password123 |
| Buyer | buyer@marketplace.com | password123 |
| Courier | courier@marketplace.com | password123 |

## API Endpoints

### Auth
- `POST /api/auth/register` — Register
- `POST /api/auth/login` — Login
- `GET /api/auth/profile` — Get profile

### Products
- `GET /api/products` — List (with search/filters)
- `GET /api/products/:id` — Details
- `POST /api/products` — Create (seller)
- `PUT /api/products/:id` — Update (seller)
- `DELETE /api/products/:id` — Delete (seller)

### Cart
- `GET /api/cart` — Get cart
- `POST /api/cart` — Add item
- `PUT /api/cart/:id` — Update quantity
- `DELETE /api/cart/:id` — Remove item

### Orders
- `POST /api/orders` — Create order
- `GET /api/orders/user` — User orders
- `GET /api/orders/seller` — Seller orders
- `PUT /api/orders/:id/status` — Update status

### Reviews, Wishlist, Categories, Admin
- Full CRUD endpoints for all modules

## Project Structure

```
├── backend/          # NestJS API
│   ├── src/
│   │   ├── auth/
│   │   ├── products/
│   │   ├── cart/
│   │   ├── orders/
│   │   ├── reviews/
│   │   ├── wishlist/
│   │   ├── admin/
│   │   └── entities/
│   └── uploads/
├── frontend/         # Next.js App
│   └── src/
│       ├── app/
│       ├── components/
│       ├── lib/
│       └── store/
└── docker-compose.yml
```

## License

MIT
