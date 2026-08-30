import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import { notFound } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import notificationRoutes from "./routes/notification.routes.js";

dotenv.config();

connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	})
);

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use(notFound);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
	res.send("Backend is running...");
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});