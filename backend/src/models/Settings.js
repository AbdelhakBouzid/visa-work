import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      default: 'visa-work'
    },
    siteDescription: {
      type: String,
      default: 'منصة عربية متخصصة في العمل بالخارج والتأشيرات والهجرة القانونية.'
    },
    logo: {
      type: String,
      default: '/visa-work-logo.svg'
    },
    socialLinks: {
      facebook: { type: String, default: '' },
      x: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      youtube: { type: String, default: '' }
    },
    footerText: {
      type: String,
      default: 'visa-work - بوابتك العربية لفهم العمل بالخارج والتأشيرات.'
    },
    contactEmail: {
      type: String,
      default: 'contact@visa-work.com'
    },
    home: {
      heroTitle: {
        type: String,
        default: 'ابدأ رحلتك نحو العمل بالخارج بخطوات واضحة وموثوقة'
      },
      heroSubtitle: {
        type: String,
        default: 'مقالات عربية احترافية تساعدك في فرص العمل، تأشيرات العمل، الوثائق المطلوبة، وطرق دفع الرسوم بأمان.'
      },
      heroCtaText: {
        type: String,
        default: 'استكشف أحدث المقالات'
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
        latest: { type: String, default: 'أحدث المقالات' },
        featured: { type: String, default: 'مقالات مختارة' },
        popular: { type: String, default: 'الأكثر قراءة' },
        workAbroad: { type: String, default: 'العمل بالخارج' },
        workVisa: { type: String, default: 'تأشيرة العمل' },
        immigration: { type: String, default: 'أدلة الهجرة' },
        visaPaymentMethods: { type: String, default: 'طرق دفع رسوم التأشيرة' },
        requiredDocuments: { type: String, default: 'الوثائق المطلوبة' }
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
