import User from "../models/User.js";
import Event from "../models/Event.js";

const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user.wishlist || []);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const { eventId } = req.body;
    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { wishlist: eventId },
    });

    res.status(200).json({ message: "Added to wishlist" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const eventId = req.params.id;
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { wishlist: eventId },
    });

    res.status(200).json({ message: "Removed from wishlist" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export { getWishlist, addToWishlist, removeFromWishlist };