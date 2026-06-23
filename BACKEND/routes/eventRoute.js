import express from "express";
const router = express.Router();    
import { organizerMiddleware, protectMiddleware } from "../middlewares/authMiddleware.js";
import { createEvent, deleteEvent, getAllEvent, getEventById, updateEvent } from "../controllers/eventController.js";

// Get all event
router.get("/",getAllEvent);

// Get event by id
router.get("/:id",getEventById);

// Create event(organizer only)
router.post("/",protectMiddleware,organizerMiddleware,createEvent);

// Update event(organizer only)
router.put("/:id",protectMiddleware,organizerMiddleware,updateEvent);

// Delete event(organizer only)
router.delete("/:id",protectMiddleware,organizerMiddleware,deleteEvent);

export default router;