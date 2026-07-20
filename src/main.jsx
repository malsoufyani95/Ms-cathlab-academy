import { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity,
  Award,
  BarChart3,
  BookOpen,
  Brain,
  Building2,
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronLeft,
  ClipboardCheck,
  Database,
  Download,
  FileText,
  FileCheck2,
  Globe2,
  GraduationCap,
  HeartPulse,
  Hospital,
  IdCard,
  LockKeyhole,
  Menu,
  Monitor,
  PlayCircle,
  Printer,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Target,
  Trophy,
  UploadCloud,
  UserRound,
  Users,
  View,
  X,
  XCircle
} from 'lucide-react';
import {
  ensureProfile,
  enrollInCourse,
  fetchCatalogCourses,
  fetchCurrentProfile,
  fetchDashboardSummary,
  fetchLearningResources,
  fetchTrainerDashboardSummary,
  getCurrentSession,
  isSupabaseConfigured,
  signInWithEmail,
  signOut,
  signUpWithEmail,
  subscribeToAuthChanges,
  uploadLearningResource
} from './lib/supabase.js';
import { usePersistedState } from './usePersistedState.js';
import './styles.css';

const content = {
  en: {
    dir: 'ltr',
    nav: ['Home', 'About', 'Catalog', 'Library', 'Diploma', 'Dashboard', 'Login', 'Certificate'],
    switchTo: 'العربية',
    heroTitle: 'Role-based Cath Lab training with competency validation',
    heroText: 'Discover Cath Lab courses, enroll as a trainee, track progress, complete simulation practice, and prepare for trainer-led competency sign-off.',
    explore: 'Start learning',
    printCertificate: 'Print Certificate',
    os: 'Clinical Training OS',
    signed: 'Completed',
    executiveOverview: 'Executive Overview',
    overviewTitle: 'Built for clinical training governance',
    overviewText: 'A structured training experience that connects education, simulation, observed competency, trainer sign-off, and readiness reporting in one modern Cath Lab Academy interface.',
    visionMissionTitle: 'Vision, Mission & About',
    aboutTitle: 'About Cath Lab Academy',
    aboutText: 'Cath Lab Academy is designed as a professional education hub for cardiac catheterization teams. It supports onboarding, continuous professional development, simulation-based learning, competency validation, and departmental quality improvement.',
    vision: 'Vision',
    visionText: 'To become a leading digital education and competency platform for Cath Lab professionals, improving consistency, safety, and clinical readiness across the team.',
    mission: 'Mission',
    missionText: 'To deliver clear training pathways, practical simulations, trainer-led competency validation, and accessible bilingual learning resources for every Cath Lab role.',
    values: ['Patient safety first', 'Role-based development', 'Trainer-led validation', 'Continuous improvement'],
    trainingCatalogTitle: 'Core Learning Catalog',
    trainingCatalogText: 'Four practical starting pathways for Cath Lab onboarding and continuous development. Dates and trainer-led sessions can be added when the approved agenda is ready.',
    agendaPending: 'Role-based learning paths',
    dashboardTitle: 'Learning Progress Dashboard',
    dashboardText: 'Your enrolled courses, competency validation, simulation attempts, and certificate readiness are displayed from your secure learner profile when signed in.',
    loginTitle: 'Secure account access',
    loginText: 'Sign in with Supabase Auth to access trainee, trainer, and administrator workflows. New accounts start as trainee profiles until a trainer/admin role is assigned.',
    modulesTitle: 'Official role-based training pathways',
    trainingArchitecture: 'Training Architecture',
    curriculum: 'Curriculum Pathway',
    competency: 'Competency Sign-off',
    heartTitle: '3D Coronary Orientation',
    heartText: 'Prototype visualization — final 3D heart model and WebXR experience can be added in the advanced development phase.',
    selectedAnatomy: 'Selected anatomy',
    rotate: 'Rotate',
    reset: 'Reset',
    simulationTitle: 'Interactive Clinical Simulation',
    simulationScore: 'Simulation score',
    certificateTitle: 'Official Certificate Design Preview',
    certificateSubtitle: 'Cath Lab Academy — Competency Validation Certificate',
    certificateName: 'Mohammed Al-Soufyani',
    certificateStatement: 'has successfully completed the required training pathway and competency validation activities for',
    certificateProgram: 'Cath Lab Foundational Competency Program',
    competencyValidation: 'Competency validation',
    status: 'Status',
    readyStatus: 'Ready for trainer validation',
    progressStatus: 'Training in progress',
    certificateFooter: 'Education and competency validation only — final approval requires trainer sign-off and departmental governance.',
    launchPlan: 'Official Launch Plan',
    launchTitle: 'Readiness to become an official website',
    footer: 'Cath Lab Academy prototype — For education and competency validation only. Not a substitute for hospital policy or clinical judgment.',
    stats: [
      ['4', 'Training Tracks', 'Role-based education'],
      ['3', 'Clinical Scenarios', 'Decision practice'],
      ['20', 'Competencies', 'Trainer sign-off'],
      ['AR/VR', 'Future Ready', 'WebXR pathway']
    ],
    overviewCards: [
      ['Role-based onboarding', 'Recovery, circulating, scrub, and quality pathways with clear progression levels.'],
      ['Competency evidence', 'Checklist-based validation that supports trainer review and departmental records.'],
      ['Simulation readiness', 'Interactive STEMI and complication scenarios to standardize decision-making practice.']
    ],
    catalogCourses: [
      ['Foundation', 'Cath Lab Orientation', 'Core safety, lab workflow, roles, terminology, and patient journey.', 'All new staff', 'Self-paced • 2 hours'],
      ['Nursing', 'Recovery & Access Site Care', 'Post-procedure monitoring, radial/femoral management, complications, and discharge readiness.', 'Recovery nurses', 'Self-paced • 3 hours'],
      ['Procedure Room', 'Circulating & Scrub Essentials', 'Room readiness, sterile field, device verification, documentation, and emergency support.', 'Cath Lab team', 'Blended • 4 hours'],
      ['Quality', 'Competency & CPD Governance', 'Competency matrix, audit readiness, incident learning, and trainer sign-off workflow.', 'Trainers / leaders', 'Workshop • 2 hours']
    ],
    launchCards: [
      ['Governance', 'Medical disclaimer, content review, internal approval, and trainer permissions before official use.'],
      ['Publishing', 'Ready for Vercel/Netlify deployment, custom domain connection, and SSL certificate.'],
      ['Analytics', 'The next phase adds trainee performance tracking and competency results by department.']
    ],
    modules: [
      { id: 'recovery', title: 'Recovery Nurse', subtitle: 'Post-catheterization recovery nursing', icon: Stethoscope, level: 'Foundation → Competent', duration: '4 weeks', outcomes: ['Post Cath observation', 'Access-site management', 'Early complication response'], lessons: ['SBAR handover', 'Radial/Femoral assessment', 'Neurovascular checks', 'Bleeding & hematoma pathway', 'Discharge readiness'], competencies: ['Patient ID/allergy verified', 'Access site assessed', 'Distal pulses documented', 'Pain and vitals trended', 'Escalation done with SBAR'] },
      { id: 'circulating', title: 'Circulating Nurse', subtitle: 'Cath Lab circulating nursing', icon: Monitor, level: 'Novice → Independent', duration: '6 weeks', outcomes: ['Room readiness', 'Team safety', 'Medication & documentation accuracy'], lessons: ['Pre-procedure safety checklist', 'Timeout leadership', 'ACT/Heparin tracking', 'Contrast/radiation safety', 'Emergency conversion support'], competencies: ['Consent status checked', 'Timeout completed', 'Emergency cart ready', 'ACT documented', 'Critical timestamps captured'] },
      { id: 'scrub', title: 'Scrub Nurse / Technologist', subtitle: 'Sterile field and device support', icon: ShieldCheck, level: 'Assisted → Competent', duration: '8 weeks', outcomes: ['Sterile workflow', 'Device preparation', 'Operator anticipation'], lessons: ['Sterile field setup', 'Wire/catheter handling', 'Balloon/stent preparation', 'Device verification', 'Sharps safety'], competencies: ['Sterility maintained', 'Wire handled safely', 'Stent size/expiry confirmed', 'Sharps safety followed', 'Device labels transferred'] },
      { id: 'quality', title: 'Quality & CPD', subtitle: 'Quality and continuous professional development', icon: FileCheck2, level: 'Competent → Trainer', duration: 'Ongoing', outcomes: ['Competency governance', 'Audit readiness', 'Continuous education'], lessons: ['Competency matrix', 'Incident learning', 'Monthly CPD plan', 'Policy alignment', 'Trainer sign-off'], competencies: ['Competency evidence attached', 'Audit gap identified', 'Action plan assigned', 'Policy reference linked', 'Trainer sign-off completed'] }
    ],
    scenarios: [
      { title: 'STEMI Activation', subtitle: 'STEMI pathway activation', priority: 'Critical', prompt: 'Patient arrives from ER with ECG-confirmed STEMI and urgent handover.', question: 'What is the first high-reliability action?', choices: ['Open all PCI devices immediately', 'Verify patient identity, allergies, consent status, ECG, IV access and team readiness', 'Wait until angiography result'], answer: 1, why: 'This prevents wrong patient/procedure/allergy events while preserving the urgent STEMI workflow.' },
      { title: 'Radial Hematoma', subtitle: 'Swelling and pain after radial catheterization', priority: 'High', prompt: 'Recovery nurse notices swelling and increasing pain at the radial access site.', question: 'Best immediate nursing response?', choices: ['Apply compression, assess neurovascular status, notify operator and document', 'Ignore if pulse is still present', 'Remove all monitoring and discharge'], answer: 0, why: 'Early compression and neurovascular checks reduce progression and detect limb compromise.' },
      { title: 'Stent Verification', subtitle: 'Device verification before use', priority: 'High', prompt: 'Operator requests a drug-eluting stent during PCI.', question: 'What should the scrub role verify verbally?', choices: ['Brand only', 'Size, length, expiry, pressure limit, operator request and packaging integrity', 'Nothing unless complication occurs'], answer: 1, why: 'Closed-loop device verification prevents wrong-size, expired-device, and documentation errors.' }
    ],
    roadmap: [['Phase 1', 'Official website + training catalog', 'Ready'], ['Phase 2', 'User accounts + trainer dashboard', 'Prototype'], ['Phase 3', 'Database, certificates, analytics', 'Next'], ['Phase 4', '3D GLB heart + WebXR/AR markers', 'Advanced'], ['Phase 5', 'Hospital LMS integration', 'Enterprise']]
  },
  ar: {
    dir: 'rtl',
    nav: ['الرئيسية', 'من نحن', 'كتالوج التدريب', 'مكتبة التدريب', 'الدبلوم', 'لوحة التحكم', 'الدخول', 'الشهادة'],
    switchTo: 'English',
    heroTitle: 'تدريب Cath Lab حسب الدور مع اعتماد الكفاءات',
    heroText: 'استعرض الدورات، سجّل كمتدرب، تابع تقدمك، تدرب بالمحاكاة، واستعد لاعتماد الكفاءة بإشراف المدرب.',
    explore: 'ابدأ التعلم',
    printCertificate: 'طباعة الشهادة',
    os: 'نظام التدريب السريري',
    signed: 'مكتملة',
    executiveOverview: 'ملخص تنفيذي',
    overviewTitle: 'مصمم لحوكمة التدريب السريري',
    overviewText: 'تجربة تدريب منظمة تربط التعليم، المحاكاة، تقييم الكفاءات، اعتماد المدرب، وتقارير الجاهزية في واجهة حديثة لمنصة Cath Lab Academy.',
    visionMissionTitle: 'الرؤية والرسالة ومن نحن',
    aboutTitle: 'عن Cath Lab Academy',
    aboutText: 'Cath Lab Academy منصة تعليمية احترافية لفريق القسطرة القلبية، تدعم تأهيل الموظفين، التعليم المستمر، التعلم بالمحاكاة، تقييم الكفاءات، وتحسين جودة القسم.',
    vision: 'الرؤية',
    visionText: 'أن تكون منصة تعليمية رقمية رائدة لتطوير كفاءات العاملين في القسطرة القلبية، وتحسين الاتساق والسلامة والجاهزية السريرية للفريق.',
    mission: 'الرسالة',
    missionText: 'تقديم مسارات تدريب واضحة، محاكاة عملية، اعتماد كفاءات بإشراف المدربين، ومصادر تعليمية ثنائية اللغة لجميع أدوار Cath Lab.',
    values: ['سلامة المريض أولًا', 'تطوير حسب الدور', 'اعتماد بإشراف المدرب', 'تحسين مستمر'],
    trainingCatalogTitle: 'كتالوج التعلم الأساسي',
    trainingCatalogText: 'أربعة مسارات عملية لتهيئة فريق القسطرة والتطوير المستمر. يمكن إضافة التواريخ والجلسات بإشراف المدرب عند اعتماد الأجندة.',
    agendaPending: 'مسارات تعلم حسب الدور',
    dashboardTitle: 'لوحة تقدم المتدرب',
    dashboardText: 'تظهر الدورات المسجلة واعتماد الكفاءات ومحاولات المحاكاة وجاهزية الشهادة من ملف المتدرب الآمن عند تسجيل الدخول.',
    loginTitle: 'الوصول الآمن للحساب',
    loginText: 'سجّل الدخول عبر Supabase Auth للوصول إلى مسارات المتدرب والمدرب والإدارة. الحسابات الجديدة تبدأ كمتدرب حتى يتم تعيين صلاحية مدرب أو إدارة.',
    modulesTitle: 'مسارات تدريب رسمية حسب الدور الوظيفي',
    trainingArchitecture: 'هيكلة التدريب',
    curriculum: 'المسار التعليمي',
    competency: 'اعتماد الكفاءات',
    heartTitle: 'توجيه ثلاثي الأبعاد للشرايين التاجية',
    heartText: 'تصور أولي — يمكن إضافة مجسم قلب 3D وتجربة WebXR في مرحلة التطوير المتقدمة.',
    selectedAnatomy: 'العنصر المحدد',
    rotate: 'تدوير',
    reset: 'إعادة',
    simulationTitle: 'محاكاة سريرية تفاعلية',
    simulationScore: 'نتيجة المحاكاة',
    certificateTitle: 'معاينة تصميم شهادة رسمية',
    certificateSubtitle: 'Cath Lab Academy — شهادة اعتماد الكفاءة',
    certificateName: 'Mohammed Al-Soufyani',
    certificateStatement: 'أكمل بنجاح متطلبات المسار التدريبي وأنشطة تقييم الكفاءة الخاصة بـ',
    certificateProgram: 'برنامج الكفاءة التأسيسية للقسطرة القلبية',
    competencyValidation: 'اعتماد الكفاءات',
    status: 'الحالة',
    readyStatus: 'جاهز لاعتماد المدرب',
    progressStatus: 'التدريب قيد التقدم',
    certificateFooter: 'للتعليم واعتماد الكفاءات فقط — الاعتماد النهائي يتطلب توقيع المدرب وحوكمة القسم.',
    launchPlan: 'خطة الإطلاق الرسمية',
    launchTitle: 'جاهزية التحويل إلى موقع رسمي',
    footer: 'نموذج Cath Lab Academy — للتعليم وتقييم الكفاءات فقط، وليس بديلًا عن سياسات المستشفى أو الحكم السريري.',
    stats: [['4', 'مسارات تدريب', 'تعليم حسب الدور'], ['3', 'سيناريوهات سريرية', 'تدريب اتخاذ القرار'], ['20', 'كفاءة', 'اعتماد المدرب'], ['AR/VR', 'جاهز للمستقبل', 'مسار WebXR']],
    overviewCards: [['تهيئة حسب الدور', 'مسارات Recovery وCirculating وScrub والجودة مع مستويات تقدم واضحة.'], ['إثبات الكفاءة', 'اعتماد مبني على قوائم تحقق يدعم مراجعة المدرب وسجلات القسم.'], ['جاهزية المحاكاة', 'سيناريوهات STEMI والمضاعفات لتوحيد التدريب على اتخاذ القرار.']],
    catalogCourses: [['تأسيسي', 'Cath Lab Orientation', 'السلامة الأساسية، سير العمل، الأدوار، المصطلحات، ورحلة المريض.', 'جميع الموظفين الجدد', 'ذاتي • ساعتان'], ['تمريض', 'Recovery & Access Site Care', 'مراقبة ما بعد الإجراء، إدارة Radial/Femoral، المضاعفات، وجاهزية الخروج.', 'ممرضو الإفاقة', 'ذاتي • 3 ساعات'], ['غرفة الإجراء', 'Circulating & Scrub Essentials', 'جاهزية الغرفة، الحقل المعقم، التحقق من الأجهزة، التوثيق، ودعم الطوارئ.', 'فريق Cath Lab', 'مدمج • 4 ساعات'], ['جودة', 'Competency & CPD Governance', 'مصفوفة الكفاءات، جاهزية التدقيق، التعلم من الحوادث، واعتماد المدرب.', 'المدربون والقادة', 'ورشة • ساعتان']],
    launchCards: [['الحوكمة', 'تنبيه طبي، مراجعة محتوى، اعتماد داخلي، وصلاحيات مدربين قبل الاستخدام الرسمي.'], ['النشر', 'جاهز للنشر على Vercel/Netlify، ثم ربط دومين رسمي وشهادة SSL.'], ['التحليلات', 'المرحلة القادمة تضيف متابعة أداء المتدربين ونتائج الكفاءات حسب القسم.']],
    modules: [
      { id: 'recovery', title: 'Recovery Nurse', subtitle: 'تمريض الإفاقة بعد القسطرة', icon: Stethoscope, level: 'تأسيسي → كفء', duration: '4 أسابيع', outcomes: ['مراقبة ما بعد القسطرة', 'العناية بموقع الدخول', 'الاستجابة المبكرة للمضاعفات'], lessons: ['تسليم SBAR', 'تقييم Radial/Femoral', 'فحص Neurovascular', 'مسار النزيف والورم الدموي', 'جاهزية الخروج'], competencies: ['تم التحقق من الهوية والحساسية', 'تم تقييم موقع الدخول', 'تم توثيق النبضات الطرفية', 'تمت متابعة الألم والعلامات الحيوية', 'تم التصعيد بصيغة SBAR'] },
      { id: 'circulating', title: 'Circulating Nurse', subtitle: 'تمريض التداول داخل غرفة القسطرة', icon: Monitor, level: 'مبتدئ → مستقل', duration: '6 أسابيع', outcomes: ['جاهزية الغرفة', 'سلامة الفريق', 'دقة الأدوية والتوثيق'], lessons: ['قائمة السلامة قبل الإجراء', 'قيادة Timeout', 'متابعة ACT/Heparin', 'سلامة الصبغة والإشعاع', 'دعم التحول للطوارئ'], competencies: ['تم التحقق من الموافقة', 'تم إكمال Timeout', 'عربة الطوارئ جاهزة', 'تم توثيق ACT', 'تم تسجيل الأوقات الحرجة'] },
      { id: 'scrub', title: 'Scrub Nurse / Technologist', subtitle: 'التعقيم والمساعدة التقنية', icon: ShieldCheck, level: 'بمساعدة → كفء', duration: '8 أسابيع', outcomes: ['سير عمل معقم', 'تحضير الأجهزة', 'توقع احتياج الطبيب'], lessons: ['تجهيز الحقل المعقم', 'التعامل مع Wire/Catheter', 'تحضير Balloon/Stent', 'التحقق من الأجهزة', 'سلامة الأدوات الحادة'], competencies: ['تم الحفاظ على التعقيم', 'تم التعامل مع Wire بأمان', 'تم تأكيد مقاس وصلاحية Stent', 'اتباع سلامة الأدوات الحادة', 'نقل ملصقات الأجهزة للتوثيق'] },
      { id: 'quality', title: 'Quality & CPD', subtitle: 'الجودة والتعليم المستمر', icon: FileCheck2, level: 'كفء → مدرب', duration: 'مستمر', outcomes: ['حوكمة الكفاءات', 'جاهزية التدقيق', 'التعليم المستمر'], lessons: ['مصفوفة الكفاءات', 'التعلم من الحوادث', 'خطة CPD شهرية', 'مطابقة السياسات', 'اعتماد المدرب'], competencies: ['تم إرفاق دليل الكفاءة', 'تم تحديد فجوة تدقيق', 'تم تعيين خطة عمل', 'تم ربط مرجع السياسة', 'تم اعتماد المدرب'] }
    ],
    scenarios: [
      { title: 'تفعيل STEMI', subtitle: 'تفعيل مسار STEMI', priority: 'حرج', prompt: 'يصل المريض من الطوارئ مع ECG يؤكد STEMI وتسليم عاجل.', question: 'ما أول إجراء عالي الموثوقية؟', choices: ['فتح جميع أجهزة PCI مباشرة', 'التحقق من الهوية والحساسية والموافقة وECG والوريد وجاهزية الفريق', 'الانتظار حتى نتيجة التصوير'], answer: 1, why: 'هذا يمنع أخطاء المريض/الإجراء/الحساسية مع الحفاظ على سرعة مسار STEMI.' },
      { title: 'Radial Hematoma', subtitle: 'تورم وألم بعد القسطرة الشعاعية', priority: 'عالٍ', prompt: 'لاحظ ممرض الإفاقة تورمًا وألمًا متزايدًا في موقع الدخول الشعاعي.', question: 'أفضل استجابة تمريضية فورية؟', choices: ['الضغط، تقييم Neurovascular، إبلاغ الطبيب، والتوثيق', 'تجاهله إذا كان النبض موجودًا', 'إزالة المراقبة والخروج'], answer: 0, why: 'الضغط المبكر وفحص Neurovascular يقللان التفاقم ويكشفان أي تأثر في الطرف.' },
      { title: 'Stent Verification', subtitle: 'التحقق من الدعامة قبل الاستخدام', priority: 'عالٍ', prompt: 'طلب الطبيب Drug-eluting stent أثناء PCI.', question: 'ماذا يجب أن يؤكد دور Scrub شفهيًا؟', choices: ['العلامة التجارية فقط', 'المقاس والطول والصلاحية وحد الضغط وطلب الطبيب وسلامة التغليف', 'لا شيء إلا عند حدوث مضاعفة'], answer: 1, why: 'التحقق المغلق يقلل أخطاء المقاس أو الصلاحية أو التوثيق.' }
    ],
    roadmap: [['المرحلة 1', 'موقع رسمي + كتالوج تدريب', 'جاهز'], ['المرحلة 2', 'حسابات مستخدمين + لوحة مدرب', 'نموذج'], ['المرحلة 3', 'قاعدة بيانات وشهادات وتحليلات', 'التالي'], ['المرحلة 4', 'مجسم GLB و WebXR/AR markers', 'متقدم'], ['المرحلة 5', 'تكامل LMS للمستشفى', 'مؤسسي']]
  }
};

