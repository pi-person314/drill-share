import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema({
    name: {type: String, required: true},
    drills: {type: [mongoose.SchemaTypes.ObjectId], ref: "Drill", required: true},
    creator: {type: mongoose.SchemaTypes.ObjectId, ref: "User", required: true},
    notes: {type: String, default: ""},
    lastPracticed: Date
}, {
    timestamps: true
});

const Workout = mongoose.Model("Workout", workoutSchema);

export default Workout;