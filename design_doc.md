# 🍔 Foodd — Full-Stack Food Delivery Platform: Design Document

This document provides a comprehensive technical overview of the architecture, database schema, authentication flow, checkout integration, and technical decisions of the **Foodd** MERN-stack food delivery application.

---

## 🏛️ System Architecture

Foodd is structured as a decoupled client-server web application. Below is the architecture diagram:

```
+--------------------------------------------------------------+
| Client (React 18 Frontend - Mantine UI & Redux Toolkit RTK)  |
+------------------------------+-------------------------------+
                               |
                               | HTTPS / REST API Requests
                               v
+------------------------------+-------------------------------+
|         Server (Node.js / Express.js / TypeScript)           |
+--------------+---------------+---------------+---------------+
               |                               |
               | Mongoose ODM Connections      | HTTPS API Calls
               v                               v
+--------------+---------------+  +------------+---------------+
|     Database (MongoDB Atlas)  |  |      External Services     |
+------------------------------+  | - Google OAuth 2.0         |
                                  | - Stripe Checkout API      |
                                  +----------------------------+
```

### 1. Frontend Architecture
- **Vite & React 18**: Provides high-performance bundler and virtual DOM rendering.
- **Redux Toolkit & RTK Query**: Manages client global state (e.g. cart items, user session) and encapsulates data fetching with automated caching, deduplication, and polling.
- **Mantine UI v7**: Utilized as the primary CSS and React UI component framework with fully customized component styling, media queries, and responsive grid layouts.

### 2. Backend Architecture
- **Node.js & Express (TypeScript)**: Configured in ESM mode. Codebase organized cleanly using controllers, services, middleware, and routers.
- **Stateless JWT Authorization**: Avoids server-side session lookup by signing a 24-hour JSON Web Token (JWT) on login/OAuth, which is verified on every secure API request.
- **Express-Session & connect-mongo**: Primarily utilized by Passport.js during the Google OAuth redirect phase to persist temporary session context.

---

## 🗃️ Database Schema Design

All schemas are declared using Mongoose ODM (`backend/src/models/`). 

### 1. Collection Definitions

#### User Schema (`user.ts`)
| Field Name | Type | Constraints | Description |
|---|---|---|---|
| `_id` | ObjectId | Primary Key | Auto-generated user ID |
| `name` | String | Required | Full name of the user |
| `email` | String | Required, Unique | Email used for registration/login |
| `password` | String | Required | Brypt hashed password |
| `location` | String | Optional | Selected/registered default address |
| `avatarUrl` | String | Optional | URL of the profile avatar (populated by OAuth) |

#### Restaurant Schema (`restaurant.ts`)
| Field Name | Type | Constraints | Description |
|---|---|---|---|
| `_id` | ObjectId | Primary Key | Auto-generated restaurant ID |
| `name` | String | Required | Name of the restaurant |
| `image` | String | Required | URL to restaurant cover image |
| `cuisine` | String | Required | Main cuisine categories (comma-separated) |
| `rating` | Number | Default: `0` | Average user rating |
| `city` | String | Required | City of operation (used for filtering) |
| `minOrder` | Number | Required | Minimum order amount to deliver |
| `deliveryTime`| Number | Required | Estimated delivery duration in minutes |

#### Food Category Schema (`foodCategory.ts`)
| Field Name | Type | Constraints | Description |
|---|---|---|---|
| `_id` | ObjectId | Primary Key | Auto-generated category ID |
| `name` | String | Required | Category name (e.g. "Main Course") |
| `restaurantId`| ObjectId | Ref: `restaurant` | Restaurant this category belongs to |

#### Food Schema (`food.ts`)
| Field Name | Type | Constraints | Description |
|---|---|---|---|
| `_id` | ObjectId | Primary Key | Auto-generated food item ID |
| `name` | String | Required | Food item title |
| `description`| String | Required | Descriptions / ingredients |
| `price` | Number | Required | Price in INR |
| `image` | String | Required | URL to item image |
| `category` | String | Required | Associated category name |
| `isVeg` | Boolean | Required | Flag indicating veg (true) / non-veg (false) |
| `restaurantId`| ObjectId | Ref: `restaurant` | Restaurant offering this item |

