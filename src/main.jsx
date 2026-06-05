import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Award,
  BarChart3,
  BookOpen,
  Brain,
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
  LockKeyhole,
  Monitor,
  PlayCircle,
  Printer,
  RotateCcw,
  ShieldCheck,
  Stethoscope,
  Target,
  Trophy,
  Users,
  View,
  XCircle
} from 'lucide-react';
import './styles.css';

const content = {
  en: {
    dir: 'ltr',
    nav: ['Home', 'Modules', 'Simulation', 'Assessment', 'Launch'],
    switchTo: 'العربية',
    languageLabel: 'Language',
    heroTitle: 'An official Cath Lab training platform — education, simulation, competencies, and certificates',
    heroText: 'A launch-ready demo for Cath Lab staff development: role-based pathways, STEMI simulation, 3D orientation, knowledge checks, competency tracking, and a clear implementation roadmap.',
    explore: 'Explore the platform',
    savePdf: 'Save as PDF',
    os: 'Clinical Training OS',
    signed: 'Signed',
    stats: [
      ['4', 'Training Tracks', 'Role-based education'],
      ['3', 'Clinical Scenarios', 'Decision practice'],
      ['20', 'Competencies', 'Trainer sign-off'],
      ['AR/VR', 'Future Ready', 'WebXR pathway']
    ],
    trainingArchitecture: 'Training Architecture',
    modulesTitle: 'Official role-based training pathways',
    curriculum: 'Curriculum Pathway',
    competency: 'Competency Sign-off',
    heartTitle: '3D Coronary Orientation',
    heartText: 'A simplified orientation model that can later be replaced with a real GLB heart model and WebXR experience.',
    selectedAnatomy: 'Selected anatomy',
    rotate: 'Rotate',
    reset: 'Reset',
    simulationTitle: 'Interactive Clinical Simulation',
    simulationScore: 'Simulation score',
    assessmentEngine: 'Assessment Engine',
    assessmentTitle: 'Knowledge check + competency record + printable certificate',
    certificateTitle: 'Cath Lab Academy Certificate Preview',
    knowledgeScore: 'Knowledge score',
    competencyCompletion: 'Competency completion',
    status: 'Status',
    readyStatus: 'Ready for trainer sign-off',
    progressStatus: 'Training in progress',
    print: 'Print / Save PDF',
    launchPlan: 'Official Launch Plan',
    launchTitle: 'Readiness to become an official website',
    launchCards: [
      ['Governance', 'Medical disclaimer, content review, internal approval, and trainer permissions before official use.'],
      ['Publishing', 'Ready for Vercel/Netlify deployment, custom domain connection, and SSL certificate.'],
      ['Analytics', 'The next phase adds trainee performance tracking and competency results by department.']
    ],
    footer: 'Cath Lab Academy prototype — For education and competency validation only. Not a substitute for hospital policy or clinical judgment.',
    modules: [
      {
        id: 'recovery', title: 'Recovery Nurse', subtitle: 'Post-catheterization recovery nursing', icon: Stethoscope, level: 'Foundation → Competent', duration: '4 weeks',
        outcomes: ['Post Cath observation', 'Access-site management', 'Early complication response'],
        lessons: ['SBAR handover', 'Radial/Femoral assessment', 'Neurovascular checks', 'Bleeding & hematoma pathway', 'Discharge readiness'],
        competencies: ['Patient ID/allergy verified', 'Access site assessed', 'Distal pulses documented', 'Pain and vitals trended', 'Escalation done with SBAR']
      },
      {
        id: 'circulating', title: 'Circulating Nurse', subtitle: 'Cath Lab circulating nursing', icon: Monitor, level: 'Novice → Independent', duration: '6 weeks',
        outcomes: ['Room readiness', 'Team safety', 'Medication & documentation accuracy'],
        lessons: ['Pre-procedure safety checklist', 'Timeout leadership', 'ACT/Heparin tracking', 'Contrast/radiation safety', 'Emergency conversion support'],
        competencies: ['Consent status checked', 'Timeout completed', 'Emergency cart ready', 'ACT documented', 'Critical timestamps captured']
      },
      {
        id: 'scrub', title: 'Scrub Nurse / Technologist', subtitle: 'Sterile field and device support', icon: ShieldCheck, level: 'Assisted → Competent', duration: '8 weeks',
        outcomes: ['Sterile workflow', 'Device preparation', 'Operator anticipation'],
        lessons: ['Sterile field setup', 'Wire/catheter handling', 'Balloon/stent preparation', 'Device verification', 'Sharps safety'],
        competencies: ['Sterility maintained', 'Wire handled safely', 'Stent size/expiry confirmed', 'Sharps safety followed', 'Device labels transferred']
      },
      {
        id: 'quality', title: 'Quality & CPD', subtitle: 'Quality and continuous professional development', icon: FileCheck2, level: 'Competent → Trainer', duration: 'Ongoing',
        outcomes: ['Competency governance', 'Audit readiness', 'Continuous education'],
        lessons: ['Competency matrix', 'Incident learning', 'Monthly CPD plan', 'Policy alignment', 'Trainer sign-off'],
        competencies: ['Competency evidence attached', 'Audit gap identified', 'Action plan assigned', 'Policy reference linked', 'Trainer sign-off completed']
      }
    ],
    scenarios: [
      { title: 'STEMI Activation', subtitle: 'STEMI pathway activation', priority: 'Critical', prompt: 'Patient arrives from ER with ECG-confirmed STEMI and urgent handover.', question: 'What is the first high-reliability action?', choices: ['Open all PCI devices immediately', 'Verify patient identity, allergies, consent status, ECG, IV access and team readiness', 'Wait until angiography result'], answer: 1, why: 'This prevents wrong patient/procedure/allergy events while preserving the urgent STEMI workflow.' },
      { title: 'Radial Hematoma', subtitle: 'Swelling and pain after radial catheterization', priority: 'High', prompt: 'Recovery nurse notices swelling and increasing pain at the radial access site.', question: 'Best immediate nursing response?', choices: ['Apply compression, assess neurovascular status, notify operator and document', 'Ignore if pulse is still present', 'Remove all monitoring and discharge'], answer: 0, why: 'Early compression and neurovascular checks reduce progression and detect limb compromise.' },
      { title: 'Stent Verification', subtitle: 'Device verification before use', priority: 'High', prompt: 'Operator requests a drug-eluting stent during PCI.', question: 'What should the scrub role verify verbally?', choices: ['Brand only', 'Size, length, expiry, pressure limit, operator request and packaging integrity', 'Nothing unless complication occurs'], answer: 1, why: 'Closed-loop device verification prevents wrong-size, expired-device, and documentation errors.' }
    ],
    quiz: [
      ['Best assessment design for Cath Lab training?', ['Attendance only', 'Knowledge + decision-making + observed competency', 'Only video watch time'], 1],
      ['Which role owns timeout coordination?', ['Circulating nurse with full team participation', 'Patient family', 'Only recovery nurse'], 0],
      ['After femoral cath, what is essential?', ['Access-site and distal neurovascular assessment', 'Immediate ambulation without assessment', 'Remove all documentation'], 0],
      ['What makes AR/VR valuable in Cath Lab training?', ['Safe repetitive practice of rare/high-risk situations', 'Replacing all clinical supervision', 'Removing competency validation'], 0]
    ],
    roadmap: [['Phase 1', 'Official website + training catalog', 'Ready'], ['Phase 2', 'User accounts + trainer dashboard', 'Next'], ['Phase 3', 'Database, certificates, analytics', 'Next'], ['Phase 4', '3D GLB heart + WebXR/AR markers', 'Advanced'], ['Phase 5', 'Hospital LMS integration', 'Enterprise']]
  },
  ar: {
    dir: 'rtl',
    nav: ['الرئيسية', 'المسارات', 'المحاكاة', 'التقييم', 'النشر'],
    switchTo: 'English',
    languageLabel: 'اللغة',
    heroTitle: 'منصة تدريب رسمية للقسطرة القلبية — تعليم، محاكاة، كفاءات، وشهادات',
    heroText: 'نسخة عرض رسمية لمشروع تطوير طاقم Cath Lab: مسارات حسب الدور الوظيفي، محاكاة STEMI، نموذج 3D، اختبارات، تتبع كفاءات، وخطة إطلاق واضحة.',
    explore: 'ابدأ استعراض المنصة',
    savePdf: 'حفظ كـ PDF',
    os: 'نظام التدريب السريري',
    signed: 'مكتملة',
    stats: [['4', 'مسارات تدريب', 'تعليم حسب الدور'], ['3', 'سيناريوهات سريرية', 'تدريب اتخاذ القرار'], ['20', 'كفاءة', 'اعتماد المدرب'], ['AR/VR', 'جاهز للمستقبل', 'مسار WebXR']],
    trainingArchitecture: 'هيكلة التدريب',
    modulesTitle: 'مسارات تدريب رسمية حسب الدور الوظيفي',
    curriculum: 'المسار التعليمي',
    competency: 'اعتماد الكفاءات',
    heartTitle: 'توجيه ثلاثي الأبعاد للشرايين التاجية',
    heartText: 'نموذج توجيهي مبسط قابل للاستبدال لاحقًا بمجسم قلب GLB وتجربة WebXR.',
    selectedAnatomy: 'العنصر المحدد',
    rotate: 'تدوير',
    reset: 'إعادة',
    simulationTitle: 'محاكاة سريرية تفاعلية',
    simulationScore: 'نتيجة المحاكاة',
    assessmentEngine: 'محرك التقييم',
    assessmentTitle: 'اختبار معرفة + سجل كفاءات + شهادة قابلة للطباعة',
    certificateTitle: 'معاينة شهادة Cath Lab Academy',
    knowledgeScore: 'درجة المعرفة',
    competencyCompletion: 'اكتمال الكفاءات',
    status: 'الحالة',
    readyStatus: 'جاهز لاعتماد المدرب',
    progressStatus: 'التدريب قيد التقدم',
    print: 'طباعة / حفظ PDF',
    launchPlan: 'خطة الإطلاق الرسمية',
    launchTitle: 'جاهزية التحويل إلى موقع رسمي',
    launchCards: [['الحوكمة', 'تنبيه طبي، مراجعة محتوى، اعتماد داخلي، وصلاحيات مدربين قبل الاستخدام الرسمي.'], ['النشر', 'جاهز للنشر على Vercel/Netlify، ثم ربط دومين رسمي وشهادة SSL.'], ['التحليلات', 'المرحلة القادمة تضيف متابعة أداء المتدربين ونتائج الكفاءات حسب القسم.']],
    footer: 'نموذج Cath Lab Academy — للتعليم وتقييم الكفاءات فقط، وليس بديلًا عن سياسات المستشفى أو الحكم السريري.',
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
    quiz: [
      ['أفضل تصميم تقييم لتدريب Cath Lab؟', ['الحضور فقط', 'المعرفة + اتخاذ القرار + الكفاءة الملاحظة', 'وقت مشاهدة الفيديو فقط'], 1],
      ['من ينسق Timeout؟', ['Circulating nurse بمشاركة الفريق الكامل', 'أسرة المريض', 'Recovery nurse فقط'], 0],
      ['بعد Femoral cath، ما الأمر الأساسي؟', ['تقييم موقع الدخول وNeurovascular الطرفي', 'المشي المباشر بدون تقييم', 'إزالة كل التوثيق'], 0],
      ['ما قيمة AR/VR في تدريب Cath Lab؟', ['ممارسة آمنة ومتكررة للحالات النادرة عالية الخطورة', 'استبدال كل الإشراف السريري', 'إلغاء تقييم الكفاءات'], 0]
    ],
    roadmap: [['المرحلة 1', 'موقع رسمي + كتالوج تدريب', 'جاهز'], ['المرحلة 2', 'حسابات مستخدمين + لوحة مدرب', 'التالي'], ['المرحلة 3', 'قاعدة بيانات وشهادات وتحليلات', 'التالي'], ['المرحلة 4', 'مجسم GLB و WebXR/AR markers', 'متقدم'], ['المرحلة 5', 'تكامل LMS للمستشفى', 'مؤسسي']]
  }
};

