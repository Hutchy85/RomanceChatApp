// Enhanced src/utils/errorHandling.tsx

// Error types for better categorization
export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  STORAGE = 'STORAGE',
  API = 'API',
  VALIDATION = 'VALIDATION',
  TIMEOUT = 'TIMEOUT',
  UNKNOWN = 'UNKNOWN'
}

// Custom error class with more context
export class AppError extends Error {
  constructor(
    message: string,
    public type: ErrorType,
    public isRecoverable: boolean = true,
    public originalError?: Error,
    public context?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Lightweight type guard for common error shape
interface AppErrorLike {
  message?: string;
  code?: string;
  status?: number;
  name?: string;
  type?: string;
  response?: {
    status?: number;
  };
}

// Enhanced error message mapping with actionable information
export const getErrorMessage = (error: AppErrorLike, context?: string) => {
  console.error(`Error in ${context || 'unknown context'}:`, error);

  const status = error.status ?? error.response?.status;

  if (
    error.message?.toLowerCase().includes('network') ||
    error.message?.toLowerCase().includes('fetch') ||
    error.code === 'NETWORK_ERROR' ||
    !navigator.onLine
  ) {
    return {
      message: 'Network connection error',
      type: ErrorType.NETWORK,
      isRecoverable: true,
      actionableMessage:
        'Please check your internet connection and try again. If the problem persists, try switching between WiFi and mobile data.'
    };
  }

  if (
    error.message?.toLowerCase().includes('timeout') ||
    error.code === 'TIMEOUT' ||
    error.name === 'TimeoutError'
  ) {
    return {
      message: 'Request timed out',
      type: ErrorType.TIMEOUT,
      isRecoverable: true,
      actionableMessage:
        'The server is taking too long to respond. Please wait a moment and try again.'
    };
  }

  if (
    status === 401 ||
    status === 403 ||
    error.message?.toLowerCase().includes('unauthorized') ||
    error.message?.toLowerCase().includes('forbidden')
  ) {
    return {
      message: 'Authentication error',
      type: ErrorType.AUTHENTICATION,
      isRecoverable: false,
      actionableMessage:
        'Your API key may be invalid or expired. Please check your configuration and restart the app.'
    };
  }

  if (status === 429) {
    return {
      message: 'Too many requests',
      type: ErrorType.API,
      isRecoverable: true,
      actionableMessage:
        "You've made too many requests. Please wait a few minutes before trying again."
    };
  }

  if (status && status >= 400 && status < 500) {
    return {
      message: 'Request error',
      type: ErrorType.API,
      isRecoverable: true,
      actionableMessage:
        'There was a problem with your request. Please try again or contact support if the issue continues.'
    };
  }

  if (status && status >= 500) {
    return {
      message: 'Server error',
      type: ErrorType.API,
      isRecoverable: true,
      actionableMessage:
        'The server is temporarily unavailable. Please try again in a few minutes.'
    };
  }

  if (
    error.message?.toLowerCase().includes('storage') ||
    error.message?.toLowerCase().includes('asyncstorage') ||
    error.code === 'STORAGE_ERROR'
  ) {
    return {
      message: 'Storage error',
      type: ErrorType.STORAGE,
      isRecoverable: true,
      actionableMessage:
        'Unable to save your progress. Please ensure you have enough storage space and try again.'
    };
  }

  if (
    error.message?.toLowerCase().includes('validation') ||
    error.type === 'ValidationError'
  ) {
    return {
      message: 'Validation error',
      type: ErrorType.VALIDATION,
      isRecoverable: true,
      actionableMessage: 'Please check your input and try again.'
    };
  }

  return {
    message: 'An unexpected error occurred',
    type: ErrorType.UNKNOWN,
    isRecoverable: true,
    actionableMessage:
      'Something went wrong. Please try again, and if the problem continues, restart the app.'
  };
};

// Retry delay calculation (expandable for jitter/backoff later)
const getRetryDelay = (baseDelay: number, attempt: number) => baseDelay * attempt;