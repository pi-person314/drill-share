import express from "express";
import { connectDB } from "./db.js";
import users from "./routes/users.js";
import drills from "./routes/drills.js";

const app = express();

app.use(express.json());
app.use("/api/users", users);
app.use("/api/drills", drills);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    connectDB();
    console.log(`Connected at http://localhost:${PORT}`);
});