function usePersistedState(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(state)); } catch { /* ignore private mode */ }
  }, [key, state]);
  return [state, setState];
}

function Stat({ icon: Icon, value, label, note }) {
  return <div className="stat"><Icon /><strong>{value}</strong><span>{label}</span><small>{note}</small></div>;
}

function TopNav({ t, lang, setLang }) {
  const hrefs = ['#home', '#modules', '#simulation', '#assessment', '#launch'];
  return <nav className="topnav"><a className="brand" href="#home"><HeartPulse /> Cath Lab Academy</a><div className="nav-links">{t.nav.map((label, i) => <a key={hrefs[i]} href={hrefs[i]}>{label}</a>)}<button className="language-toggle" onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}><Globe2 /> {t.switchTo}</button></div></nav>;
}

function ModuleCard({ module, active, onClick }) {
  const Icon = module.icon;
  return <button className={`module-card ${active ? 'active' : ''}`} onClick={onClick}>
    <Icon /><b>{module.title}</b><strong>{module.subtitle}</strong><span>{module.outcomes.join(' • ')}</span><small>{module.level} — {module.duration}</small>
  </button>;
}

function ProgramModules({ t, checks, setChecks }) {
  const [selectedId, setSelectedId] = useState(t.modules[0].id);
  const selected = t.modules.find(m => m.id === selectedId) || t.modules[0];
  const Icon = selected.icon;
  const done = selected.competencies.filter(item => checks[`${selected.id}:${item}`]).length;
  const pct = Math.round((done / selected.competencies.length) * 100);
  return <section id="modules" className="section">
    <p className="eyebrow">{t.trainingArchitecture}</p><h2>{t.modulesTitle}</h2>
    <div className="module-grid">{t.modules.map(m => <ModuleCard key={m.id} module={m} active={selected.id === m.id} onClick={() => setSelectedId(m.id)} />)}</div>
    <div className="detail-panel"><div className="panel-head"><Icon /><div><h3>{selected.title}</h3><p>{selected.subtitle} — {selected.level}</p></div><div className="ring" style={{'--pct': `${pct}%`}}><span>{pct}%</span></div></div>
      <div className="two-col"><div><h4><BookOpen /> {t.curriculum}</h4><ol>{selected.lessons.map(x => <li key={x}>{x}</li>)}</ol></div><div><h4><ClipboardCheck /> {t.competency}</h4>{selected.competencies.map(x => <label className="check" key={x}><input type="checkbox" checked={!!checks[`${selected.id}:${x}`]} onChange={e => setChecks({...checks, [`${selected.id}:${x}`]: e.target.checked})} />{x}</label>)}</div></div>
    </div>
  </section>;
}

