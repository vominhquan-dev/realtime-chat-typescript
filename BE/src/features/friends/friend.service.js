import Friend from "./friend.model.js";
import FriendRequest from "./friendRequest.model.js";
import FriendRequestService from "./friendRequest.service.js";
import mongoose from "mongoose";

class FriendService {
  // Helper function để lấy sorted pair
  _getSortedPair(id1, id2) {
    const str1 = id1.toString();
    const str2 = id2.toString();
    return str1 < str2 ? [id1, id2] : [id2, id1];
  }

  sendRequestFriend = async (from, to, message) => {
    const fromId = from.toString();
    const toId = to.toString();

    // Validate not self
    if (fromId === toId) {
      throw new Error("Cannot send friend request to yourself");
    }

    // Get sorted pair
    const [user1, user2] = this._getSortedPair(fromId, toId);

    // Kiểm tra đã là bạn bè chưa
    const alreadyFriends = await Friend.findOne({
      user1,
      user2,
    });

    if (alreadyFriends) {
      throw new Error("You are already friends.");
    }

    // Kiểm tra request còn pending giữa 2 user
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { from: fromId, to: toId },
        { from: toId, to: fromId },
      ],
      status: "pending",
    });

    if (existingRequest) {
      throw new Error(
        "A friend request is already pending between these users."
      );
    }

    // Tạo request
    const friendRequest = await FriendRequest.create({
      from: fromId,
      to: toId,
      message,
      status: "pending",
    });

    return friendRequest;
  };

  acceptedRequestFriend = async (requestId, to) => {
    if (!requestId || !to) throw new Error("Missing required parameters");

    const toId = to.toString();
    const request = await FriendRequest.findById(requestId);

    if (!request) throw new Error("Friend request not found.");
    if (request.to.toString() !== toId)
      throw new Error("You are not authorized to accept this friend request.");
    if (request.status !== "pending")
      throw new Error("This friend request has already been processed.");
    if (!request.from) throw new Error("Invalid friend request - missing from");

    const fromId = request.from.toString();
    const [user1, user2] = this._getSortedPair(fromId, toId);

    // Check exist BEFORE create
    const exist = await Friend.findOne({
      user1,
      user2,
    });
    if (exist) throw new Error("You are already friends.");

    // Update request status
    request.status = "accepted";
    await request.save();

    // Create friend with sorted pair (pre-hook will ensure consistency)
    await Friend.create({ user1, user2 });

    // Delete request after success
    await FriendRequestService.deleteRequest(requestId);

    return { message: "Friend request accepted successfully" };
  };

  getPendingRequests = async (userId) => {
    if (!userId) throw new Error("User ID is required");

    const userIdStr = userId.toString();
    const requests = await FriendRequest.find({
      to: userIdStr,
      status: "pending",
    }).populate({
      path: "from",
      select: "username email avatarImage phone",
    });

    return requests;
  };

  getFriends = async (userId) => {
    if (!userId) throw new Error("User ID is required");

    const userIdStr = userId.toString();

    // Find all friendships where user is either user1 or user2
    const friends = await Friend.find({
      $or: [{ user1: userIdStr }, { user2: userIdStr }],
    })
      .populate({
        path: "user1",
        select: "username email avatarImage phone",
      })
      .populate({
        path: "user2",
        select: "username email avatarImage phone",
      });

    // Map to return the actual friend (not the user themselves)
    const friendsList = friends.map((friendship) => {
      const friend =
        friendship.user1._id.toString() === userIdStr
          ? friendship.user2
          : friendship.user1;
      return friend;
    });

    return friendsList;
  };
}

export default new FriendService();
