# BookIt - Full-Stack Event Booking Platform

Bookit is a full-stack MERN application that allows users to seamlessly browse, register, and pay natively without any third party tools. It features an administrative dashboard for event organizers to create and manage free and paid events. All bookings can be managed manually by an admin to handle payments directly and for user WishList funtionalty

## Features
- **User Authentication**: Secure login & registration with JWT and bcrypt.
- **2FA OTP Verification**: 
  - Mandatory Email OTP to activate your account upon Registration (or delayed login attempts).
  - Mandatory Email OTP to finalize and secure event ticket booking.
  - After Booking Confirm booking confirmed message on gmail
- **Role-Based Access**: 
  - **Admin**: Create, edit, and delete events. Confirm and reject all incoming booking requests, mark them as 'Paid' or 'Not Paid'. Access is strictly locked to database-flagged users only.
  - **User**: Browse events, submit ticket booking requests via OTP, view personal dashboard pending status, and cancel bookings.
- **Event Management**: Create free and paid events with detailed descriptions, external image URLs, dates, categories, and seating capacity.
- **Smart Booking System**:
  - Mandatory 2FA OTP to authorize a booking request.
  - All booking requests (both free and paid) enter a secure 'Pending' queue for Admin verification.
  - Seat availability accurately updates and securely validates against overbooking logic.
- **Admin Analytics Dashboard**: Track live data such as Pending Requests, Total Revenue, and Total Confirmed Paid Clients directly from the admin panel.
- **Email Notifications**: Automated email delivery upon successful booking confirmation using Nodemailer.
- **Sleek UI/UX**: Built entirely with React, Tailwind CSS, and polished with micro-interactions.

---

## 🚀 Setup Instructions
## important point ----> for admin use it -

Follow these steps to get the app running locally.

1. Install dependencies
   - From the project root:
     ```bash
     npm run install-all
     ```
   - This installs dependencies for the root, `BACKEND`, and `FRONTEND`.

2. Configure backend environment
   - Create a `.env` file inside `BACKEND/`.
   - Add the following variables:
     ```env
     PORT=5000
     MONGODB_URL=<your_mongodb_connection_string>
     JWT_SECRET=<your_jwt_secret>
     FRONTEND_URL=http://localhost:5173
     SMTP_HOST=<smtp_host>
     SMTP_PORT=<smtp_port>
     SMTP_SERVICE=<smtp_service> # optional
     EMAIL_USER=<your_email>
     EMAIL_PASS=<your_email_password>
     EMAIL=<your_email>
     PASSWORD=<your_email_password>
     ```
   - Do not commit secret values to source control.

3. Start the application
   - From the project root:
     ```bash
     npm run dev
     ```
   - This runs both backend and frontend concurrently.

4. Access the app
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000/api`

5. Build for production
   - From the project root:
     ```bash
     npm run build
     ```
   - Then start the backend and frontend preview separately if needed.

6. Optional backend development commands
   - Start backend only:
     ```bash
     npm run dev --prefix BACKEND
     ```
   - Start backend production mode:
     ```bash
     npm start --prefix BACKEND
     ```

7. Optional frontend development commands
   - Start frontend only:
     ```bash
     npm run dev --prefix FRONTEND
     ```
   - Preview built frontend:
     ```bash
     npm run preview --prefix FRONTEND
     ```

---

## ⚙️ Notes

- The backend uses MongoDB, JWT authentication, and Nodemailer for email OTP. Make sure `MONGODB_URL`, `JWT_SECRET`, and email settings are valid.
- The frontend is built with React, Vite, and Tailwind CSS.
- If you change frontend origin, update `BACKEND/.env` `FRONTEND_URL` and CORS settings in `BACKEND/index.js`.

