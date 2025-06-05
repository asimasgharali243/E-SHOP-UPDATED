const sendResponse = (res, statusCode = 200, message = "", data = null) => {
  return res.status(statusCode).json({
    success: statusCode >= 200 && statusCode < 300,
    message,
    data, // This will contain the user object if needed
    
  });
};

export default sendResponse;