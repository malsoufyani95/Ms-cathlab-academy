import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity,
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
  LayoutDashboard,
  LockKeyhole,
  Monitor,
  PlayCircle,
  Printer,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Target,
  Trophy,
  Users,
  Video,
  View,
  XCircle
} from 'lucide-react';
import './styles.css';

const modules = [
  {
    id: 'recovery',
    title: 'Recovery Nurse',
    ar: 'تمريض الإفاقة بعد القسطرة',
    icon: Stethoscope,
    level: 'Foundation → Competent',
    duration: '4 weeks',
    outcomes: ['Post Cath observation', 'Access-site management', 'Early complication response'],
    lessons: ['SBAR handover', 'Radial/Femoral assessment', 'Neurovascular checks', 'Bleeding & hematoma pathway', 'Discharge readiness'],
    competencies: ['Patient ID/allergy verified', 'Access site assessed', 'Distal pulses documented', 'Pain and vitals trended', 'Escalation done with SBAR']
  },
  {
    id: 'circulating',
    title: 'Circulating Nurse',
    ar: 'تمريض التداول داخل غرفة القسطرة',
    icon: Monitor,
    level: 'Novice → Independent',
    duration: '6 weeks',
    outcomes: ['Room readiness', 'Team safety', 'Medication & documentation accuracy'],
    lessons: ['Pre-procedure safety checklist', 'Timeout leadership', 'ACT/Heparin tracking', 'Contrast/radiation safety', 'Emergency conversion support'],
    competencies: ['Consent status checked', 'Timeout completed', 'Emergency cart ready', 'ACT documented', 'Critical timestamps captured']
  },
  {
    id: 'scrub',
    title: 'Scrub Nurse / Technologist',
    ar: 'التعقيم والمساعدة التقنية',
    icon: ShieldCheck,
    level: 'Assisted → Competent',
    duration: '8 weeks',
    outcomes: ['Sterile workflow', 'Device preparation', 'Operator anticipation'],
    lessons: ['Sterile field setup', 'Wire/catheter handling', 'Balloon/stent preparation', 'Device verification', 'Sharps safety'],
    competencies: ['Sterility maintained', 'Wire handled safely', 'Stent size/expiry confirmed', 'Sharps safety followed', 'Device labels transferred']
  },
  {
    id: 'quality',
    title: 'Quality & CPD',
    ar: 'الجودة والتعليم المستمر',
    icon: FileCheck2,
    level: 'Competent → Trainer',
    duration: 'Ongoing',
    outcomes: ['Competency governance', 'Audit readiness', 'Continuous education'],
    lessons: ['Competency matrix', 'Incident learning', 'Monthly CPD plan', 'Policy alignment', 'Trainer sign-off'],
    competencies: ['Competency evidence attached', 'Audit gap identified', 'Action plan assigned', 'Policy reference linked', 'Trainer sign-off completed']
  }
];

const scenarios = [
  {
    title: 'STEMI Activation',
    ar: 'تفعيل مسار STEMI',
    priority: 'Critical',
    prompt: 'Patient arrives from ER with ECG-confirmed STEMI and urgent handover.',
    question: 'What is the first high-reliability action?',
    choices: ['Open all PCI devices immediately', 'Verify patient identity, allergies, consent status, ECG, IV access and team readiness', 'Wait until angiography result'],
    answer: 1,
    why: 'This prevents wrong patient/procedure/allergy events while preserving the urgent STEMI workflow.'
  },
  {
    title: 'Radial Hematoma',
    ar: 'تورم وألم بعد القسطرة الشعاعية',
    priority: 'High',
    prompt: 'Recovery nurse notices swelling and increasing pain at the radial access site.',
    question: 'Best immediate nursing response?',
    choices: ['Apply compression, assess neurovascular status, notify operator and document', 'Ignore if pulse is still present', 'Remove all monitoring and discharge'],
    answer: 0,
    why: 'Early compression and neurovascular checks reduce progression and detect limb compromise.'
  },
  {
    title: 'Stent Verification',
    ar: 'التحقق من الدعامة قبل الاستخدام',
    priority: 'High',
    prompt: 'Operator requests a drug-eluting stent during PCI.',
    question: 'What should the scrub role verify verbally?',
    choices: ['Brand only', 'Size, length, expiry, pressure limit, operator request and packaging integrity', 'Nothing unless complication occurs'],
    answer: 1,
    why: 'Closed-loop device verification prevents wrong-size/expired-device/documentation errors.'
  }
];

const quiz = [
  ['Best assessment design for Cath Lab training?', ['Attendance only', 'Knowledge + decision-making + observed competency', 'Only video watch time'], 1],
  ['Which role owns timeout coordination?', ['Circulating nurse with full team participation', 'Patient family', 'Only recovery nurse'], 0],
  ['After femoral cath, what is essential?', ['Access-site and distal neurovascular assessment', 'Immediate ambulation without assessment', 'Remove all documentation'], 0],
  ['What makes AR/VR valuable in Cath Lab training?', ['Safe repetitive practice of rare/high-risk situations', 'Replacing all clinical supervision', 'Removing competency validation'], 0]
];

