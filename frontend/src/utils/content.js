export const generateTocFromHtml = (html = '') => {
  if (typeof window === 'undefined') {
    return [];
  }

  const parser = new window.DOMParser();
  const documentNode = parser.parseFromString(html, 'text/html');
  const headings = [...documentNode.querySelectorAll('h2, h3')];

  return headings.map((heading, index) => {
    const text = heading.textContent?.trim() || `section-${index + 1}`;
    const anchor = heading.id || `section-${index + 1}`;
    heading.id = anchor;
    return {
      text,
      anchor,
      level: heading.tagName.toLowerCase()
    };
  });
};

export const addHeadingAnchors = (html = '') => {
  if (typeof window === 'undefined') {
    return html;
  }

  const parser = new window.DOMParser();
  const documentNode = parser.parseFromString(html, 'text/html');
  [...documentNode.querySelectorAll('h2, h3')].forEach((heading, index) => {
    if (!heading.id) {
      heading.id = `section-${index + 1}`;
    }
  });

  return documentNode.body.innerHTML;
};