function competencyStorageKey(moduleId, index) {
  return `${moduleId}:${index}`;
}

function legacyCompetencyKeys(moduleId, index) {
  return ['en', 'ar'].map(lang => {
    const module = content[lang].modules.find(item => item.id === moduleId);
    return module?.competencies[index] ? `${moduleId}:${module.competencies[index]}` : null;
  }).filter(Boolean);
}

function isCompetencyComplete(checks, moduleId, index) {
  const stableKey = competencyStorageKey(moduleId, index);
  if (Object.prototype.hasOwnProperty.call(checks, stableKey)) return !!checks[stableKey];
  return legacyCompetencyKeys(moduleId, index).some(key => !!checks[key]);
}

function countCompletedCompetencies(checks) {
  return content.en.modules.reduce((total, module) => total + module.competencies.reduce((moduleTotal, _, index) => moduleTotal + (isCompetencyComplete(checks, module.id, index) ? 1 : 0), 0), 0);
}

function Stat({ icon: Icon, value, label, note }) {
  return <div className="stat"><Icon /><strong>{value}</strong><span>{label}</span><small>{note}</small></div>;
}

function TopNav({ t, lang, setLang }) {
  const [open, setOpen] = useState(false);
  const hrefs = ['#home', '#about', '#catalog', '#resources', './program.html', '#dashboard', '#login', '#certificate'];
  const menuLabel = lang === 'ar' ? 'القائمة الرئيسية' : 'Main menu';
  return <nav className="topnav" aria-label={menuLabel}>
    <a className="brand" href="#home" onClick={() => setOpen(false)}><HeartPulse aria-hidden="true" /> Cath Lab Academy</a>
    <button className="mobile-menu-toggle" type="button" aria-label={menuLabel} aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    <div id="primary-navigation" className={`nav-links ${open ? 'open' : ''}`}>
      {t.nav.map((label, i) => <a key={hrefs[i]} href={hrefs[i]} onClick={() => setOpen(false)}>{label}</a>)}
      <button className="language-toggle" type="button" onClick={() => { setLang(lang === 'en' ? 'ar' : 'en'); setOpen(false); }}><Globe2 /> {t.switchTo}</button>
    </div>
  </nav>;
}

