import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import deleteFromCloudinary from "../utils/deleteFromCloudinary.js";

export const signupUser = async (req, res) => {
	try{
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
	}catch (error){
		console.error("Signup Error:", error.message);

		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
		});
	}
};

export const loginUser = async (req, res) => {
	try{
		const { email, password } = req.body;

	// Validation
	if (!email || !password) {
		return res.status(400).json({
			success: false,
			message: "Please provide email and password",
		});
	}

	// Find User
	const user = await User.findOne({ email });
	if (!user) {
		return res.status(400).json({
			success: false,
			message: "Invalid email or password",
		});
	}

	// Compare Password
	const isPasswordCorrect = await bcrypt.compare(
		password,
		user.password
    );

	// Generate Token
	if (!isPasswordCorrect) {
		return res.status(400).json({
			success: false,
			message: "Invalid email or password",
		});
	}
	generateToken(user._id, res);

	// Response
	return res.status(200).json({
		success: true,
		message: "Login successful",
	});
	}catch (error){
			console.error("Login Error:", error.message);

		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
		});
	}
};

export const logoutUser = (req, res) => {
	res.cookie("jwt", "", {
		maxAge: 0,
		httpOnly: true,
		sameSite: "strict",
		secure: process.env.NODE_ENV === "production",
	});

	return res.status(200).json({
		success: true,
		message: "Logged out successfully",
	});
};
export const getMe = async (req, res) => {
	return res.status(200).json({
		success: true,
		user: req.user,
	});
};
export const getUserProfile = async (req, res) => {
	try {
		const { username } = req.params;

		const user = await User.findOne({ username }).select("-password");

		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		return res.status(200).json({
			success: true,
			user,
		});
	} catch (error) {
		console.error("Get Profile Error:", error.message);

		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
		});
	}
};
export const updateProfile = async (req, res) => {
	let uploadedImage = null;
	let oldProfilePic = null;

	try {
		const { name, username, bio } = req.body;

		const user = await User.findById(req.user._id);

		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		// Store old profile picture before making changes
		oldProfilePic = user.profilePic;

		// Check if new username is already taken
		if (username && username !== user.username) {
			const existingUser = await User.findOne({ username });

			if (existingUser) {
				return res.status(400).json({
					success: false,
					message: "Username is already taken",
				});
			}
		}

		// Update text fields
		if (name) user.name = name;
		if (username) user.username = username;
		if (bio) user.bio = bio;

		// Upload new profile picture if provided
		if (req.file) {
			const result = await uploadToCloudinary(
				req.file.buffer,
				"threadshub/profile-pictures"
			);

			// Keep track of newly uploaded image
			// so we can delete it if MongoDB save fails
			uploadedImage = result;

			user.profilePic = {
				url: result.secure_url,
				publicId: result.public_id,
			};
		}

		// Save updated user to MongoDB
		await user.save();

		// MongoDB save successful,
		// so now delete the old image from Cloudinary
		if (
			uploadedImage &&
			oldProfilePic?.publicId
		) {
			await deleteFromCloudinary(
				oldProfilePic.publicId
			);
		}

		return res.status(200).json({
			success: true,
			message: "Profile updated successfully",
			user: {
				_id: user._id,
				name: user.name,
				username: user.username,
				email: user.email,
				bio: user.bio,
				profilePic: user.profilePic,
				followers: user.followers,
				following: user.following,
			},
		});
	} catch (error) {
		console.error("Update Profile Error:", error.message);

		// If username duplicate reaches MongoDB unique index
		if (error.code === 11000) {
			return res.status(400).json({
				success: false,
				message: "Username is already taken",
			});
		}

		// If Cloudinary upload succeeded but MongoDB save failed,
		// delete the newly uploaded image to prevent orphaned files
		if (uploadedImage?.public_id) {
			try {
				await deleteFromCloudinary(
					uploadedImage.public_id
				);
			} catch (deleteError) {
				console.error(
					"Failed to cleanup Cloudinary image:",
					deleteError.message
				);
			}
		}

		return res.status(500).json({
			success: false,
			message: "Internal Server Error",
		});
	}
};