#### Order Schema (`order.ts`)
| Field Name | Type | Constraints | Description |
|---|---|---|---|
| `_id` | ObjectId | Primary Key | Auto-generated order ID |
| `customerId` | String | Required | ID of user (handles both ObjectId & Google OAuth string) |
| `restaurantId`| ObjectId | Ref: `restaurant` | Restaurant where the order was placed |
| `items` | Array | Required | Array containing `{ foodItemId, quantity, price }` |
| `deliveryFee` | Number | Required | Delivery fee charged |
| `gstAndCharges`| Number | Required | Applied GST (18%) and restaurant charges |
| `totalAmount` | Number | Required | Final payable grand total |
| `couponCode` | String | Default: `null` | Applied discount coupon code |
| `discountAmount`| Number| Default: `0` | Calculated discount subtracted from total |
| `status` | String | Enum: `pending`, `confirmed`, `preparing`, `out_for_delivery`, `delivered`, `cancelled` | Status of preparation/delivery |
| `paymentStatus`| String | Enum: `pending`, `paid`, `failed`, `refunded` | Status of transaction |
| `deliveryAddress`| String| Required | Destination address |

#### Coupon Schema (`coupon.ts`)
| Field Name | Type | Constraints | Description |
|---|---|---|---|
| `_id` | ObjectId | Primary Key | Auto-generated coupon ID |
| `code` | String | Required, Unique | Code string (e.g., "WELCOME50") |
| `discountType`| String | Enum: `percentage`, `flat` | Type of discount subtraction |
| `discountValue`| Number | Required | Deduction numeric value |
| `minOrderAmount`| Number | Required | Minimum cart value required to apply |
| `maxDiscount` | Number | Optional | Maximum cap on percentage discount |

### 2. Relationships Summary
- **Restaurant to Food**: One-to-Many (`restaurantId` referenced on `Food` documents).
- **Restaurant to FoodCategory**: One-to-Many (`restaurantId` referenced on `FoodCategory` documents).
- **Order to Restaurant & Items**: One-to-One with restaurant, One-to-Many with food items (snapshots the item prices at checkout time).

---

## 🔐 Authentication & Session Flow

The application implements a **dual-authentication mechanism** (Email/Password credentials and Google OAuth 2.0). Both pathways resolve into a unified, stateless JWT token stored in the browser, making downstream API controllers auth-method agnostic.

### OAuth 2.0 & JWT Callback Sequence Flow

```
[Client Browser]                [Express Server]             [Google Identity]             [MongoDB Atlas]
       |                                |                            |                            |
  (1)  |-- GET /apiv1/auth/google ----->|                            |                            |
  (2)  |<-- Redirect to Consent Page ---|                            |                            |
  (3)  |-- Authenticate & Consent ---------------------------------->|                            |
  (4)  |<-- Auth Code redirect via Browser callback -----------------|                            |
  (5)  |                                |-- Exchange Auth Code ----->|                            |
  (6)  |                                |<-- Return User Profile ----|                            |
  (7)  |                                |-- Check / Create User --------------------------------->|
  (8)  |<-- Redirect with ?token=JWT ---|                            |                            |
```

1. **Initiation**: Client requests Google Auth path.
2. **Consent Redirect**: Server initiates Google OAuth strategy flow and redirects user to Google's consent screen.
3. **Authentication**: User consents and authenticates with their Google account credentials.
4. **Authorization Code**: Google redirects user back to the backend callback route with an authorization code.
5. **Token Exchange**: Server exchanges code with Google API for an access token and profile info.
6. **User Sync**: Server searches the DB by email. If the email doesn't exist, it creates a new user document with a randomized password.
7. **JWT Response**: Server signs a standard JWT token containing the user profile and redirects the browser back to the frontend with `?token=XYZ` in the URL.
8. **Extraction**: React app extracts the token, saves it as a cookie/Redux state, and strips the token parameter from the URL bar.

### Secure API Route Guarding (`backend/src/middleware/jwtAuth.ts`)
- Decodes the `Authorization: Bearer <token>` HTTP header.
- Verifies the signature using `SECRET_JWT`.
- Attaches the decoded payload (`id`, `name`, `email`) directly to `req.user`.
- **Dev Mode Bypass**: If the environment is not production and the token matches `"mock-dev-token"`, the middleware skips cryptographic verification and logs in a mock developer user to speed up integration testing.

---

## 💳 Checkout & Stripe Integration

