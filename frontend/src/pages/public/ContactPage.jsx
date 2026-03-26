import { Mail, MapPinned, Send } from 'lucide-react';
import { useState } from 'react';
import Seo from '../../components/common/Seo';
import { useUi } from '../../contexts/UiContext';
import { extractApiError, publicApi } from '../../services/api';

const initialForm = {
  name: '',
  email: '',
  message: ''
};

function ContactPage() {
  const { t } = useUi();
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      await publicApi.submitContact(form);
      setStatus({ type: 'success', message: t('pages.contact.success') });
      setForm(initialForm);
    } catch (error) {
      setStatus({ type: 'error', message: extractApiError(error, t('pages.contact.error')) });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Seo title={t('pages.contact.title')} description={t('pages.contact.seoDescription')} />

      <section className="page-shell py-14">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[32px] bg-hero px-8 py-10 text-white shadow-soft">
            <h1 className="text-4xl font-black">{t('pages.contact.heading')}</h1>
            <p className="mt-4 text-sm leading-8 text-white/80 md:text-base">
              {t('pages.contact.description')}
            </p>
            <div className="mt-8 space-y-4 text-sm">
              <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-4">
                <Mail className="mt-1 h-5 w-5" />
                <div>
                  <p className="font-semibold">{t('common.email')}</p>
                  <p className="text-white/75">contact.visa.work@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-4">
                <MapPinned className="mt-1 h-5 w-5" />
                <div>
                  <p className="font-semibold">{t('pages.contact.platformScope')}</p>
                  <p className="text-white/75">{t('pages.contact.platformScopeDescription')}</p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="surface-card p-8">
            <div className="grid gap-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">{t('common.name')}</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">{t('common.email')}</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">{t('common.message')}</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-brand-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-800 disabled:opacity-60 dark:bg-brand-600 dark:hover:bg-brand-500"
            >
              <Send className="h-4 w-4" />
              {submitting ? t('common.sending') : t('common.sendMessage')}
            </button>

            {status.message ? (
              <p className={`mt-4 text-sm ${status.type === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {status.message}
              </p>
            ) : null}
          </form>
        </div>
      </section>
    </>
  );
}

export default ContactPage;
