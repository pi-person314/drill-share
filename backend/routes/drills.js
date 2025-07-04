import { Router } from "express";
import Drill from "../schema/Drill.js";
import User from "../schema/User.js";

const router = Router();

router.get("/public", async (req, res) => {
    try {
        const drills = await Drill.find({public: true});
        res.status(200).json({data: drills, message: "Fetched all public drills!"});
    } catch (error) {
        res.status(500).json({message: "Server Error"});
        console.log(error);
    }
});

router.get("/created/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({message: "User not found."});
        }

        const drills = await Drill.find({creator: id});
        res.status(200).json({data: drills, message: `Fetched all drills created by user!`});
    } catch (error) {
        res.status(500).json({message: "Server Error"});
        console.log(error);
    }
});

router.get("/saved/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({message: "User not found."});
        }

        const drills = await Drill.find({usersSaved: id});
        res.status(200).json({data: drills, message: `Fetched all drills saved by user!`});
    } catch (error) {
        res.status(500).json({message: "Server Error"});
        console.log(error);
    }
});

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const drill = await Drill.findById(id);
        if (!drill) {
            return res.status(404).json({message: "Drill not found."});
        }
        res.status(200).json({data: drill, message: `Fetched drill info!`});
    } catch (error) {
        res.status(500).json({message: "Server Error"});
        console.log(error);
    }
});

router.post("/", async (req, res) => {
    const drill = req.body;
    if (!drill.name || !drill.description || !drill.creator) {
        return res.status(400).json({message: "Please fill in all required fields."});
    }

    try {
        const user = await User.findById(drill.creator);
        if (!user) {
            return res.status(404).json({message: "User not found."});
        }

        const newDrill = Drill(drill);
        await newDrill.save();
        res.status(201).json({data: newDrill, message: "Drill created!"});
    } catch (error) {
        res.status(500).json({message: "Server Error"});
        console.log(error);
    }
});

router.put("/:id", async (req, res) => {
    const id = req.params.id;
    const newData = req.body;
    if (!newData.name || !newData.description || !newData.creator) {
        return res.status(400).json({message: "Please fill in all required fields."});
    }

    try {
        const drill = await Drill.findById(id);
        if (!drill) {
            return res.status(404).json({message: "Drill not found."});
        }

        await Drill.findByIdAndUpdate(id, newData);
        
        res.status(200).json({data: newData, message: "Drill updated!"});
    } catch (error) {
        res.status(500).json({message: "Server Error"});
        console.log(error);
    }
});

router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const drill = await Drill.findByIdAndDelete(id);
        if (!drill) {
            return res.status(404).json({message: "Drill not found."});
        }

        res.status(200).json({data: drill, message: "Drill deleted!"});
    } catch (error) {
        res.status(500).json({message: "Server Error"});
        console.log(error);
    }
});

export default router;