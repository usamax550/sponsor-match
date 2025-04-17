import mongoose from "mongoose";
import platforms from "../constants/platforms.js";

const countSchema = new mongoose.Schema({
  views: { type: Number, default: 0 },
  search: { type: Number, default: 0 },
  chat: { type: Number, default: 0 },
}, { _id: false }); // No _id needed for subdoc

const socialPlatformSchema = new mongoose.Schema({
  platform: {
    type: String,
    enum: [...platforms],
    required: true,
  },
  reach: {
    type: Number,
    required: true,
  },
  followers: {
    type: Number,
    required: true,
  },
});

const influencerAdSchema = new mongoose.Schema(
  {
    influencer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    socialPlatforms: {
      type: [socialPlatformSchema],
      required: true,
      validate: {
        validator: function (platforms) {
          return platforms.length > 0;
        },
        message: "At least one social platform is required",
      },
    },
    count: {
      type: countSchema,
      default: () => ({ views: 0, search: 0, chat: 0}),
    },
  },
  {
    timestamps: true,
  }
);

const InfluencerAd = mongoose.model("InfluencerAd", influencerAdSchema);

export default InfluencerAd;
