function TableOfContents({ items }) {
  if (!items?.length) {
    return null;
  }

  return (
    <aside className="surface-card sticky top-24 p-6">
      <h3 className="mb-4 text-lg font-bold text-slate-900">فهرس المحتوى</h3>
      <nav className="space-y-3">
        {items.map((item) => (
          <a
            key={item.anchor}
            href={`#${item.anchor}`}
            className={`block rounded-2xl px-3 py-2 text-sm text-slate-600 transition hover:bg-brand-50 hover:text-brand-700 ${
              item.level === 'h3' ? 'mr-4' : ''
            }`}
          >
            {item.text}
          </a>
        ))}
      </nav>
    </aside>
  );
}

export default TableOfContents;
