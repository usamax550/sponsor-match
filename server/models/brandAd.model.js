import mongoose from "mongoose";

const countSchema = new mongoose.Schema({
  views: { type: Number, default: 0 },
  search: { type: Number, default: 0 },
  chat: { type: Number, default: 0 },
}, { _id: false }); // No _id needed for subdoc

const brandAdSchema = new mongoose.Schema({
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  brandLogoUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  productCategory: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  count: {
    type: countSchema,
    default: () => ({ views: 0, search: 0, chat: 0 }),
  },
});

const BrandAd = mongoose.model("BrandAd", brandAdSchema);

export default BrandAd;
