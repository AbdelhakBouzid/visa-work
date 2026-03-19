import { Globe, ShieldCheck, Sparkles } from 'lucide-react';
import Seo from '../../components/common/Seo';

function AboutPage() {
  return (
    <>
      <Seo title="من نحن" description="تعرف على منصة visa-work ورسالتها في تقديم محتوى عربي موثوق عن العمل بالخارج." />

      <section className="page-shell py-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="surface-card p-8 md:p-10">
            <span className="text-sm font-semibold text-brand-700">عن visa-work</span>
            <h1 className="mt-3 text-4xl font-black leading-tight text-slate-950">
              منصة عربية تساعدك على فهم العمل بالخارج والتأشيرات بطريقة واضحة ومهنية
            </h1>
            <p className="mt-6 text-base leading-8 text-slate-600">
              تم تصميم visa-work ليكون مركزاً معرفياً منظماً للباحثين عن فرص عمل خارج أوطانهم، والمهتمين
              بفهم تأشيرات العمل، الهجرة القانونية، الوثائق المطلوبة، وطرق دفع الرسوم عبر القنوات الرسمية.
            </p>
            <p className="mt-4 text-base leading-8 text-slate-600">
              هدفنا هو تقديم محتوى عربي سريع القراءة، موثوق، وقابل للتطبيق؛ بحيث يجد المستخدم ملخصاً عملياً
              وخطوات واضحة تساعده على اتخاذ قرارات أفضل دون الوقوع في المعلومات المربكة أو غير الدقيقة.
            </p>
          </div>

          <div className="grid gap-4">
            {[
              {
                icon: Sparkles,
                title: 'محتوى عملي',
                description: 'مقالات مركزة على الخطوات والوثائق والقرارات التي يحتاجها المستخدم فعلاً.'
              },
              {
                icon: ShieldCheck,
                title: 'تركيز على المسارات القانونية',
                description: 'نعطي أولوية للمعلومات التي تشجع على التقديم القانوني والالتزام بالإجراءات الرسمية.'
              },
              {
                icon: Globe,
                title: 'واجهة عربية حديثة',
                description: 'تجربة قراءة عربية مع دعم RTL وتصميم مهني سريع ومناسب للهاتف والكمبيوتر.'
              }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="surface-card p-6">
                  <div className="inline-flex rounded-2xl bg-brand-50 p-3 text-brand-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="mt-4 text-xl font-bold text-slate-900">{item.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
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
