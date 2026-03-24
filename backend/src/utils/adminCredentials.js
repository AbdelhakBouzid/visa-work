import { createSlug } from './createSlug.js';

const DEFAULT_ADMIN_USERNAME = 'abdelhak26';
const DEFAULT_ADMIN_PASSWORD = 'ABDObzd@@2001';

const normalize = (value = '') => value.trim().toLowerCase();

const extractUsernameFromEmail = (email) => {
  if (!email || !email.includes('@')) {
    return '';
  }

  return normalize(email.split('@')[0]);
};

export const getAdminCredentials = () => {
  const normalizedEnvUsername = normalize(process.env.ADMIN_USERNAME || '');
  const normalizedEnvEmail = normalize(process.env.ADMIN_EMAIL || '');
  const derivedUsername = extractUsernameFromEmail(normalizedEnvEmail);
  const username = normalizedEnvUsername || derivedUsername || DEFAULT_ADMIN_USERNAME;
  const email = normalizedEnvEmail || `${createSlug(username, 'admin')}@visa-work.local`;
  const password = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;

  return {
    username,
    email,
    password
  };
};