```
[Client Browser]                [Express Server]              [Stripe API]                [MongoDB Atlas]
       |                                |                            |                            |
  (1)  |-- POST /checkout-session ------>|                            |                            |
       |    (Cart & Address Details)    |                            |                            |
  (2)  |                                |-- Create Pending Order -------------------------------->|
  (3)  |                                |-- Create Checkout Session ->|                            |
  (4)  |                                |<-- Return Session URL & ID -|                            |
  (5)  |<-- JSON Response with URL -----|                            |                            |
  (6)  |-- Redirect to Stripe Hosted Page --------------------------->|                            |
  (7)  |<-- Complete Payment & Redirect to /payment-success ----------|                            |
  (8)  |-- POST /verify-payment (ID) -->|                            |                            |
  (9)  |                                |-- Retrieve Checkout Session|                            |
  (10) |                                |    and verify status is paid|                            |
  (11) |                                |<-- Return paid status -----|                            |
  (12) |                                |-- Update Order & Payment ------------------------------>|
  (13) |<-- Confirmation response ------|                            |                            |
```

### Flow Breakdown:
1. **Initiation**: The client hits the `/checkout-session` endpoint with cart items and the target delivery address.
2. **Order Placement (Pending)**: The controller stores the order in MongoDB with a `pending` status and `pending` paymentStatus.
3. **Session Request**: Express server calculates totals and calls Stripe's checkout session creation API.
4. **Discount Proportioning**: Local database coupons are applied proportionally to each line item since Stripe's API does not accept arbitrary negative discount entries as line items.
5. **Redirection**: Stripe returns the session metadata. The server returns the Stripe Hosted page URL to the client, which redirects the client.
6. **Payment Verification**: Once payment is completed, the user lands back on `/payment-success?session_id=...` which triggers a secure `/verify-payment` request. The backend retrieves the session from Stripe, checks the payment status, and updates the database order to `confirmed` and `paid`.

---

## 🔍 Key Technical Findings & Improvements

While reviewing the codebase, several minor issues and potential improvements were identified:

### 1. Double Database Connection Event (Critical Node Performance)
- **Problem**: In [index.ts](file:///d:/Desktop/Projects/foodd-mern/backend/src/index.ts#L23-L24), the server calls `db.connect()`. In [server.ts](file:///d:/Desktop/Projects/foodd-mern/backend/src/server.ts#L8-L9), it instantiates another `dbConfig` and runs `await db.connect()`.
- **Implication**: This establishes multiple separate connection pools to MongoDB Atlas on server startup.
- **Recommendation**: Remove the connection initialization in [index.ts](file:///d:/Desktop/Projects/foodd-mern/backend/src/index.ts) and keep only the awaited connection in [server.ts](file:///d:/Desktop/Projects/foodd-mern/backend/src/server.ts) to guarantee connection availability before listening on the port.

### 2. Client-Side Triggered Payment Verification (Security Risk)
- **Problem**: Payment status is updated in the DB when the client redirects to the success page and triggers `/verify-payment` with a `sessionId`.
- **Implication**: If a user closes the browser tab immediately after a successful Stripe charge but before the frontend redirects and fetches `/verify-payment`, the order will remain in `pending` state even though the user was charged.
- **Recommendation**: Implement a **Stripe Webhook handler** endpoint (`/apiv1/payments/webhook`) that listens directly for Stripe `checkout.session.completed` events and updates the DB order state asynchronously.

### 3. Missing GraphQL/Ruru Implementation
- **Problem**: The `README.md` references the presence of a GraphQL endpoint via `graphql-http` and `ruru` dev interface. However, neither `package.json` nor the source files configure GraphQL.
- **Recommendation**: Update `README.md` to reflect that GraphQL is part of the roadmap, or install `graphql-http` and set up standard GraphQL schemas and resolvers in `/src/graphql/`.

---

## 🚀 Execution & Verification Plan

If implementing any of the future roadmap changes, verify using these commands in their respective workspaces:

### Backend Checks
- Verify typescript compiles cleanly:
  ```powershell
  cd backend
  npx tsc --noEmit
  ```
- Run tests:
  ```powershell
  npm run test
  ```

### Frontend Checks
- Verify type checks and production build succeeds:
  ```powershell
  cd frontend
  npm run build
  ```
