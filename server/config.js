import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 5000;
const SECRET = process.env.PORT || "some_secret_string";
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/sponsormatch";

const appConfig = {
  PORT,
  MONGO_URI,
};

const JWT_config = {
  JWT_SECRET: SECRET,
  JWT_EXPIRATION: process.env.JWT_EXPIRATION,
};

export { appConfig, JWT_config };
