import express from "express";

const router = express.Router();

router.get("/booking", (req, res) => {
    res.send(" booking page");
})

export default router;