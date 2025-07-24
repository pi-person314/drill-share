import { Router } from "express";
import Training from "../schema/Training.js";
import User from "../schema/User.js";
import Drill from "../schema/Drill.js";

const router = Router();

router.get("/created/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({message: "User not found."});
        }

        const trainings = await Training.find({creator: id}).populate({path: "drills", populate: {path: "creator", select: "username"}});
        res.status(200).json({data: trainings, message: `Fetched all training sessions created by user!`});
    } catch (error) {
        res.status(500).json({message: "Server Error"});
        console.log(error);
    }
});

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const training = await Training.findById(id).populate({path: "drills", populate: {path: "creator", select: "username"}});
        if (!training) {
            return res.status(404).json({message: "Training session not found."});
        }
        
        res.status(200).json({data: training, message: `Fetched training session info!`});
    } catch (error) {
        res.status(500).json({message: "Server Error"});
        console.log(error);
    }
});

router.post("/", async (req, res) => {
    const training = req.body;
    if (!training.title || !training.drills || !training.creator || !training.sport) {
        return res.status(400).json({message: "Please fill in all required fields."});
    }

    try {
        const user = await User.findById(training.creator);
        if (!user) {
            return res.status(404).json({message: "User not found."});
        }

        training.drills.forEach(async drillId => {
            const drill = await Drill.findById(drillId);
            if (!drill) {
                return res.status(404).json({message: "One or more drills no longer exist."});
            }
        });

        const newTraining = Training(training);
        await newTraining.save();
        res.status(201).json({data: newTraining, message: "Training session created!"});
    } catch (error) {
        res.status(500).json({message: "Server Error"});
        console.log(error);
    }
});

router.put("/:id", async (req, res) => {
    const id = req.params.id;
    const newData = req.body;
    if (!newData.title || !newData.drills || !newData.creator || !newData.sport) {
        return res.status(400).json({message: "Please fill in all required fields."});
    }

    try {
        const training = await Training.findById(id);
        if (!training) {
            return res.status(404).json({message: "Training session not found."});
        }

        newData.drills.forEach(async drillId => {
            const drill = await Drill.findById(drillId);
            if (!drill) {
                return res.status(404).json({message: "One or more drills no longer exist."});
            }
        });

        await Training.findByIdAndUpdate(id, newData);
        
        res.status(200).json({data: newData, message: "Training session updated!"});
    } catch (error) {
        res.status(500).json({message: "Server Error"});
        console.log(error);
    }
});

router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const training = await Training.findByIdAndDelete(id);
        if (!training) {
            return res.status(404).json({message: "Training session not found."});
        }

        res.status(200).json({data: training, message: "Training session deleted!"});
    } catch (error) {
        res.status(500).json({message: "Server Error"});
        console.log(error);
    }
});

export default router;