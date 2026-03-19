import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { put } from '@vercel/blob';
import { asyncHandler } from '../utils/asyncHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, '../../uploads');

const createSafeFilename = (originalName = 'upload.jpg') => {
  const extension = path.extname(originalName) || '.jpg';
  const baseName = path
    .basename(originalName, extension)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  return `${baseName || 'upload'}-${Date.now()}${extension}`;
};

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'لم يتم إرسال أي صورة.' });
  }

  const fileName = createSafeFilename(req.file.originalname);

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`uploads/${fileName}`, req.file.buffer, {
      access: 'public',
      contentType: req.file.mimetype,
      addRandomSuffix: false
    });

    return res.status(201).json({
      message: 'تم رفع الصورة بنجاح.',
      url: blob.url
    });
  }

  if (process.env.VERCEL) {
    return res.status(500).json({
      message: 'على Vercel يجب إضافة BLOB_READ_WRITE_TOKEN لتخزين الصور بشكل دائم.'
    });
  }

  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, fileName), req.file.buffer);

  res.status(201).json({
    message: 'تم رفع الصورة بنجاح.',
    url: `/uploads/${fileName}`
  });
});
