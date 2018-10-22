const Joi = require('Joi');
const Episodes = require('../../episodes/episodes.enum');

module.exports = Joi.object().keys({
  name: Joi.string(),
  planet: Joi.string(),
  friends: Joi.array().items(Joi.string()),
  episodes: Joi.array().items(Joi.string().valid(Object.values(Episodes))).unique(),

});