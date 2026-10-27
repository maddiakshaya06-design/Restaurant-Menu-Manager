function notFound(req, res) {
  res.status(404).json({success:false, message:"The requested API endpoint was not found."});
}
function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  console.error("Request failed:", err.message);
  res.status(err.status || 500).json({
    success:false,
    message:err.status && err.status < 500 ? err.message : "An unexpected server error occurred."
  });
}
module.exports = {notFound, errorHandler};