function ExecutiveOverview({ t }) {
  const icons = [Users, ClipboardCheck, Brain];
  return <section className="executive-overview"><div className="overview-copy"><p className="eyebrow">{t.executiveOverview}</p><h2>{t.overviewTitle}</h2><p>{t.overviewText}</p><div className="quality-badges">{['Policy-aligned', 'Trainer-led', 'Bilingual', 'Certificate-ready'].map((badge, i) => <span key={badge}><ShieldCheck /> {i === 0 && t.dir === 'rtl' ? 'متوافق مع السياسات' : i === 1 && t.dir === 'rtl' ? 'بإشراف المدرب' : i === 2 && t.dir === 'rtl' ? 'ثنائي اللغة' : i === 3 && t.dir === 'rtl' ? 'جاهز للشهادة' : badge}</span>)}</div></div><div className="overview-grid">{t.overviewCards.map(([title, text], i) => { const Icon = icons[i]; return <div className="overview-card" key={title}><Icon /><h3>{title}</h3><p>{text}</p></div>; })}</div></section>;
}

function AboutSection({ t }) {
  return <section id="about" className="section about-section"><p className="eyebrow">{t.visionMissionTitle}</p><h2>{t.aboutTitle}</h2><div className="about-layout"><div className="about-main"><Building2 /><p>{t.aboutText}</p><div className="values-row">{t.values.map(value => <span key={value}><CheckCircle2 /> {value}</span>)}</div></div><div className="vm-card"><Target /><h3>{t.vision}</h3><p>{t.visionText}</p></div><div className="vm-card"><Sparkles /><h3>{t.mission}</h3><p>{t.missionText}</p></div></div></section>;
}

