import { ChevronLeft, ChevronRight } from 'lucide-react';

function Pagination({ page, pages, onChange }) {
  if (!pages || pages <= 1) {
    return null;
  }

  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronRight className="h-4 w-4" />
        السابق
      </button>
      <div className="rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-white">
        الصفحة {page} من {pages}
      </div>
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= pages}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        التالي
        <ChevronLeft className="h-4 w-4" />
      </button>
    </div>
  );
}

export default Pagination;
