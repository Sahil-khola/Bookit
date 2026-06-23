import express from "express";

const router = express.Router();

router.get("/event", (req, res) => {
    res.send("event  page");
})

export default router;