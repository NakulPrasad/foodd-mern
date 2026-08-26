<br/>
<p align="center">
  <img src="https://github.com/user-attachments/assets/7c93c911-9faa-4d5d-b4c9-a5d4709596f1" alt="Foodd Banner" width="100%" />
</p>

<h1 align="center">🍔 Foodd — Full-Stack Food Delivery Platform</h1>

<p align="center">
  A production-grade, full-stack food delivery web application built with the MERN stack, featuring real-time cart management, Google OAuth, Stripe payments, slide-in cart drawer, live order tracking, and a fully mobile-responsive dark/light UI.
</p>

<p align="center">
  <a href="https://foodd-mern.vercel.app/"><strong>🚀 Live Demo</strong></a> &nbsp;·&nbsp;
  <a href="https://github.com/NakulPrasad/foodd-mern/issues">Report Bug</a> &nbsp;·&nbsp;
  <a href="https://github.com/NakulPrasad/foodd-mern/issues">Request Feature</a>
</p>

<p align="center">
  <img src="https://img.shields.io/github/contributors/NakulPrasad/foodd-mern?color=dark-green" />
  <img src="https://img.shields.io/github/issues/NakulPrasad/foodd-mern" />
  <img src="https://img.shields.io/github/license/NakulPrasad/foodd-mern" />
  <img src="https://img.shields.io/badge/TypeScript-End--to--End-blue?logo=typescript" />
  <img src="https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel" />
</p>

---

## 📌 About The Project

**Foodd** is a fully-featured, production-ready food delivery platform inspired by Swiggy/Zomato. Users can browse restaurants, explore menus, customise orders with portion size variants, manage their cart with a slide-in drawer, apply coupon codes, and complete checkout via Stripe or COD — all with a seamless, mobile-first dark/light experience.

The project demonstrates expertise across the entire stack: from a stateless JWT + Google OAuth authentication system, to an Express REST API with centralised error handling, to a responsive React UI with global state management via Redux Toolkit.

---

## ✨ Features

### 🔐 Authentication
- **Dual auth system** — Email/password (bcrypt, 10-round salt) and Google OAuth 2.0 via Passport.js
- Both methods resolve to the same **stateless JWT session**, so all protected routes are auth-method agnostic
- Session persistence via MongoDB-backed `connect-mongo` store
- JWT verified on every protected request via a dedicated `authMiddleware`

### 🍽️ Restaurant & Menu
- Browse all restaurants with live data from MongoDB
- Filter and explore full menus per restaurant
- **Food category filtering** — filter by category within a restaurant menu
- Veg / Non-veg indicators on all food items
- Coupon / Deals carousel per restaurant

### 🛒 Advanced Cart & Drawer
- **Slide-in Cart Drawer** (Mantine Drawer) — full-height interactive drawer with quantity `+`/`−` controls and per-item custom cooking instructions
- **Multi-restaurant conflict guard** — modal warning when adding items from a different restaurant, with option to clear and replace cart
- Persistent Redux cart — add, remove, update quantity of items
- Cart auto-clears on successful order placement
- Real-time itemised bill (Item Total · Delivery Fee · GST · Discount · **To Pay**)

### 📦 Checkout & Payments
- Multi-address delivery selection with visual highlight of selected address
- **Coupon code input** with live discount application and success feedback
- **Visual bill breakdown** — GST, delivery fee, coupon discount, and grand total
- No-contact delivery opt-in option
- **Stripe card payments** (test mode) + COD option
- Pay button gated — disabled until a delivery address is selected

### 📋 Order Tracking
- Full order history on the Orders / Profile page with status filters (All · Delivered · In Progress)
- **Live Order Tracker Stepper** — 5-step timeline: Placed → Confirmed → Preparing → On the Way → Delivered
- Receipt, Help, and Reorder actions per order
- Star rating displayed per order

### 📍 Location
- **Geolocation-based city detection** using the browser Geolocation API + reverse geocoding
- Restaurants filtered and displayed per city

### 🌓 Dark / Light Mode
- System-aware colour scheme (`defaultColorScheme="auto"`) via Mantine v7
- Toggle button in navbar persisted to `localStorage`
- All surfaces (body, headings, cards) follow Mantine CSS variables

### 📱 Mobile Responsive UI
- Hamburger menu → slide-in drawer with full nav + cart + auth on mobile
- Responsive grid: 1 col (mobile) → 2 (tablet) → 4 (desktop) for restaurants
- Mobile-first CSS variables that scale up at breakpoints
- CSS micro-animations: `bump`, `shimmer`, `pulseGlow` keyframes on interactive elements

### ⚙️ Backend / API
- **REST API** (primary) + **GraphQL** endpoint via `graphql-http` (dev UI via `ruru`)
- **Centralised error handling middleware** — standard `{ success, message }` JSON error responses
- **404 Not Found handler** for unknown API routes
- **Health check endpoint** — `GET /health` returns uptime and environment
- Request logging with `morgan`
- CORS with custom origin validation (blocks unknown origins)
- Rate limiting via `express-rate-limit` (100 req/min per IP)
- Input validation using `express-validator` on all user-facing endpoints
- **Singleton DB connection** — MongoDB connects once at startup before the server accepts requests

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Redux Toolkit (RTK Query), Mantine UI v7, React Router v7 |
| **Backend** | Node.js 24.x, Express.js, TypeScript (ESM), Passport.js |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Auth** | JWT (`jsonwebtoken`), Google OAuth 2.0, bcrypt |
| **Payments** | Stripe (Checkout Sessions + Webhook verification) |
| **API** | REST + GraphQL (`graphql-http`, `graphql-yoga`) |
| **Testing** | Vitest, React Testing Library |
| **Deployment** | Vercel (Frontend + Backend), MongoDB Atlas |