function normalizeCatalogCourse(course, index = 0) {
  if (Array.isArray(course)) {
    const [track, title, description, audience, duration] = course;
    return { id: null, slug: `fallback-${index}`, track, title, description, audience, duration, level: track };
  }
  return {
    id: course.id,
    slug: course.slug || `course-${index}`,
    track: course.track,
    title: course.title,
    description: course.description,
    audience: course.audience,
    duration: course.duration,
    level: course.level || course.track,
  };
}

function TrustReadiness({ t }) {
  const rtl = t.dir === 'rtl';
  const items = rtl
    ? [
        ['Supabase Auth', 'تسجيل دخول حقيقي وحساب متدرب'],
        ['Database Catalog', 'كتالوج تدريبي ديناميكي من قاعدة البيانات'],
        ['Protected Dashboard', 'قراءة آمنة لبيانات المتدرب فقط'],
        ['Certificate Ready', 'بنية جاهزة للتحقق من الشهادات']
      ]
    : [
        ['Supabase Auth', 'Real login and trainee accounts'],
        ['Database Catalog', 'Dynamic course catalog from Supabase'],
        ['Protected Dashboard', 'Secure trainee-owned dashboard reads'],
        ['Certificate Ready', 'Verification-ready certificate structure']
      ];
  return <section className="trust-strip" aria-label={rtl ? 'جاهزية المنصة' : 'Platform readiness'}>{items.map(([title, note]) => <div key={title}><ShieldCheck /><strong>{title}</strong><small>{note}</small></div>)}</section>;
}

