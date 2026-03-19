import { Facebook, Linkedin, Link2, MessageCircle, Twitter } from 'lucide-react';

const openShareWindow = (url) => {
  window.open(url, '_blank', 'noopener,noreferrer,width=640,height=640');
};

function ShareButtons({ url, title }) {
  const shareLinks = [
    {
      label: 'واتساب',
      icon: MessageCircle,
      action: () => openShareWindow(`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`)
    },
    {
      label: 'X',
      icon: Twitter,
      action: () =>
        openShareWindow(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
        )
    },
    {
      label: 'فيسبوك',
      icon: Facebook,
      action: () => openShareWindow(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
    },
    {
      label: 'لينكدإن',
      icon: Linkedin,
      action: () =>
        openShareWindow(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        )
    }
  ];

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {shareLinks.map(({ label, icon: Icon, action }) => (
        <button
          key={label}
          type="button"
          onClick={action}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:border-brand-300 hover:text-brand-700"
        >
          <Icon className="h-4 w-4" />
          {label}
        </button>
      ))}
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:border-brand-300 hover:text-brand-700"
      >
        <Link2 className="h-4 w-4" />
        نسخ الرابط
      </button>
    </div>
  );
}

export default ShareButtons;
