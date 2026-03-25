import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useUi } from '../../contexts/UiContext';

function Pagination({ page, pages, onChange }) {
  const { isRtl, t } = useUi();

  if (!pages || pages <= 1) {
    return null;
  }

  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
      >
        {isRtl ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        {t('common.previous')}
      </button>
      <div className="rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-white dark:bg-brand-600">
        {t('common.pageOf', { page, pages })}
      </div>
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= pages}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
      >
        {t('common.next')}
        {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
    </div>
  );
}

export default Pagination;
