import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import User from "../models/user.model.js";
import CustomError from "../utils/customError.js";
import categoriesList from "../constants/categories.js";
const router = express.Router();


router.post("/increment-views/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Find the user and increment views
    const user = await User.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true } // to return updated user
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "View count incremented successfully",
      views: user.views,
    });
  } catch (err) {
    console.error("Error incrementing views:", err);
    res.status(500).json({ error: "Server error" });
  }
});



router.put("/update-profile", authMiddleware, async (req, res) => {
  const userId = req.user._id;
  const updateData = { ...req.body };

  delete updateData.email;
  delete updateData.role;
  delete updateData.password;

  const existingUser = await req.user;

  if (existingUser.role === "brand" && updateData.socialMedia) {
    delete updateData.socialMedia;
  }

  if (existingUser.role === "influencer" && updateData.categories) {
    delete updateData.categories;
  }

  if (updateData.categories) {
    const isValidCategories = updateData.categories.every((cat) =>
      categoriesList.includes(cat)
    );

    if (!isValidCategories) {
      throw new CustomError(400, "Invalid Category data");
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    message: "User updated successfully",
    data: updatedUser,
  });
});

router.get("/get-profile-info", authMiddleware, async (req, res) => {
  res.status(200).json({ user: req.user });
});

router.get("/get-profile/:id", authMiddleware, async (req, res) => {
  const userId = req.params.id;

  const user = await User.findById(userId);

  if (!user) {
    throw new CustomError(404, "User not found");
  }

  res.status(200).json({ data: user });
});



export default router;
