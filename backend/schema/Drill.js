import mongoose from "mongoose";

const drillSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    creator: {type: mongoose.SchemaTypes.ObjectId, ref: "User", required: true},
    type: {type: String, required: true},
    difficulty: {type: String, required: true},
    time: {type: Number, required: true},
    sports: {type: [String], default: []},
    media: {type: [mongoose.SchemaTypes.ObjectId], default: []},
    public: {type: Boolean, default: true},
    likes: {type: Number, default: 0},
    usersLiked: {type: [mongoose.SchemaTypes.ObjectId], ref: "User", default: []},
    usersSaved: {type: [mongoose.SchemaTypes.ObjectId], ref: "User", default: []},
}, {
    timestamps: true
});

const Drill = mongoose.model("Drill", drillSchema);

export default Drill;