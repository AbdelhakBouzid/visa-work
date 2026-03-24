import { asyncHandler } from '../utils/asyncHandler.js';
import {
  clearAdminSessionCookie,
  createAdminSessionToken,
  ensureAdminAuthorRecord,
  getAdminCredentials,
  setAdminSessionCookie,
  validateAdminCredentials
} from '../utils/adminSession.js';

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  username: user.username,
  role: user.role
});

export const login = asyncHandler(async (req, res) => {
  const username = String(req.body.username || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  if (!username || !password) {
    return res.status(400).json({ message: 'يرجى إدخال اسم المستخدم وكلمة المرور.' });
  }

  const adminCredentials = getAdminCredentials();

  if (!validateAdminCredentials(username, password)) {
    return res.status(401).json({ message: 'بيانات تسجيل الدخول غير صحيحة.' });
  }

  const user = await ensureAdminAuthorRecord();
  const token = createAdminSessionToken(adminCredentials.username);
  setAdminSessionCookie(res, token);

  res.json({
    user: sanitizeUser(user)
  });
});

export const logout = asyncHandler(async (req, res) => {
  clearAdminSessionCookie(res);
  res.json({ message: 'تم تسجيل الخروج بنجاح.' });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});

export const setupStatus = asyncHandler(async (req, res) => {
  res.json({ needsSetup: false });
});

export const initialSetup = asyncHandler(async (req, res) => {
  res.status(410).json({
    message: 'تم تعطيل إعداد الأدمن من الواجهة. استخدم ADMIN_USER و ADMIN_PASS من بيئة الخادم.'
  });
});
