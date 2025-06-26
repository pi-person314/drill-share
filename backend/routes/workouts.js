import { Router } from "express";
import Workout from "../schema/Workout.js";
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

        const workouts = await Workout.find({creator: id});
        res.status(200).json({data: workouts, message: `Fetched all workouts created by user!`});
    } catch (error) {
        res.status(500).json({message: "Server Error"});
        console.log(error);
    }
});

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const workout = await Workout.findById(id);
        if (!workout) {
            return res.status(404).json({message: "Workout not found."});
        }
        
        res.status(200).json({data: workout, message: `Fetched workout info!`});
    } catch (error) {
        res.status(500).json({message: "Server Error"});
        console.log(error);
    }
});

router.post("/", async (req, res) => {
    const workout = req.body;
    if (!workout.name || !workout.drills || !workout.creator) {
        return res.status(400).json({message: "Please fill in all required fields."});
    }

    try {
        const user = await User.findById(workout.creator);
        if (!user) {
            return res.status(404).json({message: "User not found."});
        }

        workout.drills.forEach(async drillId => {
            const drill = await Drill.findById(drillId);
            if (!drill) {
                return res.status(404).json({message: "One or more drills no longer exist."});
            }
        });

        const newWorkout = Workout(workout);
        await newWorkout.save();
        res.status(201).json({data: newWorkout, message: "Workout created!"});
    } catch (error) {
        res.status(500).json({message: "Server Error"});
        console.log(error);
    }
});

router.put("/:id", async (req, res) => {
    const id = req.params.id;
    const newData = req.body;
    if (!newData.name || !newData.drills || !newData.creator) {
        return res.status(400).json({message: "Please fill in all required fields."});
    }

    try {
        const workout = await Workout.findById(id);
        if (!workout) {
            return res.status(404).json({message: "Workout not found."});
        }

        newData.drills.forEach(async drillId => {
            const drill = await Drill.findById(drillId);
            if (!drill) {
                return res.status(404).json({message: "One or more drills no longer exist."});
            }
        });

        await Workout.findByIdAndUpdate(id, newData);
        
        res.status(200).json({data: newData, message: "Workout updated!"});
    } catch (error) {
        res.status(500).json({message: "Server Error"});
        console.log(error);
    }
});

router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const workout = await Workout.findByIdAndDelete(id);
        if (!workout) {
            return res.status(404).json({message: "Workout not found."});
        }

        res.status(200).json({data: workout, message: "Workout deleted!"});
    } catch (error) {
        res.status(500).json({message: "Server Error"});
        console.log(error);
    }
});

export default router;