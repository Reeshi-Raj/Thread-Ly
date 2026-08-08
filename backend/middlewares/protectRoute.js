import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
	try {
		const token = req.cookies.jwt;

		if (!token) {
			return res.status(401).json({
				success: false,
				message: "Unauthorized user - No Token Provided",
			});
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		const user = await User.findById(decoded.userId).select("-password");

		if (!user) {
			return res.status(401).json({
				success: false,
				message: "Unauthorized - User not found",
			});
		}

		req.user = user;

		next();
	} catch (error) {
		console.error("Protect Route Error:", error.message);

		return res.status(401).json({
			success: false,
			message: "Unauthorized - Invalid Token",
		});
	}
};

export default protectRoute;