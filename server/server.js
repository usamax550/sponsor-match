import express from "express";
import { appConfig } from "./config.js";
import mongoose from "mongoose";
import "express-async-errors";
import authRouter from "./routes/auth.route.js";
import adRouter from "./routes/ad.route.js";
import profileRouter from "./routes/profile.route.js";
import chatRouter from "./routes/chat.route.js";
import categoryRouter from "./routes/category.route.js";
import errorHandler from "./middlewares/errorHandler.js";
import notFound from "./middlewares/notFound.js";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_, res) => {
  res.status(200).send("Hello World!");
});

app.use("/auth", authRouter);
app.use("/category", categoryRouter);
app.use("/ad", adRouter);
app.use("/profile", profileRouter);
app.use("/chat", chatRouter);

app.use(errorHandler);
app.use(notFound);

const start = async () => {
  try {
    await mongoose.connect(appConfig.MONGO_URI);
    console.log("Connected to Database");
    app.listen(appConfig.PORT, () => {
      console.log(`Server is running on port ${appConfig.PORT}`);
    });
  } catch (error) {
    console.log("Error starting server: ", error);
    process.exit(1);
  }
};

start();
