/**
 * Database Schema - Entity Relationship Diagram
 *
 * This document describes the relationships between collections in MongoDB
 */

/**
 * =====================================================
 * USERS Collection
 * =====================================================
 */
// db.users.insertOne({
//   _id: ObjectId,
//   username: String (unique),
//   email: String (unique),
//   password: String (hashed with bcrypt),
//   avatarImage: String (URL),
//   refreshToken: String,
//   createdAt: Date,
//   updatedAt: Date
// })

/**
 * =====================================================
 * CONVERSATIONS Collection
 * =====================================================
 * Types: "direct" (1-to-1), "group" (multiple users)
 */
// db.conversations.insertOne({
//   _id: ObjectId,
//   type: "direct" | "group",
//   participants: [
//     {
//       userId: ObjectId (ref: Users),
//       joinedAt: Date
//     }
//   ],
//   group: {
//     name: String,
//     avatarImage: String
//   },
//   lastMessageAt: Date,
//   lastMessage: {
//     messageId: ObjectId (ref: Messages),
//     sendBy: ObjectId (ref: Users),
//     content: String
//   },
//   seenBy: [ObjectId] (ref: Users),
//   unreadCounts: Map<String, Number>, // userId -> count
//   createdAt: Date,
//   updatedAt: Date
// })

/**
 * =====================================================
 * MESSAGES Collection
 * =====================================================
 * Can belong to Conversations (direct/group) OR be Public
 */
// db.messages.insertOne({
//   _id: ObjectId,
//   conversationId: ObjectId (ref: Conversations) [optional - null for public messages],
//   isPublic: Boolean (true for public chat, false/null for conversations),
//   senderId: ObjectId (ref: Users),
//   content: String,
//   imgUrl: String,
//   seenBy: [ObjectId] (ref: Users),
//   timestamp: Date,
//   createdAt: Date,
//   updatedAt: Date
// })

/**
 * =====================================================
 * FRIENDS Collection
 * =====================================================
 * Represents confirmed friendships
 */
// db.friends.insertOne({
//   _id: ObjectId,
//   user1Id: ObjectId (ref: Users),
//   user2Id: ObjectId (ref: Users),
//   createdAt: Date
// })

/**
 * =====================================================
 * FRIEND REQUESTS Collection
 * =====================================================
 * Represents pending friend requests
 */
// db.friendrequests.insertOne({
//   _id: ObjectId,
//   senderId: ObjectId (ref: Users),
//   recipientId: ObjectId (ref: Users),
//   status: "pending" | "accepted" | "rejected",
//   createdAt: Date,
//   updatedAt: Date
// })

/**
 * =====================================================
 * RELATIONSHIPS DIAGRAM
 * =====================================================
 *
 *                    ┌─────────────┐
 *                    │    Users    │
 *                    └─────────────┘
 *                          │
 *         ┌────────────────┼────────────────┐
 *         │                │                │
 *         ▼                ▼                ▼
 *    ┌────────────┐  ┌──────────────┐  ┌──────────────┐
 *    │ Friends    │  │Conversations │  │Messages      │
 *    ├────────────┤  ├──────────────┤  ├──────────────┤
 *    │user1Id→    │  │participants→ │  │senderId→     │
 *    │user2Id→    │  │lastMessage→  │  │conversationId│
 *    └────────────┘  └──────────────┘  └──────────────┘
 *                          │
 *                          ▼
 *                    ┌──────────────┐
 *                    │Messages      │
 *                    ├──────────────┤
 *                    │conversationId│
 *                    │senderId→     │
 *                    │seenBy→       │
 *                    └──────────────┘
 *
 *    ┌──────────────────┐       ┌──────────────────┐
 *    │ FriendRequests   │       │OnlineUsers       │
 *    ├──────────────────┤       │ (Socket.io)      │
 *    │senderId→         │       ├──────────────────┤
 *    │recipientId→      │       │socketId          │
 *    │status            │       │userId            │
 *    └──────────────────┘       │username          │
 *                               │email             │
 *                               │avatar            │
 *                               └──────────────────┘
 *
 * Legend:
 * → : Reference/Foreign Key
 * ─ : One-to-Many relationship
 *
 * =====================================================
 * KEY RELATIONSHIPS
 * =====================================================
 *
 * 1. Users → Conversations (Many-to-Many)
 *    - User can have multiple conversations
 *    - Conversation can have multiple users
 *    - Through: participants array
 *
 * 2. Users → Messages (One-to-Many)
 *    - User (senderId) sends multiple messages
 *    - Message belongs to one sender
 *
 * 3. Conversations → Messages (One-to-Many)
 *    - Conversation has multiple messages
 *    - Message belongs to one conversation (except public)
 *
 * 4. Users → Friends (Many-to-Many)
 *    - User can be friends with multiple users
 *    - Represents confirmed friendships
 *
 * 5. Users → FriendRequests (One-to-Many)
 *    - User sends/receives multiple friend requests
 *    - FriendRequest has one sender and one recipient
 *
 * 6. Socket.io → OnlineUsers (Virtual)
 *    - Real-time tracking of connected users
 *    - Not stored in database
 *    - Emits "online-users" event on connect/disconnect
 *
 * =====================================================
 * SPECIAL FEATURES
 * =====================================================
 *
 * PUBLIC CHAT:
 * - Messages with isPublic: true
 * - conversationId: null
 * - Accessible to all authenticated users
 * - Real-time via Socket.io event "publicMessage"
 * - Persisted in Messages collection
 *
 * DIRECT MESSAGES:
 * - conversationId: references direct Conversation
 * - type: "direct"
 * - isPublic: false
 * - Participants: exactly 2 users
 *
 * GROUP MESSAGES:
 * - conversationId: references group Conversation
 * - type: "group"
 * - isPublic: false
 * - Participants: 2 or more users
 *
 * =====================================================
 */

export default {
  collections: {
    users: "User accounts with auth info",
    conversations: "Direct and group chats",
    messages: "Messages in conversations or public chat",
    friends: "Confirmed friendships",
    friendrequests: "Pending friend requests",
  },
  indexes: {
    messages: [
      "{ conversationId: 1, timestamp: -1 }",
      "{ isPublic: 1, timestamp: -1 }",
    ],
    conversations: ["{ participants.userId: 1 }", "{ type: 1 }"],
    users: ["{ username: 1, unique: true }", "{ email: 1, unique: true }"],
    friends: ["{ user1Id: 1, user2Id: 1 }", "{ user2Id: 1, user1Id: 1 }"],
    friendrequests: ["{ senderId: 1, recipientId: 1 }", "{ status: 1 }"],
  },
};
