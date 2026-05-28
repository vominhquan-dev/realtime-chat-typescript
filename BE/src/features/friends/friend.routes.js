import express from "express";
import {
  sendRequestFriend,
  acceptedRequestFriend,
  getPendingRequests,
  getFriends,
} from "./friend.controller.js";
import { authenticate } from "../../shared/middleware/auth.middleware.js";

const router = express.Router();
router.post("/request", authenticate, sendRequestFriend);
router.post("/accept", authenticate, acceptedRequestFriend);
router.get("/requests/pending", authenticate, getPendingRequests);
router.get("/", authenticate, getFriends);

export default router;
