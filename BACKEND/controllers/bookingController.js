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
    const otpRecord = await Otp.findOne({
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
     try {
        const { paymentStatus } = req.body; // 'paid' or 'not_paid'
        const booking = await Booking.findById(req.params.id).populate('userId').populate('eventId');
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        if (booking.status === 'confirmed') return res.status(400).json({ message: 'Booking is already confirmed' });

        const event = await Event.findById(booking.eventId._id);
        if (event.availableSeats <= 0) {
            return res.status(400).json({ message: 'No seats available to confirm this booking' });
        }

        booking.status = 'confirmed';
        if (paymentStatus) {
            booking.paymentStatus = paymentStatus;
        }
        await booking.save();

        event.availableSeats -= 1;
        await event.save();

        // Send email on admin confirmation
        await sendBookingEmail(booking.userId.email, booking.userId.name, booking.eventId.title);

        res.json({ message: 'Booking confirmed successfully', booking });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}

const cancelBooking = async (req, res) => {
   try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        if (booking.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        if (booking.status === 'cancelled') return res.status(400).json({ message: 'Already cancelled' });

        const wasConfirmed = booking.status === 'confirmed';

        booking.status = 'cancelled';
        await booking.save();

        if (wasConfirmed) {
            const event = await Event.findById(booking.eventId);
            if (event) {
                event.availableSeats += 1;
                await event.save();
            }
        }

        res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}

const getMyBooking = async (req, res) => {
       try {
        const bookings = req.user.role === 'admin'
            ? await Booking.find().populate('eventId').populate('userId', 'name email').sort({ createdAt: -1 })
            : await Booking.find({ userId: req.user.id }).populate('eventId').sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}



export { bookEvent, sendOtp, getMyBooking, confirmBooking, cancelBooking };
