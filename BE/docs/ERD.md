# Entity Relationship Diagram - Realtime Chat

## Collections Overview

### 1. **Users**

```
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  avatarImage: String,
  refreshToken: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 2. **Conversations**

```
{
  _id: ObjectId,
  type: "direct" | "group",
  participants: [
    { userId: ObjectId, joinedAt: Date }
  ],
  group: { name: String, avatarImage: String },
  lastMessageAt: Date,
  lastMessage: {
    messageId: ObjectId,
    sendBy: ObjectId,
    content: String
  },
  seenBy: [ObjectId],
  unreadCounts: Map<String, Number>,
  createdAt: Date,
  updatedAt: Date
}
```

### 3. **Messages**

```
{
  _id: ObjectId,
  conversationId: ObjectId (optional - null for public),
  isPublic: Boolean,
  senderId: ObjectId,
  content: String,
  imgUrl: String,
  seenBy: [ObjectId],
  timestamp: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 4. **Friends**

```
{
  _id: ObjectId,
  user1Id: ObjectId,
  user2Id: ObjectId,
  createdAt: Date
}
```

### 5. **FriendRequests**

```
{
  _id: ObjectId,
  senderId: ObjectId,
  recipientId: ObjectId,
  status: "pending" | "accepted" | "rejected",
  createdAt: Date,
  updatedAt: Date
}
```

## Relationship Diagram

```
                         ┌──────────────┐
                         │    USERS     │
                         └──────────────┘
                               │
                ┌──────────────┬┴─────────────┬───────────────┐
                │              │              │               │
                ▼              ▼              ▼               ▼
          ┌────────────┐  ┌─────────────┐  ┌──────────┐  ┌─────────────┐
          │  FRIENDS   │  │CONVERSATIONS│  │ MESSAGES │  │FRIEND_REQS  │
          ├────────────┤  ├─────────────┤  ├──────────┤  ├─────────────┤
          │user1Id → ╱ │  │participants │  │senderId  │  │senderId →   │
          │user2Id ╱   │  │   → USERS   │  │ → USERS  │  │recipientId→ │
          └────────────┘  └─────────────┘  └──────────┘  │status       │
                               │                          └─────────────┘
                               ▼
                          ┌──────────────┐
                          │  MESSAGES    │
                          ├──────────────┤
                          │conversationId│
                          │  → CONV      │
                          │senderId → U  │
                          │seenBy → U[]  │
                          │isPublic      │
                          └──────────────┘
```

## Key Relationships

| Relationship             | Type         | Description                             |
| ------------------------ | ------------ | --------------------------------------- |
| Users ↔ Conversations    | Many-to-Many | Users participate in conversations      |
| Users ↔ Messages         | One-to-Many  | Users send multiple messages            |
| Conversations ↔ Messages | One-to-Many  | Conversations contain multiple messages |
| Users ↔ Friends          | Many-to-Many | Users have multiple friends             |
| Users ↔ FriendRequests   | One-to-Many  | Users send/receive friend requests      |

## Message Types

### 1. **Public Messages**

- `isPublic: true`
- `conversationId: null`
- Visible to all authenticated users
- Persisted in database
- Real-time via Socket.io event `publicMessage`

### 2. **Direct Messages**

- `conversationId: ref(Conversations)`
- Conversation type: `"direct"`
- Exactly 2 participants
- `isPublic: false`

### 3. **Group Messages**

- `conversationId: ref(Conversations)`
- Conversation type: `"group"`
- 2 or more participants
- `isPublic: false`

## Database Indexes

### Messages Collection

```javascript
// Efficient querying by conversation and time
db.messages.createIndex({ conversationId: 1, timestamp: -1 });

// Efficient querying of public messages
db.messages.createIndex({ isPublic: 1, timestamp: -1 });
```

### Conversations Collection

```javascript
// Find conversations for a user
db.conversations.createIndex({ "participants.userId": 1 });

// Find by type
db.conversations.createIndex({ type: 1 });
```

### Users Collection

```javascript
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ email: 1 }, { unique: true });
```

### Friends Collection

```javascript
// Bidirectional friend lookup
db.friends.createIndex({ user1Id: 1, user2Id: 1 });
db.friends.createIndex({ user2Id: 1, user1Id: 1 });
```

### FriendRequests Collection

```javascript
db.friendrequests.createIndex({ senderId: 1, recipientId: 1 });
db.friendrequests.createIndex({ status: 1 });
```

## Online Users (Real-time)

**Not stored in database - maintained in memory via Socket.io**

```javascript
// Socket.io Map structure
Map {
  socket_id → {
    userId: String,
    username: String,
    email: String,
    avatar: String,
    socketId: String
  }
}
```

### Events

- **Connection**: User connects → Added to online list
- **user-info**: Client sends user details → Update in online list
- **disconnect**: User disconnects → Removed from online list
- **online-users**: Broadcasted after any change

## API Endpoints by Collection

### Users

- `POST /api/auth/login` - Login
- `GET /api/users/online` - Get online count
- `GET /api/users/online-users` - Get online users list
- `GET /api/users/{id}` - Get user by ID
- `GET /api/users` - Get all users
- `POST /api/users/register` - Register

### Messages

- `POST /api/messages/public` - Send public message
- `GET /api/messages/public/history` - Get public messages
- `GET /api/messages/online-count` - Get online users count
- `GET /api/messages/online-users` - Get online users list
- `POST /api/messages/direct` - Send direct message
- `POST /api/messages/{id}/group` - Send group message
- `GET /api/messages/{id}` - Get conversation messages
- `PUT /api/messages/{id}/seen` - Mark message as seen

### Conversations

- `GET /api/conversations` - Get user conversations
- `POST /api/conversations` - Create conversation
- `GET /api/conversations/{id}` - Get conversation details

### Friends

- `GET /api/friends` - Get friends list
- `POST /api/friends/request` - Send friend request
- `POST /api/friends/accept` - Accept friend request
- `DELETE /api/friends/{id}` - Remove friend

## Data Flow Diagram

```
┌────────────┐
│  Frontend  │
└─────┬──────┘
      │
      ├─ REST API ──────┐
      │                 │
      └─ Socket.io ─┐   │
                    │   │
                    ▼   ▼
              ┌──────────────────┐
              │  Express Server  │
              └────────┬─────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ▼                             ▼
   ┌─────────────┐          ┌──────────────────┐
   │  MongoDB    │          │  Socket.io       │
   │  (Persist)  │          │  (Real-time)     │
   └─────────────┘          └──────────────────┘
        ▲                             │
        │                             │
        └─────────────────┬───────────┘
                          │
                    Bi-directional
                    Communication
```
