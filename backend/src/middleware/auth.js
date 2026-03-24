import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const extractToken = (req) => {
  const header = req.headers.authorization || '';

  if (header.startsWith('Bearer ')) {
    return header.replace('Bearer ', '').trim();
  }

  return null;
};

export const requireAuth = async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({ message: 'غير مصرح بالوصول.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'visa-work-jwt-fallback-secret');
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'المستخدم غير موجود.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'رمز الدخول غير صالح أو منتهي.' });
  }
};

export const optionalAuth = async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    next();
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'visa-work-jwt-fallback-secret');
    const user = await User.findById(decoded.userId).select('-password');

    if (user) {
      req.user = user;
    }
  } catch (error) {
    req.user = null;
  }

  next();
};
