import mongoose from "mongoose";

const drillSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    creator: {type: mongoose.SchemaTypes.ObjectId, ref: "User", required: true},
    usersLiked: {type: [mongoose.SchemaTypes.ObjectId], ref: "User", default: []},
    public: {type: Boolean, default: true},
    media: {type: [String], default: []},
    time: {type: Number, default: 0}, // suggested length (can be filter tag)
    sports: {type: [String], default: []}, // filter tag
    difficulty: {type: String, default: ""}, // filter tag
    likes: {type: Number, default: 0}
}, {
    timestamps: true
});

const Drill = mongoose.model("Drill", drillSchema);

export default Drill;