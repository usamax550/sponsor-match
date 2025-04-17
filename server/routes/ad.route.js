import express from "express";
import categories from "../constants/categories.js";
import platforms from "../constants/platforms.js";
import roles from "../constants/roles.js";
import authMiddleware, { authorize } from "../middlewares/authMiddleware.js";
import BrandAd from "../models/brandAd.model.js";
import InfluencerAd from "../models/influencerAd.model.js";
import CustomError from "../utils/customError.js";
const router = express.Router();

const DEFAULT_LIMIT = 8;

router.post(
  "/brand/increment-influencer-count/:influencerAdId",
  authMiddleware,
  authorize(roles.BRAND),
  async (req, res) => {
    try {
      const { influencerAdId } = req.params;
      const { type } = req.body; // 'views', 'search', profile or 'chat'

      if (!["views", "search", "chat"].includes(type)) {
        return res.status(400).json({ success: false, message: "Invalid interaction type" });
      }

      const influencerAd = await InfluencerAd.findById(influencerAdId);
      if (!influencerAd) {
        return res.status(404).json({ success: false, message: "Influencer Ad not found" });
      }

      influencerAd.count[type] += 1;
      await influencerAd.save();

      res.status(200).json({
        success: true,
        message: `Influencer Ad ${type} count updated successfully`,
        data: influencerAd.count,
      });
    } catch (error) {
      console.error("Increment influencer count error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

router.post(
  "/influencer/increment-brand-count/:brandAdId",
  authMiddleware,
  authorize(roles.INFLUENCER),
  async (req, res) => {
    try {
      const { brandAdId } = req.params;
      const { type } = req.body;
      
      if (!["views", "search", "chat"].includes(type)) {
        return res.status(400).json({ success: false, message: "Invalid interaction type" });
      }
      
      const brandAd = await BrandAd.findById(brandAdId);
      if (!brandAd) {
        return res.status(404).json({ success: false, message: "Brand Ad not found" });
      }      
      brandAd.count[type] += 1;
      await brandAd.save();

      res.status(200).json({
        success: true,
        message: `Brand Ad ${type} count updated successfully`,
        data: brandAd.count,
      });
    } catch (error) {
      console.error("Increment brand count error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);


router.post(
  "/influencer/create-ad",
  authMiddleware,
  authorize(roles.INFLUENCER),
  async (req, res) => {
    const influencerId = req.user._id;
    if (req.user.role !== "influencer") {
      throw new CustomError(403, "Only influencers can create these ads");
    }
    const { title, description, thumbnailUrl, videoUrl, socialPlatforms } =
      req.body;

    if (
      !title ||
      !description ||
      !thumbnailUrl ||
      !videoUrl ||
      !socialPlatforms ||
      socialPlatforms.length === 0
    ) {
      return res.status(400).json({
        message:
          "All fields are required, including at least one social platform",
      });
    }

    const platformSet = new Set();
    const adPlatforms = [];

    for (const platformData of socialPlatforms) {
      if (!platforms.includes(platformData.platform)) {
        throw new CustomError(
          400,
          `Invalid platform: ${platformData.platform}`
        );
      }
      if (platformSet.has(platformData.platform)) {
        throw new CustomError(
          400,
          `Duplicate platform: ${platformData.platform}. Each platform can only be added once.`
        );
      }
      platformSet.add(platformData.platform);

      if (typeof platformData.reach !== "number" || platformData.reach < 0) {
        throw new CustomError(
          400,
          `Invalid reach for platform ${platformData.platform}. Reach must be a non-negative number.`
        );
      }
      if (
        typeof platformData.followers !== "number" ||
        platformData.followers < 0
      ) {
        throw new CustomError(
          400,
          `Invalid followers for platform ${platformData.platform}. Followers must be a non-negative number.`
        );
      }
      adPlatforms.push({
        platform: platformData.platform,
        reach: platformData.reach,
        followers: platformData.followers,
      });
    }

    const newAd = new InfluencerAd({
      influencer: influencerId,
      title,
      description,
      thumbnailUrl,
      videoUrl,
      socialPlatforms: adPlatforms,
    });

    const savedAd = await newAd.save();

    res
      .status(201)
      .json({ message: "Influencer ad created successfully", ad: savedAd });
  }
);


router.post(
  "/brand/create-ad",
  authMiddleware,
  authorize(roles.BRAND),
  async (req, res) => {
    const brandId = req.user._id;
    if (req.user.role !== "brand") {
      throw new CustomError(403, "Only brands can create these ads");
    }
    const { name, description, productCategory, brandLogoUrl, thumbnail } =
      req.body;

    if (
      !name ||
      !description ||
      !productCategory ||
      !brandLogoUrl ||
      !thumbnail
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // add check to verify the category
    if (!categories.includes(productCategory)) {
      throw new CustomError(400, "Invalid product category");
    }

    const newBrandAd = await BrandAd.create({
      brandId,
      name,
      description,
      productCategory,
      brandLogoUrl,
      thumbnail,
    });

    res.status(201).json({
      message: "Brand ad created successfully",
      data: newBrandAd,
    });
  }
);

router.get(
  "/brand/ads",
  authMiddleware,
  authorize(roles.INFLUENCER),
  async (req, res) => {
    const { page = 1, limit = DEFAULT_LIMIT, category, search } = req.query;

    if (category && !categories.includes(category)) {
      throw new CustomError(400, "Invalid category");
    }

    const query = {};
    if (category) {
      query.productCategory = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Execute query with pagination
    const brandAds = await BrandAd.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const totalDocs = await BrandAd.countDocuments(query);

    res.status(200).json({
      data: brandAds,
      currentPage: +page,
      totalPages: Math.ceil(totalDocs / limit),
      totalDocs,
      hasNextPage: page * limit < totalDocs,
      hasPrevPage: page > 1,
    });
  }
);

router.get(
  "/influencer/ads",
  authMiddleware,
  authorize(roles.BRAND),
  async (req, res) => {
    const {
      page = 1,
      limit = DEFAULT_LIMIT,
      minFollowers,
      maxFollowers,
      minReach,
      maxReach,
      platform,
      search,
    } = req.query;

    // Build pipeline for aggregation
    const pipeline = [];

    // Match by platform if specified
    if (platform) {
      pipeline.push({
        $match: {
          "socialPlatforms.platform": platform,
        },
      });
    }

    // Filter by followers range
    if (minFollowers || maxFollowers) {
      pipeline.push({
        $match: {
          socialPlatforms: {
            $elemMatch: {
              followers: {
                ...(minFollowers && { $gte: parseInt(minFollowers) }),
                ...(maxFollowers && { $lte: parseInt(maxFollowers) }),
              },
            },
          },
        },
      });
    }

    // Filter by reach range
    if (minReach || maxReach) {
      pipeline.push({
        $match: {
          socialPlatforms: {
            $elemMatch: {
              reach: {
                ...(minReach && { $gte: parseInt(minReach) }),
                ...(maxReach && { $lte: parseInt(maxReach) }),
              },
            },
          },
        },
      });
    }

    // Apply search if query is provided (only searches title & description)
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { title: { $regex: search, $options: "i" } }, // Case-insensitive search
            { description: { $regex: search, $options: "i" } },
          ],
        },
      });
    }

    // Add pagination
    pipeline.push({ $skip: (page - 1) * limit }, { $limit: parseInt(limit) });

    // Get ads with populated influencer data
    const ads = await InfluencerAd.aggregate(pipeline);

    // Get total count for pagination
    const totalDocs = await InfluencerAd.aggregate(pipeline.slice(0, -2)).count(
      "total"
    );

    res.status(200).json({
      data: ads,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalDocs[0]?.total / limit) || 0,
      totalDocs: totalDocs[0]?.total || 0,
      hasNextPage: page * limit < (totalDocs[0]?.total || 0),
      hasPrevPage: page > 1,
    });
  }
);

router.get("/my-ads", authMiddleware, async (req, res) => {
  const { _id: userId, role } = req.user;
  const { page = 1, limit = DEFAULT_LIMIT } = req.query;

  let query = {};
  let Model;

  if (role === "brand") {
    query = { brandId: userId };
    Model = BrandAd;
  } else {
    query = { influencer: userId };
    Model = InfluencerAd;
  }

  const myAds = await Model.find(query)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  const totalDocs = await Model.countDocuments(query);

  res.status(200).json({
    success: true,
    message: "Ads retrieved successfully",
    data: myAds,
    currentPage: +page,
    totalPages: Math.ceil(totalDocs / limit),
    totalDocs,
    hasNextPage: page * limit < totalDocs,
    hasPrevPage: page > 1,
  });
});

router.get("/:adId", authMiddleware, async (req, res) => {
  const { adId } = req.params;

  let ad = await InfluencerAd.findById(adId)
    .populate("influencer", "-password")
    .lean();

  if (!ad) {
    ad = await BrandAd.findById(adId).populate("brandId", "-password").lean();
  }

  if (!ad) {
    throw new CustomError(404, "Ad not found");
  }

  res.status(200).json({
    success: true,
    data: ad,
  });
});


router.get(
  "/influencer/get-ads/:userId",
  authMiddleware,
  authorize(roles.INFLUENCER),
  async (req, res) => {
    try {
      const { userId } = req.params;

      const ads = await InfluencerAd.find({ influencer: userId }).populate("influencer", "name avatar");

      // Initialize counters
      let totalViews = 0;
      let totalSearches = 0;
      let totalChats = 0;

      ads.forEach(ad => {
        totalViews += ad.count?.views || 0;
        totalSearches += ad.count?.search || 0;
        totalChats += ad.count?.chat || 0;
      });

      res.status(200).json({
        success: true,
        message: "Influencer ads fetched successfully",
        data: {
          ads,
          totalViews,
          totalSearches,
          totalChats
        }
      });
    } catch (error) {
      console.error("Error fetching influencer ads:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);





router.get(
  "/brand/get-ads/:userId",
  authMiddleware,
  authorize(roles.BRAND),
  async (req, res) => {
    try {
      const { userId } = req.params;

      const ads = await BrandAd.find({ brandId: userId }).populate("brandId", "name brandLogoUrl");

      // Initialize counters
      let totalViews = 0;
      let totalSearches = 0;
      let totalChats = 0;

      ads.forEach(ad => {
        totalViews += ad.count?.views || 0;
        totalSearches += ad.count?.search || 0;
        totalChats += ad.count?.chat || 0;
      });

      res.status(200).json({
        success: true,
        message: "Brand ads fetched successfully",
        data: {
          ads,
          totalViews,
          totalSearches,
          totalChats
        }
      });
    } catch (error) {
      console.error("Error fetching brand ads:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

export default router;
