import { getLocalizedCategoryCopy } from './i18n';

export const buildUtilityNavigation = (t) => [
  { label: t('nav.utility.articles'), to: '/articles' },
  { label: t('nav.utility.about'), to: '/about' },
  { label: t('nav.utility.contact'), to: '/contact' },
  { label: t('nav.utility.privacy'), to: '/privacy' }
];

const categoryGroupConfig = [
  {
    key: 'work-abroad',
    labelKey: 'nav.groups.workAbroad.label',
    descriptionKey: 'nav.groups.workAbroad.description',
    primarySlug: 'work-abroad',
    items: [{ slug: 'work-abroad' }, { slug: 'tips-guides' }]
  },
  {
    key: 'visas',
    labelKey: 'nav.groups.visas.label',
    descriptionKey: 'nav.groups.visas.description',
    primarySlug: 'work-visa',
    items: [{ slug: 'work-visa' }, { slug: 'immigration' }, { slug: 'visa-payment-methods' }]
  },
  {
    key: 'guides',
    labelKey: 'nav.groups.guides.label',
    descriptionKey: 'nav.groups.guides.description',
    primarySlug: 'required-documents',
    items: [{ slug: 'required-documents' }]
  }
];

export function buildCategoryGroups(categories = [], locale = 'ar', t = (value) => value) {
  const categoriesBySlug = new Map(categories.map((category) => [category.slug, category]));

  return categoryGroupConfig.map((group) => ({
    ...group,
    label: t(group.labelKey),
    description: t(group.descriptionKey),
    href: `/category/${group.primarySlug}`,
    items: group.items.map((item) => {
      const category = categoriesBySlug.get(item.slug);
      const localizedCopy = getLocalizedCategoryCopy(locale, item.slug);

      return {
        _id: category?._id || item.slug,
        slug: item.slug,
        name: locale === 'ar' && category?.name ? category.name : localizedCopy.name,
        description: locale === 'ar' && category?.description ? category.description : localizedCopy.description,
        href: `/category/${item.slug}`
      };
    })
  }));
}
