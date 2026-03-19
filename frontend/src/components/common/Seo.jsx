import { Helmet } from 'react-helmet-async';

function Seo({ title, description, image, type = 'website' }) {
  const siteTitle = title ? `${title} | visa-work` : 'visa-work';
  const siteDescription =
    description ||
    'منصة عربية متخصصة في العمل بالخارج وتأشيرات العمل والهجرة القانونية والوثائق المطلوبة.';

  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={siteDescription} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:type" content={type} />
      {image ? <meta property="og:image" content={image} /> : null}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={siteDescription} />
      {image ? <meta name="twitter:image" content={image} /> : null}
    </Helmet>
  );
}

export default Seo;
