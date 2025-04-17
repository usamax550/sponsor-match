import express from "express";
import jwt from "jsonwebtoken";
import CustomError from "../utils/customError.js";
import User from "../models/user.model.js";
import { JWT_config } from "../config.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { name, email, password, role, avatar, socialMedia } = req.body;

  if (!name || !email || !password || !role) {
    throw new CustomError(
      400,
      "Please provide name, email, password, and role."
    );
  }

  if (!["brand", "influencer"].includes(role)) {
    throw new CustomError(
      400,
      'Invalid role. Role must be either "brand" or "influencer".'
    );
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new CustomError(400, "Email already exists.");
  }

  const newUser = new User({
    name,
    email,
    password: password,
    role,
    avatar: avatar || "",
    socialMedia: role === "influencer" ? socialMedia || [] : [],
  });

  await newUser.save();

  const token = jwt.sign(
    { userId: newUser._id, role: newUser.role },
    JWT_config.JWT_SECRET,
    { expiresIn: JWT_config.JWT_EXPIRATION }
  );

  const userResponse = newUser.toObject();
  delete userResponse.password;

  res
    .status(201)
    .json({ message: "User created successfully", token, user: userResponse });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("backend email: ", email, "password: ", password);

  if (!email || !password) {
    throw new CustomError(400, "Please provide email and password.");
  }

  // Check if the user exists
  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError(401, "Invalid email or password.");
  }

  // Check if the password is correct
  const isMatch = await user.validatePassword(password);
  if (!isMatch) {
    throw new CustomError(401, "Invalid email or password.");
  }

  // Generate a JWT token
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    JWT_config.JWT_SECRET,
    { expiresIn: JWT_config.JWT_EXPIRATION}
  );

  // Respond with the token and user details (excluding the password)
  const userResponse = user.toObject();
  delete userResponse.password;
  res
    .status(200)
    .json({ message: "Login successful", token, user: userResponse });
});

export default router;
