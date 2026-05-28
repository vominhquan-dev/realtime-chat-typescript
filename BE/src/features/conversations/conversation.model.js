import mongoose from "mongoose";

const participantsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const groupsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    avatarImage: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const lastMessageSchema = new mongoose.Schema(
  {
    messageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    sendBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const conversationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["direct", "group"],
      required: true,
    },
    participants: {
      type: [participantsSchema],
      required: true,
    },
    group: {
      type: groupsSchema,
    },
    lastMessageAt: {
      type: Date,
    },
    seenBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    lastMessage: {
      type: lastMessageSchema,
      default: null,
    },
    unreadCounts: {
      type: Map,
      of: Number,
    },
  },
  { timestamps: true }
);

conversationSchema.index({
  "participants.userId": 1,
  lastMessageAt: -1,
});

export default mongoose.model("Conversation", conversationSchema);
