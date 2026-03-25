import { Link } from 'react-router-dom';
import { useUi } from '../../contexts/UiContext';
import { getLocalizedCategoryCopy } from '../../utils/i18n';

function CategoryBadge({ category }) {
  const { locale } = useUi();

  if (!category) {
    return null;
  }

  const categoryLabel =
    locale === 'ar' ? category.name : getLocalizedCategoryCopy(locale, category.slug).name;

  return (
    <Link
      to={`/category/${category.slug}`}
      className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-100 dark:bg-brand-500/10 dark:text-brand-200 dark:hover:bg-brand-500/20"
    >
      {categoryLabel}
    </Link>
  );
}

export default CategoryBadge;
