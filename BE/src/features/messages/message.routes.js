import express from "express";

import {
  sendDirectMessage,
  sendGroupMessage,
  getConversationMessages,
  markMessageAsSeen,
  markConversationAsRead,
  sendPublicMessage,
  getPublicMessages,
  getOnlineCount,
  getOnlineUsersList,
} from "./message.controller.js";
import { authenticate } from "../../shared/middleware/auth.middleware.js";
import { checkFriendship } from "../../shared/middleware/friend.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /messages/public:
 *   post:
 *     summary: Send public message
 *     tags: [Messages - Public Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message sent successfully
 */
router.post("/public", authenticate, sendPublicMessage);

/**
 * @swagger
 * /messages/public/history:
 *   get:
 *     summary: Get public message history
 *     tags: [Messages - Public Chat]
 *     parameters:
 *       - name: limit
 *         in: query
 *         type: integer
 *       - name: skip
 *         in: query
 *         type: integer
 *     responses:
 *       200:
 *         description: Messages retrieved
 */
router.get("/public/history", getPublicMessages);

/**
 * @swagger
 * /messages/online-count:
 *   get:
 *     summary: Get online users count
 *     tags: [Messages - Online Status]
 *     responses:
 *       200:
 *         description: Online count
 */
router.get("/online-count", getOnlineCount);

/**
 * @swagger
 * /messages/online-users:
 *   get:
 *     summary: Get list of online users
 *     tags: [Messages - Online Status]
 *     responses:
 *       200:
 *         description: List of online users with usernames
 */
router.get("/online-users", getOnlineUsersList);

/**
 * @swagger
 * /messages/direct:
 *   post:
 *     summary: Send direct message
 *     tags: [Messages - Direct Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipientId:
 *                 type: string
 *               content:
 *                 type: string
 *               conversationId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message sent
 */
router.post("/direct", authenticate, checkFriendship, sendDirectMessage);

/**
 * @swagger
 * /messages/{conversationId}/group:
 *   post:
 *     summary: Send group message
 *     tags: [Messages - Group Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: conversationId
 *         in: path
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message sent
 */
router.post("/:conversationId/group", authenticate, sendGroupMessage);

/**
 * @swagger
 * /messages/{conversationId}:
 *   get:
 *     summary: Get conversation messages
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: conversationId
 *         in: path
 *         required: true
 *       - name: limit
 *         in: query
 *         type: integer
 *       - name: cursor
 *         in: query
 *         type: string
 *     responses:
 *       200:
 *         description: Messages retrieved
 */
router.get("/:conversationId", authenticate, getConversationMessages);

/**
 * @swagger
 * /messages/{messageId}/seen:
 *   put:
 *     summary: Mark message as seen
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: messageId
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Message marked as seen
 */
router.put("/:messageId/seen", authenticate, markMessageAsSeen);

/**
 * @swagger
 * /messages/{conversationId}/read:
 *   put:
 *     summary: Mark conversation as read
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: conversationId
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Conversation marked as read
 */
router.put("/:conversationId/read", authenticate, markConversationAsRead);

export default router;
