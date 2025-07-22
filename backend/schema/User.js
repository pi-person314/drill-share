import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    photo: {type: String, default: ""},
    bio: {type: String, default: ""},
    sports: {type: [String], default: []},
    streak: {type: Number, default: 0},
    contribution: {type: Number, default: 0}
}, {
    timestamps: true
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;