export const formatArabicDate = (dateValue) => {
  if (!dateValue) {
    return '';
  }

  return new Intl.DateTimeFormat('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(dateValue));
};

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
