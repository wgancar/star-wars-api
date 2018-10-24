const Joi = require('joi');
const Episodes = require('../../episodes/episodes.enum');

module.exports = Joi.object().keys({
  name: Joi.string().required(),
  planet: Joi.string(),
  friends: Joi.array().items(Joi.string()),
  episodes: Joi.array().items(Joi.string().valid(Object.values(Episodes))).unique().required(),
});
