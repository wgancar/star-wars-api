const Joi = require('joi');
const ValidationError = require('../errors/ValidationError');

const validate = (objectToValidate, validationSchema) => {
  const { error, value } = Joi.validate(objectToValidate, validationSchema, { abortEarly: false });

  if (error) {
    throw new ValidationError('There were some validation errors in the request', error.details.map(({ path, message }) => ({
      path,
      message
    })));
  }
  return value;
};

module.exports = {
  validate,
};
