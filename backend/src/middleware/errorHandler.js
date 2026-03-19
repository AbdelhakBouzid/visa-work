export const notFound = (req, res) => {
  res.status(404).json({ message: 'المسار المطلوب غير موجود.' });
};

export const errorHandler = (error, req, res, next) => {
  console.error(error);

  if (res.headersSent) {
    next(error);
    return;
  }

  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    message: error.message || 'حدث خطأ غير متوقع في الخادم.'
  });
};