function HeartModel({ t }) {
  const [rot, setRot] = useState(0);
  const [selected, setSelected] = useState('LAD');
  return <div className="glass-card heart-card"><div className="card-title"><View /> {t.heartTitle}</div><p>{t.heartText}</p>
    <div className="heart-stage"><div className="heart-model" style={{transform: `rotateY(${rot}deg) rotateX(${Math.sin(rot/40)*9}deg)`}}><div className="heart-core" />{['LAD', 'LCx', 'RCA'].map((a, i) => <button key={a} onClick={() => setSelected(a)} className={`artery a${i}`}>{a}</button>)}<div className="stent">STENT</div></div></div>
    <div className="info-pill">{t.selectedAnatomy}: <b>{selected}</b></div><div className="actions"><button onClick={() => setRot(rot - 30)}>{t.rotate}</button><button onClick={() => setRot(0)}><RotateCcw /> {t.reset}</button></div>
  </div>;
}

function Simulation({ t }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = usePersistedState('cathlab-scenario-answers', {});
  const s = t.scenarios[index];
  const score = t.scenarios.reduce((acc, item, i) => acc + (answers[i] === item.answer ? 1 : 0), 0);
  return <section id="simulation" className="section simulation-grid"><HeartModel t={t} /><div className="glass-card scenario-card"><div className="card-title"><PlayCircle /> {t.simulationTitle}</div><div className="timeline">{t.scenarios.map((_, i) => <button key={i} className={i === index ? 'active' : ''} onClick={() => setIndex(i)}>{i + 1}</button>)}</div><div className="priority">{s.priority}</div><h3>{s.title}</h3><b className="ar-label">{s.subtitle}</b><p>{s.prompt}</p><div className="decision"><strong>{s.question}</strong>{s.choices.map((choice, i) => { const selected = answers[index] === i; const revealed = answers[index] !== undefined; const correct = i === s.answer; return <button className={`${selected ? 'selected' : ''} ${revealed && correct ? 'correct' : ''} ${revealed && selected && !correct ? 'wrong' : ''}`} key={choice} onClick={() => setAnswers({...answers, [index]: i})}>{revealed && correct ? <CheckCircle2 /> : revealed && selected && !correct ? <XCircle /> : <ChevronLeft />}{choice}</button>; })}</div>{answers[index] !== undefined && <p className="feedback">{s.why}</p>}<div className="score"><Trophy /> {t.simulationScore} {score}/{t.scenarios.length}</div></div></section>;
}

