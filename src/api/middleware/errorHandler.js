/**
 * Error Handler Middleware
 * Centralizes error handling
 */

export const handleError = (error, res) => {
  console.error('API Error:', error);

  const statusCode = error.status || error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
    timestamp: new Date().toISOString()
  });
};

export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
