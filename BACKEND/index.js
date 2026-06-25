import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
dotenv.config();
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoute.js";
import bookingRoutes from "./routes/bookingRoute.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";

const app = express();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//ROUTES ----->
app.use("/api/auth", authRoutes);
app.use("/api/events",eventRoutes );
app.use("/api/bookings",bookingRoutes );
app.use("/api/wishlist",wishlistRoutes );

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log("Connected to MongoDB"); 
}).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
})

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
