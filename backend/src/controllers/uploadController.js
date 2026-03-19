import { asyncHandler } from '../utils/asyncHandler.js';

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'لم يتم إرسال أي صورة.' });
  }

  res.status(201).json({
    message: 'تم رفع الصورة بنجاح.',
    url: `/uploads/${req.file.filename}`
  });
});
