import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { completeInitialAdminSetup, getSetupStatus } from '../utils/bootstrapInitialData.js';
import { createSlug } from '../utils/createSlug.js';

const DEFAULT_ADMIN_USERNAME = 'abdelhak26';
const DEFAULT_ADMIN_PASSWORD = 'ABDObzd@@2001';

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

const getMasterCredentials = () => ({
  username: (process.env.ADMIN_USERNAME || DEFAULT_ADMIN_USERNAME).trim().toLowerCase(),
  password: process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD
});

const ensureMasterAdminUser = async () => {
  const { username, password } = getMasterCredentials();
  const generatedEmail = `${createSlug(username, 'admin')}@visa-work.local`;

  let admin = await User.findOne({ role: 'admin' }).sort({ createdAt: 1 });

  if (!admin) {
    admin = await User.findOne().sort({ createdAt: 1 });
  }

  if (!admin) {
    return User.create({
      name: 'Abdelhak',
      username,
      email: generatedEmail,
      password,
      role: 'admin'
    });
  }

  admin.username = username;
  admin.email = generatedEmail;
  admin.password = password;

  if (admin.role !== 'admin') {
    admin.role = 'admin';
  }

  if (!admin.name?.trim()) {
    admin.name = 'Abdelhak';
  }

  await admin.save();
  return admin;
};

export const login = asyncHandler(async (req, res) => {
  const identifier = (req.body.identifier || req.body.email || '').trim().toLowerCase();
  const masterCredentials = getMasterCredentials();

  if (identifier === masterCredentials.username) {
    const masterAdmin = await ensureMasterAdminUser();

    return res.json({
      token: createToken(masterAdmin._id),
      user: sanitizeUser(masterAdmin)
    });
  }

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

  return res.json({
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
