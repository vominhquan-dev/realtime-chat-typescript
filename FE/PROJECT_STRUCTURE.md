test

# 📁 Realtime Chat - Project Structure

## 🏗️ Overall Architecture

```
realtime_chat/
├── FE (Frontend - React + TypeScript)
│   ├── src/
│   │   ├── App.jsx                      # Main app component
│   │   ├── main.jsx                     # Entry point
│   │   ├── index.css                    # Global styles
│   │   ├── globals.css                  # Tailwind CSS
│   │   ├── vite-env.d.ts               # Vite type definitions
│   │   │
│   │   ├── api/                         # API Client Layer
│   │   │   ├── apiClient.ts            # Axios instance with interceptors
│   │   │   ├── authApi.ts              # Auth endpoints
│   │   │   ├── userApi.ts              # User endpoints
│   │   │   └── publicChatApi.ts        # Chat endpoints
│   │   │
│   │   ├── app/                         # Redux Configuration
│   │   │   ├── store.ts                # Redux store setup
│   │   │   ├── rootSaga.ts             # Root saga orchestrator
│   │   │   └── initAuthSaga.ts         # Initial auth restoration
│   │   │
│   │   ├── assets/                      # Static Assets
│   │   │   └── images/
│   │   │
│   │   ├── components/                  # Shared UI Components
│   │   │   ├── calendars.tsx           # Calendar component
│   │   │   ├── date-picker.tsx         # Date picker
│   │   │   ├── nav-*.tsx               # Navigation components
│   │   │   ├── sidebar-left.tsx        # Left sidebar
│   │   │   ├── sidebar-right.tsx       # Right sidebar
│   │   │   ├── team-switcher.tsx       # Team switcher
│   │   │   └── ui/                     # Base UI Components
│   │   │       ├── avatar.tsx
│   │   │       ├── breadcrumb.tsx
│   │   │       ├── button.tsx
│   │   │       ├── calendar.tsx
│   │   │       ├── collapsible.tsx
│   │   │       ├── dropdown-menu.tsx
│   │   │       ├── input.tsx
│   │   │       ├── label.tsx
│   │   │       ├── popover.tsx
│   │   │       ├── separator.tsx
│   │   │       ├── sheet.tsx
│   │   │       ├── sidebar.tsx
│   │   │       ├── skeleton.tsx
│   │   │       ├── tooltip.tsx
│   │   │       └── index.ts            # Export all UI components
│   │   │
│   │   ├── config/                      # Configuration Files
│   │   │   ├── api.config.ts           # API base URLs
│   │   │   ├── app.config.ts           # App settings
│   │   │   └── index.ts                # Export all configs
│   │   │
│   │   ├── constants/                   # Constants
│   │   │   └── index.ts
│   │   │
│   │   ├── features/                    # Feature Modules (Vertical Slicing)
│   │   │   │
│   │   │   ├── auth/                   # Authentication Feature
│   │   │   │   ├── index.ts
│   │   │   │   ├── components/
│   │   │   │   │   ├── LoginForm.tsx
│   │   │   │   │   ├── SignupForm.tsx
│   │   │   │   │   └── ForgotPasswordForm.tsx
│   │   │   │   ├── constants/
│   │   │   │   │   └── index.ts
│   │   │   │   ├── hooks/
│   │   │   │   │   └── useAuth.ts     # Auth hook
│   │   │   │   ├── pages/
│   │   │   │   │   ├── LoginPage.tsx
│   │   │   │   │   ├── SignupPage.tsx
│   │   │   │   │   └── ForgotPasswordPage.tsx
│   │   │   │   ├── redux/
│   │   │   │   │   ├── authSlice.ts   # Redux slice for auth state
│   │   │   │   │   └── authSaga.ts    # Redux saga for auth async
│   │   │   │   └── types/
│   │   │   │       └── index.ts
│   │   │   │
│   │   │   ├── chat/                   # Chat Feature
│   │   │   │   ├── index.ts
│   │   │   │   ├── components/
│   │   │   │   │   ├── ChatForum.tsx      # Chat forum layout
│   │   │   │   │   ├── ChatWindow.tsx     # Chat window component
│   │   │   │   │   ├── MessageBubble.tsx  # Message bubble display
│   │   │   │   │   └── PublicChat.tsx     # Public chat with real-time
│   │   │   │   ├── hooks/
│   │   │   │   │   └── useOnlineUsers.ts # Online users hook
│   │   │   │   ├── pages/
│   │   │   │   │   └── ChatPage.tsx
│   │   │   │   ├── redux/
│   │   │   │   │   ├── chatSlice.ts   # Redux slice for chat state
│   │   │   │   │   └── chatSaga.ts    # Redux saga for chat async
│   │   │   │   └── types/
│   │   │   │       └── index.ts
│   │   │   │
│   │   │   └── dashboard/              # Dashboard Feature
│   │   │       ├── index.ts
│   │   │       └── pages/
│   │   │           └── DashboardPage.tsx
│   │   │
│   │   ├── hooks/                       # Custom Hooks
│   │   │   ├── index.ts
│   │   │   ├── use-mobile.tsx          # Mobile detection
│   │   │   ├── useForm.ts              # Form handling
│   │   │   └── useSocketConnection.ts  # Socket lifecycle management
│   │   │
│   │   ├── layouts/                     # Layout Components
│   │   │   ├── AuthLayout.tsx
│   │   │   ├── MainLayout.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── lib/                         # Utility Libraries
│   │   │   └── utils.js                # Token decode, user extraction
│   │   │
│   │   ├── routes/                      # Routing Configuration
│   │   │   ├── auth.routes.tsx         # Auth routes
│   │   │   ├── chat.routes.tsx         # Chat routes
│   │   │   ├── dashboard.routes.tsx    # Dashboard routes
│   │   │   └── index.tsx               # Main routing setup
│   │   │
│   │   ├── services/                    # Service Layer
│   │   │   ├── authService.ts          # Auth business logic
│   │   │   ├── index.ts
│   │   │   ├── notificationService.ts  # Toast notifications
│   │   │   ├── storageService.ts       # localStorage helpers
│   │   │   └── websocketService.ts     # Socket.IO management
│   │   │
│   │   ├── types/                       # TypeScript Type Definitions
│   │   │   ├── auth.ts                 # Auth types
│   │   │   ├── publicChat.ts           # Chat types
│   │   │   ├── user.ts                 # User types
│   │   │   └── index.ts
│   │   │
│   │   └── utils/                       # Utility Functions
│   │       ├── index.ts
│   │       ├── storage.ts              # Storage utilities
│   │       └── validation.ts           # Form validation
│   │
│   ├── public/                          # Static Public Files
│   │
│   ├── package.json                    # Dependencies & scripts
│   ├── tsconfig.json                   # TypeScript config
│   ├── tsconfig.node.json              # TypeScript config (node)
│   ├── vite.config.js                  # Vite bundler config
│   ├── tailwind.config.js              # Tailwind CSS config
│   ├── postcss.config.js               # PostCSS config
│   ├── eslint.config.js                # ESLint config
│   ├── components.json                 # Component library config
│   ├── index.html                      # HTML entry point
│   ├── README.md                        # Documentation
│   │
│   ├── REDUX_FLOW.md                   # Redux flow documentation
│   └── PROJECT_STRUCTURE.md            # This file
│
└── BE (Backend - Node.js + Express)
    └── [Backend structure here]
```