function Assessment({ t, checks }) {
  const [answers, setAnswers] = usePersistedState('cathlab-quiz-answers', {});
  const score = t.quiz.reduce((acc, q, i) => acc + (answers[i] === q[2] ? 1 : 0), 0);
  const completedCompetencies = Object.values(checks).filter(Boolean).length;
  const totalCompetencies = t.modules.reduce((acc, m) => acc + m.competencies.length, 0);
  return <section id="assessment" className="section assessment"><div><p className="eyebrow">{t.assessmentEngine}</p><h2>{t.assessmentTitle}</h2></div><div className="assessment-grid"><div className="quiz-card">{t.quiz.map(([q, options, answer], i) => <div className="question" key={q}><b>{i + 1}. {q}</b>{options.map((o, j) => <label key={o} className={`${answers[i] === j ? 'selected' : ''} ${answers[i] !== undefined && j === answer ? 'correct' : ''}`}><input type="radio" checked={answers[i] === j} onChange={() => setAnswers({...answers, [i]: j})} />{o}</label>)}</div>)}</div><div className="certificate"><Award /><h3>{t.certificateTitle}</h3><p>{t.knowledgeScore}: <b>{score}/{t.quiz.length}</b></p><p>{t.competencyCompletion}: <b>{completedCompetencies}/{totalCompetencies}</b></p><p>{t.status}: <b>{score >= 3 && completedCompetencies >= 8 ? t.readyStatus : t.progressStatus}</b></p><button onClick={() => window.print()}><Printer /> {t.print}</button></div></div></section>;
}

