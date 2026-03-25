import { Search } from 'lucide-react';
import { useState } from 'react';
import { useUi } from '../../contexts/UiContext';

function SearchBar({
  placeholder,
  initialValue = '',
  onSubmit,
  compact = false
}) {
  const { isRtl, t } = useUi();
  const [value, setValue] = useState(initialValue);
  const resolvedPlaceholder = placeholder || t('common.searchPlaceholder');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.(value.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center gap-3 rounded-[28px] border border-brand-100 bg-white/95 px-4 transition duration-200 focus-within:border-brand-300 dark:border-slate-700 dark:bg-slate-900/90 dark:focus-within:border-brand-500 ${
        compact ? 'py-2.5' : 'py-3.5'
      } shadow-soft`}
    >
      <button
        type="submit"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-700 to-brand-500 text-white transition hover:from-brand-800 hover:to-brand-600"
        aria-label={t('common.searchAria')}
      >
        <Search className="h-4 w-4" />
      </button>
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={resolvedPlaceholder}
        className={`w-full border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:ring-0 dark:text-slate-100 dark:placeholder:text-slate-500 ${
          isRtl ? 'text-right' : 'text-left'
        }`}
      />
    </form>
  );
}

export default SearchBar;
