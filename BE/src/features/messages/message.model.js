import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    index: true,
  },
  isPublic: {
    type: Boolean,
    default: false,
    index: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    trim: true,
  },
  imgUrl: {
    type: String,
    trim: true,
  },
  seenBy: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
});
messageSchema.index({ conversationId: 1, timestamp: -1 });
messageSchema.index({ isPublic: 1, timestamp: -1 });

export default mongoose.model("Message", messageSchema);
