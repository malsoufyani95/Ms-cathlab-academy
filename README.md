# Cath Lab Academy — Official Prototype

نسخة رسمية متقدمة من موقع/منصة تدريب القسطرة القلبية. تم تطويرها لتكون مناسبة للعرض أمام الإدارة أو فريق التعليم المستمر كنموذج Launch-ready قبل إضافة قاعدة بيانات وتسجيل دخول.

## المميزات الحالية

- Landing page رسمية بتصميم Premium dark clinical style.
- SEO metadata داخل `index.html`.
- Navigation sections:
  - الرئيسية
  - المسارات التدريبية
  - المحاكاة
  - التقييم
  - خطة الإطلاق
- 4 مسارات تدريب:
  - Recovery Nurse
  - Circulating Nurse
  - Scrub Nurse / Technologist
  - Quality & CPD
- Competency checklist محفوظة محليًا عبر `localStorage`.
- Interactive STEMI / complications simulation مع feedback فوري.
- 3D Coronary orientation prototype قابل للاستبدال لاحقًا بـ GLB/WebXR.
- Knowledge assessment.
- Certificate preview + Print / Save PDF.
- Official launch roadmap.
- Responsive design للجوال والتابلت.
- Print stylesheet لإخراج تقرير/شهادة بشكل أنظف.

## التشغيل محليًا

التعليمات العربية المفصلة لـ Windows والجوال موجودة في [LOCAL_SETUP_AR.md](./LOCAL_SETUP_AR.md).

```bash
npm ci
npm run dev
```

ثم افتح:

```bash
http://localhost:5173
```

## بناء نسخة للنشر

```bash
npm run check
```

ملفات النشر ستكون داخل:

```bash
dist/
```

## النشر الرسمي المقترح

### Vercel

- Framework: Vite
- Build command:

```bash
npm run build
```

- Output directory:

```bash
dist
```

### Netlify

- Build command: `npm run build`
- Publish directory: `dist`

## قبل الاستخدام الرسمي

هذا الموقع تعليمي Prototype وليس أداة طبية علاجية. قبل استخدامه رسميًا داخل منشأة صحية يجب:

1. مراجعة المحتوى واعتماده من Cath Lab education / clinical governance.
2. مطابقته لسياسات المستشفى والبروتوكولات المحلية.
3. إضافة Privacy Policy و Terms عند جمع بيانات موظفين.
4. إضافة Backend آمن إذا سيتم حفظ درجات أو بيانات مستخدمين.
5. اعتماد آلية trainer sign-off.

## التطوير القادم

المراجعة التقنية وخطة الأولويات موجودة في [PROJECT_REVIEW_AR.md](./PROJECT_REVIEW_AR.md).

- Supabase/Firebase authentication.
- Trainer dashboard حقيقي.
- Database للمتدربين والدرجات.
- Course builder لإضافة فيديوهات وملفات.
- Certificate generation باسم المتدرب.
- 3D GLB anatomical model.
- WebXR / AR marker للأدوات.
- LMS integration.
