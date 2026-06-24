import express from "express";
const router = express.Router();
import {  protect ,  admin} from "../middlewares/authMiddleware.js";
import { bookEvent , sendOtp , getMyBooking , confirmBooking , cancelBooking } from "../controllers/bookingController.js";

router.post("/send-otp",protect,sendOtp);
router.post("/",protect,bookEvent);
router.get("/my-booking",protect,getMyBooking);
router.get("/my",protect,getMyBooking);
router.put("/:id/confirm",protect,admin,confirmBooking);
router.delete("/:id",protect,cancelBooking);





export default router;