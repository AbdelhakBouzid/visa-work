import { Search } from 'lucide-react';
import { useState } from 'react';

function SearchBar({
  placeholder = 'ابحث عن مقالات، تأشيرات، وثائق...',
  initialValue = '',
  onSubmit,
  compact = false
}) {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.(value.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center gap-3 rounded-[28px] border border-brand-100 bg-white/95 px-4 transition duration-200 focus-within:border-brand-300 ${
        compact ? 'py-2.5' : 'py-3.5'
      } shadow-soft`}
    >
      <button
        type="submit"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-700 to-brand-500 text-white transition hover:from-brand-800 hover:to-brand-600"
        aria-label="بحث"
      >
        <Search className="h-4 w-4" />
      </button>
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        className="w-full border-none bg-transparent text-right text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:ring-0"
      />
    </form>
  );
}

export default SearchBar;
