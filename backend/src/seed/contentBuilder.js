const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const renderList = (items = [], ordered = false) => {
  if (!items.length) {
    return '';
  }

  const tag = ordered ? 'ol' : 'ul';
  return `<${tag}>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</${tag}>`;
};

const renderSubsection = (subsection) => {
  const blocks = [];

  if (subsection.title) {
    blocks.push(`<h3>${escapeHtml(subsection.title)}</h3>`);
  }

  for (const paragraph of subsection.paragraphs || []) {
    blocks.push(`<p>${escapeHtml(paragraph)}</p>`);
  }

  blocks.push(renderList(subsection.bullets || [], false));
  blocks.push(renderList(subsection.ordered || [], true));

  if (subsection.note) {
    blocks.push(`<blockquote><p>${escapeHtml(subsection.note)}</p></blockquote>`);
  }

  return blocks.filter(Boolean).join('\n');
};

const renderSection = (section) => {
  const blocks = [];

  if (section.heading) {
    blocks.push(`<h2>${escapeHtml(section.heading)}</h2>`);
  }

  for (const paragraph of section.paragraphs || []) {
    blocks.push(`<p>${escapeHtml(paragraph)}</p>`);
  }

  blocks.push(renderList(section.bullets || [], false));
  blocks.push(renderList(section.ordered || [], true));

  for (const subsection of section.subsections || []) {
    blocks.push(renderSubsection(subsection));
  }

  if (section.note) {
    blocks.push(`<blockquote><p>${escapeHtml(section.note)}</p></blockquote>`);
  }

  return blocks.filter(Boolean).join('\n');
};

export const buildArticleContent = (sections = []) => sections.map(renderSection).filter(Boolean).join('\n\n');

export const createSeedArticle = ({
  title,
  slug,
  excerpt,
  categorySlug,
  tags = [],
  status = 'draft',
  seoTitle,
  seoDescription,
  featuredImage = '',
  views = 0,
  publishedAt = null,
  sections = []
}) => ({
  title,
  slug,
  excerpt,
  content: buildArticleContent(sections),
  featuredImage,
  categorySlug,
  tags,
  status,
  seoTitle: seoTitle || `${title} | visa-work`,
  seoDescription: seoDescription || excerpt,
  views,
  publishedAt
});
