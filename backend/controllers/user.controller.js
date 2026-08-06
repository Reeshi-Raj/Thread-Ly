import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export const signupUser = async (req, res) => {
	const { name, username, email, password } = req.body;

	if (!name || !username || !email || !password) {
		return res.status(400).json({
			success: false,
			message: "Please fill all required fields",
		});
	}

	const existingUser = await User.findOne({
	$or: [{ email }, { username }],
    });

    if (existingUser) {
	    return res.status(400).json({
		    success: false,
		    message: "User already exists",
	    });
    }
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
	    name,
	    username,
	    email,
	    password: hashedPassword,
    });
    await newUser.save();
	generateToken(newUser._id, res);

	return res.status(201).json({
	    success: true,
	    message: "User created successfully",
    });
};