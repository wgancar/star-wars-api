class ResourceNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.type = 'RESOURCE_NOT_FOUND_ERROR';
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ResourceNotFoundError;
