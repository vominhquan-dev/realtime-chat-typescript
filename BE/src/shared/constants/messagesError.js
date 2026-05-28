export const MessagesError = {
  SUCCESS: {
    DEFAULT: "Operation completed successfully",
    CREATED: "Resource created successfully",
    UPDATED: "Resource updated successfully",
    DELETED: "Resource deleted successfully",
    LOGIN: "Login successful",
    LOGOUT: "Logout successful",
    REGISTER: "Registration successful",
    FORGOT_PASSWORD: "If email exists, reset link has been sent to your email",
    RESET_PASSWORD: "Password reset successful",
  },

  ERROR: {
    INTERNAL: "Internal server error",
    VALIDATION: "Validation failed",
    UNAUTHORIZED: "Unauthorized access",
    FORBIDDEN: "Access forbidden",
    NOT_FOUND: "Resource not found",
    CONFLICT: "Resource already exists",
    INVALID_CREDENTIALS: "Invalid credentials. Please try again.",
    TOKEN_EXPIRED: "Token has expired",
    TOKEN_INVALID: "Invalid token",
    RESET_TOKEN_INVALID: "Invalid or expired reset token",
    RESET_TOKEN_EXPIRED: "Reset token has expired",
    USER_NOT_FOUND: "User not found",
    EMAIL_USERNAME_OR_PASSWORD_INCORRECT:
      "Email, username, or password is incorrect",
    INVALID_EMAIL: "Invalid email format",
    WEAK_PASSWORD: "Password is too weak",
    EMAIL_ALREADY_EXISTS: "Email already exists",
    USER_LOCKED: "User account is locked",
    ACCOUNT_LOCKED: "Account is locked. Please contact administrator",
    LOGIN_FAILED: "Login failed",
    NO_PERMISSION: "Insufficient privileges to access this resource",
    NOT_FRIENDS: "Users are not friends",
  },

  DATABASE: {
    CONNECTION_ERROR: "Database connection failed",
    QUERY_ERROR: "Database query failed",
    SAVE_ERROR: "Failed to save data",
    UPDATE_ERROR: "Failed to update data",
    DELETE_ERROR: "Failed to delete data",
  },

  VALIDATION: {
    REQUIRED: "This field is required",
    INVALID_FORMAT: "Invalid format",
    MIN_LENGTH: "Minimum length not met",
    MAX_LENGTH: "Maximum length exceeded",
    OUT_OF_RANGE: "Value is out of valid range",
  },

  FRIEND: {
    ALREADY_FRIENDS: "Users are already friends",
    NOT_FRIENDS: "Users are not friends",
    REQUEST_SENT: "Friend request sent",
  },
};

export default MessagesError;
