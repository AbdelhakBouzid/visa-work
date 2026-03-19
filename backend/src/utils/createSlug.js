import slugify from 'slugify';

export const createSlug = (value, prefix = 'article') => {
  const slug = slugify(value || '', {
    lower: true,
    strict: true,
    trim: true
  });

  if (slug) {
    return slug;
  }

  return `${prefix}-${Date.now()}`;
};
