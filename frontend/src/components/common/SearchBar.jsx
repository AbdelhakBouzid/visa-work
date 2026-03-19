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
      className={`flex items-center gap-3 rounded-full border border-white/30 bg-white/95 px-4 ${
        compact ? 'py-2' : 'py-3'
      } shadow-soft`}
    >
      <button
        type="submit"
        className="rounded-full bg-brand-700 p-2 text-white transition hover:bg-brand-800"
        aria-label="بحث"
      >
        <Search className="h-4 w-4" />
      </button>
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        className="w-full border-none bg-transparent text-right text-sm text-slate-700 outline-none placeholder:text-slate-400"
      />
    </form>
  );
}

export default SearchBar;
