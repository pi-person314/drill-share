import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import users from "./routes/users.js";
import drills from "./routes/drills.js";
import workouts from "./routes/workouts.js";

const app = express();

app.use(express.json({ limit: "5mb" }));
app.use(cors());
app.use("/api/users", users);
app.use("/api/drills", drills);
app.use("/api/workouts", workouts);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    connectDB();
    console.log(`Connected at http://localhost:${PORT}`);
});