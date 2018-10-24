const Joi = require('joi');
const { Types } = require('mongoose');
const ValidationError = require('../errors/ValidationError');

const validate = (objectToValidate, validationSchema) => {
  const { error, value } = Joi.validate(objectToValidate, validationSchema, { abortEarly: false, convert: true });

  if (error) {
    throw new ValidationError('There were some validation errors in the request', error.details.map(({ path, message }) => ({
      path,
      message
    })));
  }
  return value;
};

const validateObjectId = id => {
  if (!Types.ObjectId.isValid(String(id))) {
    throw new ValidationError(`${id} is not valid ObjectID property`);
  }
  return id;
};

module.exports = {
  validate,
  validateObjectId,
};
