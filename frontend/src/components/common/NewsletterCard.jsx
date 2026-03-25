import { Mail } from 'lucide-react';
import { useState } from 'react';
import { extractApiError, publicApi } from '../../services/api';

function NewsletterCard() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await publicApi.subscribeNewsletter({ email });
      setStatus({ type: 'success', message: response.message });
      setEmail('');
    } catch (error) {
      setStatus({ type: 'error', message: extractApiError(error, 'تعذر إتمام الاشتراك حالياً.') });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-[32px] bg-hero px-6 py-10 text-white shadow-soft md:px-10">
      <div className="grid gap-8 md:grid-cols-[1fr_360px] md:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold ring-1 ring-white/10">
            <Mail className="h-4 w-4" />
            النشرة البريدية
          </span>
          <h2 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">
            توصيات أسبوعية في فرص العمل بالخارج والتأشيرات
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-8 text-white/80 md:text-base">
            اشترك لتصلك المقالات الجديدة، التحديثات القانونية المهمة، وأفضل الأدلة العملية باللغة العربية.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="rounded-[28px] border border-brand-100/70 bg-white p-5 text-slate-900 shadow-soft">
          <label className="mb-3 block text-sm font-semibold text-slate-700">البريد الإلكتروني</label>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand-500"
            placeholder="name@example.com"
          />
          <button
            type="submit"
            disabled={submitting}
            className="mt-4 w-full rounded-2xl bg-gradient-to-r from-accent-600 to-accent-400 px-4 py-3 text-sm font-bold text-white transition hover:from-accent-700 hover:to-accent-500 disabled:opacity-60"
          >
            {submitting ? 'جارٍ الاشتراك...' : 'اشترك الآن'}
          </button>
          {status.message ? (
            <p
              className={`mt-3 text-sm ${
                status.type === 'success' ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {status.message}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}

export default NewsletterCard;
