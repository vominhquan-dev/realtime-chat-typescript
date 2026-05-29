// Store active users and their socket IDs
const activeUsers = new Map(); // userId -> socketId
const PUBLIC_CONVERSATION_NAME = "Public Chat";

// Get or create the public conversation
const getOrCreatePublicConversation = async (Conversation) => {
  let publicConv = await Conversation.findOne({
    type: "group",
    "group.name": PUBLIC_CONVERSATION_NAME,
  });

  if (!publicConv) {
    publicConv = await Conversation.create({
      type: "group",
      group: {
        name: PUBLIC_CONVERSATION_NAME,
        avatarImage: null,
      },
      participants: [],
      lastMessageAt: new Date(),
      unreadCounts: new Map(),
    });
    console.log(`🏠 Created Public Chat conversation: ${publicConv._id}`);
  }

  return publicConv;
};

export const setupSocket = (io, messageService, conversationService) => {
  io.on("connection", (socket) => {
    console.log(`📱 New connection: ${socket.id}`);

    // User joins - store userId and socketId mapping
    socket.on("user_join", (userId) => {
      activeUsers.set(userId, socket.id);
      socket.userId = userId;
      console.log(
        `✅ User ${userId} joined. Active users: ${activeUsers.size}`,
      );

      // Broadcast online status
      io.emit("user_online", { userId, status: "online" });

      // Broadcast updated user count
      io.emit("online_users", Array.from(activeUsers.keys()));
    });

    // ===== PUBLIC CHAT =====
    // Send public message - Save to DB + Broadcast to everyone
    socket.on("send_public_message", async (data) => {
      try {
        const { content, senderId, username, _id: clientMsgId, avatar } = data;

        if (!content || !senderId) {
          socket.emit("error_message", {
            message: "Missing content or sender",
          });
          return;
        }

        // Get the Message model dynamically
        const mongoose = (await import("mongoose")).default;
        const Message =
          mongoose.models.Message ||
          (await import("../model/message.js")).default;
        const Conversation =
          mongoose.models.Conversation ||
          (await import("../model/Conversation.js")).default;

        // Get or create the Public Chat conversation
        const publicConv = await getOrCreatePublicConversation(Conversation);

        // Save message to DB
        const savedMessage = await Message.create({
          conversationId: publicConv._id,
          senderId,
          content,
          seenBy: [senderId],
          timestamp: new Date(),
        });

        // Populate sender info
        const populated = await Message.findById(savedMessage._id)
          .populate({
            path: "senderId",
            select: "username avatarImage",
          })
          .lean();

        // Update conversation's lastMessage
        publicConv.lastMessageAt = new Date();
        publicConv.lastMessage = {
          messageId: savedMessage._id,
          sendBy: senderId,
          content,
        };
        await publicConv.save();

        // Broadcast to ALL connected clients
        io.emit("new_public_message", {
          _id: savedMessage._id,
          _clientId: clientMsgId, // Send back client's temp ID for replacement
          content: populated.content,
          senderId: populated.senderId,
          timestamp: populated.timestamp,
          seenBy: populated.seenBy,
        });

        console.log(`💬 Public message saved: ${savedMessage._id}`);
      } catch (error) {
        console.error("❌ Error saving public message:", error.message);
        socket.emit("error_message", { message: error.message });
      }
    });

    // Join public chat room (for consistency)
    socket.on("join_public", () => {
      socket.join("public_room");
      console.log(`🔗 User ${socket.userId || socket.id} joined public room`);
    });

    // ===== DIRECT MESSAGES =====
    // Listen for new messages - Save to DB + Broadcast
    socket.on("send_message", async (data) => {
      try {
        const { conversationId, senderId, recipientId, content } = data;

        // Save message to DB
        const savedMessage = await messageService.sendDirectMessage(
          senderId,
          recipientId,
          content,
          conversationId,
        );

        // Broadcast to all users in conversation
        io.to(`conversation_${conversationId}`).emit("new_message", {
          _id: savedMessage._id,
          conversationId,
          senderId,
          content,
          timestamp: savedMessage.timestamp,
          seenBy: savedMessage.seenBy,
        });

        // Emit to recipient if online
        const recipientSocketId = activeUsers.get(recipientId);
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("receive_message", {
            conversationId,
            senderId,
            content,
            timestamp: savedMessage.timestamp,
          });
        }

        console.log(`💬 Direct message saved: ${savedMessage._id}`);
      } catch (error) {
        console.error("❌ Error saving message:", error.message);
        socket.emit("error_message", { message: error.message });
      }
    });

    // ===== GROUP MESSAGES =====
    // Listen for group messages - Save to DB + Broadcast
    socket.on("send_group_message", async (data) => {
      try {
        const { conversationId, senderId, content } = data;

        // Save group message to DB
        const savedMessage = await messageService.sendGroupMessage(
          conversationId,
          senderId,
          content,
        );

        // Broadcast to all members in conversation
        io.to(`conversation_${conversationId}`).emit("new_message", {
          _id: savedMessage._id,
          conversationId,
          senderId,
          content,
          timestamp: savedMessage.timestamp,
          seenBy: savedMessage.seenBy,
        });

        console.log(`💬 Group message saved: ${savedMessage._id}`);
      } catch (error) {
        console.error("❌ Error saving group message:", error.message);
        socket.emit("error_message", { message: error.message });
      }
    });

    // Join conversation room
    socket.on("join_conversation", (conversationId) => {
      socket.join(`conversation_${conversationId}`);
      console.log(`🔗 User joined conversation: ${conversationId}`);
    });

    // Leave conversation room
    socket.on("leave_conversation", (conversationId) => {
      socket.leave(`conversation_${conversationId}`);
      console.log(`🔓 User left conversation: ${conversationId}`);
    });

    // Typing indicator
    socket.on("typing", (data) => {
      const { conversationId, userId, username } = data;
      io.to(`conversation_${conversationId}`).emit("user_typing", {
        userId,
        username,
      });
    });

    // Stop typing
    socket.on("stop_typing", (conversationId) => {
      io.to(`conversation_${conversationId}`).emit("user_stop_typing");
    });

    // Mark message as seen - Save to DB + Broadcast
    socket.on("message_seen", async (data) => {
      try {
        const { messageId, conversationId, userId } = data;

        // Save seen status to DB
        await messageService.markMessageAsSeen(messageId, userId);

        // Broadcast to all members in conversation
        io.to(`conversation_${conversationId}`).emit("message_marked_seen", {
          messageId,
          userId,
        });

        console.log(`👁️ Message ${messageId} marked as seen by ${userId}`);
      } catch (error) {
        console.error("❌ Error marking message as seen:", error.message);
        socket.emit("error_message", { message: error.message });
      }
    });

    // Mark conversation as read - Save to DB
    socket.on("conversation_read", async (data) => {
      try {
        const { conversationId, userId } = data;

        // Mark all messages in conversation as read
        await messageService.markConversationAsRead(conversationId, userId);

        console.log(
          `✅ Conversation ${conversationId} marked as read by ${userId}`,
        );
      } catch (error) {
        console.error("❌ Error marking conversation as read:", error.message);
        socket.emit("error_message", { message: error.message });
      }
    });

    // Disconnect
    socket.on("disconnect", () => {
      if (socket.userId) {
        activeUsers.delete(socket.userId);
        console.log(
          `❌ User ${socket.userId} disconnected. Active users: ${activeUsers.size}`,
        );
        io.emit("user_offline", { userId: socket.userId, status: "offline" });
        io.emit("online_users", Array.from(activeUsers.keys()));
      }
    });
  });
};

export const getActiveUsers = () => activeUsers;
