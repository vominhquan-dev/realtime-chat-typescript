import express from "express";
import userRoutes from "../features/users/user.routes.js";
import authRoutes from "../features/auth/auth.routes.js";
import friendRoutes from "../features/friends/friend.routes.js";
import messageRoutes from "../features/messages/message.routes.js";
import conversationRoutes from "../features/conversations/conversation.routes.js";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/friends", friendRoutes);
router.use("/messages", messageRoutes);
router.use("/conversations", conversationRoutes);

export default router;
