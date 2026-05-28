import Friend from "../../features/friends/friend.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { MessagesError } from "../constants/messagesError.js";

export const checkFriendship = async (req, res, next) => {
  try {
    const userId = req.user._id.toString();
    const { recipientId } = req.body;

    if (!recipientId) {
      return ApiResponse.error(
        res,
        "Missing recipientId",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    if (userId === recipientId) {
      return ApiResponse.error(
        res,
        "You cannot chat with yourself",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Use sorted pair logic matching Friend model
    const [user1, user2] =
      userId < recipientId ? [userId, recipientId] : [recipientId, userId];

    const friendship = await Friend.findOne({ user1, user2 });
    if (!friendship) {
      return ApiResponse.error(
        res,
        MessagesError.ERROR.NOT_FRIENDS,
        HTTP_STATUS.FORBIDDEN
      );
    }

    req.isFriends = true;
    next();
  } catch (error) {
    return ApiResponse.error(
      res,
      error.message || MessagesError.ERROR.INTERNAL,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};
