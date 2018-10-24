const ConflictError = require('../errors/ConflictError');
const ValidationError = require('../errors/ValidationError');
const ResourceNotFoundError = require('../errors/ResourceNotFoundError');

const handleError = (err, req, res, next) => {
  const httpException = transformErrorToHttpException(err);

  res.status(httpException.status).json(httpException);
};

const transformErrorToHttpException = (error) => {
  switch(error.constructor) {
    case ResourceNotFoundError:
      return { status: 404, message: error.message, type: error.type };
    case ValidationError:
      return { status: 400, message: error.message, type: error.type, details: error.details};
    case ConflictError:
      return { status: 400, message: error.message, type: error.type};
    default:
      return { status: 500, message: `Unexpected error: ${error.message}` };
  }
};

module.exports = handleError;
