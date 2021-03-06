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
    const newResource = await creationResponse;
    res.status(201).json(newResource);
  } catch (error) {
    next(error);
  }
};

const handleActionResponse = async (req, res, next, postResponse) => {
  try {
    const postReturnedData = await postResponse;
    res.status(200).json(postReturnedData);
  } catch (error) {
    next(error);
  }
};

const handleUpdateResponse = async (req, res, next, updateResponse) => {
  try {
    const updatedResource = await updateResponse;
    res.status(200).json(updatedResource);
  } catch (error) {
    next(error);
  }
};

const handleDeletionResponse = async (res, next, deletionResponse) => {
  try {
    await deletionResponse;
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleGetResponse,
  handleActionResponse,
  handleCreationResponse,
  handleUpdateResponse,
  handleDeletionResponse
};
