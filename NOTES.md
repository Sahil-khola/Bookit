
#

- **Summary:** Lightweight full-stack event booking app (React + Express + MongoDB) with JWT auth and email OTP verification.
- **Purpose:** Enable users to browse events, request bookings (free or paid), and let admins confirm bookings and payments.

- **Architecture:**
	- **Backend:** Express, Node.js, Mongoose (MongoDB), Nodemailer for email, JWT for auth, clustering for workers.
	- **Frontend:** React + Vite, Tailwind CSS, React Router, Axios (custom instance attaches JWT).
	- **Communication:** REST API under `/api/*`, JSON web tokens for authenticated requests, email OTP for 2FA flows.

- **Key Features:**
	- User registration/login with OTP-based account verification.
	- Booking flow: send OTP → user confirms booking → booking marked pending → admin confirms/rejects.
	- Admin dashboard to manage events and bookings, prevent overbooking by checking available seats.
	- Wishlist, email notifications (OTP and booking confirmations), role-based access control.

- **Important runtime files:**
	- `BACKEND/index.js` — server, routes, Mongo connection, cluster logic
	- `BACKEND/controllers/*` — auth, event, booking, wishlist controllers
	- `BACKEND/utils/email.js` — Nodemailer setup and email templates
	- `FRONTEND/src/utils/axios.js` — API wrapper that injects JWT

- **Environment variables (BACKEND/.env):**
	- `PORT`, `MONGODB_URL`, `JWT_SECRET`, `FRONTEND_URL`
	- Email: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SERVICE` (optional), `EMAIL_USER`, `EMAIL_PASS`

- **Key API endpoints (examples):**
	- `POST /api/auth/register` — register user (sends account OTP)
	- `POST /api/auth/login` — login (returns JWT)
	- `POST /api/auth/verify` — verify account OTP
	- `GET /api/events` — list events
	- `GET /api/events/:id` — event details
	- `POST /api/bookings/send-otp` — start booking OTP flow
	- `POST /api/bookings/book` — create booking (uses booking OTP)
	- `PUT /api/bookings/confirm` — admin confirms booking/payment
	- `GET /api/wishlist` / `POST /api/wishlist` / `DELETE /api/wishlist/:id`

- **Simplified data model shapes:**
	- `User`: { name, email, passwordHash, role, isVerified }
	- `Event`: { title, description, date, location, category, totalSeats, availableSeats, ticketPrice }
	- `Booking`: { userId, eventId, status (pending|confirmed|cancelled), paymentStatus (paid|not_paid), amount }
	- `OTP`: { email, otp, action, createdAt }

    UI - i use windsurf ai from making ui 

