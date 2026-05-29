import ApiResponse from "../utils/ApiResponse.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import User from "../model/Users.js";
import { getActiveUsers } from "../socket/socketHandler.js";

export const getOnlineUsers = async (req, res) => {
  try {
    const activeUsers = getActiveUsers();
    const userIds = Array.from(activeUsers.keys());

    if (userIds.length === 0) {
      return ApiResponse.success(
        res,
        [],
        "Online users retrieved successfully",
        HTTP_STATUS.OK,
      );
    }

    const users = await User.find({
      _id: { $in: userIds },
    }).select("_id username email avatarImage");

    return ApiResponse.success(
      res,
      users,
      "Online users retrieved successfully",
      HTTP_STATUS.OK,
    );
  } catch (error) {
    return ApiResponse.error(
      res,
      error.message || "Internal server error",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
    );
  }
};
