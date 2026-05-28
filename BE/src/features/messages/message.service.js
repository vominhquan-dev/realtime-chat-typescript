import Message from "./message.model.js";
import Conversation from "../conversations/conversation.model.js";
import { MessagesError } from "../../shared/constants/messagesError.js";
import { updateConversationAfterCreateMessage } from "../../shared/utils/MessageHelper.js";

class MessageService {
  sendDirectMessage = async (
    senderId,
    recipientId,
    content,
    conversationId
  ) => {
    try {
      let conversation;

      // If conversationId provided, use it
      if (conversationId) {
        conversation = await Conversation.findById(conversationId);
        if (!conversation) {
          throw new Error("Conversation not found");
        }
      } else {
        // Check if conversation already exists between sender and recipient
        // Using sorted pair logic to find existing conversation
        const senderIdStr = senderId.toString();
        const recipientIdStr = recipientId.toString();
        const [user1, user2] =
          senderIdStr < recipientIdStr
            ? [senderIdStr, recipientIdStr]
            : [recipientIdStr, senderIdStr];

        // Find existing direct conversation
        conversation = await Conversation.findOne({
          type: "direct",
          "participants.userId": { $all: [user1, user2] },
        });

        // If no existing conversation, create new one
        if (!conversation) {
          conversation = await Conversation.create({
            type: "direct",
            participants: [
              { userId: senderId, joinedAt: new Date() },
              { userId: recipientId, joinedAt: new Date() },
            ],
            lastMessageAt: new Date(),
            unreadCounts: new Map([[recipientIdStr, 0]]),
          });
        }
      }

      const newMessage = await Message.create({
        conversationId: conversation._id,
        senderId,
        content,
        seenBy: [senderId],
        timestamp: new Date(),
      });

      // Use helper to update conversation
      updateConversationAfterCreateMessage(conversation, newMessage, senderId);
      await conversation.save();

      return newMessage;
    } catch (error) {
      throw new Error(error.message || MessagesError.ERROR.INTERNAL);
    }
  };

  sendGroupMessage = async (conversationId, senderId, content) => {
    try {
      if (!conversationId || !senderId || !content) {
        throw new Error("Missing required parameters");
      }

      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        throw new Error("Conversation not found");
      }

      if (conversation.type !== "group") {
        throw new Error("This is not a group conversation");
      }

      // Check if sender is a member
      const senderIdStr = senderId.toString();
      const isMember = conversation.participants.some(
        (p) => p.userId.toString() === senderIdStr
      );

      if (!isMember) {
        throw new Error("You are not a member of this group");
      }

      const newMessage = await Message.create({
        conversationId,
        senderId,
        content,
        seenBy: [senderId],
        timestamp: new Date(),
      });

      // Use helper to update conversation - increment unread for all members except sender
      updateConversationAfterCreateMessage(conversation, newMessage, senderId);
      await conversation.save();

      return newMessage;
    } catch (error) {
      throw new Error(error.message || MessagesError.ERROR.INTERNAL);
    }
  };

  markMessageAsSeen = async (messageId, userId) => {
    try {
      if (!messageId || !userId) {
        throw new Error("Missing messageId or userId");
      }

      const message = await Message.findById(messageId);
      if (!message) {
        throw new Error("Message not found");
      }

      const userIdStr = userId.toString();

      // Add user to seenBy if not already there
      if (!message.seenBy.includes(userIdStr)) {
        message.seenBy.push(userId);
        await message.save();
      }

      return message;
    } catch (error) {
      throw new Error(error.message || MessagesError.ERROR.INTERNAL);
    }
  };

  markConversationAsRead = async (conversationId, userId) => {
    try {
      if (!conversationId || !userId) {
        throw new Error("Missing conversationId or userId");
      }

      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        throw new Error("Conversation not found");
      }

      const userIdStr = userId.toString();

      // Mark all messages as seen by this user
      await Message.updateMany(
        { conversationId },
        { $addToSet: { seenBy: userId } }
      );

      // Reset unread count for this user
      conversation.unreadCounts.set(userIdStr, 0);
      await conversation.save();

      return conversation;
    } catch (error) {
      throw new Error(error.message || MessagesError.ERROR.INTERNAL);
    }
  };

  getConversationMessages = async (
    conversationId,
    userId,
    limit = 20,
    cursor = null
  ) => {
    try {
      if (!conversationId || !userId) {
        throw new Error("Missing conversationId or userId");
      }

      const query = { conversationId };

      // If cursor provided, fetch messages before this cursor timestamp
      if (cursor) {
        const cursorDate = new Date(cursor);
        query.timestamp = { $lt: cursorDate };
      }

      const messages = await Message.find(query)
        .sort({ timestamp: -1 })
        .limit(limit + 1) // Fetch one extra to determine if there are more
        .populate({
          path: "senderId",
          select: "username avatarImage",
        })
        .populate({
          path: "seenBy",
          select: "username",
        });

      // Determine if there are more messages
      let hasMore = false;
      let result = messages;

      if (messages.length > limit) {
        hasMore = true;
        result = messages.slice(0, limit);
      }

      // Get next cursor (timestamp of last message)
      const nextCursor =
        result.length > 0 ? result[result.length - 1].timestamp : null;

      // Mark as read for this user
      await this.markConversationAsRead(conversationId, userId);

      return {
        messages: result.reverse(),
        nextCursor: hasMore ? nextCursor : null,
        hasMore,
      };
    } catch (error) {
      throw new Error(error.message || MessagesError.ERROR.INTERNAL);
    }
  };

  // Send public message
  sendPublicMessage = async (senderId, content) => {
    try {
      const message = await Message.create({
        senderId,
        content,
        isPublic: true,
        timestamp: new Date(),
      });

      const populatedMessage = await message.populate("senderId", [
        "_id",
        "username",
        "email",
        "avatarImage",
      ]);

      return populatedMessage;
    } catch (error) {
      throw new Error(error.message || MessagesError.ERROR.INTERNAL);
    }
  };

  // Get public messages
  getPublicMessages = async (limit = 50, skip = 0) => {
    try {
      const messages = await Message.find({ isPublic: true })
        .populate("senderId", ["_id", "username", "email", "avatarImage"])
        .sort({ timestamp: -1 })
        .limit(limit)
        .skip(skip)
        .lean();

      const total = await Message.countDocuments({ isPublic: true });

      return {
        messages: messages.reverse(),
        total,
        limit,
        skip,
        hasMore: skip + limit < total,
      };
    } catch (error) {
      throw new Error(error.message || MessagesError.ERROR.INTERNAL);
    }
  };
}
export default new MessageService();
