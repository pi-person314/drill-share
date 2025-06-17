import { Router } from "express";
import User from "../schema/User.js";
import Drill from "../schema/Drill.js";
import Workout from "../schema/Workout.js";

const router = Router();

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({success: false, message: "User not found."});
        }

        res.status(200).json({success: true, data: user, message: "Fetched user info!"});
    } catch (error) {
        res.status(500).json({success: false, message: "Server Error"});
        console.log(error);
    }
});

router.post("/register", async (req, res) => {
    const user = req.body;
    if (!user.username || !user.password) {
        return res.status(400).json({success: false, message: "Please fill in all required fields."});
    }

    try {
        const exists = await User.findOne({username: user.username});
        if (exists) {
            return res.status(400).json({success: false, message: "User already exists."});
        }

        const newUser = await User(user);
        newUser.password = newUser.generateHash(user.password);

        await newUser.save();
        res.status(201).json({success: true, data: newUser, message: "User created!"});
    } catch (error) {
        res.status(500).json({success: false, message: "Server Error"});
        console.log(error);
    }
});

router.post("/login", async (req, res) => {
    const user = req.body;
    if (!user.username || !user.password) {
        return res.status(400).json({success: false, message: "Please fill in all required fields."});
    }

    try {
        const userData = await User.findOne({username: user.username});
        if (!userData) {
            return res.status(404).json({success: false, message: "User not found."});
        }

        if (!userData.validPassword(user.password)) {
            return res.status(400).json({success: false, message: "Invalid username or password"});
        }

        res.status(200).json({success: true, data: userData, message: "User validated!"});
    } catch (error) {
        res.status(500).json({success: false, message: "Server Error"});
        console.log(error);
    }
});

router.put("/:id", async (req, res) => {
    const id = req.params.id;
    const newData = req.body;
    if (!newData.username || !newData.password) {
        return res.status(400).json({success: false, message: "Please fill in all required fields."});
    }

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({success: false, message: "User not found."});
        }

        newData.password = user.generateHash(newData.password);
        await User.findByIdAndUpdate(id, newData);
        
        res.status(200).json({success: true, data: newData, message: "User updated!"});
    } catch (error) {
        res.status(500).json({success: false, message: "Server Error"});
        console.log(error);
    }
});

router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({success: false, message: "User not found."});
        }

        const drills = await Drill.find({creator: id});
        drills.forEach(async drill => await Drill.findByIdAndDelete(drill.id));

        const workouts = await Workout.find({creator: id});
        workouts.forEach(async workout => await Workout.findByIdAndDelete(workout.id));

        res.status(200).json({success: true, data: {user, drills}, message: "User deleted!"});
    } catch (error) {
        res.status(500).json({success: false, message: "Server Error"});
        console.log(error);
    }
});

export default router;