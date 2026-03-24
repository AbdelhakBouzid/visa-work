import { resolveAdminSessionUser } from '../utils/adminSession.js';

export const requireAuth = async (req, res, next) => {
  try {
    const user = await resolveAdminSessionUser(req);

    if (!user) {
      return res.status(401).json({ message: 'غير مصرح بالوصول.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(error.statusCode || 401).json({
      message: error.message || 'تعذر التحقق من جلسة الأدمن.'
    });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    req.user = await resolveAdminSessionUser(req);
  } catch (error) {
    req.user = null;
  }

  next();
};
