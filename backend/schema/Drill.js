import mongoose from "mongoose";

const drillSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    length: {type: Number, required: true},
    sports: {type: [String], default: []},
    media: {type: [String], default: []},
    public: {type: Boolean, default: false},
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, {
    timestamps: true
});

const Drill = mongoose.model("Drill", drillSchema);

export default Drill;