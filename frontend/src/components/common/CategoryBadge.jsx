import { Link } from 'react-router-dom';

function CategoryBadge({ category }) {
  if (!category) {
    return null;
  }

  return (
    <Link
      to={`/category/${category.slug}`}
      className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-100"
    >
      {category.name}
    </Link>
  );
}

export default CategoryBadge;
