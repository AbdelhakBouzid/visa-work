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

const renderIntro = (intro) => {
  if (!intro) {
    return '';
  }

  return `<p>${escapeHtml(intro)}</p>`;
};

const renderConclusion = (conclusion) => {
  if (!conclusion) {
    return '';
  }

  return `<h2>خلاصة عملية</h2>\n<p>${escapeHtml(conclusion)}</p>`;
};

export const buildArticleContent = ({ intro = '', sections = [], conclusion = '' } = {}) =>
  [renderIntro(intro), ...sections.map(renderSection), renderConclusion(conclusion)].filter(Boolean).join('\n\n');

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
  sections = [],
  intro = excerpt,
  conclusion = 'تعامل مع هذا الدليل كنقطة بداية عملية، ثم راجع التعليمات الرسمية الأحدث الخاصة بوجهتك وحالتك قبل اتخاذ أي قرار نهائي.'
}) => ({
  title,
  slug,
  excerpt,
  content: buildArticleContent({ intro, sections, conclusion }),
  featuredImage,
  categorySlug,
  tags,
  status,
  seoTitle: seoTitle || `${title} | visa-work`,
  seoDescription: seoDescription || excerpt,
  views,
  publishedAt
});
