import Booking from "../models/Booking.js";
import Event from "../models/Event.js";
import Otp from "../models/OTP.js";
import { sendOTPEmail, sendBookingEmail } from "../utils/email.js";

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOtp = async (req, res) => {
  const opt = generateOtp();
  
  await Otp.deleteMany({ email: req.user.email, action: "event_booking" });
  await Otp.create({
    email: req.user.email,
    otp: opt,
    action: "event_booking",
  });
  await sendOTPEmail(req.user.email, opt, "event_booking");
  res.json({ message: "OTP sent to your email" });
};

const bookEvent = async (req, res) => {
  const { eventId, otp } = req.body;
  otpRecord = await Otp.findOne({
    email: req.user.email,
    otp: otp,
    action: "event_booking",
  });
  if (!otpRecord) {
    return res.status(400).json({ message: "Invalid OTP" });
  }
  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(400).json({ message: "Event not found" });
  }
  const booking = await Booking.create({
    userId: req.user._id,
    eventId,
    status:"pending",
    paymentStatus:"unpaid",
    amount:event.ticketPrice
  });
  await Otp.deleteMany({ email: req.user.email, action: "event_booking" });
  await sendBookingEmail(req.user.email, event, booking);
  res.json({ message: "Event booked successfully" });
};

const confirmBooking = async (req, res) => {
    const paymentStatus = req.body.paymentStatus;
    if (!["paid","unpaid"].includes(paymentStatus)) {
        return res.status(400).json({ message: "Invalid payment status" });
    }
    const booking = await Booking.findById(req.params.id).populate("eventId");
    if (!booking) {
      return res.status(400).json({ message: "Booking not found" });
    }
    if(booking.status === "confirmed") {
        return res.status(400).json({ message: "Booking already confirmed" });
    }

   const event = await Event.findById(booking.eventId._id);
   if (event.availableSeats <= 0) {
       return res.status(400).json({ message: "No seats available" });
   }    

   booking.status = "confirmed";
   if (paymentStatus) {
       booking.paymentStatus = paymentStatus;
    
   }
   await booking.save();
   event.availableSeats -= 1;
   await event.save();

   // send confirmation email
   await sendBookingEmail(req.user.email, event.title, booking._id);
   res.json({ message: "Booking confirmed successfully" });
}

const cancelBooking = async (req, res) => {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(400).json({ message: "Booking not found" });
    }
    if(booking.status === "confirmed") {
        const event = await Event.findById(booking.eventId._id);
        event.availableSeats += 1;
        await event.save();

    }
    await booking.remove();
    if (booking.status==="cancelled") {
        return res.json({ message: "Booking already cancelled" });
    }
    res.json({ message: "Booking cancelled successfully" });
}

const getMyBooking = async (req, res) => {
    const bookings = await Booking.find({ userId: req.user._id }).populate("eventId");
    res.json(bookings);
}



export { bookEvent, sendOtp, getMyBooking, confirmBooking, cancelBooking };