function LaunchReadiness({ t }) {
  const icons = [LockKeyhole, Globe2, BarChart3];
  return <section id="launch" className="section launch"><p className="eyebrow">{t.launchPlan}</p><h2>{t.launchTitle}</h2><div className="roadmap">{t.roadmap.map(([phase, title, status]) => <div className="road" key={phase}><span>{phase}</span><b>{title}</b><small>{status}</small></div>)}</div><div className="launch-grid">{t.launchCards.map(([title, text], i) => { const Icon = icons[i]; return <div key={title}><Icon /><h3>{title}</h3><p>{text}</p></div>; })}</div></section>;
}

function App() {
  const [lang, setLang] = usePersistedState('cathlab-language', 'en');
  const t = content[lang] || content.en;
  const [checks, setChecks] = usePersistedState('cathlab-competencies', {});
  const completed = Object.values(checks).filter(Boolean).length;

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = t.dir;
    document.title = lang === 'en' ? 'Cath Lab Academy | AR/VR Training Platform' : 'أكاديمية القسطرة القلبية | منصة تدريب AR/VR';
  }, [lang, t.dir]);

  return <><TopNav t={t} lang={lang} setLang={setLang} /><main id="home" className={lang === 'ar' ? 'rtl' : 'ltr'}><section className="hero"><div className="hero-copy"><p className="eyebrow">Cath Lab Academy</p><h1>{t.heroTitle}</h1><p>{t.heroText}</p><div className="hero-actions"><a href="#modules">{t.explore}</a><button onClick={() => window.print()}><Download /> {t.savePdf}</button></div></div><div className="hero-panel"><Hospital /><h2>{t.os}</h2><p>Recovery • Circulating • Scrub • Quality</p><div className="mini-dashboard"><span>{t.modules.length}<small>Modules</small></span><span>{t.scenarios.length}<small>Scenarios</small></span><span>{completed}<small>{t.signed}</small></span></div></div></section><section className="stats-row">{t.stats.map(([value, label, note], i) => { const icons = [GraduationCap, Brain, Target, Camera]; return <Stat key={label} icon={icons[i]} value={value} label={label} note={note} />; })}</section><ProgramModules t={t} checks={checks} setChecks={setChecks} /><Simulation t={t} /><Assessment t={t} checks={checks} /><LaunchReadiness t={t} /><footer><Users /> {t.footer}</footer></main></>;
}

createRoot(document.getElementById('root')).render(<App />);
