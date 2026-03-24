import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { completeInitialAdminSetup, getSetupStatus } from '../utils/bootstrapInitialData.js';

const createToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET || 'visa-work-jwt-fallback-secret', {
    expiresIn: '7d'
  });

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  username: user.username,
  role: user.role,
  requiresSetup: user.requiresSetup
});

export const login = asyncHandler(async (req, res) => {
  const username = (req.body.username || '').trim().toLowerCase();
  const password = typeof req.body.password === 'string' ? req.body.password : '';

  if (!username || !password) {
    return res.status(400).json({ message: 'يرجى إدخال اسم المستخدم وكلمة المرور.' });
  }

  const admin = await User.findOne({ role: 'admin', username });

  if (!admin) {
    return res.status(401).json({ message: 'بيانات تسجيل الدخول غير صحيحة.' });
  }

  const hasStoredCredentials =
    typeof admin.username === 'string' &&
    admin.username.trim() &&
    typeof admin.password === 'string' &&
    admin.password.trim();

  if (admin.requiresSetup || !hasStoredCredentials) {
    return res.status(409).json({ message: 'يجب إكمال إعداد حساب المدير أولاً.' });
  }

  const isMatch = await admin.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: 'بيانات تسجيل الدخول غير صحيحة.' });
  }

  return res.json({
    token: createToken(admin._id),
    user: sanitizeUser(admin)
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.json({ message: 'تم تسجيل الخروج بنجاح.' });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

export const setupStatus = asyncHandler(async (req, res) => {
  try {
    const status = await getSetupStatus();
    res.json(status);
  } catch (error) {
    console.error('Failed to resolve admin setup status:', error);
    res.status(200).json({
      needsSetup: true,
      statusCheckFailed: true
    });
  }
});

export const initialSetup = asyncHandler(async (req, res) => {
  const user = await completeInitialAdminSetup({
    username: req.body.username,
    password: req.body.password
  });

  res.status(201).json({
    message: 'تم إنشاء حساب المدير بنجاح.',
    token: createToken(user._id),
    user: sanitizeUser(user)
  });
});
