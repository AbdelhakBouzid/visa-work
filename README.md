# visa-work

منصة عربية كاملة بنظام RTL مخصصة للعمل بالخارج، تأشيرات العمل، الهجرة القانونية، الوثائق المطلوبة، وطرق دفع رسوم التأشيرة.

## التقنية

- `frontend`: React + Vite + TailwindCSS + React Router
- `backend`: Node.js + Express
- `database`: MongoDB + Mongoose
- `auth`: JWT + bcryptjs

## المزايا

- واجهة عامة عربية احترافية ومتجاوبة
- لوحة إدارة محمية لتسيير المقالات والتصنيفات والإعدادات
- صفحات: الرئيسية، المقالات، المقال المفرد، التصنيف، البحث، من نحن، اتصل بنا، الخصوصية، و404
- إدارة المقالات مع slug وSEO ووسوم وصور وحالة نشر
- إدارة الصفحة الرئيسية والمقالات المميزة والتصنيفات المبرزة
- رفع صور محلي إلى `backend/uploads`
- بيانات seed جاهزة

## التشغيل

1. أنشئ ملف البيئة `backend/.env` عبر نسخ القيم من `backend/.env.example`.
2. ثبّت الاعتماديات:

```bash
npm install
```

3. شغّل بيانات البداية:

```bash
npm run seed
```

4. شغّل المشروع:

```bash
npm run dev
```

## الروابط الافتراضية

- الواجهة: `http://localhost:5173`
- الـ API: `http://localhost:5000/api`

## تسجيل دخول الأدمن

- صفحة `/admin/login` تعرض تسجيل دخول فقط.
- لا يوجد إعداد أولي من الواجهة.
- بيانات الأدمن الأساسية تأتي من متغيرات البيئة:
  `ADMIN_USER`, `ADMIN_PASS`, `ADMIN_SESSION_SECRET`
- بعد تسجيل الدخول الناجح، ينشئ السيرفر Session Cookie آمنة من نوع `HttpOnly`.
- الجلسة تستمر لمدة 7 أيام، وتُستعاد تلقائياً عند فتح لوحة الإدارة من جديد.

## أوامر مهمة

```bash
npm run dev
npm run dev:frontend
npm run dev:backend
npm run build
npm run seed
npm run start
```

## النشر على Vercel كمشروع واحد

- اترك `Root Directory` على `./`
- اجعل `Framework Preset` = `Other` أو `Vite`
- يعتمد المشروع على الملف [vercel.json](/C:/Users/ABDELHAK/Desktop/project/visa-work/vercel.json) الموجود في الجذر
- الـ frontend سيُبنى من `frontend/dist`
- الـ API سيعمل من خلال `api/index.js` و `api/[...path].js`

### متغيرات Vercel المطلوبة

- `MONGO_URI`
- `ADMIN_USER`
- `ADMIN_PASS`
- `ADMIN_SESSION_SECRET`
- `CLIENT_URL`

### متغير مهم لرفع الصور على Vercel

- `BLOB_READ_WRITE_TOKEN`

بدون `BLOB_READ_WRITE_TOKEN` سيعمل الموقع، لكن رفع الصور من لوحة الإدارة لن يعمل بشكل دائم على Vercel.

## API الأساسية

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/articles`
- `GET /api/articles/:slug`
- `POST /api/articles`
- `PUT /api/articles/:id`
- `DELETE /api/articles/:id`
- `GET /api/categories`
- `POST /api/categories`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`
- `GET /api/settings`
- `PUT /api/settings`
- `GET /api/dashboard/stats`
- `POST /api/uploads/image`
- `GET /api/public/home`
- `POST /api/public/contact`
- `POST /api/public/newsletter`

## التحقق

- نجح `npm run build` للواجهة الأمامية.
- نجح فحص الصياغة لملفات backend الأساسية.
- تشغيل الخادم فعلياً يحتاج MongoDB متاحاً محلياً أو عبر Atlas.
