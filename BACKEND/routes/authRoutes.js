import express from "express";
import { registerUser, logInUser , verifyOtp } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", logInUser);
router.post("/verify-otp", verifyOtp);

export default router;