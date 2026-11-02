import mongoose from 'mongoose';

/**
 * Custom application error with HTTP status and RFC 7807 problem details
 */
export class AppError extends Error {
  constructor(message, status = 500, title = 'Internal Server Error', type = 'https://api.accessibleplace.org/errors/internal-error') {
    super(message);
    this.status = status;
    this.title = title;
    this.type = type;
  }
}

/**
 * 404 Not Found Middleware
 */
export function notFoundHandler(req, res, next) {
  res.status(404).json({
    type: 'https://api.accessibleplace.org/errors/not-found',
    title: 'Resource Not Found',
    status: 404,
    detail: `Cannot ${req.method} ${req.originalUrl}`,
    instance: req.originalUrl
  });
}

/**
 * Centralized RFC 7807 Error Handler
 */
export function errorHandler(err, req, res, next) {
  let status = err.status || 500;
  let title = err.title || 'Internal Server Error';
  let type = err.type || 'https://api.accessibleplace.org/errors/internal-error';
  let detail = err.message || 'An unexpected error occurred.';
  let invalidParams = err.invalidParams || undefined;

  // Handle Mongoose CastError (e.g., malformed ObjectId)
  if (err instanceof mongoose.Error.CastError) {
    status = 404;
    title = 'Resource Not Found';
    type = 'https://api.accessibleplace.org/errors/not-found';
    detail = `Resource with ID '${err.value}' does not exist or has an invalid format.`;
  }

  // Handle Mongoose ValidationError
  if (err instanceof mongoose.Error.ValidationError) {
    status = 400;
    title = 'Validation Error';
    type = 'https://api.accessibleplace.org/errors/validation-error';
    detail = 'Mongoose schema validation failed.';
    invalidParams = Object.values(err.errors).map((e) => ({
      name: e.path,
      reason: e.message
    }));
  }

  // Log server errors
  if (status >= 500) {
    console.error(`[Server Error] ${req.method} ${req.originalUrl}:`, err);
  }

  const problemResponse = {
    type,
    title,
    status,
    detail,
    instance: req.originalUrl
  };

  if (invalidParams) {
    problemResponse.invalidParams = invalidParams;
  }

  if (process.env.NODE_ENV === 'development' && status >= 500) {
    problemResponse.stack = err.stack;
  }

  res.status(status).json(problemResponse);
}