function TrainingCatalog({ t, courses, source, session, profile, onEnroll }) {
  const rtl = t.dir === 'rtl';
  const [query, setQuery] = useState('');
  const [trackFilter, setTrackFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [message, setMessage] = useState('');
  const catalogCourses = (courses.length ? courses : t.catalogCourses).map(normalizeCatalogCourse);
  const sourceLabel = source === 'supabase'
    ? (rtl ? 'متصل بقاعدة بيانات Supabase' : 'Connected to Supabase database')
    : (rtl ? 'بيانات تجريبية لحين اكتمال الربط' : 'Demo catalog fallback');
  const tracks = [...new Set(catalogCourses.map(course => course.track).filter(Boolean))];
  const levels = [...new Set(catalogCourses.map(course => course.level).filter(Boolean))];
  const visibleCourses = catalogCourses.filter(course => {
    const text = `${course.track} ${course.title} ${course.description} ${course.audience} ${course.level}`.toLowerCase();
    return (!query || text.includes(query.toLowerCase()))
      && (trackFilter === 'all' || course.track === trackFilter)
      && (levelFilter === 'all' || course.level === levelFilter);
  });

  async function handleEnroll(course) {
    setMessage('');
    if (!session?.user || !profile?.id) {
      setMessage(rtl ? 'سجّل الدخول أولًا لإنشاء تسجيلك في الدورة.' : 'Sign in first to create your course enrollment.');
      return;
    }
    if (!course.id) {
      setMessage(rtl ? 'هذه دورة تجريبية ولا يمكن التسجيل فيها حتى تتصل بقاعدة البيانات.' : 'This is a demo course and cannot be enrolled until database data is available.');
      return;
    }
    try {
      await onEnroll(course);
      setMessage(rtl ? `تم تسجيلك في: ${course.title}` : `Enrollment saved: ${course.title}`);
    } catch (error) {
      setMessage(error.message || String(error));
    }
  }

  return <section id="catalog" className="section catalog-section"><p className="eyebrow">{t.agendaPending}</p><h2>{t.trainingCatalogTitle}</h2><p className="section-lead">{t.trainingCatalogText}</p><div className="quality-badges"><span><Database /> {sourceLabel}</span><span><Users /> {rtl ? 'التسجيل يربط الدورة بملف المتدرب' : 'Enroll connects the course to the trainee profile'}</span></div><div className="catalog-toolbar"><label><span>{rtl ? 'بحث' : 'Search'}</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={rtl ? 'ابحث عن دورة أو مسار...' : 'Search courses or tracks...'} /></label><label><span>{rtl ? 'المسار' : 'Track'}</span><select value={trackFilter} onChange={event => setTrackFilter(event.target.value)}><option value="all">{rtl ? 'كل المسارات' : 'All tracks'}</option>{tracks.map(track => <option key={track} value={track}>{track}</option>)}</select></label><label><span>{rtl ? 'المستوى' : 'Level'}</span><select value={levelFilter} onChange={event => setLevelFilter(event.target.value)}><option value="all">{rtl ? 'كل المستويات' : 'All levels'}</option>{levels.map(level => <option key={level} value={level}>{level}</option>)}</select></label></div>{message && <p className="inline-alert" role="status">{message}</p>}<div className="catalog-grid">{visibleCourses.map(course => <article className="catalog-card" key={course.slug || course.title}><div><span className="track-pill">{course.track}</span><h3>{course.title}</h3><p>{course.description}</p></div><div className="catalog-meta"><span><Users /> {course.audience}</span><span><CalendarDays /> {course.duration}</span><span><Target /> {course.level}</span></div><button className="enroll-button" type="button" onClick={() => handleEnroll(course)}><CheckCircle2 /> {rtl ? 'سجّل في الدورة' : 'Enroll'}</button></article>)}</div>{visibleCourses.length === 0 && <p className="inline-alert">{rtl ? 'لا توجد دورات مطابقة للبحث الحالي.' : 'No courses match the current filters.'}</p>}</section>;
}





function formatFileSize(bytes, rtl) {
  const size = Number(bytes || 0);
  if (!size) return rtl ? 'حجم غير محدد' : 'Size unavailable';
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function TrainingLibrary({ lang, courses, resources, loading, session, profile, onUpload, onRefresh }) {
  const rtl = lang === 'ar';
  const canUpload = Boolean(profile && ['trainer', 'admin'].includes(profile.role));
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState('');
  const [resourceType, setResourceType] = useState('document');
  const [visibility, setVisibility] = useState('trainee');
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const courseOptions = courses.filter(course => course.id);
  const labels = rtl
    ? {
        eyebrow: 'مكتبة التدريب',
        title: 'Training Library + Upload Center',
        lead: 'ارفع ملفات التدريب بشكل آمن، اربطها بالدورات، واعرضها للمتدربين من Supabase Storage.',
        login: 'سجّل الدخول لعرض مكتبة التدريب.',
        uploadOnly: 'الرفع مخصص للمدرب أو الإدارة فقط. المتدرب يشاهد الملفات المتاحة له.',
        uploadTitle: 'رفع ملف تدريبي',
        resourceTitle: 'عنوان الملف',
        description: 'وصف مختصر',
        course: 'الدورة المرتبطة',
        noCourse: 'بدون دورة محددة',
        type: 'نوع الملف',
        visibility: 'الصلاحية',
        file: 'الملف',
        submit: 'رفع الملف',
        uploading: 'جاري الرفع...',
        uploaded: 'تم رفع الملف وحفظ بياناته.',
        empty: 'لا توجد ملفات تدريب مرفوعة بعد.',
        refresh: 'تحديث المكتبة',
        open: 'فتح / تحميل',
        uploadedBy: 'رفع بواسطة',
        types: { document: 'مستند PDF/DOC', presentation: 'عرض PPT', video: 'فيديو', image: 'صورة', arvr_model: 'نموذج 3D/AR', checklist: 'Checklist', other: 'أخرى' },
        vis: { trainee: 'متاح للمتدربين', trainer: 'مدرب/إدارة', admin: 'إدارة فقط' }
      }
    : {
        eyebrow: 'Training Library',
        title: 'Training Library + Upload Center',
        lead: 'Upload training files securely, attach them to courses, and publish them to learners from Supabase Storage.',
        login: 'Sign in to view the training library.',
        uploadOnly: 'Upload is limited to Trainer/Admin. Trainees can view assigned resources.',
        uploadTitle: 'Upload training file',
        resourceTitle: 'Resource title',
        description: 'Short description',
        course: 'Linked course',
        noCourse: 'No specific course',
        type: 'File type',
        visibility: 'Visibility',
        file: 'File',
        submit: 'Upload file',
        uploading: 'Uploading...',
        uploaded: 'File uploaded and indexed.',
        empty: 'No training resources uploaded yet.',
        refresh: 'Refresh library',
        open: 'Open / download',
        uploadedBy: 'Uploaded by',
        types: { document: 'PDF/DOC document', presentation: 'PPT presentation', video: 'Video', image: 'Image', arvr_model: '3D/AR model', checklist: 'Checklist', other: 'Other' },
        vis: { trainee: 'Available to trainees', trainer: 'Trainer/Admin', admin: 'Admin only' }
      };

  async function submitUpload(event) {
    event.preventDefault();
    setStatus('');
    if (!canUpload) {
      setStatus(labels.uploadOnly);
      return;
    }
    if (!file) {
      setStatus(rtl ? 'اختر ملفًا أولًا.' : 'Select a file first.');
      return;
    }
    setBusy(true);
    try {
      await onUpload({ file, title, description, courseId, resourceType, visibility });
      setTitle('');
      setDescription('');
      setCourseId('');
      setResourceType('document');
      setVisibility('trainee');
      setFile(null);
      event.currentTarget.reset();
      setStatus(labels.uploaded);
    } catch (error) {
      setStatus(error.message || String(error));
    } finally {
      setBusy(false);
    }
  }

  return <section id="resources" className="section resources-section"><p className="eyebrow">{labels.eyebrow}</p><h2>{labels.title}</h2><p className="section-lead">{labels.lead}</p><div className="quality-badges"><span><Database /> Supabase Storage</span><span><ShieldCheck /> {labels.uploadOnly}</span><span><FileText /> PDF • PPTX • DOCX • MP4 • GLB</span></div>{!session?.user && <p className="inline-alert">{labels.login}</p>}<div className="resources-layout"><div className="resource-library-card"><div className="library-head"><h3>{rtl ? 'الملفات المتاحة' : 'Available resources'}</h3><button type="button" className="text-button" onClick={onRefresh} disabled={!session?.user || loading}><RotateCcw /> {labels.refresh}</button></div>{loading && <p className="inline-alert">{rtl ? 'جاري تحميل المكتبة...' : 'Loading library...'}</p>}{!loading && resources.length === 0 && <p className="inline-alert">{labels.empty}</p>}<div className="resource-list">{resources.map(resource => <article key={resource.id} className="resource-item"><div><span className="track-pill">{labels.types[resource.resource_type] || resource.resource_type}</span><h3>{resource.title}</h3>{resource.description && <p>{resource.description}</p>}<div className="catalog-meta"><span><BookOpen /> {resource.courseTitle || labels.noCourse}</span><span><FileCheck2 /> {resource.file_name}</span><span><Database /> {formatFileSize(resource.file_size_bytes, rtl)}</span>{resource.uploadedBy && <span><UserRound /> {labels.uploadedBy}: {resource.uploadedBy}</span>}</div></div>{resource.signedUrl ? <a className="enroll-button" href={resource.signedUrl} target="_blank" rel="noreferrer"><Download /> {labels.open}</a> : <span className="inline-alert">{rtl ? 'الرابط غير متاح' : 'Link unavailable'}</span>}</article>)}</div></div><form className="upload-card" onSubmit={submitUpload}><h3><UploadCloud /> {labels.uploadTitle}</h3><label><span>{labels.resourceTitle}</span><input value={title} onChange={event => setTitle(event.target.value)} placeholder={rtl ? 'مثال: RHC Lecture PDF' : 'Example: RHC Lecture PDF'} disabled={!canUpload || busy} required /></label><label><span>{labels.description}</span><textarea value={description} onChange={event => setDescription(event.target.value)} rows={3} placeholder={rtl ? 'ماذا يحتوي الملف؟' : 'What does this file include?'} disabled={!canUpload || busy} /></label><label><span>{labels.course}</span><select value={courseId} onChange={event => setCourseId(event.target.value)} disabled={!canUpload || busy}><option value="">{labels.noCourse}</option>{courseOptions.map(course => <option key={course.id} value={course.id}>{course.title}</option>)}</select></label><div className="upload-grid"><label><span>{labels.type}</span><select value={resourceType} onChange={event => setResourceType(event.target.value)} disabled={!canUpload || busy}>{Object.entries(labels.types).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label><span>{labels.visibility}</span><select value={visibility} onChange={event => setVisibility(event.target.value)} disabled={!canUpload || busy}>{Object.entries(labels.vis).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></div><label><span>{labels.file}</span><input type="file" onChange={event => setFile(event.target.files?.[0] || null)} disabled={!canUpload || busy} accept=".pdf,.ppt,.pptx,.doc,.docx,.mp4,.png,.jpg,.jpeg,.glb,.gltf" required /></label><button className="ai-submit" type="submit" disabled={!canUpload || busy}><UploadCloud /> {busy ? labels.uploading : labels.submit}</button>{status && <p className="inline-alert" role="status">{status}</p>}</form></div></section>;
}

function AITutor({ lang, session, profile }) {
  const rtl = lang === 'ar';
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const examples = rtl
    ? ['كيف أتعامل مع Radial hematoma بعد PCI؟', 'اشرح لي دور circulating nurse في STEMI activation', 'اعطني مراجعة سريعة عن access site assessment']
    : ['How should I respond to radial hematoma after PCI?', 'Explain the circulating nurse role during STEMI activation', 'Give me a quick review of access site assessment'];

  async function askTutor(event) {
    event.preventDefault();
    setAnswer('');
    setError('');
    if (!session?.user) {
      setError(rtl ? 'سجّل الدخول أولًا لاستخدام مساعد القسطرة الذكي.' : 'Sign in first to use CathLab AI Tutor.');
      return;
    }
    if (question.trim().length < 3) {
      setError(rtl ? 'اكتب سؤالًا تدريبيًا واضحًا.' : 'Enter a clear training question.');
      return;
    }
    setStatus('loading');
    try {
      const response = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, lang, role: profile?.role || 'trainee' }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'AI request failed');
      setAnswer(data.answer || '');
      setStatus('done');
    } catch (err) {
      setError(err.message || String(err));
      setStatus('error');
    }
  }

  return <section id="ai-tutor" className="section ai-tutor-section"><div className="ai-tutor-copy"><p className="eyebrow">{rtl ? 'ذكاء تدريبي' : 'Training AI'}</p><h2>{rtl ? 'مساعد القسطرة الذكي' : 'CathLab AI Tutor'}</h2><p className="section-lead">{rtl ? 'اسأل مساعدًا تدريبيًا عن القسطرة، الأدوار، السلامة، الكفاءات، وسيناريوهات التدريب. الاستخدام تعليمي فقط ويحتاج تسجيل دخول.' : 'Ask a training assistant about Cath Lab roles, safety, competencies, and simulation scenarios. Education-only and sign-in required.'}</p><div className="quality-badges"><span><ShieldCheck /> {rtl ? 'تعليمي فقط' : 'Education only'}</span><span><LockKeyhole /> {rtl ? 'يتطلب تسجيل دخول' : 'Login required'}</span><span><Brain /> OpenAI</span></div></div><form className="ai-tutor-card" onSubmit={askTutor}><label><span>{rtl ? 'سؤالك' : 'Your question'}</span><textarea value={question} onChange={event => setQuestion(event.target.value)} maxLength={1200} rows={5} placeholder={rtl ? 'مثال: كيف أتصرف عند حدوث radial hematoma؟' : 'Example: How should I respond to radial hematoma?'} /></label><div className="ai-example-row">{examples.map(example => <button key={example} type="button" onClick={() => setQuestion(example)}>{example}</button>)}</div><button className="ai-submit" type="submit" disabled={status === 'loading'}><Sparkles /> {status === 'loading' ? (rtl ? 'جاري التفكير...' : 'Thinking...') : (rtl ? 'اسأل المساعد' : 'Ask tutor')}</button>{error && <p className="inline-alert danger-alert" role="alert">{error}</p>}{answer && <article className="ai-answer"><h3>{rtl ? 'الإجابة التدريبية' : 'Training answer'}</h3><p>{answer}</p></article>}<small>{rtl ? 'المساعد لا يستبدل سياسة المستشفى أو الحكم السريري.' : 'The tutor does not replace hospital policy or clinical judgment.'}</small></form></section>;
}

function Dashboard({ t, completed, totalCompetencies, simulationScore, scenarioCount, certificateReady, onReset, session, profile, dashboardSummary }) {
  const rtl = t.dir === 'rtl';
  const usingDatabase = Boolean(session?.user && profile && dashboardSummary);
  const localPct = totalCompetencies ? Math.round((completed / totalCompetencies) * 100) : 0;
  const simulationPct = scenarioCount ? Math.round((simulationScore / scenarioCount) * 100) : 0;
  const dbPct = dashboardSummary?.averageProgress ?? 0;
  const pct = usingDatabase ? dbPct : localPct;
  const validated = dashboardSummary?.validatedCount ?? 0;
  const assessments = dashboardSummary?.assessmentCount ?? totalCompetencies;
  const certificateCount = dashboardSummary?.certificateCount ?? 0;
  const enrollmentCount = dashboardSummary?.enrollmentCount ?? 0;
  const attemptCount = dashboardSummary?.attemptCount ?? simulationScore;
  const dashboardCards = rtl
    ? [[`${pct}%`, 'تقدم التدريب', usingDatabase ? `${enrollmentCount} دورات مسجلة` : `${completed} من ${totalCompetencies}`], [`${validated}/${assessments}`, 'الكفاءات المعتمدة', usingDatabase ? 'من قاعدة البيانات' : 'محفوظة على هذا الجهاز'], [`${attemptCount}`, 'محاولات المحاكاة', usingDatabase ? 'مسجلة في Supabase' : `${simulationScore} من ${scenarioCount}`], [certificateCount ? 'مصدرة' : certificateReady ? 'جاهزة' : 'غير جاهزة', 'حالة الشهادة', certificateCount ? `${certificateCount} شهادة` : 'تتطلب إكمال الكفاءات والمحاكاة']]
    : [[`${pct}%`, 'Training progress', usingDatabase ? `${enrollmentCount} enrolled courses` : `${completed} of ${totalCompetencies}`], [`${validated}/${assessments}`, 'Validated competencies', usingDatabase ? 'From database' : 'Saved on this device'], [`${attemptCount}`, 'Simulation attempts', usingDatabase ? 'Stored in Supabase' : `${simulationScore} of ${scenarioCount}`], [certificateCount ? 'Issued' : certificateReady ? 'Ready' : 'Not ready', 'Certificate status', certificateCount ? `${certificateCount} certificate(s)` : 'Requires competencies and scenarios']];
  const matrixTitle = usingDatabase ? (rtl ? 'لوحة بيانات المتدرب' : 'Trainee data dashboard') : (rtl ? 'مصفوفة الكفاءات المحلية' : 'Local competency matrix');
  const progressText = usingDatabase
    ? (rtl ? `مرحبًا ${profile.full_name} — الدور: ${profile.role}` : `Welcome ${profile.full_name} — role: ${profile.role}`)
    : (rtl ? `${completed}/${totalCompetencies} من عناصر قائمة الكفاءة مكتملة` : `${completed}/${totalCompetencies} competency checklist items completed`);
  const resetLabel = rtl ? 'إعادة ضبط التقدم المحلي' : 'Reset local progress';
  const sourceText = usingDatabase ? (rtl ? 'البيانات تقرأ من Supabase' : 'Data loaded from Supabase') : (rtl ? 'سجّل الدخول لعرض بياناتك من Supabase' : 'Sign in to view your Supabase data');
  return <section id="dashboard" className="section dashboard-section"><p className="eyebrow">{rtl ? 'متابعة مباشرة' : 'Live progress'}</p><h2>{t.dashboardTitle}</h2><p className="section-lead">{t.dashboardText}</p><div className="dashboard-grid">{dashboardCards.map(([value, label, note], i) => { const icons = [BarChart3, ClipboardCheck, Activity, Award]; const Icon = icons[i]; return <div className="dash-card" key={label}><Icon /><strong>{value}</strong><span>{label}</span><small>{note}</small></div>; })}</div><div className="dashboard-panel"><div><h3>{matrixTitle}</h3><div className="progress-line" role="progressbar" aria-label={matrixTitle} aria-valuemin="0" aria-valuemax="100" aria-valuenow={pct}><span style={{ width: `${pct}%` }} /></div><small>{progressText}</small>{usingDatabase && dashboardSummary.enrollments.length > 0 && <div className="mini-list dashboard-enrollments">{dashboardSummary.enrollments.slice(0, 3).map(row => <span key={row.id}><BookOpen /> {row.courses?.[rtl ? 'title_ar' : 'title_en'] || row.courses?.title_en || row.status}: {row.progress_percent}%</span>)}</div>}</div><div className="mini-list"><span><Database /> {sourceText}</span><span><CheckCircle2 /> {rtl ? 'المحاكاة والتقدم المحلي لا يزالان متاحين' : 'Local simulation and progress remain available'}</span><button className="text-button danger-button" type="button" onClick={onReset}><RotateCcw /> {resetLabel}</button></div></div></section>;
}


function TrainerAdminDashboard({ t, profile, summary }) {
  const rtl = t.dir === 'rtl';
  if (!profile || !['trainer', 'admin'].includes(profile.role) || !summary) return null;
  const cards = rtl
    ? [[summary.traineeCount, 'المتدربون', 'حسابات Trainee نشطة'], [summary.enrollmentCount, 'التسجيلات', 'جميع الدورات المسجلة'], [`${summary.averageProgress}%`, 'متوسط التقدم', 'متوسط تقدم المتدربين'], [summary.pendingAssessmentCount, 'اعتمادات معلقة', 'تحتاج مراجعة المدرب']]
    : [[summary.traineeCount, 'Trainees', 'Active trainee accounts'], [summary.enrollmentCount, 'Enrollments', 'All registered courses'], [`${summary.averageProgress}%`, 'Average progress', 'Learner progress average'], [summary.pendingAssessmentCount, 'Pending sign-offs', 'Need trainer review']];
  const title = rtl ? 'لوحة المدرب والإدارة' : 'Trainer / Admin Dashboard';
  const lead = rtl ? 'نظرة إشرافية على المتدربين، التسجيلات، التقدم، واعتمادات الكفاءة من Supabase.' : 'Supervisor view for trainees, enrollments, progress, and competency sign-offs from Supabase.';
  return <section id="trainer-admin" className="section trainer-admin-section"><p className="eyebrow">{profile.role === 'admin' ? 'Admin Console' : 'Trainer Console'}</p><h2>{title}</h2><p className="section-lead">{lead}</p><div className="dashboard-grid">{cards.map(([value, label, note], i) => { const icons = [Users, BookOpen, BarChart3, ClipboardCheck]; const Icon = icons[i]; return <div className="dash-card" key={label}><Icon /><strong>{value}</strong><span>{label}</span><small>{note}</small></div>; })}</div><div className="trainer-layout"><div className="dashboard-panel trainer-table"><h3>{rtl ? 'آخر المتدربين والتسجيلات' : 'Recent trainees and enrollments'}</h3><div className="trainer-list">{summary.enrollments.slice(0, 6).map(row => <div key={row.id}><span><UserRound /> {row.profiles?.full_name || (rtl ? 'متدرب' : 'Trainee')}</span><b>{row.courses?.[rtl ? 'title_ar' : 'title_en'] || row.courses?.title_en || row.status}</b><small>{row.status} • {row.progress_percent}%</small></div>)}{summary.enrollments.length === 0 && <p className="inline-alert">{rtl ? 'لا توجد تسجيلات بعد.' : 'No enrollments yet.'}</p>}</div></div><div className="dashboard-panel trainer-table"><h3>{rtl ? 'الكفاءات والشهادات' : 'Competencies and certificates'}</h3><div className="trainer-list">{summary.pendingAssessments.slice(0, 4).map(row => <div key={row.id}><span><ClipboardCheck /> {row.profiles?.full_name || (rtl ? 'متدرب' : 'Trainee')}</span><b>{row.competencies?.[rtl ? 'title_ar' : 'title_en'] || row.competencies?.title_en || row.competencies?.code}</b><small>{row.status}</small></div>)}{summary.pendingAssessments.length === 0 && <div><span><CheckCircle2 /> {rtl ? 'لا توجد كفاءات معلقة حاليًا' : 'No pending competency sign-offs'}</span><small>{rtl ? 'ستظهر هنا عند إضافة تقييمات الكفاءات.' : 'They will appear here when competency assessments are created.'}</small></div>}<div className="certificate-count"><Award /> {rtl ? `${summary.certificateCount} شهادات صادرة` : `${summary.certificateCount} certificates issued`}</div></div></div></div></section>;
}

function LoginPrototype({ t, session, profile, onAuthChange }) {
  const rtl = t.dir === 'rtl';
  const [mode, setMode] = useState('signin');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const signedIn = Boolean(session?.user);

  const labels = rtl
    ? {
        eyebrow: 'الوصول للحساب',
        signedIn: 'تم تسجيل الدخول',
        signIn: 'تسجيل الدخول',
        create: 'إنشاء حساب متدرب',
        name: 'الاسم الكامل',
        email: 'البريد الإلكتروني',
        password: 'كلمة المرور',
        submitSignIn: 'دخول آمن',
        submitCreate: 'إنشاء الحساب',
        signOut: 'تسجيل الخروج',
        connected: 'متصل بقاعدة بيانات Supabase Auth',
        disabled: 'المصادقة غير مفعلة لأن إعداد Supabase غير موجود.',
        success: 'تمت العملية بنجاح.',
        role: 'الدور',
        trainee: 'متدرب',
        emailHint: 'example@hospital.org',
        passwordHint: '8 أحرف على الأقل'
      }
    : {
        eyebrow: 'Account access',
        signedIn: 'Signed in',
        signIn: 'Sign in',
        create: 'Create trainee account',
        name: 'Full name',
        email: 'Email',
        password: 'Password',
        submitSignIn: 'Secure sign in',
        submitCreate: 'Create account',
        signOut: 'Sign out',
        connected: 'Connected to Supabase Auth database',
        disabled: 'Authentication is disabled because Supabase config is missing.',
        success: 'Action completed successfully.',
        role: 'Role',
        trainee: 'Trainee',
        emailHint: 'example@hospital.org',
        passwordHint: 'At least 8 characters'
      };

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      if (mode === 'signup') {
        await signUpWithEmail(email.trim(), password, fullName.trim());
      } else {
        await signInWithEmail(email.trim(), password);
      }
      setPassword('');
      setMessage(labels.success);
      await onAuthChange();
    } catch (error) {
      setMessage(error.message || String(error));
    } finally {
      setBusy(false);
    }
  }

  async function handleSignOut() {
    setBusy(true);
    setMessage('');
    try {
      await signOut();
      await onAuthChange();
    } catch (error) {
      setMessage(error.message || String(error));
    } finally {
      setBusy(false);
    }
  }

  return <section id="login" className="section login-section"><div className="login-copy"><p className="eyebrow">{labels.eyebrow}</p><h2>{t.loginTitle}</h2><p>{t.loginText}</p><div className="role-tabs"><span>{rtl ? 'متدرب' : 'Trainee'}</span><span>{rtl ? 'مدرب' : 'Trainer'}</span><span>{rtl ? 'إدارة' : 'Admin'}</span></div><div className="quality-badges"><span><Database /> {isSupabaseConfigured ? labels.connected : labels.disabled}</span></div></div><form className="login-card" onSubmit={handleSubmit} aria-label={t.loginTitle}><div className="login-logo"><LockKeyhole /><b>Cath Lab Academy</b></div>{signedIn ? <><div className="auth-status-card"><IdCard /><div><strong>{profile?.full_name || session.user.email}</strong><small>{session.user.email}</small><small>{labels.role}: {profile?.role || labels.trainee}</small></div></div><button type="button" onClick={handleSignOut} disabled={busy}><XCircle /> {labels.signOut}</button></> : <><div className="role-tabs auth-mode-tabs"><button type="button" className={mode === 'signin' ? 'active' : ''} onClick={() => setMode('signin')}>{labels.signIn}</button><button type="button" className={mode === 'signup' ? 'active' : ''} onClick={() => setMode('signup')}>{labels.create}</button></div>{mode === 'signup' && <label><span>{labels.name}</span><div><UserRound /><input type="text" value={fullName} onChange={event => setFullName(event.target.value)} placeholder={rtl ? 'اسم المتدرب' : 'Trainee name'} disabled={!isSupabaseConfigured || busy} /></div></label>}<label><span>{labels.email}</span><div><UserRound /><input type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder={labels.emailHint} required disabled={!isSupabaseConfigured || busy} /></div></label><label><span>{labels.password}</span><div><ShieldCheck /><input type="password" value={password} onChange={event => setPassword(event.target.value)} placeholder={labels.passwordHint} required minLength={8} disabled={!isSupabaseConfigured || busy} /></div></label><button type="submit" disabled={!isSupabaseConfigured || busy}><IdCard /> {mode === 'signup' ? labels.submitCreate : labels.submitSignIn}</button></>}{message && <small aria-live="polite">{message}</small>}</form></section>;
}

