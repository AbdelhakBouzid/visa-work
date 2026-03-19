import sanitizeHtml from 'sanitize-html';

export const sanitizeArticleContent = (content = '') =>
  sanitizeHtml(content, {
    allowedTags: [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'p',
      'br',
      'strong',
      'em',
      'u',
      'blockquote',
      'ul',
      'ol',
      'li',
      'a',
      'img',
      'hr',
      'code',
      'pre',
      'span'
    ],
    allowedAttributes: {
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'alt', 'title'],
      span: ['style'],
      p: ['style'],
      h1: ['id'],
      h2: ['id'],
      h3: ['id'],
      h4: ['id']
    },
    allowedSchemes: ['http', 'https', 'mailto', 'data'],
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', {
        rel: 'noopener noreferrer',
        target: '_blank'
      })
    }
  });
