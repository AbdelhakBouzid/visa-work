import crypto from 'crypto';
import { User } from '../models/User.js';

const SESSION_COOKIE_NAME = process.env.ADMIN_SESSION_COOKIE_NAME || 'visa_work_admin_session';
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

const toComparableBuffer = (value) => Buffer.from(String(value ?? ''));

const safeEqual = (left, right) => {
  const leftBuffer = toComparableBuffer(left);
  const rightBuffer = toComparableBuffer(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
};

const getSessionSecret = () => process.env.ADMIN_SESSION_SECRET || process.env.JWT_SECRET || 'visa-work-admin-session';

export const getAdminCredentials = () => {
  const username = String(process.env.ADMIN_USER || '').trim().toLowerCase();
  const password = String(process.env.ADMIN_PASS || '');

  if (!username || !password) {
    const error = new Error('Missing ADMIN_USER or ADMIN_PASS.');
    error.statusCode = 500;
    throw error;
  }

  return { username, password };
};

export const validateAdminCredentials = (username, password) => {
  const configured = getAdminCredentials();
  return safeEqual(String(username || '').trim().toLowerCase(), configured.username) && safeEqual(password, configured.password);
};

const serializeSessionPayload = (payload) => Buffer.from(JSON.stringify(payload)).toString('base64url');
const deserializeSessionPayload = (value) => JSON.parse(Buffer.from(value, 'base64url').toString('utf8'));

const signSessionPayload = (payload) =>
  crypto.createHmac('sha256', getSessionSecret()).update(payload).digest('base64url');

export const createAdminSessionToken = (username) => {
  const payload = serializeSessionPayload({
    username,
    expiresAt: Date.now() + SESSION_MAX_AGE_MS
  });
  const signature = signSessionPayload(payload);
  return `${payload}.${signature}`;
};

export const parseCookies = (cookieHeader = '') =>
  cookieHeader
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((accumulator, item) => {
      const separatorIndex = item.indexOf('=');

      if (separatorIndex === -1) {
        return accumulator;
      }

      const key = item.slice(0, separatorIndex).trim();
      const value = item.slice(separatorIndex + 1).trim();
      accumulator[key] = decodeURIComponent(value);
      return accumulator;
    }, {});

export const readAdminSessionToken = (req) => {
  const cookies = parseCookies(req.headers.cookie || '');
  return cookies[SESSION_COOKIE_NAME] || null;
};

export const verifyAdminSessionToken = (token) => {
  if (!token || !token.includes('.')) {
    return null;
  }

  const [payload, signature] = token.split('.');
  const expectedSignature = signSessionPayload(payload);

  if (!safeEqual(signature, expectedSignature)) {
    return null;
  }

  try {
    const data = deserializeSessionPayload(payload);

    if (!data?.username || !data?.expiresAt || Number(data.expiresAt) < Date.now()) {
      return null;
    }

    const { username: adminUsername } = getAdminCredentials();

    if (!safeEqual(String(data.username).toLowerCase(), adminUsername)) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
};

export const setAdminSessionCookie = (res, token) => {
  const parts = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${Math.floor(SESSION_MAX_AGE_MS / 1000)}`
  ];

  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    parts.push('Secure');
  }

  res.append('Set-Cookie', parts.join('; '));
};

export const clearAdminSessionCookie = (res) => {
  const parts = [`${SESSION_COOKIE_NAME}=`, 'Path=/', 'HttpOnly', 'SameSite=Lax', 'Max-Age=0'];

  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    parts.push('Secure');
  }

  res.append('Set-Cookie', parts.join('; '));
};

export const ensureAdminAuthorRecord = async () => {
  const configuredUsername = String(process.env.ADMIN_USER || '').trim().toLowerCase();
  let user = null;

  if (configuredUsername) {
    user = await User.findOne({ role: 'admin', username: configuredUsername });
  }

  if (!user) {
    user = await User.findOne({ role: 'admin' }).sort({ createdAt: 1 });
  }

  if (!user) {
    user = new User({ role: 'admin' });
  }

  const nextUsername = configuredUsername || user.username || 'admin';
  let changed = user.isNew;

  if (!user.name) {
    user.name = 'مدير الموقع';
    changed = true;
  }

  if (user.username !== nextUsername) {
    user.username = nextUsername;
    changed = true;
  }

  if (user.requiresSetup !== false) {
    user.requiresSetup = false;
    changed = true;
  }

  if (changed) {
    await user.save();
  }

  return user;
};

export const resolveAdminSessionUser = async (req) => {
  const token = readAdminSessionToken(req);
  const session = verifyAdminSessionToken(token);

  if (!session) {
    return null;
  }

  return ensureAdminAuthorRecord();
};
