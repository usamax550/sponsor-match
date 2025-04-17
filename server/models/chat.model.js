import mongoose from "mongoose";
const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
    },
    attachment: {
      type: String, // URL to the attachment
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    validate: {
      validator: function (message) {
        return message.content || message.attachment;
      },
      message: "Either content or attachment is required",
    },
  }
);

const chatSchema = new Schema({
  brand: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    validate: {
      validator: async function (userId) {
        const user = await mongoose.model("User").findById(userId);
        return user && user.role === "brand";
      },
      message: 'Brand user must have role "brand"',
    },
  },
  influencer: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    validate: {
      validator: async function (userId) {
        const user = await mongoose.model("User").findById(userId);
        return user && user.role === "influencer";
      },
      message: 'Influencer user must have role "influencer"',
    },
  },
  messages: [messageSchema],
  lastMessage: {
    type: Date,
    default: Date.now,
  },
  unreadBrand: {
    type: Number,
    default: 0,
  },
  unreadInfluencer: {
    type: Number,
    default: 0,
  },
});

chatSchema.index({ brand: 1, influencer: 1 }, { unique: true });

chatSchema.pre("save", function (next) {
  if (this.messages.length > 0) {
    this.lastMessage = this.messages[this.messages.length - 1].timestamp;
  }
  next();
});

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
