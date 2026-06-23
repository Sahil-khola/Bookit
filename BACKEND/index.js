import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
dotenv.config();
import authRoutes from "./routes/authRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());


//ROUTES ----->
app.use("/", authRoutes);

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
