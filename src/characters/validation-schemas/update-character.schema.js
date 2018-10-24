const Joi = require('joi');
const Episodes = require('../../episodes/episodes.enum');

const patchObjectSchema = Joi.object().keys({
  name: Joi.string(),
  planet: Joi.string(),
  friends: Joi.array().items(Joi.string()),
  episodes: Joi.array().items(Joi.string().valid(Object.values(Episodes))).min(1).unique(),
});

const episodesArraySchema = Joi.object().keys({
  episodes: Joi.array().items(Joi.string().valid(Object.values(Episodes))).min(1).required().unique(),
});

const friendsArraySchema = Joi.object().keys({
  friends: Joi.array().items(Joi.string()).min(1).required(),
});

module.exports = {
  patchObjectSchema,
  friendsArraySchema,
  episodesArraySchema,
};
