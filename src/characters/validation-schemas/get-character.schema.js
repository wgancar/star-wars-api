const Joi = require('joi');

const getCharacterOptionsSchema = Joi.object().keys({
  page: Joi.number().integer().min(1),
  pageSize: Joi.number().integer().min(1),
});

module.exports = {
  getCharacterOptionsSchema,
};
