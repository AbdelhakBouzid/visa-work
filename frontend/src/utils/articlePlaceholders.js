const placeholderByCategory = {
  'work-abroad': '/seed/work-abroad.svg',
  'work-visa': '/seed/germany-visa.svg',
  'required-documents': '/seed/required-documents.svg',
  immigration: '/seed/legal-immigration.svg',
  'visa-payment-methods': '/seed/payment-methods.svg',
  'tips-guides': '/seed/tips-guides.svg'
};

export const getArticleFeaturedImage = (article) =>
  article?.featuredImage || placeholderByCategory[article?.category?.slug] || '/seed/work-abroad.svg';
