/**
 * Centralized error codes and messages for the application
 * 
 * Usage:
 * import { ERROR_CODES } from '@/constants/errorCodes';
 * throw new Error(ERROR_CODES.AUTH.UNAUTHORIZED.message);
 */

export const ERROR_CODES = {
  // Authentication & Authorization Errors
  AUTH: {
    UNAUTHORIZED: {
      code: 'AUTH_UNAUTHORIZED',
      status: 401,
      message: 'You must be logged in to access this feature',
      userMessage: 'Please log in to continue',
    },
    INVALID_TOKEN: {
      code: 'AUTH_INVALID_TOKEN',
      status: 401,
      message: 'Invalid or expired authentication token',
      userMessage: 'Your session has expired. Please log in again',
    },
    ACCESS_DENIED: {
      code: 'AUTH_ACCESS_DENIED',
      status: 403,
      message: 'User denied access',
      userMessage: 'You need to authorize the app to use Spotify features',
    },
    NOT_ON_ALLOWLIST: {
      code: 'AUTH_NOT_ON_ALLOWLIST',
      status: 403,
      message: 'User not on approved list',
      userMessage: 'Your Spotify account needs to be added to the allowlist. Request demo access to continue.',
    },
    MISSING_CREDENTIALS: {
      code: 'AUTH_MISSING_CREDENTIALS',
      status: 401,
      message: 'Missing client credentials',
      userMessage: 'Authentication configuration error. Please contact support.',
    },
  },

  // Spotify API Errors
  SPOTIFY: {
    API_ERROR: {
      code: 'SPOTIFY_API_ERROR',
      status: 500,
      message: 'Spotify API request failed',
      userMessage: 'Unable to fetch data from Spotify. Please try again.',
    },
    RATE_LIMIT: {
      code: 'SPOTIFY_RATE_LIMIT',
      status: 429,
      message: 'Spotify API rate limit exceeded',
      userMessage: 'Too many requests. Please wait a moment and try again.',
    },
    NOT_FOUND: {
      code: 'SPOTIFY_NOT_FOUND',
      status: 404,
      message: 'Spotify resource not found',
      userMessage: 'The requested content could not be found.',
    },
    PREMIUM_REQUIRED: {
      code: 'SPOTIFY_PREMIUM_REQUIRED',
      status: 403,
      message: 'Spotify Premium account required',
      userMessage: 'This feature requires a Spotify Premium account.',
    },
  },

  // Validation Errors
  VALIDATION: {
    INVALID_EMAIL: {
      code: 'VALIDATION_INVALID_EMAIL',
      status: 400,
      message: 'Invalid email format',
      userMessage: 'Please enter a valid email address',
    },
    REQUIRED_FIELD: {
      code: 'VALIDATION_REQUIRED_FIELD',
      status: 400,
      message: 'Required field missing',
      userMessage: 'This field is required',
    },
    INVALID_INPUT: {
      code: 'VALIDATION_INVALID_INPUT',
      status: 400,
      message: 'Invalid input provided',
      userMessage: 'Please check your input and try again',
    },
  },

  // Network Errors
  NETWORK: {
    TIMEOUT: {
      code: 'NETWORK_TIMEOUT',
      status: 408,
      message: 'Request timeout',
      userMessage: 'Request timed out. Please check your connection and try again.',
    },
    CONNECTION_ERROR: {
      code: 'NETWORK_CONNECTION_ERROR',
      status: 503,
      message: 'Network connection error',
      userMessage: 'Network error. Please check your internet connection.',
    },
  },

  // Server Errors
  SERVER: {
    INTERNAL_ERROR: {
      code: 'SERVER_INTERNAL_ERROR',
      status: 500,
      message: 'Internal server error',
      userMessage: 'Something went wrong. Please try again later.',
    },
    SERVICE_UNAVAILABLE: {
      code: 'SERVER_SERVICE_UNAVAILABLE',
      status: 503,
      message: 'Service temporarily unavailable',
      userMessage: 'Service is temporarily unavailable. Please try again later.',
    },
  },

  // Demo Request Errors
  DEMO: {
    SUBMISSION_FAILED: {
      code: 'DEMO_SUBMISSION_FAILED',
      status: 500,
      message: 'Failed to submit demo request',
      userMessage: 'Failed to submit request. Please try again.',
    },
    EMAIL_FAILED: {
      code: 'DEMO_EMAIL_FAILED',
      status: 500,
      message: 'Failed to send email notification',
      userMessage: 'Your request was received but email notification failed.',
    },
  },

  // Playback Errors
  PLAYBACK: {
    NO_ACTIVE_DEVICE: {
      code: 'PLAYBACK_NO_ACTIVE_DEVICE',
      status: 404,
      message: 'No active playback device',
      userMessage: 'No active device found. Please open Spotify on a device.',
    },
    PLAYBACK_ERROR: {
      code: 'PLAYBACK_ERROR',
      status: 500,
      message: 'Playback error occurred',
      userMessage: 'Unable to play track. Please try again.',
    },
    PREVIEW_UNAVAILABLE: {
      code: 'PLAYBACK_PREVIEW_UNAVAILABLE',
      status: 404,
      message: 'Track preview unavailable',
      userMessage: 'Preview not available for this track.',
    },
  },
} as const;

/**
 * Helper to get error by code
 */
export function getErrorByCode(code: string) {
  for (const category of Object.values(ERROR_CODES)) {
    for (const error of Object.values(category)) {
      if (error.code === code) {
        return error;
      }
    }
  }
  return ERROR_CODES.SERVER.INTERNAL_ERROR;
}

/**
 * Type exports for TypeScript
 */
export type ErrorCode = {
  code: string;
  status: number;
  message: string;
  userMessage: string;
};

export type ErrorCategory = keyof typeof ERROR_CODES;

/**
 * Helper to create error response
 */
export function createErrorResponse(error: ErrorCode, details?: string) {
  return {
    error: {
      code: error.code,
      message: error.message,
      userMessage: error.userMessage,
      details: details || undefined,
    },
    status: error.status,
  };
}