---

## 📊 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            React Components                            │
│  (LoginPage, DashboardPage, PublicChat, ChatPage)                      │
└────────────────────┬────────────────────────────────────────────────────┘
                     │
                     │ dispatch(action) / useSelector()
                     │ useAuth() / useOnlineUsers()
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           Redux Store                                  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ auth State                │ chat State                            │  │
│  │ ├─ user                   │ ├─ onlineUsers[]                      │  │
│  │ ├─ isAuthenticated        │ ├─ onlineUsersCount                   │  │
│  │ ├─ isLoading              │ ├─ isLoading                          │  │
│  │ ├─ error                  │ └─ error                              │  │
│  │ └─ successMessage         │                                       │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│                        (Managed by Slices)                             │
└────┬──────────────────────────────────────────────────────────────┬────┘
     │                                                              │
     │ Dispatch Actions                                           │ Select State
     │                                                              │
     ▼                                                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         Redux-Saga Middleware                          │
│                                                                          │
│  authSaga                                  chatSaga                     │
│  ├─ Watches: loginRequest                  ├─ Watches: fetchOnlineUsersStart
│  ├─ Calls: login API                       ├─ Calls: getOnlineUsersList API
│  └─ Dispatches: loginSuccess/Failure       └─ Dispatches: Success/Failure
│                                                                          │
│  initAuthSaga                                                           │
│  ├─ On app start: Restore session from token                          │
│  └─ Dispatches: restoreSession action                                 │
└────┬──────────────────────────────────────────────────────────────────┬─┘
     │                                                                  │
     │ API Calls / Side Effects                                       │
     │                                                                  │
     ▼                                                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        API Layer (Axios)                               │
