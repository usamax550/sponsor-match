import { GoogleGenAI } from "@google/genai";

import express from "express";
import User from "../models/user.model.js";
import CustomError from "../utils/customError.js";
import Chat from "../models/chat.model.js";
import mongoose from "mongoose";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  const userId = req.user._id;

  // First find all chats for this user
  const chats = await Chat.find({
    $or: [{ brand: userId }, { influencer: userId }],
  })
    .populate("brand", "name avatar")
    .populate("influencer", "name avatar")
    .sort({ lastMessage: -1 })
    .lean();

  // For each chat, fetch only the last message
  const chatsWithLastMessage = await Promise.all(
    chats.map(async (chat) => {
      const lastMessage = await Chat.findById(chat._id)
        .select({ messages: { $slice: -1 } })
        .lean();

      return {
        ...chat,
        messages: lastMessage.messages || [],
      };
    })
  );

  res.status(200).json({
    success: true,
    data: chatsWithLastMessage,
  });
});



router.post("/generate-content", async (req, res) => {
  const { content } = req.body;
const apiKey = process.env.GEMINI_API_KEY;
console.log("apiKey: ",apiKey);
  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContentStream({
      model: "gemini-2.0-flash",
      contents: content.parts[0].text,
    });


    let resultText = "";
    for await (const chunk of response) {
      resultText += chunk.text;
    }
    return res.status(200).json({ content: resultText });
  } catch (error) {
    console.error("Error from Gemini API:", error);
    return res
      .status(500)
      .json({ error: "Failed to generate response from Gemini API." });
  }
});


router.post("/send-message", authMiddleware, async (req, res) => {
  const { recipientId, content, attachment } = req.body;
  const sender = req.user;
  const senderId = sender._id;

  const recipient = await User.findById(recipientId);

  if (!recipient) {
    throw new CustomError(404, "Recipient not found");
  }

  if (sender.role === recipient.role) {
    throw new CustomError(400, "You can't chat with a user of the same role");
  }

  if (!content && !attachment) {
    throw new CustomError(
      400,
      "Either message content or attachment is required"
    );
  }

  const brand = sender.role === "brand" ? sender._id : recipient._id;
  const influencer = sender.role === "influencer" ? sender._id : recipient._id;

  // Find existing chat or create new one
  let chat = await Chat.findOne({ brand, influencer });

  if (!chat) {
    chat = await Chat.create({
      brand,
      influencer,
      messages: [],
      unreadBrand: 0,
      unreadInfluencer: 0,
    });
  }

  // Add new message
  const newMessage = {
    sender: senderId,
    content,
    attachment,
  };

  chat.messages.push(newMessage);
  chat.lastMessage = Date.now();
  if (sender.role === "brand") {
    chat.unreadInfluencer += 1;
  } else {
    chat.unreadBrand += 1;
  }
  await chat.save();

  const populatedChat = await Chat.findById(chat._id)
    .populate("brand", "name avatar")
    .populate("influencer", "name avatar")
    .populate({
      path: "messages",
      options: { sort: { timestamp: -1 } },
    });

  res.status(200).json({
    success: true,
    data: {
      chat: populatedChat,
      message: populatedChat.messages[populatedChat.messages.length - 1],
    },
  });
});

router.get("/with/:userId", authMiddleware, async (req, res) => {
  const currentUserId = req.user._id;
  const otherUserId = req.params.userId;
  const MESSAGES_LIMIT = 30;

  const otherUser = await User.findById(otherUserId);

  if (!otherUser) {
    throw new CustomError(404, "User not found");
  }

  if (otherUser._id === currentUserId) {
    throw new CustomError(400, "You can not chat with yourself");
  }

  const brand = req.user.role === "brand" ? currentUserId : otherUserId;
  const influencer =
    req.user.role === "influencer" ? currentUserId : otherUserId;

  const chat = await Chat.findOne({ brand, influencer })
    .populate("brand", "name avatar")
    .populate("influencer", "name avatar")
    .select("-messages")
    .lean();

  if (!chat) {
    return res.status(200).json({
      success: true,
      data: null,
    });
  }

  const messages = await Chat.findById(chat._id)
    .select("messages")
    .slice("messages", -MESSAGES_LIMIT)
    .lean();

  const updateData = {};
  if (req.user.role === "brand") {
    updateData.unreadBrand = 0;
  } else {
    updateData.unreadInfluencer = 0;
  }

  const updatedChat = await Chat.findByIdAndUpdate(chat._id, updateData, {
    new: true,
  });

  updatedChat.messages = messages.messages;

  res.status(200).json({
    success: true,
    data: updatedChat,
  });
});

router.get("/:chatId/messages", authMiddleware, async (req, res) => {
  const { chatId } = req.params;
  const userId = req.user._id;
  const { lastMessageId } = req.query;
  const MESSAGES_LIMIT = 30;

  if (!lastMessageId) {
    const messages = await Chat.findById(chatId)
      .select("messages")
      .slice("messages", -MESSAGES_LIMIT)
      .lean();

    const hasMore = messages.messages.length === MESSAGES_LIMIT;

    return res.status(200).json({
      success: true,
      data: messages.messages,
      hasMore,
    });
  }

  const chat = await Chat.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(chatId) } },
    { $unwind: "$messages" },
    {
      $match: {
        "messages._id": { $lt: new mongoose.Types.ObjectId(lastMessageId) },
      },
    },
    { $sort: { "messages.timestamp": -1 } },
    { $limit: MESSAGES_LIMIT },
    {
      $group: {
        _id: "$_id",
        messages: { $push: "$messages" },
      },
    },
  ]);

  const messages = chat[0]?.messages || [];
  const hasMore = messages.length === MESSAGES_LIMIT;

  res.status(200).json({
    success: true,
    data: messages.reverse(),
    hasMore,
  });
});

router.get("/user-info/:userId", async (req, res) => {
  const userId = req.params.userId;

  let user = await User.findById(userId).select("name role avatar");

  if (!user) {
    throw new CustomError("User not found");
  }

  return res.status(200).send({
    success: true,
    data: user,
  });
});

export default router;
