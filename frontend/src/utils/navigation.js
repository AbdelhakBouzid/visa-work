export const utilityNavigation = [
  { label: 'المقالات', to: '/articles' },
  { label: 'من نحن', to: '/about' },
  { label: 'اتصل بنا', to: '/contact' },
  { label: 'سياسة الخصوصية', to: '/privacy' }
];

const categoryGroupConfig = [
  {
    key: 'work-abroad',
    label: 'العمل بالخارج',
    description: 'ابدأ من فرص العمل، تحسين الملف المهني، والأدلة العملية التي تجهزك للتقديم بثقة.',
    primarySlug: 'work-abroad',
    items: [
      {
        slug: 'work-abroad',
        fallbackName: 'العمل بالخارج',
        fallbackDescription: 'نصائح واستراتيجيات للبحث عن وظائف وفرص مهنية خارج بلدك.'
      },
      {
        slug: 'tips-guides',
        fallbackName: 'نصائح وأدلة',
        fallbackDescription: 'أدلة تفصيلية تساعدك على فهم الإجراءات خطوة بخطوة.'
      }
    ]
  },
  {
    key: 'visas',
    label: 'التأشيرات',
    description: 'كل ما تحتاجه لفهم تأشيرات العمل، الهجرة القانونية، وطرق دفع الرسوم عبر القنوات الرسمية.',
    primarySlug: 'work-visa',
    items: [
      {
        slug: 'work-visa',
        fallbackName: 'تأشيرة العمل',
        fallbackDescription: 'كل ما يتعلق بتأشيرات العمل وإجراءاتها ومتطلباتها.'
      },
      {
        slug: 'immigration',
        fallbackName: 'الهجرة القانونية',
        fallbackDescription: 'مقالات ودلائل عملية حول مسارات الهجرة القانونية والاندماج.'
      },
      {
        slug: 'visa-payment-methods',
        fallbackName: 'طرق دفع رسوم التأشيرة',
        fallbackDescription: 'شرح وسائل الدفع الإلكتروني والمنصات الرسمية لرسوم التأشيرات.'
      }
    ]
  },
  {
    key: 'guides',
    label: 'الأدلة',
    description: 'مرجع منظم للوثائق المطلوبة وكيفية تجهيز الملف الرسمي بشكل احترافي وواضح.',
    primarySlug: 'required-documents',
    items: [
      {
        slug: 'required-documents',
        fallbackName: 'الوثائق المطلوبة',
        fallbackDescription: 'قوائم الوثائق المطلوبة ونصائح تجهيز الملفات الرسمية.'
      }
    ]
  }
];

export function buildCategoryGroups(categories = []) {
  const categoriesBySlug = new Map(categories.map((category) => [category.slug, category]));

  return categoryGroupConfig.map((group) => ({
    ...group,
    href: `/category/${group.primarySlug}`,
    items: group.items.map((item) => {
      const category = categoriesBySlug.get(item.slug);

      return {
        _id: category?._id || item.slug,
        slug: item.slug,
        name: category?.name || item.fallbackName,
        description: category?.description || item.fallbackDescription,
        href: `/category/${item.slug}`
      };
    })
  }));
}