│                                                                          │
│  apiClient.ts (Base Configuration)                                    │
│  ├─ Base URL from config                                              │
│  ├─ Auth token interceptor (add token to headers)                    │
│  └─ Error interceptor (handle 401, refresh token)                    │
│                                                                          │
│  Endpoint Groups:                                                      │
│  ├─ authApi.ts                                                        │
│  │  ├─ POST /auth/login                                              │
│  │  ├─ POST /auth/signup                                             │
│  │  └─ POST /auth/logout                                             │
│  │                                                                     │
│  ├─ publicChatApi.ts                                                  │
│  │  ├─ GET /messages/messages                                        │
│  │  ├─ GET /messages/online-users                                    │
│  │  └─ GET /messages/online-count                                    │
│  │                                                                     │
│  └─ userApi.ts                                                        │
│     └─ GET /user/profile                                             │
└────┬──────────────────────────────────────────────────────────────────┬─┘
     │                                                                  │
     │ HTTP Requests                                                  │
     │                                                                  │
     ▼                                                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      Backend API (Node.js/Express)                     │
│                                                                          │
│  /auth      → Authentication endpoints                                 │
│  /messages  → Chat and online users endpoints                         │
│  /user      → User profile endpoints                                  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🔌 Real-Time Communication (WebSocket)

```
┌──────────────────────────────────────────────────────────────────────┐
│                    Socket.IO Connection                              │
│                                                                       │
│  websocketService.ts                                                │
│  ├─ Singleton class                                                │
│  ├─ Manages Socket.IO connection lifecycle                         │
│  ├─ Handles reconnection logic (max 3 retries, 5s timeout)        │
│  └─ Event subscription management                                 │
│                                                                       │
│  Events:                                                            │
│  ├─ publicMessage    → New message in public chat                 │
│  ├─ online-users-list → Updated online users list                 │
│  ├─ online-users     → Online users count                         │
│  └─ user-info        → Emit user info to server                   │
└──────────────────┬─────────────────────────────────────────────────┘
                   │
                   │ Real-time events
                   │
                   ▼
┌──────────────────────────────────────────────────────────────────────┐
│                   Component Socket Handlers                          │
│                                                                       │
│  useSocketConnection hook                                           │
│  ├─ Watches: isAuthenticated from Redux                           │
│  ├─ Connects socket when user logs in                             │
│  └─ Disconnects socket when user logs out                         │
│                                                                       │
│  PublicChat.tsx                                                    │
│  ├─ socketService.on("publicMessage", handleIncomingMessage)    │
│  │  └─ Updates local messages state + Redux cache                 │
│  │                                                                   │
│  └─ socketService.on("online-users-list", handleUsersList)      │
│     └─ Dispatches updateOnlineUsers to Redux                    │
│                                                                       │
│  DashboardPage.tsx                                                 │
│  └─ socketService.on("online-users-list", dispatch action)     │
│     └─ Updates Redux chat state                                  │
└──────────────────┬─────────────────────────────────────────────────┘
                   │
                   │ Emit events
                   │
                   ▼
┌──────────────────────────────────────────────────────────────────────┐
│               Backend Socket.IO Server                              │
│                                                                       │
│  Message events:                                                    │
│  ├─ publicMessage → Broadcast to all clients                       │
│  └─ user-info → Save user context for this socket                 │
│                                                                       │
│  Server emits to all:                                              │
│  ├─ online-users-list → All connected users                       │
│  └─ online-users → Count of online users                          │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow

```
                        ┌─ Signup Flow
                        │
