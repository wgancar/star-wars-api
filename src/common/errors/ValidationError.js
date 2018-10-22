class ValidationError extends Error {
  constructor(message, details) {
    super(message);
    this.type = 'VALIDATION_ERROR';
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ValidationError;
