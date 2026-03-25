const localeMap = {
  ar: 'ar-EG',
  fr: 'fr-FR',
  en: 'en-US'
};

export const formatLocalizedDate = (dateValue, locale = 'ar') => {
  if (!dateValue) {
    return '';
  }

  return new Intl.DateTimeFormat(localeMap[locale] || localeMap.ar, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(dateValue));
};

export const formatArabicDate = (dateValue) => formatLocalizedDate(dateValue, 'ar');

export const stripHtml = (value = '') =>
  value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

export const calculateReadingTime = (html = '') => {
  const words = stripHtml(html).split(' ').filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
};

export const createExcerpt = (html = '', max = 160) => {
  const text = stripHtml(html);
  if (text.length <= max) {
    return text;
  }

  return `${text.slice(0, max).trim()}...`;
};
