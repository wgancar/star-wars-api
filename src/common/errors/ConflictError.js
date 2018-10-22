class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.type = 'CONFLICT_ERROR';
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ConflictError;
