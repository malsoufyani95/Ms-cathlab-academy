import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowLeft,
  BookOpen,
  Brain,
  CheckCircle2,
  ClipboardCheck,
  Globe2,
  GraduationCap,
  HeartPulse,
  Layers3,
  ShieldCheck,
  Stethoscope,
  Target,
  Users
} from 'lucide-react';
import { programInfo } from './programInfo.js';
import './styles.css';

function ProgramPage() {
  const [lang, setLang] = useState(() => localStorage.getItem('cathlab-language') || 'en');
  const t = programInfo[lang] || programInfo.en;

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = t.dir;
    document.title = lang === 'ar' ? 'معلومات برنامج دبلوم تمريض القسطرة' : 'CCL Nursing Diploma Program Information';
    localStorage.setItem('cathlab-language', lang);
  }, [lang, t.dir]);

  return <main className={`program-page ${lang === 'ar' ? 'rtl' : 'ltr'}`}>
    <nav className="topnav program-nav">
      <a className="brand" href="/"><HeartPulse /> Cath Lab Academy</a>
      <div className="nav-links">
        <a href="/"><ArrowLeft /> {t.homeLabel}</a>
        <button className="language-toggle" onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}><Globe2 /> {t.languageLabel}</button>
      </div>
    </nav>

    <section className="program-hero">
      <div className="hero-copy">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
        <p>{t.description}</p>
      </div>
      <div className="hero-panel program-summary-card">
        <GraduationCap />
        <h2>{t.highlights[0][0]}</h2>
        <p>{t.highlights[0][1]}</p>
        <div className="mini-dashboard">
          <span>14<small>Modules</small></span>
          <span>5<small>Roles</small></span>
          <span>L1–L5<small>Levels</small></span>
        </div>
      </div>
    </section>

    <section className="diploma-highlights">{t.highlights.map(([value, label, note]) => <div className="dash-card" key={label}><GraduationCap /><strong>{value}</strong><span>{label}</span><small>{note}</small></div>)}</section>

    <section className="section program-section">
      <p className="eyebrow"><Target /> {t.goalsTitle}</p>
      <div className="diploma-layout">
        <div className="glass-card"><div className="card-title"><Target /> {t.goalsTitle}</div>{t.domains.map(x => <div className="check" key={x}><CheckCircle2 /> {x}</div>)}</div>
        <div className="glass-card"><div className="card-title"><Users /> {t.entryTitle}</div>{t.entryRequirements.map(x => <div className="check" key={x}><ShieldCheck /> {x}</div>)}</div>
      </div>
    </section>

    <section className="section program-section">
      <p className="eyebrow"><Stethoscope /> {t.rotationsTitle}</p>
      <h2>{t.rotationsTitle}</h2>
      <div className="diploma-years">{t.years.map(y => <article className="overview-card" key={y.year}><h3>{y.year}</h3><p><b>{y.total}</b></p><div className="program-rotation-list">{y.rotations.map(([name, weeks, setting]) => <div key={name}><strong>{name}</strong><span>{weeks}</span><small>{setting}</small></div>)}</div></article>)}</div>
    </section>

    <section className="section program-section">
      <div className="glass-card diploma-modules"><div className="card-title"><BookOpen /> {t.modulesTitle}</div><div>{t.modules.map((m, i) => <span key={m}>{String(i + 1).padStart(2, '0')} — {m}</span>)}</div></div>
    </section>

    <section className="section program-section two-col program-two-col">
      <div className="glass-card diploma-simulation"><div className="card-title"><Brain /> {t.simulationTitle}</div><div>{t.simulation.map((m, i) => <span key={m}>{i + 1}. {m}</span>)}</div></div>
      <div className="glass-card"><div className="card-title"><Layers3 /> {t.levelsTitle}</div>{t.levels.map(([level, label, desc]) => <div className="level-row" key={level}><strong>{level}</strong><span>{label}</span><small>{desc}</small></div>)}</div>
    </section>

    <section className="section program-section">
      <div className="glass-card"><div className="card-title"><ClipboardCheck /> {t.assessmentTitle}</div>{t.assessment.map(x => <div className="check" key={x}><CheckCircle2 /> {x}</div>)}</div>
    </section>

    <footer><HeartPulse /> Cath Lab Academy — CCL Nursing Diploma Program Information</footer>
  </main>;
}

createRoot(document.getElementById('root')).render(<ProgramPage />);
