import express from "express";
import ProductCategory from "../models/category.model.js";
import CustomError from "../utils/customError.js";
import authMiddleware, { authorize } from "../middlewares/authMiddleware.js";
import categories from "../constants/categories.js";
const router = express.Router();

// Route for old requirements. Not used anymore
router.post(
  "/create-category-old",
  authMiddleware,
  authorize("None"),
  async (req, res) => {
    const { name, description } = req.body;

    if (!name) {
      throw new CustomError(400, "Category name is required");
    }

    const existingCategory = await ProductCategory.findOne({ name });
    if (existingCategory) {
      throw new CustomError(400, `Category with name '${name}' already exists`);
    }
    const newCategory = new ProductCategory({
      name,
      description,
    });

    const savedCategory = await newCategory.save();

    res.status(201).json({
      message: "Category created successfully",
      data: savedCategory,
    });
  }
);

// Route for old requirements. Not used anymore
router.get(
  "/get-categories-old",
  authMiddleware,
  authorize("None"),
  async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const skip = (page - 1) * limit;

    const filter = {};
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const total = await ProductCategory.countDocuments(filter);

    const categories = await ProductCategory.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      data: categories,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    });
  }
);

router.get("/get-categories", async (req, res) => {
  res.status(200).json({ categories });
});

export default router;
