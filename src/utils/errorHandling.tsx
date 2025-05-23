// Error types for better categorization
export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION', 
  STORAGE = 'STORAGE',
  API = 'API',
  VALIDATION = 'VALIDATION',
  UNKNOWN = 'UNKNOWN'
}

// Custom error class
export class AppError extends Error {
  constructor(
    message: string,
    public type: ErrorType,
    public isRecoverable: boolean = true,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Error message mapping
export const getErrorMessage = (error: any): { message: string; type: ErrorType; isRecoverable: boolean } => {
  // Network errors
  if (error.message?.toLowerCase().includes('network') || 
      error.message?.toLowerCase().includes('fetch') ||
      error.code === 'NETWORK_ERROR') {
    return {
      message: 'Network connection error. Please check your internet connection and try again.',
      type: ErrorType.NETWORK,
      isRecoverable: true
    };
  }

  // Timeout errors
  if (error.message?.toLowerCase().includes('timeout') ||
      error.code === 'TIMEOUT') {
    return {
      message: 'Request timed out. The server might be busy, please try again in a moment.',
      type: ErrorType.NETWORK,
      isRecoverable: true
    };
  }

  // Authentication errors
  if (error.status === 401 || error.status === 403) {
    return {
      message: 'Authentication error. Please restart the app and try again.',
      type: ErrorType.AUTHENTICATION,
      isRecoverable: false
    };
  }

  // API errors
  if (error.status >= 400 && error.status < 500) {
    return {
      message: 'There was a problem with your request. Please try again.',
      type: ErrorType.API,
      isRecoverable: true
    };
  }

  // Server errors
  if (error.status >= 500) {
    return {
      message: 'Server is temporarily unavailable. Please try again later.',
      type: ErrorType.API,
      isRecoverable: true
    };
  }

  // Storage errors
  if (error.message?.toLowerCase().includes('storage') ||
      error.message?.toLowerCase().includes('asyncstorage')) {
    return {
      message: 'Unable to save your progress. Please ensure you have enough storage space.',
      type: ErrorType.STORAGE,
      isRecoverable: true
    };
  }

  // Default error
  return {
    message: 'An unexpected error occurred. Please try again.',
    type: ErrorType.UNKNOWN,
    isRecoverable: true
  };
};
