import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import users from "./routes/users.js";
import drills from "./routes/drills.js";
import training from "./routes/training.js";
import files from "./routes/files.js";

const app = express();

app.use(express.json());
app.use(cors({origin: process.env.FRONTEND || "http://localhost:3000", credentials: true}));
app.use("/api/users", users);
app.use("/api/drills", drills);
app.use("/api/training", training);
app.use("/api/files", files);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    connectDB();
    console.log(`Connected at http://localhost:${PORT}`);
});