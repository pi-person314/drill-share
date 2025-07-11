import mongoose from "mongoose";

const drillSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    creator: {type: mongoose.SchemaTypes.ObjectId, ref: "User", required: true},
    usersLiked: {type: [mongoose.SchemaTypes.ObjectId], ref: "User", default: []},
    usersSaved: {type: [mongoose.SchemaTypes.ObjectId], ref: "User", default: []},
    public: {type: Boolean, default: true},
    media: {type: [String], default: []},
    time: {type: Number, default: 0},
    sports: {type: [String], default: []},
    difficulty: {type: String, default: ""},
    likes: {type: Number, default: 0}
}, {
    timestamps: true
});

const Drill = mongoose.model("Drill", drillSchema);

export default Drill;