function ModuleCard({ module, active, onClick }) {
  const Icon = module.icon;
  return <button type="button" className={`module-card ${active ? 'active' : ''}`} aria-pressed={active} onClick={onClick}>
    <Icon /><b>{module.title}</b><strong>{module.subtitle}</strong><span>{module.outcomes.join(' • ')}</span><small>{module.level} — {module.duration}</small>
  </button>;
}

function ProgramModules({ t, checks, setChecks }) {
  const [selectedId, setSelectedId] = useState(t.modules[0].id);
  const selected = t.modules.find(m => m.id === selectedId) || t.modules[0];
  const Icon = selected.icon;
  const done = selected.competencies.reduce((total, _, index) => total + (isCompetencyComplete(checks, selected.id, index) ? 1 : 0), 0);
  const pct = Math.round((done / selected.competencies.length) * 100);
  return <section id="modules" className="section">
    <p className="eyebrow">{t.trainingArchitecture}</p><h2>{t.modulesTitle}</h2>
    <div className="module-grid">{t.modules.map(m => <ModuleCard key={m.id} module={m} active={selected.id === m.id} onClick={() => setSelectedId(m.id)} />)}</div>
    <div className="detail-panel"><div className="panel-head"><Icon /><div><h3>{selected.title}</h3><p>{selected.subtitle} — {selected.level}</p></div><div className="ring" style={{'--pct': `${pct}%`}}><span>{pct}%</span></div></div>
      <div className="two-col"><div><h4><BookOpen /> {t.curriculum}</h4><ol>{selected.lessons.map(x => <li key={x}>{x}</li>)}</ol></div><div><h4><ClipboardCheck /> {t.competency}</h4>{selected.competencies.map((x, index) => { const stableKey = competencyStorageKey(selected.id, index); return <label className="check" key={stableKey}><input type="checkbox" checked={isCompetencyComplete(checks, selected.id, index)} onChange={e => { const nextChecks = {...checks, [stableKey]: e.target.checked}; legacyCompetencyKeys(selected.id, index).forEach(key => delete nextChecks[key]); setChecks(nextChecks); }} />{x}</label>; })}</div></div>
    </div>
  </section>;
}

