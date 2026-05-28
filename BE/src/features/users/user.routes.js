import express from "express";

import {
  registerUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  searchUsers,
  getOnlineUsers,
  getUserProfile,
} from "./user.controller.js";
import { authenticate } from "../../shared/middleware/auth.middleware.js";

const router = express.Router();

// Create
router.post("/register", registerUser);

// List users and search (must come BEFORE /:id route)
router.get("/search", authenticate, searchUsers);
router.get("/online", getOnlineUsers);
router.get("/", authenticate, getAllUsers);
router.get("/profile", authenticate, getUserProfile);

// Read / Update / Delete by id (parameterized routes go last)
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
