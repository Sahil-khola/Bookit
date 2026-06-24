import express from "express";
const router = express.Router();
import { protectMiddleware as protect , organizerMiddleware as admin} from "../middlewares/authMiddleware.js";
import { bookEvent , sendOtp , getMyBooking , confirmBooking , cancelBooking } from "../controllers/bookingController.js";

router.post("/",protect,bookEvent);
router.post("/send-otp",protect,sendOtp);
router.get("/my-booking",protect,getMyBooking);
router.put("/:id/confirm",protect,admin,confirmBooking);
router.delete("/:id/cancel",protect,cancelBooking);


export default router;