function HeartModel({ t }) {
  const [rot, setRot] = useState(0);
  const [selected, setSelected] = useState('LAD');
  return <div className="glass-card heart-card"><div className="card-title"><View /> {t.heartTitle}</div><p>{t.heartText}</p>
    <div className="heart-stage"><div className="heart-model" style={{transform: `rotateY(${rot}deg) rotateX(${Math.sin(rot/40)*9}deg)`}}><div className="heart-core" />{['LAD', 'LCx', 'RCA'].map((a, i) => <button type="button" aria-pressed={selected === a} key={a} onClick={() => setSelected(a)} className={`artery a${i}`}>{a}</button>)}<div className="stent">STENT</div></div></div>
    <div className="info-pill">{t.selectedAnatomy}: <b>{selected}</b></div><div className="actions"><button type="button" onClick={() => setRot(rot - 30)}>{t.rotate}</button><button type="button" onClick={() => setRot(0)}><RotateCcw /> {t.reset}</button></div>
  </div>;
}

function Simulation({ t, answers, setAnswers }) {
  const [index, setIndex] = useState(0);
  const s = t.scenarios[index];
  const score = t.scenarios.reduce((acc, item, i) => acc + (answers[i] === item.answer ? 1 : 0), 0);
  return <section id="simulation" className="section simulation-grid"><HeartModel t={t} /><div className="glass-card scenario-card"><div className="card-title"><PlayCircle /> {t.simulationTitle}</div><div className="timeline" aria-label={t.simulationTitle}>{t.scenarios.map((_, i) => <button type="button" key={i} className={i === index ? 'active' : ''} aria-label={`${t.simulationTitle} ${i + 1}`} aria-pressed={i === index} onClick={() => setIndex(i)}>{i + 1}</button>)}</div><div className="priority">{s.priority}</div><h3>{s.title}</h3><b className="ar-label">{s.subtitle}</b><p>{s.prompt}</p><div className="decision"><strong>{s.question}</strong>{s.choices.map((choice, i) => { const selected = answers[index] === i; const revealed = answers[index] !== undefined; const correct = i === s.answer; return <button type="button" className={`${selected ? 'selected' : ''} ${revealed && correct ? 'correct' : ''} ${revealed && selected && !correct ? 'wrong' : ''}`} key={choice} aria-pressed={selected} onClick={() => setAnswers({...answers, [index]: i})}>{revealed && correct ? <CheckCircle2 /> : revealed && selected && !correct ? <XCircle /> : <ChevronLeft />}{choice}</button>; })}</div>{answers[index] !== undefined && <p className="feedback" aria-live="polite">{s.why}</p>}<div className="score"><Trophy /> {t.simulationScore} {score}/{t.scenarios.length}</div></div></section>;
}

function printCertificate() {
  document.body.classList.add('print-certificate-only');
  window.print();
  window.setTimeout(() => document.body.classList.remove('print-certificate-only'), 500);
}

