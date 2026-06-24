import express from "express";
const router = express.Router();    
import {protect , admin } from "../middlewares/authMiddleware.js";
import { createEvent, deleteEvent, getAllEvent, getEventById, updateEvent } from "../controllers/eventController.js";

// Get all event
router.get("/",getAllEvent);

// Get event by id
router.get("/:id",getEventById);

// Create event(admin only)
router.post("/",protect,admin,createEvent);

// Update event(admin only)
router.put("/:id",protect,admin,updateEvent);

// Delete event(admin only)
router.delete("/:id",protect,admin,deleteEvent);


export default router;