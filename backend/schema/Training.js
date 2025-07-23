import mongoose from "mongoose";

const trainingSchema = new mongoose.Schema({
    title: {type: String, required: true},
    drills: {type: [mongoose.SchemaTypes.ObjectId], ref: "Drill", required: true},
    creator: {type: mongoose.SchemaTypes.ObjectId, ref: "User", required: true},
    videos: {type: [String], default: []},
    notes: {type: [String], default: []},
    visited: {type: Number, default: 1},
}, {
    timestamps: true
});

const Training = mongoose.model("Training", trainingSchema);

export default Training;