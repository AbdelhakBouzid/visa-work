import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../middleware/auth.js';
import { uploadImage } from '../controllers/uploadController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, '../../uploads');

fs.mkdirSync(uploadDir, { recursive: true });

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    cb(new Error('نوع الملف غير مدعوم، يرجى رفع صورة فقط.'));
    return;
  }

  cb(null, true);
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: 4 * 1024 * 1024
  }
});

const router = Router();

router.post('/image', requireAuth, upload.single('image'), uploadImage);

export default router;