User Input              │
   │                    │
   ├─ Login              ▼
   │   └─ Credentials  SignupForm
   │       │              │
   │       ▼              ▼
   │  dispatch(loginRequest)  dispatch(signupRequest)
   │       │                      │
   │       ▼                      ▼
   │   authSaga (listens)    authSaga (listens)
   │       │                      │
   │       ▼                      ▼
   │   Call: POST /auth/login  Call: POST /auth/signup
   │       │                      │
   │       ▼                      ▼
   │   Backend validates      Backend creates account
   │       │                      │
   │       ▼                      ▼
   │   Returns: {user, token}  Shows success message
   │       │                      │
   │       ▼                      ▼
   │   dispatch(loginSuccess)  User goes to login page
   │       │
   │       ▼
   │   Redux state updated:
   │   ├─ user = {...}
   │   ├─ isAuthenticated = true
   │   └─ Save token to localStorage
   │       │
   │       ▼
   │   useAuth() hook sees change
   │       │
   │       ▼
   │   LoginForm redirects to /dashboard
   │       │
   │       ▼
   │   ProtectedRoute allows access
   │       │
   │       ▼
   │   DashboardPage mounts
   │       │
   │       ▼
   │   initAuthSaga (on app start)
   │       │ Checks localStorage for token
   │       │ Decodes token → extracts user info
   │       │ dispatch(restoreSession)
   │       │
   │       ▼
   │   Redux restores user state
   │       │
   │       └─ useAuth() returns cached user (no re-login needed!)
   │
   └─ On every page load:
       1. initAuthSaga tries to restore session
       2. If token exists & valid → user stays logged in
       3. If no token → redirect to /login
```

---

## 📁 Folder Organization Pattern

### **Vertical Slicing (Feature-based)**

```
features/
├── auth/                    ← Complete auth feature
│   ├── components/         ← UI components for auth
│   ├── pages/              ← Auth pages
│   ├── redux/              ← Redux auth state
│   ├── hooks/              ← Auth-specific hooks
│   ├── types/              ← Auth TypeScript types
│   ├── constants/          ← Auth constants
│   └── index.ts            ← Public exports
│
├── chat/                    ← Complete chat feature
│   ├── components/         ← Chat UI components
│   ├── pages/              ← Chat pages
│   ├── redux/              ← Redux chat state
│   ├── hooks/              ← Chat-specific hooks
│   ├── types/              ← Chat types
│   └── index.ts
│
└── dashboard/              ← Complete dashboard
    ├── pages/
    └── index.ts
```

**Benefits:**

- ✅ Self-contained features
- ✅ Easy to move/remove features
- ✅ Clear dependencies
- ✅ Team can work on features independently

---

## 🎯 Key Files & Their Purposes

### Redux System

| File                               | Purpose                                                    |
| ---------------------------------- | ---------------------------------------------------------- |
| `app/store.ts`                     | Configures Redux store with all reducers + saga middleware |
| `app/rootSaga.ts`                  | Orchestrates all sagas (auth, chat, init)                  |
| `features/auth/redux/authSlice.ts` | Auth state management + reducers                           |
| `features/auth/redux/authSaga.ts`  | Auth async operations (login, signup, logout)              |
| `features/chat/redux/chatSlice.ts` | Chat state (online users, messages)                        |
| `features/chat/redux/chatSaga.ts`  | Chat async operations (fetch online users)                 |
| `app/initAuthSaga.ts`              | Restore user session on app startup                        |

### API & Services

| File                           | Purpose                                     |
| ------------------------------ | ------------------------------------------- |
| `api/apiClient.ts`             | Axios instance with auth interceptors       |
| `api/authApi.ts`               | Auth API endpoints (login, signup, logout)  |
| `api/publicChatApi.ts`         | Chat API endpoints (messages, online users) |
| `api/userApi.ts`               | User API endpoints (profile)                |
| `services/websocketService.ts` | Socket.IO singleton + connection management |

### Hooks

| File                                    | Purpose                                     |
| --------------------------------------- | ------------------------------------------- |
| `features/auth/hooks/useAuth.ts`        | Get auth state + dispatch login/logout      |
| `features/chat/hooks/useOnlineUsers.ts` | Get online users + dispatch fetch action    |
| `hooks/useSocketConnection.ts`          | Manage socket lifecycle based on auth state |

### Routing

| File                          | Purpose                            |
| ----------------------------- | ---------------------------------- |
| `routes/index.tsx`            | Main routing setup                 |
| `routes/auth.routes.tsx`      | Auth page routes (/login, /signup) |
| `routes/dashboard.routes.tsx` | Dashboard routes (protected)       |
| `routes/chat.routes.tsx`      | Chat routes (protected)            |
| `routes/ProtectedRoute.tsx`   | Route guard component              |

---

## 🔄 Component Dependencies Map

```
App.jsx
├─ Routes (routes/index.tsx)
│  │
│  ├─ /login
│  │  └─ LoginPage
│  │     └─ LoginForm
│  │        ├─ useAuth() → calls dispatch(loginRequest)
│  │        └─ redirects on isAuthenticated = true
│  │
│  ├─ /signup
│  │  └─ SignupPage
│  │     └─ SignupForm
│  │        └─ useAuth() → calls dispatch(signupRequest)
│  │
│  ├─ /dashboard (Protected)
│  │  └─ DashboardPage
│  │     ├─ useAuth() → get user
│  │     ├─ useOnlineUsers() → dispatch fetch + select state
│  │     ├─ socketService.on() → listen to socket events
│  │     └─ PublicChat component
│  │        ├─ socketService.on() → listen publicMessage
│  │        ├─ socketService.sendMessage() → emit message
│  │        ├─ userCache state → cache usernames
│  │        └─ MessageBubble (child)
│  │           └─ Display message with sender info
│  │
│  └─ /chat (Protected)
│     └─ ChatPage
│        └─ ChatWindow
│           └─ MessageBubble
│
└─ useSocketConnection hook
   ├─ Watches isAuthenticated
   ├─ Calls socketService.connect() on login
   └─ Calls socketService.disconnect() on logout
