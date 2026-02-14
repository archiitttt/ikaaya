module.exports = (err, req, res, next) => {
  const { statusCode = 500, message = 'Internal Server Error' } = err

  res.status(statusCode).json({
    success: false,
    message
  })
}
