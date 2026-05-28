import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import swaggerUi from "swagger-ui-express";
import connectDB from "../db.js";
import routes from "./routes/index.js";
import { initializeSocket, setupSocket } from "./socket/socketHandler.js";
import { swaggerSpec } from "./config/swagger.js";
import MessageService from "./features/messages/message.service.js";
import ConversationService from "./features/conversations/conversation.service.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO and get io instance
const io = initializeSocket(
  server,
  process.env.CORS_ORIGIN || "http://localhost:5173",
);

// Make io available globally
global.io = io;

const PORT = process.env.PORT || 3000;

// CORS Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);

// Middleware
app.use(express.json());

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Sử dụng tất cả route qua index.js
app.use("/api", routes);

// Setup WebSocket handlers with services
setupSocket(io, MessageService, ConversationService);

// Server + DB bootstrap
const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`🚀 Server ready => http://localhost:${PORT}`);
      console.log(`🔌 Socket.io ready on ws://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Cannot start server:", error.message);
    process.exit(1);
  }
};

startServer();
