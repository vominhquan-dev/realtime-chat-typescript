class OnlineUsersService {
  // Get total count of online users
  getOnlineCount() {
    try {
      return global.socketService?.getOnlineCount() || 0;
    } catch (error) {
      throw new Error(error.message || "Failed to get online count");
    }
  }

  // Get list of online users with full info
  getOnlineUsersList() {
    try {
      const onlineUsers = global.socketService?.getOnlineUsers() || [];

      // Extract user info from online users
      const usersList = onlineUsers
        .filter((user) => user.username) // Only users with username (authenticated)
        .map((user) => ({
          userId: user.userId,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          socketId: user.socketId,
        }));

      return {
        onlineUsers: usersList,
        count: usersList.length,
      };
    } catch (error) {
      throw new Error(error.message || "Failed to get online users list");
    }
  }
}

export default new OnlineUsersService();
