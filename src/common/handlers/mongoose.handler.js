const ConflictError = require('../errors/ConflictError');
const ResourceNotFoundError = require('../errors/ResourceNotFoundError');

const appendToDocument = (collectionModel, resourceId, appendData) =>
  collectionModel.findOneAndUpdate({ _id: resourceId }, { $addToSet: appendData }, {new: true, lean: true});

const removeFromDocument = (collectionModel, resourceId, removeData) =>
  collectionModel.findOneAndUpdate({ _id: resourceId }, { $pullAll: removeData }, { new: true, lean: true });

const throwNotFoundWhenNull = errorMessage => obj => {
  if (!obj) {
    throw new ResourceNotFoundError(errorMessage);
  }
  return obj;
};

const throwUniqConstraintWhenConflict = errorMessage => error => {
  if (error.code === 11000) {
    throw new ConflictError(errorMessage);
  }
  throw error;
};

module.exports = {
  appendToDocument,
  removeFromDocument,
  throwUniqConstraintWhenConflict,
  throwNotFoundWhenNull,
};
