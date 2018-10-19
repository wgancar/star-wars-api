const handleError = (err, req, res, next) => {
  const { status, message } = transformErrorToHttpException(err);

  res.status(status).json({ status, message });
};

const transformErrorToHttpException = (error) => {
  switch(error.type) {
    default:
      return { status: 500, message: `Unexpected error: ${error.message}` };
  }
};

module.exports = handleError;
