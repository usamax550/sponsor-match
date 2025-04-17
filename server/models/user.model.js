import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import platforms from "../constants/platforms.js";

const socialMediaSchema = new Schema({
  platform: {
    type: String,
    enum: [...platforms],
    required: true,
  },
  screenshot: {
    type: String,
  },
  reach: {
    type: Number,
  },
  followers: {
    type: Number,
  },
});

const userSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: "Name is required",
  },
  email: {
    type: String,
    trim: true,
    unique: "Email already exists",
    lowercase: true,
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
    required: "Email is required",
  },
  bio: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required: "Password is required",
  },
  role: {
    type: String,
    enum: ["brand", "influencer"],
    required: true,
  },
  avatar: {
    type: String,
  },
  views: {
    type: Number,
    default: 0,
  },
  socialMedia: {
    type: [socialMediaSchema],
    default: [],
    validate: {
      validator: function (socialMediaArray) {
        const platforms = socialMediaArray.map((account) => account.platform);
        return new Set(platforms).size === platforms.length;
      },
      message: "You can only have one account per social media platform.",
    },
  },
  categories: {
    type: [String],
  },
});

userSchema.pre("save", async function (next) {
  if (!this.password || !this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.validatePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

const User = mongoose.model("User", userSchema);

export default User;