const roadmap = [
  ['Phase 1', 'Official website + training catalog', 'Ready'],
  ['Phase 2', 'User accounts + trainer dashboard', 'Next'],
  ['Phase 3', 'Database, certificates, analytics', 'Next'],
  ['Phase 4', '3D GLB heart + WebXR/AR markers', 'Advanced'],
  ['Phase 5', 'Hospital LMS integration', 'Enterprise']
];

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

function TopNav() {
  const items = [
    ['الرئيسية', '#home'], ['المسارات', '#modules'], ['المحاكاة', '#simulation'], ['التقييم', '#assessment'], ['النشر', '#launch']
  ];
  return <nav className="topnav"><a className="brand" href="#home"><HeartPulse /> Cath Lab Academy</a><div>{items.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</div></nav>;
}

function ModuleCard({ module, active, onClick }) {
  const Icon = module.icon;
  return <button className={`module-card ${active ? 'active' : ''}`} onClick={onClick}>
    <Icon /><b>{module.title}</b><strong>{module.ar}</strong><span>{module.outcomes.join(' • ')}</span><small>{module.level} — {module.duration}</small>
  </button>;
}

function ProgramModules({ checks, setChecks }) {
  const [selected, setSelected] = useState(modules[0]);
  const Icon = selected.icon;
  const done = selected.competencies.filter(item => checks[`${selected.id}:${item}`]).length;
  const pct = Math.round((done / selected.competencies.length) * 100);
  return <section id="modules" className="section">
    <p className="eyebrow">Training Architecture</p>
    <h2>مسارات تدريب رسمية حسب الدور الوظيفي</h2>
    <div className="module-grid">{modules.map(m => <ModuleCard key={m.id} module={m} active={selected.id === m.id} onClick={() => setSelected(m)} />)}</div>
    <div className="detail-panel">
      <div className="panel-head"><Icon /><div><h3>{selected.title}</h3><p>{selected.ar} — {selected.level}</p></div><div className="ring" style={{'--pct': `${pct}%`}}><span>{pct}%</span></div></div>
      <div className="two-col">
        <div><h4><BookOpen /> Curriculum Pathway</h4><ol>{selected.lessons.map(x => <li key={x}>{x}</li>)}</ol></div>
        <div><h4><ClipboardCheck /> Competency Sign-off</h4>{selected.competencies.map(x => <label className="check" key={x}><input type="checkbox" checked={!!checks[`${selected.id}:${x}`]} onChange={e => setChecks({...checks, [`${selected.id}:${x}`]: e.target.checked})} />{x}</label>)}</div>
      </div>
    </div>
  </section>;
}

function HeartModel() {
  const [rot, setRot] = useState(0);
  const [selected, setSelected] = useState('LAD');
  return <div className="glass-card heart-card">
    <div className="card-title"><View /> 3D Coronary Orientation</div>
    <p>نموذج توجيهي مبسط قابل للاستبدال لاحقًا بـ GLB heart model و WebXR.</p>
    <div className="heart-stage"><div className="heart-model" style={{transform: `rotateY(${rot}deg) rotateX(${Math.sin(rot/40)*9}deg)`}}>
      <div className="heart-core" />
      {['LAD', 'LCx', 'RCA'].map((a, i) => <button key={a} onClick={() => setSelected(a)} className={`artery a${i}`}>{a}</button>)}
      <div className="stent">STENT</div>
    </div></div>
    <div className="info-pill">Selected anatomy: <b>{selected}</b></div>
    <div className="actions"><button onClick={() => setRot(rot - 30)}>Rotate</button><button onClick={() => setRot(0)}><RotateCcw /> Reset</button></div>
  </div>;
}

function Simulation() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = usePersistedState('cathlab-scenario-answers', {});
  const s = scenarios[index];
  const score = scenarios.reduce((acc, item, i) => acc + (answers[i] === item.answer ? 1 : 0), 0);
  return <section id="simulation" className="section simulation-grid">
    <HeartModel />
    <div className="glass-card scenario-card">
      <div className="card-title"><PlayCircle /> Interactive Clinical Simulation</div>
      <div className="timeline">{scenarios.map((_, i) => <button key={i} className={i === index ? 'active' : ''} onClick={() => setIndex(i)}>{i + 1}</button>)}</div>
      <div className="priority">{s.priority}</div><h3>{s.title}</h3><b className="ar-label">{s.ar}</b><p>{s.prompt}</p>
      <div className="decision"><strong>{s.question}</strong>{s.choices.map((choice, i) => {
        const selected = answers[index] === i; const revealed = answers[index] !== undefined; const correct = i === s.answer;
        return <button className={`${selected ? 'selected' : ''} ${revealed && correct ? 'correct' : ''} ${revealed && selected && !correct ? 'wrong' : ''}`} key={choice} onClick={() => setAnswers({...answers, [index]: i})}>{revealed && correct ? <CheckCircle2 /> : revealed && selected && !correct ? <XCircle /> : <ChevronLeft />}{choice}</button>;
      })}</div>
      {answers[index] !== undefined && <p className="feedback">{s.why}</p>}
      <div className="score"><Trophy /> Simulation score {score}/{scenarios.length}</div>
    </div>
  </section>;
}

