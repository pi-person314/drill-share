import { Router } from "express";
import Drill from "../schema/Drill.js";

const router = Router();

router.post("/", async (req, res) => {
    const drill = req.body;
    if (!drill.name || !drill.description || !drill.length) {
        res.status(400).json({success: false, message: "Please fill in all required fields."});
    }

    try {
        const newDrill = Drill(drill);
        await newDrill.save();
        res.status(201).json({success: true, data: newDrill, message: "Drill created!"});
    } catch (error) {
        res.status(500).json({success: false, message: "Server Error"});
        console.log(error);
    }
});

export default router;