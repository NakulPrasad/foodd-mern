<br/>
<p align="center">
  <img src="https://github.com/user-attachments/assets/7c93c911-9faa-4d5d-b4c9-a5d4709596f1" alt="Foodd Banner" width="100%" />
</p>

<h1 align="center">🍔 Foodd — Full-Stack Food Delivery Platform</h1>

<p align="center">
  A production-grade, full-stack food delivery web application built with the MERN stack, featuring real-time cart management, Google OAuth, GraphQL, and a fully mobile-responsive UI.
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

**Foodd** is a fully-featured, production-ready food delivery platform inspired by Swiggy/Zomato. Users can browse restaurants, explore menus, customize orders, manage their cart across sessions, and complete checkout — all with a seamless, mobile-first experience.

The project demonstrates expertise across the entire stack: from a stateless JWT + Google OAuth authentication system, to a GraphQL-enabled Express API, to a responsive React UI with global state management via Redux Toolkit.

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

### 🛒 Cart & Order Management
- **Persistent Redux cart** — add, remove, update quantity of items
- Real-time cart summary in the NavBar dropdown (desktop) and mobile drawer
- Cart auto-clears on successful order placement
- Full order history on the Orders / Profile page
- Supports **Google OAuth users** — `customerId` stored as string (not ObjectId) to handle both auth providers

### 📍 Location
- **Geolocation-based city detection** using the browser Geolocation API + reverse geocoding
- Restaurants filtered and displayed per city

### 📦 Checkout
- Multi-address delivery selection with visual highlight of selected address
- Pay button gated — disabled until a delivery address is selected
- Bill breakdown: item total, delivery fee, GST, grand total
- No-contact delivery opt-in option

### 📱 Mobile Responsive UI
- Hamburger menu → slide-in drawer with full nav + cart + auth on mobile
- Responsive grid: 1 col (mobile) → 2 (tablet) → 4 (desktop) for restaurants
- Mobile-first CSS variables that scale up at breakpoints
- Overflow and box-model fixes (`overflow-x: hidden`, `box-sizing: border-box` globally)

### ⚙️ Backend / API
- **REST API** (primary) + **GraphQL** endpoint via `graphql-http` (dev UI via `ruru`)
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
| **Backend** | Node.js, Express.js, TypeScript (ESM), Passport.js |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Auth** | JWT (`jsonwebtoken`), Google OAuth 2.0, bcrypt |
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
| **Mobile-first CSS variables** | Section margin CSS variables start at `1rem` on mobile and scale up via `@media` breakpoints, letting all screens use the same class names without `!important` overrides. |

---

## 🖼️ Screenshots

<img width="1916" height="1077" alt="Home" src="https://github.com/user-attachments/assets/2418c6e8-2218-4ea5-b336-b26e26424cfd" />
<br/>
<img width="1919" height="1078" alt="Restaurant Menu" src="https://github.com/user-attachments/assets/5bf9a997-030c-43c4-a3f3-384eb44bc0a9" />
<br/>
<img width="1919" height="937" alt="Checkout" src="https://github.com/user-attachments/assets/576b8abb-9df7-4cef-b867-d2b7e657a3b7" />
<br/>
<img width="1918" height="1067" alt="Orders" src="https://github.com/user-attachments/assets/602c67e8-f54d-4a80-976d-00b7a8b2a748" />

---

## 🗺️ Roadmap — Features To Be Added

- [ ] **Real payment gateway** — Razorpay / Stripe integration for actual payment processing
- [ ] **Live order tracking** — WebSocket-based real-time delivery status updates (Confirmed → Preparing → Out for Delivery → Delivered)
- [ ] **User profile management** — Edit name, phone, saved addresses, and avatar
- [ ] **Push notifications** — Browser/PWA push for order status updates
- [ ] **Search & discovery** — Full-text search across restaurants and food items
- [ ] **Ratings & reviews** — Post-delivery restaurant and item ratings
- [ ] **Coupon system** — Backend-validated coupon codes with discount application at checkout
- [ ] **Admin dashboard** — Separate role-gated dashboard to manage restaurants, food items, and orders (separate repo scaffolded)
- [ ] **Refresh token mechanism** — Rotate JWTs silently instead of forcing re-login on expiry
- [ ] **PWA support** — Installable, offline-capable progressive web app
- [ ] **Dark mode** — Mantine color scheme toggle persisted to localStorage
- [ ] **E2E tests** — Playwright test suite for the critical user journeys (login → order → checkout)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Google Cloud Console project with OAuth 2.0 credentials

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
