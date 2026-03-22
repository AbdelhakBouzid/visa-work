import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { completeInitialAdminSetup, getSetupStatus } from '../utils/bootstrapInitialData.js';

const createToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  username: user.username,
  email: user.email,
  role: user.role
});

export const login = asyncHandler(async (req, res) => {
  const identifier = (req.body.identifier || req.body.email || '').trim().toLowerCase();
  const { password } = req.body;

  let user = await User.findOne({
    $or: [{ username: identifier }, { email: identifier }]
  });

  if (!user && identifier.includes('@')) {
    const emailLocalPart = identifier.split('@')[0];

    if (emailLocalPart) {
      user = await User.findOne({ username: emailLocalPart });
    }
  }

  if (!user) {
    return res.status(401).json({ message: 'بيانات تسجيل الدخول غير صحيحة.' });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: 'بيانات تسجيل الدخول غير صحيحة.' });
  }

  res.json({
    token: createToken(user._id),
    user: sanitizeUser(user)
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.json({ message: 'تم تسجيل الخروج بنجاح.' });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

export const setupStatus = asyncHandler(async (req, res) => {
  const status = await getSetupStatus();
  res.json(status);
});

export const initialSetup = asyncHandler(async (req, res) => {
  const user = await completeInitialAdminSetup({
    username: req.body.username,
    password: req.body.password,
    name: req.body.name
  });

  res.status(201).json({
    message: 'تم إنشاء حساب المدير بنجاح.',
    token: createToken(user._id),
    user: sanitizeUser(user)
  });
});