```

---

## 📦 Dependencies

### Core

- **react** + **react-dom** - UI library
- **react-router-dom** - Client routing
- **react-redux** - Redux bindings

### State Management

- **@reduxjs/toolkit** - Redux helper library
- **redux-saga** - Side effects handling

### API & Real-time

- **axios** - HTTP client
- **socket.io-client** - WebSocket client

### UI & Styling

- **tailwindcss** - CSS framework
- **lucide-react** - Icon library
- **shadcn/ui** - Component library

### Forms

- **react-hook-form** - Form state management

### Notifications

- **sonner** - Toast notifications

### Build & Dev Tools

- **vite** - Fast bundler
- **typescript** - Type safety
- **eslint** - Code linting

---

## 🚀 How It All Works Together

### **User Login Journey:**

```
1. User visits app → initAuthSaga runs
   └─ Checks localStorage for token
   └─ If found: restore session (no re-login)
   └─ If not: user sees login page

2. User enters credentials → clicks Login
   └─ LoginForm calls: dispatch(loginRequest)
   └─ authSaga intercepts action
   └─ Calls: POST /auth/login
   └─ Dispatch: loginSuccess {user, token}
   └─ Redux updates: isAuthenticated = true, user = {...}
   └─ localStorage: save token
   └─ LoginForm sees state change → redirects /dashboard

3. Dashboard loads → useSocketConnection hook runs
   └─ Sees: isAuthenticated = true
   └─ Calls: socketService.connect()
   └─ Socket connects to WebSocket server
   └─ Emits: "user-info" event with user details

4. User types message → clicks Send
   └─ PublicChat: dispatch socket.emit("publicMessage")
   └─ Message added to local state
   └─ Server receives message
   └─ Server broadcasts to all clients: "publicMessage"
   └─ Other clients receive: handleIncomingMessage
   └─ Update their local state + Redux
   └─ Messages re-render in real-time

5. User logs out
   └─ LoginForm calls: dispatch(logoutRequest)
   └─ authSaga intercepts
   └─ Calls: POST /auth/logout
   └─ Dispatch: logoutSuccess
   └─ Redux clears: user = null, isAuthenticated = false
   └─ localStorage: remove token
   └─ useSocketConnection sees: isAuthenticated = false
   └─ Calls: socketService.disconnect()
   └─ Socket disconnects
   └─ User redirected to /login
```

---

## 🎓 File Navigation Tips

**Want to find something?**

- 🔐 **Auth logic** → `features/auth/redux/`
- 💬 **Chat logic** → `features/chat/redux/`
- 🔌 **API calls** → `api/`
- 🌐 **WebSocket** → `services/websocketService.ts`
- 📱 **Components** → `features/*/components/` or `components/`
- 🪝 **Custom hooks** → `hooks/` or `features/*/hooks/`
- 🛣️ **Routes** → `routes/`
- 📋 **Types** → `types/` or `features/*/types/`

---

**This is a modern React architecture with Redux + Saga for state & side effects, Socket.IO for real-time, and feature-based organization!**