function Assessment({ checks }) {
  const [answers, setAnswers] = usePersistedState('cathlab-quiz-answers', {});
  const score = quiz.reduce((acc, q, i) => acc + (answers[i] === q[2] ? 1 : 0), 0);
  const completedCompetencies = Object.values(checks).filter(Boolean).length;
  const totalCompetencies = modules.reduce((acc, m) => acc + m.competencies.length, 0);
  return <section id="assessment" className="section assessment">
    <div><p className="eyebrow">Assessment Engine</p><h2>اختبار معرفة + سجل كفاءات + شهادة قابلة للطباعة</h2></div>
    <div className="assessment-grid"><div className="quiz-card">
      {quiz.map(([q, options, answer], i) => <div className="question" key={q}><b>{i + 1}. {q}</b>{options.map((o, j) => <label key={o} className={`${answers[i] === j ? 'selected' : ''} ${answers[i] !== undefined && j === answer ? 'correct' : ''}`}><input type="radio" checked={answers[i] === j} onChange={() => setAnswers({...answers, [i]: j})} />{o}</label>)}</div>)}
    </div><div className="certificate">
      <Award /><h3>Cath Lab Academy Certificate Preview</h3><p>Knowledge score: <b>{score}/{quiz.length}</b></p><p>Competency completion: <b>{completedCompetencies}/{totalCompetencies}</b></p><p>Status: <b>{score >= 3 && completedCompetencies >= 8 ? 'Ready for trainer sign-off' : 'Training in progress'}</b></p><button onClick={() => window.print()}><Printer /> Print / Save PDF</button>
    </div></div>
  </section>;
}

function LaunchReadiness() {
  return <section id="launch" className="section launch">
    <p className="eyebrow">Official Launch Plan</p><h2>جاهزية التحويل إلى موقع رسمي</h2>
    <div className="roadmap">{roadmap.map(([phase, title, status]) => <div className="road" key={phase}><span>{phase}</span><b>{title}</b><small>{status}</small></div>)}</div>
    <div className="launch-grid">
      <div><LockKeyhole /><h3>Governance</h3><p>تنبيه طبي، مراجعة محتوى، اعتماد داخلي، وصلاحيات مدربين قبل الاستخدام الرسمي.</p></div>
      <div><Globe2 /><h3>Publishing</h3><p>جاهز للنشر على Vercel/Netlify، ثم ربط دومين رسمي وشهادة SSL.</p></div>
      <div><BarChart3 /><h3>Analytics</h3><p>المرحلة القادمة تضيف متابعة أداء المتدربين ونتائج Competency لكل قسم.</p></div>
    </div>
  </section>;
}

function App() {
  const [checks, setChecks] = usePersistedState('cathlab-competencies', {});
  const completed = Object.values(checks).filter(Boolean).length;
  return <><TopNav /><main id="home">
    <section className="hero">
      <div className="hero-copy"><p className="eyebrow">Cath Lab Academy</p><h1>منصة تدريب رسمية للقسطرة القلبية — تعليم، محاكاة، كفاءات، وشهادات</h1><p>واجهة متقدمة تصلح كنسخة عرض رسمية لمشروع تدريب Cath Lab staff: مسارات Role-based، محاكاة STEMI، نموذج 3D، اختبارات، Competency tracking، وخطة إطلاق واضحة.</p><div className="hero-actions"><a href="#modules">ابدأ استعراض المنصة</a><button onClick={() => window.print()}><Download /> حفظ كـ PDF</button></div></div>
      <div className="hero-panel"><Hospital /><h2>Clinical Training OS</h2><p>Recovery • Circulating • Scrub • Quality</p><div className="mini-dashboard"><span>{modules.length}<small>Modules</small></span><span>{scenarios.length}<small>Scenarios</small></span><span>{completed}<small>Signed</small></span></div></div>
    </section>
    <section className="stats-row"><Stat icon={GraduationCap} value="4" label="Training Tracks" note="Role-based education" /><Stat icon={Brain} value="3" label="Clinical Scenarios" note="Decision practice" /><Stat icon={Target} value="20" label="Competencies" note="Trainer sign-off" /><Stat icon={Camera} value="AR/VR" label="Future Ready" note="WebXR pathway" /></section>
    <ProgramModules checks={checks} setChecks={setChecks} />
    <Simulation />
    <Assessment checks={checks} />
    <LaunchReadiness />
    <footer><Users /> Cath Lab Academy prototype — For education and competency validation only. Not a substitute for hospital policy or clinical judgment.</footer>
  </main></>;
}

createRoot(document.getElementById('root')).render(<App />);
