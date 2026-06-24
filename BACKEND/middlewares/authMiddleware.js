import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

const protect = async (req, res, next) => {
   const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (token) {
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decode.id).select("-password");
      if (!req.user) {
        return res.status(401).json({ message: "User unauthorized" });
      }
      next();
    } catch (error) {
      return res.status(401).json({ message: "User unauthorized" });
    }
  } else {
    return res.status(401).json({ message: "User unauthorized" });
  }
};

const admin = async (req,res,next) => {
    if (req.user && (req.user.role === "admin" || req.user.role === "organizer")) {
        next();
    } else {
        return res.status(403).json({ message: "Only organizers can access" });
    }
}

export {protect,admin}