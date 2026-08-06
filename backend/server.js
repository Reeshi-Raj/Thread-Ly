import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

connectDB();

const app = express();
app.use(express.json());

app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
	res.send("Backend is running...");
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});