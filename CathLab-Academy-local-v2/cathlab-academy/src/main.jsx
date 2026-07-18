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
  Download,
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
  UserRound,
  Users,
  View,
  X,
  XCircle
} from 'lucide-react';
import { programInfo } from './programInfo.js';
import { usePersistedState } from './usePersistedState.js';
import './styles.css';

const content = {
  en: {
    dir: 'ltr',
    nav: ['Home', 'About', 'Catalog', 'Diploma', 'Dashboard', 'Login', 'Certificate'],
    switchTo: 'العربية',
    heroTitle: 'Cath Lab Academy — Education, Simulation, and Competency Validation',
    heroText: 'A professional bilingual platform concept for Cath Lab staff development: role-based pathways, simulation, competency evidence, dashboard governance, and certificate readiness.',
    explore: 'Explore the platform',
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
    dashboardText: 'Your competency checklist, simulation score, and certificate readiness are calculated from activity saved on this device.',
    loginTitle: 'Secure account access — planned',
    loginText: 'This screen shows the planned trainee, trainer, and administrator access model. It remains disabled until secure authentication and a database are connected.',
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
    nav: ['الرئيسية', 'من نحن', 'كتالوج التدريب', 'الدبلوم', 'لوحة التحكم', 'الدخول', 'الشهادة'],
    switchTo: 'English',
    heroTitle: 'Cath Lab Academy — تعليم، محاكاة، واعتماد كفاءات',
    heroText: 'تصور احترافي لمنصة ثنائية اللغة لتطوير فريق القسطرة القلبية: مسارات تدريب حسب الدور، محاكاة، إثبات كفاءة، لوحة متابعة، وشهادات جاهزة.',
    explore: 'استعراض المنصة',
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
    dashboardText: 'تُحسب الكفاءات ونتيجة المحاكاة وجاهزية الشهادة من النشاط المحفوظ على هذا الجهاز.',
    loginTitle: 'الوصول الآمن للحساب — مخطط له',
    loginText: 'تعرض هذه الواجهة نموذج حسابات المتدربين والمدربين والإدارة، وتبقى معطلة حتى ربط مصادقة آمنة وقاعدة بيانات.',
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
  const hrefs = ['#home', '#about', '#catalog', './program.html', '#dashboard', '#login', '#certificate'];
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

function TrainingCatalog({ t }) {
  return <section id="catalog" className="section catalog-section"><p className="eyebrow">{t.agendaPending}</p><h2>{t.trainingCatalogTitle}</h2><p className="section-lead">{t.trainingCatalogText}</p><div className="catalog-grid">{t.catalogCourses.map(([track, title, desc, audience, date]) => <article className="catalog-card" key={title}><div><span className="track-pill">{track}</span><h3>{title}</h3><p>{desc}</p></div><div className="catalog-meta"><span><Users /> {audience}</span><span><CalendarDays /> {date}</span></div></article>)}</div></section>;
}


function ProgramInfoTeaser({ lang }) {
  const t = programInfo[lang] || programInfo.en;
  return <section id="program" className="section diploma-section program-teaser">
    <p className="eyebrow">{t.eyebrow}</p>
    <h2>{t.title}</h2>
    <p className="section-lead">{t.subtitle}</p>
    <div className="diploma-highlights">{t.highlights.map(([value, label, note]) => <a className="dash-card" href="./program.html" key={label}><GraduationCap /><strong>{value}</strong><span>{label}</span><small>{note}</small></a>)}</div>
    <div className="hero-actions"><a href="./program.html">{t.cta}</a></div>
  </section>;
}

function Dashboard({ t, completed, totalCompetencies, simulationScore, scenarioCount, certificateReady, onReset }) {
  const pct = totalCompetencies ? Math.round((completed / totalCompetencies) * 100) : 0;
  const simulationPct = scenarioCount ? Math.round((simulationScore / scenarioCount) * 100) : 0;
  const rtl = t.dir === 'rtl';
  const dashboardCards = rtl
    ? [[`${pct}%`, 'اكتمال الكفاءات', `${completed} من ${totalCompetencies}`], [`${totalCompetencies - completed}`, 'كفاءات متبقية', 'محفوظة على هذا الجهاز'], [`${simulationPct}%`, 'نتيجة المحاكاة', `${simulationScore} من ${scenarioCount}`], [certificateReady ? 'جاهزة' : 'غير جاهزة', 'حالة الشهادة', 'تتطلب إكمال الكفاءات والمحاكاة']]
    : [[`${pct}%`, 'Competency completion', `${completed} of ${totalCompetencies}`], [`${totalCompetencies - completed}`, 'Competencies remaining', 'Saved on this device'], [`${simulationPct}%`, 'Simulation score', `${simulationScore} of ${scenarioCount}`], [certificateReady ? 'Ready' : 'Not ready', 'Certificate status', 'Requires all competencies and scenarios']];
  const matrixTitle = rtl ? 'مصفوفة الكفاءات' : 'Competency matrix';
  const progressText = rtl ? `${completed}/${totalCompetencies} من عناصر قائمة الكفاءة مكتملة` : `${completed}/${totalCompetencies} competency checklist items completed`;
  const resetLabel = rtl ? 'إعادة ضبط التقدم' : 'Reset progress';
  return <section id="dashboard" className="section dashboard-section"><p className="eyebrow">{rtl ? 'متابعة مباشرة' : 'Live progress'}</p><h2>{t.dashboardTitle}</h2><p className="section-lead">{t.dashboardText}</p><div className="dashboard-grid">{dashboardCards.map(([value, label, note], i) => { const icons = [BarChart3, ClipboardCheck, Activity, Award]; const Icon = icons[i]; return <div className="dash-card" key={label}><Icon /><strong>{value}</strong><span>{label}</span><small>{note}</small></div>; })}</div><div className="dashboard-panel"><div><h3>{matrixTitle}</h3><div className="progress-line" role="progressbar" aria-label={matrixTitle} aria-valuemin="0" aria-valuemax="100" aria-valuenow={pct}><span style={{ width: `${pct}%` }} /></div><small>{progressText}</small></div><div className="mini-list"><span><CheckCircle2 /> {rtl ? 'التقدم محفوظ محليًا' : 'Progress saved locally'}</span><span><CheckCircle2 /> {rtl ? 'المحاكاة التفاعلية مفعّلة' : 'Interactive simulation enabled'}</span><button className="text-button danger-button" type="button" onClick={onReset}><RotateCcw /> {resetLabel}</button></div></div></section>;
}

function LoginPrototype({ t }) {
  const rtl = t.dir === 'rtl';
  return <section id="login" className="section login-section"><div className="login-copy"><p className="eyebrow">{rtl ? 'الوصول للحساب' : 'Account access'}</p><h2>{t.loginTitle}</h2><p>{t.loginText}</p><div className="role-tabs"><span>{rtl ? 'متدرب' : 'Trainee'}</span><span>{rtl ? 'مدرب' : 'Trainer'}</span><span>{rtl ? 'إدارة' : 'Admin'}</span></div></div><form className="login-card" onSubmit={e => e.preventDefault()} aria-label={t.loginTitle}><div className="login-logo"><LockKeyhole /><b>Cath Lab Academy</b></div><label><span>{rtl ? 'البريد أو الرقم الوظيفي' : 'Email / Staff ID'}</span><div><UserRound /><input type="email" placeholder={rtl ? 'سيُفعّل بعد ربط قاعدة البيانات' : 'Available after database setup'} disabled /></div></label><label><span>{rtl ? 'كلمة المرور' : 'Password'}</span><div><ShieldCheck /><input type="password" placeholder="••••••••" disabled /></div></label><button type="button" disabled><IdCard /> {rtl ? 'تسجيل الدخول — المرحلة القادمة' : 'Sign in — next phase'}</button><small>{rtl ? 'واجهة توضيحية فقط — لم يتم ربط المصادقة أو قاعدة البيانات.' : 'Interface preview only — authentication and database are not connected.'}</small></form></section>;
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

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = t.dir;
    document.title = lang === 'en' ? 'Cath Lab Academy | Professional Training Platform' : 'أكاديمية القسطرة القلبية | منصة تدريب احترافية';
  }, [lang, t.dir]);

  return <><a className="skip-link" href="#main-content">{lang === 'ar' ? 'انتقل إلى المحتوى' : 'Skip to content'}</a><TopNav t={t} lang={lang} setLang={setLang} /><main id="main-content" className={lang === 'ar' ? 'rtl' : 'ltr'}><section id="home" className="hero"><div className="hero-copy"><p className="eyebrow">Cath Lab Academy</p><h1>{t.heroTitle}</h1><p>{t.heroText}</p><div className="hero-actions"><a href="#about">{t.explore}</a><button type="button" onClick={printCertificate}><Download /> {t.printCertificate}</button></div></div><div className="hero-panel"><Hospital /><h2>{t.os}</h2><p>Recovery • Circulating • Scrub • Quality</p><div className="mini-dashboard"><span>{t.modules.length}<small>Modules</small></span><span>{t.scenarios.length}<small>Scenarios</small></span><span>{completed}<small>{t.signed}</small></span></div></div></section><section className="stats-row">{t.stats.map(([value, label, note], i) => { const icons = [GraduationCap, Brain, Target, Camera]; return <Stat key={label} icon={icons[i]} value={value} label={label} note={note} />; })}</section><ExecutiveOverview t={t} /><AboutSection t={t} /><TrainingCatalog t={t} /><ProgramInfoTeaser lang={lang} /><Dashboard t={t} completed={completed} totalCompetencies={totalCompetencies} simulationScore={simulationScore} scenarioCount={t.scenarios.length} certificateReady={certificateReady} onReset={resetProgress} /><LoginPrototype t={t} /><ProgramModules t={t} checks={checks} setChecks={setChecks} /><Simulation t={t} answers={answers} setAnswers={setAnswers} /><CertificatePreview t={t} checks={checks} answers={answers} /><LaunchReadiness t={t} /><footer><Users /> {t.footer}</footer></main></>;
}

createRoot(document.getElementById('root')).render(<App />);
