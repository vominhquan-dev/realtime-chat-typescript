// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// HTTP Methods
export const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
};

// Pagination
export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100,
};

// Sort Order
export const SORT_ORDER = {
  ASC: "asc",
  DESC: "desc",
};

// Error Messages
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
  },
};
