import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      default: 'visa-work'
    },
    siteDescription: {
      type: String,
      default: 'منصة عربية عملية تضم مقالات وأدلة وقوائم مراجعة حول العمل بالخارج وتأشيرات العمل والهجرة القانونية.'
    },
    logo: {
      type: String,
      default: '/logo.svg'
    },
    socialLinks: {
      facebook: { type: String, default: '' },
      x: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      youtube: { type: String, default: '' }
    },
    footerText: {
      type: String,
      default: 'visa-work - مكتبة عربية عملية لفهم العمل بالخارج والتأشيرات والانتقال القانوني.'
    },
    contactEmail: {
      type: String,
      default: 'contact.visa.work@gmail.com'
    },
    home: {
      heroTitle: {
        type: String,
        default: 'مكتبة عربية عملية لفهم العمل بالخارج وتأشيرات العمل دون تشويش'
      },
      heroSubtitle: {
        type: String,
        default:
          'مقالات واضحة، أدلة قصيرة، وقوائم مراجعة تساعدك على البحث الآمن عن الوظائف، تجهيز الوثائق، والاستعداد للمقابلة.'
      },
      heroCtaText: {
        type: String,
        default: 'تصفح المكتبة الآن'
      },
      featuredArticleIds: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Article',
        default: []
      },
      highlightedCategoryIds: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Category',
        default: []
      },
      sectionTitles: {
        latest: { type: String, default: 'أحدث المواد' },
        featured: { type: String, default: 'مختارات أساسية للبداية' },
        popular: { type: String, default: 'الأكثر قراءة' },
        workAbroad: { type: String, default: 'العمل بالخارج' },
        workVisa: { type: String, default: 'تأشيرة العمل' },
        immigration: { type: String, default: 'الهجرة القانونية' },
        visaPaymentMethods: { type: String, default: 'طرق دفع الرسوم' },
        requiredDocuments: { type: String, default: 'الوثائق المطلوبة' },
        tipsGuides: { type: String, default: 'نصائح وأدلة عملية' }
      }
    },
    newsletterEmails: {
      type: [String],
      default: []
    },
    contactMessages: {
      type: [
        {
          name: String,
          email: String,
          message: String,
          createdAt: {
            type: Date,
            default: Date.now
          }
        }
      ],
      default: []
    }
  },
  { timestamps: true }
);

export const Settings = mongoose.model('Settings', settingsSchema);
