import Seo from '../../components/common/Seo';
import { useUi } from '../../contexts/UiContext';

function PrivacyPage() {
  const { t } = useUi();

  return (
    <>
      <Seo title={t('pages.privacy.title')} description={t('pages.privacy.seoDescription')} />

      <section className="page-shell py-14">
        <div className="surface-card p-8 md:p-10">
          <h1 className="text-4xl font-black text-slate-950 dark:text-white">{t('pages.privacy.title')}</h1>
          <div className="article-content mt-8">
            <h2>{t('pages.privacy.dataCollectionTitle')}</h2>
            <p>{t('pages.privacy.dataCollectionBody')}</p>
            <h2>{t('pages.privacy.dataUsageTitle')}</h2>
            <p>{t('pages.privacy.dataUsageBody')}</p>
            <h2>{t('pages.privacy.protectionTitle')}</h2>
            <p>{t('pages.privacy.protectionBody')}</p>
            <h2>{t('pages.privacy.externalLinksTitle')}</h2>
            <p>{t('pages.privacy.externalLinksBody')}</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default PrivacyPage;
