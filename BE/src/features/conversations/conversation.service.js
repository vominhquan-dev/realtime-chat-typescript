import Conversation from "./conversation.model.js";
import User from "../users/user.model.js";
import { MessagesError } from "../../shared/constants/messagesError.js";

class ConversationService {
  createConversation = async ({ participantsId, type, name, createdBy }) => {
    try {
      if (!participantsId || !Array.isArray(participantsId)) {
        throw new Error("Participants must be an array");
      }

      if (participantsId.length === 0) {
        throw new Error("At least one participant is required");
      }

      // Validate all participants exist
      const participants = await User.find({
        _id: { $in: participantsId },
      }).select("_id");

      if (participants.length !== participantsId.length) {
        throw new Error("Some participants not found");
      }

      // Create participants array with joinedAt
      const participantsArray = participantsId.map((userId) => ({
        userId,
        joinedAt: new Date(),
      }));

      // Add creator if not already in participants
      const createdByStr = createdBy.toString();
      const createdByInParticipants = participantsArray.some(
        (p) => p.userId.toString() === createdByStr
      );

      if (!createdByInParticipants) {
        participantsArray.push({
          userId: createdBy,
          joinedAt: new Date(),
        });
      }

      // Initialize unreadCounts for all participants
      const unreadCounts = new Map();
      participantsArray.forEach((p) => {
        unreadCounts.set(p.userId.toString(), 0);
      });

      const conversationData = {
        type,
        participants: participantsArray,
        lastMessageAt: new Date(),
        unreadCounts,
      };

      // Add group info if group type
      if (type === "group") {
        if (!name || name.trim() === "") {
          throw new Error("Group name is required for group conversations");
        }
        conversationData.group = {
          name: name.trim(),
          avatarImage: null,
        };
      }

      const conversation = await Conversation.create(conversationData);

      return conversation;
    } catch (error) {
      throw new Error(error.message || MessagesError.ERROR.INTERNAL);
    }
  };

  getConversations = async (userId) => {
    try {
      if (!userId) throw new Error("User ID is required");

      const userIdStr = userId.toString();

      const conversations = await Conversation.find({
        "participants.userId": userIdStr,
      })
        .populate({
          path: "participants.userId",
          select: "username email avatarImage",
        })
        .populate({
          path: "lastMessage.sendBy",
          select: "username avatarImage",
        })
        .sort({ lastMessageAt: -1 });

      return conversations;
    } catch (error) {
      throw new Error(error.message || MessagesError.ERROR.INTERNAL);
    }
  };

  getConversationById = async (conversationId, userId) => {
    try {
      if (!conversationId || !userId) {
        throw new Error("Conversation ID and User ID are required");
      }

      const userIdStr = userId.toString();

      const conversation = await Conversation.findById(conversationId).populate(
        {
          path: "participants.userId",
          select: "username email avatarImage",
        }
      );

      if (!conversation) {
        throw new Error("Conversation not found");
      }

      // Check if user is participant
      const isParticipant = conversation.participants.some(
        (p) => p.userId._id.toString() === userIdStr
      );

      if (!isParticipant) {
        throw new Error("You are not a member of this conversation");
      }

      return conversation;
    } catch (error) {
      throw new Error(error.message || MessagesError.ERROR.INTERNAL);
    }
  };

  addParticipantsToGroup = async (conversationId, userIds, userId) => {
    try {
      if (!conversationId || !userIds || !Array.isArray(userIds)) {
        throw new Error("Invalid parameters");
      }

      const userIdStr = userId.toString();

      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        throw new Error("Conversation not found");
      }

      if (conversation.type !== "group") {
        throw new Error("Can only add participants to group conversations");
      }

      // Check if requester is a participant
      const isParticipant = conversation.participants.some(
        (p) => p.userId.toString() === userIdStr
      );

      if (!isParticipant) {
        throw new Error("You are not a member of this conversation");
      }

      // Validate new participants exist
      const newParticipants = await User.find({
        _id: { $in: userIds },
      }).select("_id");

      if (newParticipants.length !== userIds.length) {
        throw new Error("Some participants not found");
      }

      // Add new participants
      userIds.forEach((userId) => {
        const userExists = conversation.participants.some(
          (p) => p.userId.toString() === userId.toString()
        );

        if (!userExists) {
          conversation.participants.push({
            userId,
            joinedAt: new Date(),
          });

          // Add to unreadCounts
          conversation.unreadCounts.set(userId.toString(), 0);
        }
      });

      await conversation.save();

      return conversation;
    } catch (error) {
      throw new Error(error.message || MessagesError.ERROR.INTERNAL);
    }
  };

  removeParticipantFromGroup = async (
    conversationId,
    participantId,
    userId
  ) => {
    try {
      if (!conversationId || !participantId) {
        throw new Error("Conversation ID and Participant ID are required");
      }

      const userIdStr = userId.toString();
      const participantIdStr = participantId.toString();

      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        throw new Error("Conversation not found");
      }

      if (conversation.type !== "group") {
        throw new Error(
          "Can only remove participants from group conversations"
        );
      }

      // Check if requester is a participant
      const isParticipant = conversation.participants.some(
        (p) => p.userId.toString() === userIdStr
      );

      if (!isParticipant) {
        throw new Error("You are not a member of this conversation");
      }

      // Remove participant
      conversation.participants = conversation.participants.filter(
        (p) => p.userId.toString() !== participantIdStr
      );

      // Remove from unreadCounts
      conversation.unreadCounts.delete(participantIdStr);

      await conversation.save();

      return conversation;
    } catch (error) {
      throw new Error(error.message || MessagesError.ERROR.INTERNAL);
    }
  };

  updateGroupInfo = async (conversationId, { name, avatarImage }, userId) => {
    try {
      if (!conversationId) throw new Error("Conversation ID is required");

      const userIdStr = userId.toString();

      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        throw new Error("Conversation not found");
      }

      if (conversation.type !== "group") {
        throw new Error("Can only update info for group conversations");
      }

      // Check if requester is a participant
      const isParticipant = conversation.participants.some(
        (p) => p.userId.toString() === userIdStr
      );

      if (!isParticipant) {
        throw new Error("You are not a member of this conversation");
      }

      // Update group info
      if (name) conversation.group.name = name.trim();
      if (avatarImage) conversation.group.avatarImage = avatarImage;

      await conversation.save();

      return conversation;
    } catch (error) {
      throw new Error(error.message || MessagesError.ERROR.INTERNAL);
    }
  };
}

export default new ConversationService();
