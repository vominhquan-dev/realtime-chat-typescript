import FriendRequest from "./friendRequest.model.js";

class FriendRequestService {
  deleteRequest = async (requestId) => {
    if (!requestId) {
      throw new Error("Missing required parameter: requestId");
    }
    const result = await FriendRequest.findByIdAndDelete(requestId);
    if (!result) {
      throw new Error("Friend request not found.");
    }
    return result;
  };
}

export default new FriendRequestService();
