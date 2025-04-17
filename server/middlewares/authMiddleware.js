import jwt from "jsonwebtoken";
import { JWT_config } from "../config.js";
import User from "../models/user.model.js";
import CustomError from "../utils/customError.js";

const authMiddleware = async (req, _, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new CustomError(401, "Authentication required");
  }

  const token = authHeader.split(" ")[1];

  const decoded = jwt.verify(token, JWT_config.JWT_SECRET);

  const user = await User.findById(decoded.userId).select("-password").lean();

  if (!user) {
    throw new CustomError(401, "Invalid authentication");
  }

  req.user = user;
  next();
};

const authorize = (...allowedRoles) => {
  return (req, _, next) => {
    if (!req.user || !req.user.role) {
      throw new CustomError(403, "Access forbidden");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new CustomError(403, "You are not authorized to access this route");
    }

    next();
  };
};

export default authMiddleware;

export { authorize };
