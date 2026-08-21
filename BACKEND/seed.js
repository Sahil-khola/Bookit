import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import connectDB from "./config/db.js";
import User from "./models/User.js";
import Event from "./models/Event.js";
import Booking from "./models/Booking.js";
import OTP from "./models/OTP.js";

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log("Clearing existing collections...");
    await User.deleteMany({});
    await Event.deleteMany({});
    await Booking.deleteMany({});
    await OTP.deleteMany({});

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    const users = await User.insertMany([
      {
        name: "Admin User",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
        isVerified: true,
      },
      {
        name: "Test User",
        email: "user@example.com",
        password: hashedPassword,
        role: "user",
        isVerified: true,
      },
    ]);

    console.log(`✅ Inserted ${users.length} users`);

    const events = await Event.insertMany([
      {
        title: "Music Concert",
        description: "Live music concert with popular artists",
        date: new Date("2026-09-15T19:00:00"),
        location: "Mumbai, India",
        category: "Music",
        totalSeats: 500,
        availableSeats: 450,
        image: "https://via.placeholder.com/300",
        ticketPrice: 999,
        createdBy: users[0]._id,
      },
      {
        title: "Tech Conference",
        description: "Annual technology conference and workshop",
        date: new Date("2026-10-20T09:00:00"),
        location: "Bangalore, India",
        category: "Technology",
        totalSeats: 200,
        availableSeats: 180,
        image: "https://via.placeholder.com/300",
        ticketPrice: 1499,
        createdBy: users[0]._id,
      },
      {
        title: "Food Festival",
        description: "Experience cuisines from around the world",
        date: new Date("2026-11-05T11:00:00"),
        location: "Delhi, India",
        category: "Food",
        totalSeats: 1000,
        availableSeats: 850,
        image: "https://via.placeholder.com/300",
        ticketPrice: 499,
        createdBy: users[0]._id,
      },
    ]);

    console.log(`✅ Inserted ${events.length} events`);

    const bookings = await Booking.insertMany([
      {
        userId: users[1]._id,
        eventId: events[0]._id,
        status: "confirmed",
        paymentStatus: "paid",
        amount: events[0].ticketPrice,
      },
      {
        userId: users[1]._id,
        eventId: events[1]._id,
        status: "pending",
        paymentStatus: "unpaid",
        amount: events[1].ticketPrice,
      },
    ]);

    console.log(`✅ Inserted ${bookings.length} bookings`);

    const otps = await OTP.insertMany([
      {
        email: users[0].email,
        otp: "123456",
        action: "account_Verification",
      },
      {
        email: users[1].email,
        otp: "654321",
        action: "event_booking",
      },
    ]);

    console.log(`✅ Inserted ${otps.length} OTPs`);

    console.log("🎉 Seeding completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedData();
