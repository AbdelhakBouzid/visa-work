import ar from './locales/ar';
import en from './locales/en';
import fr from './locales/fr';

export const localeOptions = [
  { value: 'ar', label: 'العربية', shortLabel: 'AR' },
  { value: 'fr', label: 'Français', shortLabel: 'FR' },
  { value: 'en', label: 'English', shortLabel: 'EN' }
];

const messages = { ar, fr, en };

const getNestedValue = (object, key) =>
  key.split('.').reduce((current, part) => (current && part in current ? current[part] : undefined), object);

const interpolate = (value, params) =>
  value.replace(/\{(\w+)\}/g, (_, key) => String(params[key] ?? `{${key}}`));

export function translate(locale, key, params = {}, fallback) {
  const value = getNestedValue(messages[locale], key) ?? getNestedValue(messages.ar, key) ?? fallback ?? key;

  if (typeof value !== 'string') {
    return value;
  }

  return interpolate(value, params);
}

export function getLocalizedCategoryCopy(locale, slug) {
  return {
    name: translate(locale, `categories.${slug}.name`),
    description: translate(locale, `categories.${slug}.description`)
  };
}
