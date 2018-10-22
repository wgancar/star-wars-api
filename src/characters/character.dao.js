const mongoose = require('mongoose');
const Episodes = require('../episodes/episodes.enum');
const Schema = mongoose.Schema;

const CharacterSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  planet: {
    type: String,
  },
  episodes: {
    type: [{
      type: String,
      enum: Object.values(Episodes),
    }],
    required: true,
  },
  friends: {
    type: [{
      type: String,
    }],
    default: [],
  },
});

module.exports = mongoose.model('characters', CharacterSchema);
