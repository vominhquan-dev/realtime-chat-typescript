import express from "express";
import {
  createConversation,
  getConversations,
  getConversationById,
  addParticipantsToGroup,
  removeParticipantFromGroup,
  updateGroupInfo,
} from "./conversation.controller.js";
import { authenticate } from "../../shared/middleware/auth.middleware.js";

const router = express.Router();

// Create conversation (direct or group)
router.post("/", authenticate, createConversation);

// Get all conversations for user
router.get("/", authenticate, getConversations);

// Get specific conversation
router.get("/:conversationId", authenticate, getConversationById);

// Add participants to group
router.post(
  "/:conversationId/add-participants",
  authenticate,
  addParticipantsToGroup
);

// Remove participant from group
router.delete(
  "/:conversationId/participants/:participantId",
  authenticate,
  removeParticipantFromGroup
);

// Update group info (name, avatar)
router.put("/:conversationId/group-info", authenticate, updateGroupInfo);

export default router;
