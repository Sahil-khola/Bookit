import Event from "../models/Event.js";

async function getAllEvent(req, res) {
  try {
    const filter = {};
    if (req.query.date) {
      filter.category = req.query.category;
    }
    if (req.query.title) {
      filter.title = req.query.title;
    }

    const events = await Event.find(filter);
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
async function getEventById(req, res) {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
async function createEvent(req, res) {
    const { title, description, location, date, category, availableSeats, ticketPrice, imageUrl} = req.body;
    try {
        const event = await Event.create({ title, description, location, date, category, availableSeats, ticketPrice, imageUrl});
        res.status(201).json({message:"Event created successfully"},event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
async function updateEvent(req, res) {
    const { title, description, location, date, category, availableSeats, ticketPrice, imageUrl} = req.body;
    try {
        const event = await Event.findById(req.params.id,{
            title, description, location, date, category, availableSeats, ticketPrice, imageUrl
        },{new:true});
      
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }
        res.status(200).json({message:"Event updated successfully"},event);
      
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
async function deleteEvent(req, res) {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }
        res.status(200).json({message:"Event deleted successfully"});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export { getAllEvent, getEventById, createEvent, deleteEvent, updateEvent };
