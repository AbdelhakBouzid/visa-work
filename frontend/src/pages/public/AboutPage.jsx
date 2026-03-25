import { Globe, ShieldCheck, Sparkles } from 'lucide-react';
import Seo from '../../components/common/Seo';
import { useUi } from '../../contexts/UiContext';

function AboutPage() {
  const { t } = useUi();

  return (
    <>
      <Seo title={t('pages.about.title')} description={t('pages.about.seoDescription')} />

      <section className="page-shell py-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="surface-card p-8 md:p-10">
            <span className="text-sm font-semibold text-brand-700 dark:text-brand-200">{t('pages.about.eyebrow')}</span>
            <h1 className="mt-3 text-4xl font-black leading-tight text-slate-950 dark:text-white">{t('pages.about.heading')}</h1>
            <p className="mt-6 text-base leading-8 text-slate-600 dark:text-slate-300">{t('pages.about.paragraphOne')}</p>
            <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">{t('pages.about.paragraphTwo')}</p>
          </div>

          <div className="grid gap-4">
            {[
              {
                icon: Sparkles,
                title: t('pages.about.cardOneTitle'),
                description: t('pages.about.cardOneDescription')
              },
              {
                icon: ShieldCheck,
                title: t('pages.about.cardTwoTitle'),
                description: t('pages.about.cardTwoDescription')
              },
              {
                icon: Globe,
                title: t('pages.about.cardThreeTitle'),
                description: t('pages.about.cardThreeDescription')
              }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="surface-card p-6">
                  <div className="inline-flex rounded-2xl bg-brand-50 p-3 text-brand-700 dark:bg-brand-500/10 dark:text-brand-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">{item.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

export default AboutPage;