function CertificatePreview({ t, checks, answers }) {
  const completedCompetencies = countCompletedCompetencies(checks);
  const totalCompetencies = t.modules.reduce((acc, m) => acc + m.competencies.length, 0);
  const simulationScore = t.scenarios.reduce((acc, item, i) => acc + (answers[i] === item.answer ? 1 : 0), 0);
  const ready = completedCompetencies === totalCompetencies && simulationScore === t.scenarios.length;
  const status = ready ? t.readyStatus : t.progressStatus;
  const rtl = t.dir === 'rtl';
  return <section id="certificate" className="section certificate-section"><p className="eyebrow">{rtl ? 'معاينة الشهادة' : 'Certificate preview'}</p><h2>{t.certificateTitle}</h2><div className="certificate"><div className="cert-border"><div className="cert-top"><div className="cert-seal"><Award /></div><div><h3>{t.certificateSubtitle}</h3><span>Cath Lab Academy</span></div></div><div className="cert-body"><p>{t.certificateStatement}</p><h1>{t.certificateName}</h1><h4>{t.certificateProgram}</h4><div className="cert-metrics"><span>{t.competencyValidation}: <b>{completedCompetencies}/{totalCompetencies}</b></span><span>{t.simulationScore}: <b>{simulationScore}/{t.scenarios.length}</b></span><span>{t.status}: <b>{status}</b></span></div></div><div className="cert-signatures"><div><b>{rtl ? 'مدير البرنامج' : 'Program Director'}</b><small>{rtl ? 'التوقيع' : 'Signature'}</small></div><div><b>{rtl ? 'المدرب السريري' : 'Clinical Trainer'}</b><small>{rtl ? 'التوقيع' : 'Signature'}</small></div></div><p className="cert-footer">{t.certificateFooter}</p></div><button type="button" onClick={printCertificate}><Printer /> {t.printCertificate}</button></div></section>;
}

function LaunchReadiness({ t }) {
  const icons = [LockKeyhole, Globe2, BarChart3];
  return <section id="launch" className="section launch"><p className="eyebrow">{t.launchPlan}</p><h2>{t.launchTitle}</h2><div className="roadmap">{t.roadmap.map(([phase, title, status]) => <div className="road" key={phase}><span>{phase}</span><b>{title}</b><small>{status}</small></div>)}</div><div className="launch-grid">{t.launchCards.map(([title, text], i) => { const Icon = icons[i]; return <div key={title}><Icon /><h3>{title}</h3><p>{text}</p></div>; })}</div></section>;
}

function App() {
  const [lang, setLang] = usePersistedState('cathlab-language', 'en');
  const t = content[lang] || content.en;
  const [checks, setChecks] = usePersistedState('cathlab-competencies', {});
  const [answers, setAnswers] = usePersistedState('cathlab-scenario-answers', {});
  const [catalogCourses, setCatalogCourses] = useState([]);
  const [catalogSource, setCatalogSource] = useState(isSupabaseConfigured ? 'loading' : 'fallback');
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [trainerSummary, setTrainerSummary] = useState(null);
  const [resources, setResources] = useState([]);
  const [resourcesLoading, setResourcesLoading] = useState(false);
  const completed = countCompletedCompetencies(checks);
  const totalCompetencies = useMemo(() => t.modules.reduce((acc, m) => acc + m.competencies.length, 0), [t.modules]);
  const simulationScore = t.scenarios.reduce((acc, item, i) => acc + (answers[i] === item.answer ? 1 : 0), 0);
  const certificateReady = completed === totalCompetencies && simulationScore === t.scenarios.length;

  const resetProgress = () => {
    const message = lang === 'ar' ? 'هل تريد مسح تقدم الكفاءات وإجابات المحاكاة من هذا الجهاز؟' : 'Clear competency progress and simulation answers from this device?';
    if (window.confirm(message)) {
      setChecks({});
      setAnswers({});
    }
  };

  async function refreshAuthState(nextSession) {
    const currentSession = nextSession ?? await getCurrentSession();
    setSession(currentSession);

    if (currentSession?.user) {
      await ensureProfile(currentSession.user);
      const nextProfile = await fetchCurrentProfile(currentSession.user.id);
      setProfile(nextProfile);
      setDashboardSummary(nextProfile?.id ? await fetchDashboardSummary(nextProfile.id) : null);
      setTrainerSummary(nextProfile ? await fetchTrainerDashboardSummary(nextProfile) : null);
    } else {
      setProfile(null);
      setDashboardSummary(null);
      setTrainerSummary(null);
    }
  }

  async function handleCourseEnroll(course) {
    if (!profile?.id) throw new Error(lang === 'ar' ? 'سجّل الدخول أولًا.' : 'Sign in first.');
    await enrollInCourse(profile.id, course.id);
    setDashboardSummary(await fetchDashboardSummary(profile.id));
    setTrainerSummary(await fetchTrainerDashboardSummary(profile));
  }


  async function refreshResources() {
    if (!session?.user) {
      setResources([]);
      return;
    }
    setResourcesLoading(true);
    try {
      setResources(await fetchLearningResources(lang));
    } finally {
      setResourcesLoading(false);
    }
  }

  async function handleResourceUpload(payload) {
    await uploadLearningResource({ ...payload, profileId: profile?.id });
    await refreshResources();
  }

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = t.dir;
    document.title = lang === 'en' ? 'Cath Lab Academy | Professional Training Platform' : 'أكاديمية القسطرة القلبية | منصة تدريب احترافية';
  }, [lang, t.dir]);

  useEffect(() => {
    refreshAuthState();
    return subscribeToAuthChanges(refreshAuthState);
  }, []);

  useEffect(() => {
    let active = true;

    async function loadCatalog() {
      if (!isSupabaseConfigured) {
        setCatalogSource('fallback');
        setCatalogCourses([]);
        return;
      }

      setCatalogSource('loading');
      const courses = await fetchCatalogCourses(lang);
      if (!active) return;
      setCatalogCourses(courses);
      setCatalogSource(courses.length ? 'supabase' : 'fallback');
    }

    loadCatalog();
    return () => { active = false; };
  }, [lang]);


  useEffect(() => {
    refreshResources();
  }, [session?.user?.id, profile?.role, lang]);

  return <><a className="skip-link" href="#main-content">{lang === 'ar' ? 'انتقل إلى المحتوى' : 'Skip to content'}</a><TopNav t={t} lang={lang} setLang={setLang} /><main id="main-content" className={lang === 'ar' ? 'rtl' : 'ltr'}><section id="home" className="hero"><div className="hero-copy"><p className="eyebrow">Cath Lab Academy</p><h1>{t.heroTitle}</h1><p>{t.heroText}</p><div className="hero-actions"><a href="#catalog">{t.explore}</a><a className="secondary-cta" href="#dashboard">{lang === 'ar' ? 'لوحة المتدرب' : 'Learner dashboard'}</a><button type="button" onClick={printCertificate}><Download /> {t.printCertificate}</button></div></div><div className="hero-panel"><Hospital /><h2>{t.os}</h2><p>Recovery • Circulating • Scrub • Quality</p><div className="mini-dashboard"><span>{t.modules.length}<small>Modules</small></span><span>{t.scenarios.length}<small>Scenarios</small></span><span>{dashboardSummary?.enrollmentCount ?? completed}<small>{dashboardSummary ? (lang === 'ar' ? 'مسجلة' : 'Enrolled') : t.signed}</small></span></div></div></section><section className="stats-row">{t.stats.map(([value, label, note], i) => { const icons = [GraduationCap, Brain, Target, Camera]; return <Stat key={label} icon={icons[i]} value={value} label={label} note={note} />; })}</section><TrustReadiness t={t} /><ExecutiveOverview t={t} /><AboutSection t={t} /><TrainingCatalog t={t} courses={catalogCourses} source={catalogSource} session={session} profile={profile} onEnroll={handleCourseEnroll} /><TrainingLibrary lang={lang} courses={catalogCourses} resources={resources} loading={resourcesLoading} session={session} profile={profile} onUpload={handleResourceUpload} onRefresh={refreshResources} /><AITutor lang={lang} session={session} profile={profile} /><Dashboard t={t} completed={completed} totalCompetencies={totalCompetencies} simulationScore={simulationScore} scenarioCount={t.scenarios.length} certificateReady={certificateReady} onReset={resetProgress} session={session} profile={profile} dashboardSummary={dashboardSummary} /><TrainerAdminDashboard t={t} profile={profile} summary={trainerSummary} /><LoginPrototype t={t} session={session} profile={profile} onAuthChange={refreshAuthState} /><ProgramModules t={t} checks={checks} setChecks={setChecks} /><Simulation t={t} answers={answers} setAnswers={setAnswers} /><CertificatePreview t={t} checks={checks} answers={answers} /><LaunchReadiness t={t} /><footer><Users /> {t.footer}</footer></main></>;
}

createRoot(document.getElementById('root')).render(<App />);
