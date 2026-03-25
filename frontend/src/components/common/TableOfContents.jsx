import { useUi } from '../../contexts/UiContext';

function TableOfContents({ items }) {
  const { isRtl, t } = useUi();

  if (!items?.length) {
    return null;
  }

  return (
    <aside className="surface-card sticky top-24 p-6">
      <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">{t('common.tableOfContents')}</h3>
      <nav className="space-y-3">
        {items.map((item) => (
          <a
            key={item.anchor}
            href={`#${item.anchor}`}
            className={`block rounded-2xl px-3 py-2 text-sm text-slate-600 transition hover:bg-brand-50 hover:text-brand-700 dark:text-slate-300 dark:hover:bg-brand-500/10 dark:hover:text-brand-200 ${
              item.level === 'h3' ? (isRtl ? 'mr-4' : 'ml-4') : ''
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
