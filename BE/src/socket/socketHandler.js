import { Server } from "socket.io";

// Store active users and their socket IDs for private messaging
const activeUsers = new Map(); // userId -> socketId

export const initializeSocket = (server, corsOrigin) => {
  const io = new Server(server, {
    cors: {
      origin: corsOrigin || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  return io;
};

export const setupSocket = (io, messageService, conversationService) => {
  io.on("connection", (socket) => {
    console.log(`✅ New connection: ${socket.id}`);

    // =====================================
    // PUBLIC CHAT
    // =====================================

    // Send public message - Save to DB + Broadcast
    socket.on("send_public_message", async (data) => {
      try {
        const { senderId, content } = data;

        // Save to DB
        const savedMessage = await messageService.sendPublicMessage(
          senderId,
          content,
        );

        // Broadcast to all connected clients
        io.emit("new_public_message", {
          _id: savedMessage._id,
          senderId: savedMessage.senderId,
          content: savedMessage.content,
          timestamp: savedMessage.timestamp,
          isPublic: true,
        });

        console.log(
          `📢 Public message from ${senderId}: ${content.substring(0, 50)}`,
        );
      } catch (error) {
        console.error("❌ Error sending public message:", error.message);
        socket.emit("error_message", { message: error.message });
      }
    });

    // =====================================
    // PRIVATE MESSAGING
    // =====================================

    // User joins - store userId and socketId mapping
    socket.on("user_join", (userId) => {
      activeUsers.set(userId, socket.id);
      socket.userId = userId;
      console.log(
        `🔐 User ${userId} joined (socket: ${socket.id}). Active: ${activeUsers.size}`,
      );

      // Broadcast online users count
      io.emit("online_users", Array.from(activeUsers.keys()));
    });

    // Send direct message - Save to DB + Broadcast to conversation room
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

        // Broadcast to all users in conversation room
        io.to(`conversation_${savedMessage.conversationId}`).emit(
          "new_message",
          {
            _id: savedMessage._id,
            conversationId: savedMessage.conversationId,
            senderId,
            content,
            timestamp: savedMessage.timestamp,
            seenBy: savedMessage.seenBy,
          },
        );

        // Also emit directly to recipient if online
        const recipientSocketId = activeUsers.get(recipientId);
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("receive_message", {
            conversationId: savedMessage.conversationId,
            senderId,
            content,
            timestamp: savedMessage.timestamp,
          });
        }

        console.log(`💬 Message saved: ${savedMessage._id}`);
      } catch (error) {
        console.error("❌ Error saving message:", error.message);
        socket.emit("error_message", { message: error.message });
      }
    });

    // Join conversation room
    socket.on("join_conversation", (conversationId) => {
      socket.join(`conversation_${conversationId}`);
      console.log(`🔗 ${socket.id} joined conversation: ${conversationId}`);
    });

    // Leave conversation room
    socket.on("leave_conversation", (conversationId) => {
      socket.leave(`conversation_${conversationId}`);
      console.log(`🔓 ${socket.id} left conversation: ${conversationId}`);
    });

    // Join public room
    socket.on("join_public", () => {
      socket.join("public_room");
      console.log(`🌐 ${socket.id} joined public room`);
    });

    // Leave public room
    socket.on("leave_public", () => {
      socket.leave("public_room");
      console.log(`🌐 ${socket.id} left public room`);
    });

    // Typing indicator for private chat
    socket.on("typing", (data) => {
      const { conversationId, userId, username } = data;
      socket.to(`conversation_${conversationId}`).emit("user_typing", {
        userId,
        username,
      });
    });

    // Stop typing
    socket.on("stop_typing", (conversationId) => {
      socket.to(`conversation_${conversationId}`).emit("user_stop_typing");
    });

    // Mark message as seen - Save to DB + Broadcast
    socket.on("message_seen", async (data) => {
      try {
        const { messageId, conversationId, userId } = data;

        await messageService.markMessageAsSeen(messageId, userId);

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

    // Mark conversation as read
    socket.on("conversation_read", async (data) => {
      try {
        const { conversationId, userId } = data;

        await messageService.markConversationAsRead(conversationId, userId);

        console.log(
          `✅ Conversation ${conversationId} marked as read by ${userId}`,
        );
      } catch (error) {
        console.error("❌ Error marking conversation as read:", error.message);
        socket.emit("error_message", { message: error.message });
      }
    });

    // =====================================
    // DISCONNECT
    // =====================================
    socket.on("disconnect", () => {
      console.log(`❌ Disconnected: ${socket.id}`);

      // Remove from active users if user was authenticated
      if (socket.userId) {
        activeUsers.delete(socket.userId);
        console.log(
          `👤 User ${socket.userId} disconnected. Active: ${activeUsers.size}`,
        );
        io.emit("online_users", Array.from(activeUsers.keys()));
      }
    });

    // Error handling
    socket.on("error", (error) => {
      console.error(`⚠️ Socket error for ${socket.id}:`, error);
    });
  });
};

export const getActiveUsers = () => activeUsers;
