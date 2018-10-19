const handleGetResponse = async (res, next, resourcePromise) => {
  try {
    const resource = await resourcePromise;
    res.json(resource);
  } catch (error) {
    next(error)
  }
};

const handleCreationResponse = async (req, res, next, creationResponse) => {
  try {
    const { _id } = await creationResponse;
    res.setHeader('Location', req.originalUrl + '/' + resourceId);
    res.status(201).json({ _id });
  } catch (error) {
    next(error);
  }
};

const handleUpdateResponse = async (req, res, next, updateResponse) => {
  try {
    await updateResponse;
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const handleDeletionResponse = async (req, res, next, deletionResponse) => {
  try {
    await deletionResponse;
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleGetResponse,
  handleCreationResponse,
  handleUpdateResponse,
  handleDeletionResponse
};
