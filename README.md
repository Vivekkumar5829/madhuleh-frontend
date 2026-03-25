# Madhuleh Frontend

Production-grade React frontend for Madhuleh honey e-commerce.

## Tech Stack
- React 18 + Vite
- TailwindCSS 3 (custom design system)
- @tanstack/react-query v5 (data fetching + caching)
- React Router v6
- Axios (with JWT interceptors + auto-refresh)
- React Hot Toast

## Setup

1. Install dependencies:
   npm install

2. Make sure your Spring Boot backend is running on port 8080.

3. Start the dev server:
   npm run dev

   Opens at http://localhost:3000

## Environment Variables
VITE_API_URL=http://localhost:8080/api/v1

## Pages
- / — Home (featured + bestsellers from API)
- /products — Product listing with search + sort
- /products/:slug — Product detail with reviews
- /cart — Shopping cart
- /checkout — Address + payment + coupon
- /order-confirmation/:orderNumber — Order status tracker
- /orders — My order history
- /blog — Recipes listing
- /blog/:slug — Recipe detail
- /about — Brand story
- /faq — Live FAQs from DB
- /contact — Contact form
- /auth — Login / Register / Forgot password
- /admin — Admin dashboard (ADMIN role only)
  - /admin/products — CRUD
  - /admin/orders — View + status update
  - /admin/reviews — Moderation
  - /admin/recipes — CRUD
  - /admin/faqs — CRUD
  - /admin/inquiries — Contact management

## Backend Addition Required
See /backend-additions/INSTALL_INSTRUCTIONS.txt
The AddressController.java is needed for checkout to work.

## Test Credentials
- Admin:    admin2@madhuleh.com / Admin@123
- Customer: vivek@test.com / Test@1234