---

## 🧠 Technical Decisions

| Decision | Reasoning |
|---|---|
| **TypeScript end-to-end** | Caught type mismatches between API responses and Redux store at compile time, not runtime. Shared interfaces between service, controller, and model layers. |
| **RTK Query for data fetching** | Automatic caching, deduplication, and invalidation of restaurant/order queries without writing manual `useEffect` + `fetch` boilerplate. |
| **JWT over server sessions** | Frontend (Vercel) and backend are on separate origins. Stateless JWTs avoid sticky-session complexity and scale horizontally. |
| **Passport.js as OAuth abstraction** | Isolated Google OAuth callback from core auth logic. Both credential and OAuth logins produce the same JWT payload, so all downstream routes are auth-method agnostic. |
| **customerId as String in Order model** | Google OAuth IDs are long numeric strings, not valid MongoDB ObjectIds. Storing as `String` makes the order system work for both auth providers without a join or lookup. |
| **DB connect at server startup** | Previous per-request reconnect was unawaited and could race with incoming requests. `await db.connect()` before `app.listen()` guarantees DB is ready before serving traffic. |
| **Centralised error middleware** | A single `errorHandler` + `notFoundHandler` at the bottom of `index.ts` prevents accidental stack trace leaks in production and standardises all error JSON shapes. |
| **Mobile-first CSS variables** | Section margin CSS variables start at `1rem` on mobile and scale up via `@media` breakpoints, letting all screens use the same class names without `!important` overrides. |

---

## 🖼️ Screenshots

### 🏠 Home — Hero, Cuisine Filter & Restaurant Cards
![Home Page](./screenshots/Screenshot%202026-08-26%20215130.png)

### 🍽️ Home — Top Chains & Explore by Cuisine
![Restaurant Cards & Cuisine Grid](./screenshots/Screenshot%202026-08-26%20215141.png)

### 🏪 Restaurant Page — Hero, Info Card & Deals Carousel
![Restaurant Page](./screenshots/Screenshot%202026-08-26%20215200.png)

### 🧾 Customise Your Order — Portion Size Variants Modal
![Order Customisation Modal](./screenshots/Screenshot%202026-08-26%20215214.png)

### 🛒 Slide-in Cart Drawer — Bill Breakdown & Checkout CTA
![Cart Drawer](./screenshots/Screenshot%202026-08-26%20215228.png)

### 📦 Checkout — Address Selection, Coupon Applied & Bill Details
![Checkout Page](./screenshots/Screenshot%202026-08-26%20215340.png)

### 💳 Payment Modal — Stripe / UPI / COD Selection
![Payment Modal](./screenshots/Screenshot%202026-08-26%20215351.png)

### 📋 Orders & Profile — Live Order Tracker Stepper
![Order History & Tracker](./screenshots/Screenshot%202026-08-26%20215405.png)

---

## 🗺️ Roadmap

### ✅ Completed
- [x] Google OAuth 2.0 + Email/Password dual auth
- [x] Stripe payment integration (Checkout Sessions)
- [x] Slide-in Cart Drawer with quantity controls & custom cooking instructions
- [x] Multi-restaurant cart conflict guard
- [x] Coupon code system with live discount
- [x] Visual bill breakdown (GST · Delivery · Discount · Total)
- [x] Live Order Tracker 5-step stepper
- [x] Dark / Light mode (system-aware + manual toggle)
- [x] CSS micro-animations (bump, shimmer, pulseGlow)
- [x] Centralised error handling + 404 handler + health check

### 🔜 Planned
- [ ] **Real-time order status** — WebSocket-based updates pushed from backend
- [ ] **User profile management** — Edit name, phone, saved addresses, and avatar
- [ ] **Push notifications** — Browser/PWA push for order status updates
- [ ] **Ratings & reviews** — Post-delivery restaurant and item ratings
- [ ] **Admin dashboard** — Role-gated dashboard to manage restaurants, food items, and orders
- [ ] **Refresh token mechanism** — Rotate JWTs silently instead of forcing re-login on expiry
- [ ] **PWA support** — Installable, offline-capable progressive web app
- [ ] **E2E tests** — Playwright test suite for critical user journeys (login → order → checkout)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Google Cloud Console project with OAuth 2.0 credentials
- Stripe account (for payment integration)

### Installation

1. **Clone the repo**
```sh
git clone https://github.com/NakulPrasad/foodd-mern.git
cd foodd-mern
```

2. **Install dependencies**
```sh
cd frontend && npm install
cd ../backend && npm install
```

3. **Configure backend environment**

Create `backend/.env.development`:
```env
MONGODB_CONNECTION_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/<db>
SESSION_SECRET=your_session_secret_here
SECRET_JWT=your_jwt_secret_here
GOOGLE_CLIENTID=your_google_client_id
GOOGLE_CLIENTSECRET=your_google_client_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
PORT=3000
```

4. **Build and run the backend**
```sh
cd backend
npx tsc
npm run dev      # starts nodemon on port 3000
```

5. **Run the frontend**
```sh
cd frontend
npm run dev      # starts Vite on port 5173
```

6. **Open** [http://localhost:5173](http://localhost:5173)

---

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: add AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👤 Author

**Nakul Prasad Mahato**
- IMSc. Mathematics & Computing — BIT Mesra
- GitHub: [@NakulPrasad](https://github.com/NakulPrasad)
