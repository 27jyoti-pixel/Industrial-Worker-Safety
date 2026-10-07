import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  HardHat,
  Users,
  AlertTriangle,
  FileCheck2,
  Building2,
  Menu,
  X,
  ClipboardCheck,
  HeartPulse,
  Check,
  Activity,
  UserRound,
  LockKeyhole,
} from 'lucide-react';
import heroWorkers from '../assets/landing/hero-workers.png';
import workflowReport from '../assets/landing/workflow-report.png';
import workflowDocument from '../assets/landing/workflow-document.png';
import workerIndustrial from '../assets/landing/worker-industrial.png';
import workerFactoryAdmin from '../assets/landing/worker-factory-admin.png';
import workerGovernmentOfficer from '../assets/landing/worker-government-officer.png';
import workerSupport from '../assets/landing/worker-support.png';
import impactTeam from '../assets/landing/impact-team.png';
import workerSuperAdmin from '../assets/landing/worker-super-admin.png';
import benefitIcons from '../assets/landing/benefit-icons.png';

const WORKFLOW = [
  { title: 'Report', description: 'Capture an incident or hazard.', icon: AlertTriangle, image: workflowReport },
  { title: 'Document', description: 'Keep evidence and response details together.', icon: ClipboardCheck, image: workflowDocument },
  { title: 'Review', description: 'Track claims, investigation and follow-up.', icon: FileCheck2, image: workerGovernmentOfficer },
  { title: 'Support', description: 'Connect the worker with the right support.', icon: HeartPulse, image: workerSupport },
];

const ROLES = [
  { title: 'Industrial Worker', desc: 'Report incidents, raise concerns and track compensation.', icon: HardHat, image: workerIndustrial, points: ['Report incidents', 'Raise complaints', 'Track compensation'] },
  { title: 'Factory Administrator', desc: 'Coordinate workers, safety and incident response.', icon: Building2, image: workerFactoryAdmin, points: ['Manage workers', 'Oversee safety', 'Handle reports'] },
  { title: 'Government Safety Officer', desc: 'Monitor compliance and support safer workplaces.', icon: ShieldCheck, image: workerGovernmentOfficer, points: ['Audit and monitor', 'Ensure compliance', 'View reports'] },
  { title: 'Super Administrator', desc: 'Manage the platform and keep services accountable.', icon: LockKeyhole, image: workerSuperAdmin, points: ['System management', 'User administration', 'Platform governance'] },
];

const BENEFITS = [
  { title: 'Safer workplaces', description: 'Fewer incidents and faster response.', icon: ShieldCheck },
  { title: 'Clear accountability', description: 'Defined roles and transparent processes.', icon: Users },
  { title: 'Data-driven decisions', description: 'Better insights for safer operations.', icon: Activity },
  { title: 'Healthier communities', description: 'More secure workers and stronger industries.', icon: HeartPulse },
];

function Eyebrow({ children }) {
  return <div className="landing-eyebrow"><span aria-hidden="true" />{children}</div>;
}

function ImageSlot({ className = '', src, label }) {
  return <div className={`landing-image-slot ${className}`}><img src={src} alt={label} /></div>;
}

const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="midc-public-page landing-page">
      <style>{`
        .landing-page { --ink:#111; --muted:#6c757d; --line:#e5e5e5; --orange:#e87532; --paper:#fff; --soft:#fbf8f4; display:block; width:100%; max-width:none; min-height:100vh; color:var(--ink); background:var(--paper); overflow-x:clip; font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; }
        .landing-page * { box-sizing:border-box; }
        .landing-page > header,.landing-page > main,.landing-page main > section { width:100%; max-width:none; }
        .landing-container { width:calc(100% - 48px); max-width:none; margin-inline:auto; }
        .landing-header { width:100%; height:74px; position:sticky; top:0; z-index:40; background:#fff; border-bottom:1px solid var(--line); }
        .landing-header-inner { height:100%; display:grid; grid-template-columns:1fr auto 1fr; align-items:center; gap:32px; }
        .landing-header-inner.landing-container { width:calc(100% - 48px); }
        .landing-brand { display:inline-flex; align-items:center; gap:11px; color:var(--ink); text-decoration:none; width:max-content; }
        .landing-brand-mark { width:47px; height:50px; flex:none; border-radius:10px; display:grid; place-items:center; color:white; background:#111; }
        .landing-brand-mark svg { width:20px; height:20px; }
        .landing-brand-name { display:block; font-size:18px; font-weight:700; letter-spacing:-.035em; line-height:1.2; }
        .landing-brand-subtitle { display:block; margin-top:4px; color:#6c757d; font-size:11px; line-height:1.25; }
        .landing-nav { display:flex; align-items:center; gap:24px; }
        .landing-nav a,.landing-signin { text-decoration:none; color:#555; font-size:14px; font-weight:500; transition:color .18s ease; }
        .landing-nav a:hover { color:var(--orange); }
        .landing-header-action { justify-self:end; display:flex; align-items:center; gap:16px; }
        .landing-signin { display:inline-flex; min-height:42px; align-items:center; justify-content:center; padding:.625rem 1rem; border:0; border-radius:9px; background:#111; color:#fff; font-size:.9375rem; font-weight:500; line-height:1.5; text-decoration:none; transition:background-color .18s ease,color .18s ease; }
        .landing-signin:hover { color:#fff; background:#111; }
        .landing-menu-button { display:none; border:0; background:transparent; color:var(--ink); padding:8px; }
        .landing-mobile-menu { display:none; }
        .landing-hero { width:100%; min-height:500px; background:#fff; border-bottom:1px solid var(--line); }
        .landing-hero-inner { min-height:500px; display:grid; grid-template-columns:.93fr 1.07fr; align-items:stretch; }
        .landing-hero-inner.landing-container { width:100%; padding-left:24px; }
        .landing-hero-copy { position:relative; z-index:2; display:flex; flex-direction:column; justify-content:center; padding:56px 0 48px; max-width:570px; }
        @media (min-width: 901px) { .landing-hero-copy { padding-left:24px; } }
        .landing-eyebrow { display:flex; align-items:center; gap:9px; color:#67727e; font-size:11px; font-weight:500; letter-spacing:.025em; text-transform:uppercase; }
        .landing-eyebrow > span { width:8px; height:8px; flex:none; border-radius:50%; background:var(--orange); }
        .landing-hero .landing-eyebrow { text-transform:none; letter-spacing:0; font-size:12px; }
        .landing-hero h1 { max-width:570px; margin:18px 0 14px; color:#111; font-size:clamp(48px,3.8vw,54px); font-weight:600; letter-spacing:-.05em; line-height:1.08; }
        .landing-hero-copy > p { max-width:475px; margin:0; color:#6c757d; font-size:16px; line-height:1.6; }
        .landing-hero-points { display:flex; align-items:center; gap:0; margin-top:30px; }
        .landing-hero-point { display:flex; align-items:center; gap:9px; padding:0 15px; border-left:1px solid var(--line); color:#222; font-size:12px; font-weight:500; line-height:1.3; }
        .landing-hero-point:first-child { padding-left:0; border-left:0; }
        .landing-hero-point svg { width:22px; height:22px; color:#69737c; flex:none; }
        .landing-hero-art { position:relative; min-width:0; min-height:500px; display:flex; align-items:stretch; justify-content:center; }
        .landing-hero-art::before { content:""; position:absolute; inset:0 auto 0 -80px; width:180px; z-index:1; background:transparent; pointer-events:none; }
        .landing-hero-scene { position:absolute; inset:0; overflow:hidden; background:#fff; }
        .landing-hero-scene img { display:block; width:100%; height:100%; object-fit:cover; object-position:100% center; -webkit-mask-image:linear-gradient(90deg,transparent 0%,rgba(0,0,0,.22) 6%,rgba(0,0,0,.76) 14%,#000 21%); mask-image:linear-gradient(90deg,transparent 0%,rgba(0,0,0,.22) 6%,rgba(0,0,0,.76) 14%,#000 21%); }
        .landing-action-stack { position:absolute; z-index:2; right:5%; top:50%; transform:translateY(-50%); display:grid; gap:12px; width:170px; }
        .landing-action-card { display:flex; gap:10px; align-items:center; padding:11px 12px; border:1px solid rgba(230,226,220,.95); border-radius:9px; background:#fff; }
        .landing-action-icon { display:grid; place-items:center; width:32px; height:32px; color:#fff; background:var(--orange); border-radius:6px; flex:none; }
        .landing-action-icon svg { width:17px; height:17px; }
        .landing-action-card strong { display:block; color:#111; font-size:11px; font-weight:600; line-height:1.3; }
        .landing-action-card span { display:block; margin-top:3px; color:#6f7881; font-size:10px; line-height:1.3; }
        .landing-section { border-bottom:1px solid var(--line); }
        .landing-page main > section[id] { scroll-margin-top:90px; }
        .landing-section-inner { padding-block:54px; }
        .landing-split { display:grid; grid-template-columns:minmax(0,.68fr) minmax(0,1.32fr); gap:28px; align-items:center; }
        .landing-section-title { margin:11px 0 0; max-width:450px; color:#111; font-size:clamp(29px,2.7vw,34px); line-height:1.16; letter-spacing:-.035em; font-weight:600; }
        .landing-section-copy { max-width:440px; margin:13px 0 0; color:#6c757d; font-size:15px; line-height:1.6; }
        .landing-workflow-grid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:16px; }
        .landing-workflow-card { min-width:0; position:relative; overflow:hidden; border:1px solid #eee9e4; border-radius:9px; background:#fff; cursor:pointer; }
        .landing-workflow-art { height:132px; position:relative; overflow:hidden; background:#f4eee8; }
        .landing-workflow-art > img { display:block; width:100%; height:100%; object-fit:cover; object-position:center 30%; }
        .landing-card-number { position:absolute; z-index:2; top:9px; left:9px; display:grid; place-items:center; width:36px; height:31px; border-radius:6px; color:var(--orange); background:white; font-size:14px; font-weight:600; }
        .landing-workflow-copy { padding:12px 12px 14px; }
        .landing-workflow-copy h3 { margin:0; color:#111; font-size:16px; font-weight:600; }
        .landing-workflow-copy p { margin:4px 0 0; color:#6c757d; font-size:13px; line-height:1.45; }
        .landing-role-section { background:#fcfbfa; }
        .landing-role-layout { display:grid; grid-template-columns:minmax(0,.68fr) minmax(0,1.32fr); gap:28px; align-items:center; }
        .landing-role-grid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:14px; }
        .landing-role-card { overflow:hidden; border:1px solid #eee9e4; border-radius:9px; background:#fff; cursor:pointer; }
        .landing-role-art { height:130px; position:relative; overflow:hidden; background:#f8f1e9; }
        .landing-role-art > img { display:block; width:100%; height:100%; object-fit:cover; object-position:center 28%; }
        .landing-role-content { padding:12px 13px 14px; }
        .landing-role-content h3 { min-height:42px; margin:0; color:#111; font-size:15px; font-weight:600; line-height:1.35; }
        .landing-role-content p { min-height:48px; margin:3px 0 9px; color:#6c757d; font-size:13px; line-height:1.45; }
        .landing-role-content ul { display:grid; gap:5px; list-style:none; padding:0; margin:0; }
        .landing-role-content li { display:flex; align-items:center; gap:6px; color:#6c757d; font-size:12px; line-height:1.35; }
        .landing-role-content li svg { width:12px; height:12px; flex:none; color:var(--orange); stroke-width:2.5; }
        .landing-impact { position:relative; overflow:hidden; background:#fbf8f4; }
        .landing-impact-inner { min-height:300px; position:relative; display:flex; align-items:center; }
        .landing-impact-inner.landing-container { width:100%; padding-left:24px; }
        .landing-impact-copy { position:relative; z-index:2; width:53%; padding-block:44px; }
        .landing-impact-copy .landing-section-title { max-width:470px; }
        .landing-impact-copy .landing-section-copy { max-width:460px; }
        .landing-impact-art { position:absolute; inset:0 0 0 44%; overflow:hidden; background:#fbf8f4; -webkit-mask-image:linear-gradient(90deg,transparent 0%,#000 24%); mask-image:linear-gradient(90deg,transparent 0%,#000 24%); }
        .landing-impact-art > img { display:block; width:100%; height:100%; object-fit:cover; object-position:center; }
        .landing-metrics { display:flex; gap:0; margin-top:22px; }
        .landing-metric { min-width:100px; padding:0 16px; border-left:1px solid #e5c9b8; }
        .landing-metric:first-child { padding-left:0; border-left:0; }
        .landing-metric strong { display:block; color:var(--orange); font-size:21px; line-height:1.15; font-weight:600; }
        .landing-metric span { display:block; margin-top:3px; color:#63707c; font-size:10px; line-height:1.35; }
        .landing-benefits .landing-section-inner { padding-block:34px 42px; }
        .landing-benefits-title { margin:10px 0 20px; color:#111; font-size:clamp(28px,2.4vw,32px); letter-spacing:-.035em; line-height:1.2; font-weight:600; }
        .landing-benefit-grid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); }
        .landing-benefit { display:flex; align-items:center; gap:13px; padding:0 18px; border-left:1px solid var(--line); }
        .landing-benefit:first-child { padding-left:0; border-left:0; }
        .landing-benefit-icon { width:53px; height:53px; flex:none; display:block; border-radius:50%; background-repeat:no-repeat; background-size:400% auto; }
        .landing-benefit h3 { margin:0; color:#111; font-size:14px; font-weight:600; }
        .landing-benefit p { margin:5px 0 0; color:#6c757d; font-size:12px; line-height:1.45; }
        @media (min-width: 901px) {
          .landing-split-intro { padding-left:24px; }
          .landing-impact-copy { padding-left:24px; }
          .landing-benefit-grid { padding-left:24px; }
          .landing-benefits .landing-section-inner > .landing-eyebrow,
          .landing-benefits-title { margin-left:24px; }
        }
        .landing-image-slot { border:0; }
        @media (max-width: 900px) {
          .landing-container { width:calc(100% - 40px); max-width:none; }
          .landing-header-inner.landing-container { width:calc(100% - 40px); }
          .landing-hero-inner.landing-container,.landing-impact-inner.landing-container { width:100%; padding-left:20px; }
          .landing-header-inner { grid-template-columns:1fr auto; }
          .landing-nav,.landing-header-action { display:none; }
          .landing-menu-button { display:block; justify-self:end; }
          .landing-mobile-menu { display:flex; flex-direction:column; gap:4px; padding:12px 20px 16px; border-top:1px solid var(--line); background:#fff; }
          .landing-mobile-menu a { padding:10px 4px; color:var(--ink); text-decoration:none; font-size:14px; }
          .landing-mobile-menu .landing-signin { width:max-content; margin-top:4px; padding:.625rem 1rem; background:#111; color:#fff; font-size:.9375rem; }
          .landing-mobile-menu .landing-signin:hover { background:#111; color:#fff; }
          .landing-hero-inner { grid-template-columns:1fr 1fr; }
          .landing-hero h1 { font-size:clamp(38px,5.1vw,46px); }
          .landing-hero-point { padding-inline:9px; font-size:10px; }
          .landing-split { grid-template-columns:1fr; gap:24px; }
          .landing-split-intro { max-width:600px; }
          .landing-role-layout { grid-template-columns:1fr; gap:24px; }
          .landing-impact-copy { width:65%; }
          .landing-benefit { padding-inline:10px; gap:9px; }
          .landing-benefit-icon { width:44px; height:44px; }
        }
        @media (max-width: 640px) {
          .landing-container { width:calc(100% - 36px); max-width:none; }
          .landing-header-inner.landing-container { width:calc(100% - 32px); }
          .landing-header { height:66px; }
          .landing-hero,.landing-hero-inner { min-height:0; }
          .landing-hero-inner { display:flex; flex-direction:column; }
          .landing-hero-copy { padding:48px 0 30px; }
          .landing-hero h1 { max-width:440px; margin-top:15px; font-size:clamp(36px,9.2vw,46px); }
          .landing-hero-copy > p { font-size:14px; }
          .landing-hero-points { flex-wrap:wrap; row-gap:14px; margin-top:23px; }
          .landing-hero-point { width:50%; padding-left:0; border-left:0; }
          .landing-hero-art { min-height:280px; margin-inline:-18px; }
          .landing-hero-art::before { inset:0 0 auto; width:auto; height:75px; background:transparent; }
          .landing-action-stack { right:4%; width:144px; gap:8px; }
          .landing-action-card { padding:8px; }
          .landing-action-icon { width:28px; height:28px; }
          .landing-section-inner { padding-block:40px; }
          .landing-section-title { font-size:29px; }
          .landing-workflow-grid { grid-template-columns:1fr 1fr; gap:11px; }
          .landing-workflow-art,.landing-role-art { height:110px; }
          .landing-role-grid { grid-template-columns:1fr 1fr; gap:11px; }
          .landing-role-content { padding:10px; }
          .landing-role-content h3 { min-height:52px; font-size:13px; }
          .landing-role-content p { min-height:52px; font-size:11px; }
          .landing-role-content li { font-size:11px; }
          .landing-impact-inner { min-height:440px; align-items:flex-start; }
          .landing-impact-copy { width:100%; padding-top:38px; }
          .landing-impact-art { inset:45% 0 0 0; -webkit-mask-image:linear-gradient(180deg,transparent 0%,#000 28%); mask-image:linear-gradient(180deg,transparent 0%,#000 28%); }
          .landing-metrics { display:grid; grid-template-columns:1fr 1fr; gap:13px 0; max-width:330px; }
          .landing-metric:nth-child(3) { padding-left:0; border-left:0; }
          .landing-benefits .landing-section-inner { padding-block:34px; }
          .landing-benefit-grid { grid-template-columns:1fr 1fr; gap:18px 0; }
          .landing-benefit { padding:0 8px; border-left:0; align-items:flex-start; }
          .landing-benefit:nth-child(odd) { padding-left:0; }
          .landing-benefit-icon { width:40px; height:40px; }
          .landing-benefit-icon svg { width:21px; height:21px; }
        }
        @media (prefers-reduced-motion: reduce) { .landing-page * { scroll-behavior:auto !important; transition:none !important; } }
      `}</style>

      <header className="landing-header">
        <div className="landing-container landing-header-inner">
          <Link to="/" className="landing-brand" aria-label="MIDC Safety home">
            <span className="landing-brand-mark"><ShieldCheck aria-hidden="true" /></span>
            <span><span className="landing-brand-name">MIDC Safety</span><span className="landing-brand-subtitle">Industrial worker protection</span></span>
          </Link>
          <nav className="landing-nav" aria-label="Main navigation">
            <a href="#platform">Platform</a><a href="#workflow">How it works</a><a href="#roles">For teams</a>
          </nav>
          <div className="landing-header-action">
            <Link to="/login" className="landing-signin">Sign in</Link>
          </div>
          <button className="landing-menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle menu" aria-expanded={menuOpen}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {menuOpen && <div className="landing-mobile-menu">
          <a href="#platform" onClick={closeMenu}>Platform</a>
          <a href="#workflow" onClick={closeMenu}>How it works</a>
          <a href="#roles" onClick={closeMenu}>For teams</a>
          <Link to="/login" className="landing-signin" onClick={closeMenu}>Sign in</Link>
        </div>}
      </header>

      <main>
        <section className="landing-hero" id="platform" aria-labelledby="landing-title">
          <div className="landing-container landing-hero-inner">
            <div className="landing-hero-copy">
              <Eyebrow>MIDC Safety · Worker protection</Eyebrow>
              <h1 id="landing-title">A safer workplace<br />for every worker.</h1>
              <p>Bring worker records, incident response, safety concerns and compensation workflows together in one dependable workspace.</p>
              <div className="landing-hero-points">
                <div className="landing-hero-point"><Users aria-hidden="true" />Unified<br />workflows</div>
                <div className="landing-hero-point"><ShieldCheck aria-hidden="true" />Compliance<br />ready</div>
                <div className="landing-hero-point"><Activity aria-hidden="true" />Trusted by<br />organizations</div>
                <div className="landing-hero-point"><UserRound aria-hidden="true" />Designed<br />for people</div>
              </div>
            </div>
            <div className="landing-hero-art">
              <ImageSlot className="landing-hero-scene" src={heroWorkers} label="Industrial workers at a refinery" />
            </div>
          </div>
        </section>

        <section className="landing-section" id="workflow">
          <div className="landing-container landing-section-inner landing-split">
            <div className="landing-split-intro">
              <Eyebrow>Designed around action</Eyebrow>
              <h2 className="landing-section-title">From report to response, without the clutter.</h2>
              <p className="landing-section-copy">Keep the next important action visible while the supporting records stay close at hand.</p>
            </div>
            <div className="landing-workflow-grid" aria-label="Safety workflow steps">
              {WORKFLOW.map(({ title, description, image }, index) => <article className="landing-workflow-card" key={title}>
                <ImageSlot className="landing-workflow-art" src={image} label={`${title} workplace scene`} /><span className="landing-card-number">0{index + 1}</span>
                <div className="landing-workflow-copy"><h3>{title}</h3><p>{description}</p></div>
              </article>)}
            </div>
          </div>
        </section>

        <section className="landing-section landing-role-section" id="roles">
          <div className="landing-container landing-section-inner">
            <div className="landing-role-layout">
              <div className="landing-split-intro">
                <Eyebrow>Built for the people involved</Eyebrow>
                <h2 className="landing-section-title">A shared system, tailored by responsibility.</h2>
                <p className="landing-section-copy">From field workers to administrators, everyone has the tools they need to work safely and stay protected.</p>
              </div>
              <div className="landing-role-grid">
                {ROLES.map(({ title, desc, image, points }) => <article className="landing-role-card" key={title}>
                  <ImageSlot className="landing-role-art" src={image} label={title} />
                  <div className="landing-role-content"><h3>{title}</h3><p>{desc}</p><ul>{points.map((point) => <li key={point}><Check aria-hidden="true" />{point}</li>)}</ul></div>
                </article>)}
              </div>
            </div>
          </div>
        </section>

        <section className="landing-impact">
          <div className="landing-container landing-impact-inner">
            <div className="landing-impact-copy">
              <Eyebrow>Real people. Real impact</Eyebrow>
              <h2 className="landing-section-title">Safety for the people who keep industries running.</h2>
              <p className="landing-section-copy">From machine operators to maintenance teams, our platform supports the real people behind every operation — with tools that protect, empower and bring everyone together.</p>
              <div className="landing-metrics">
                <div className="landing-metric"><strong>20K+</strong><span>Workers supported</span></div>
                <div className="landing-metric"><strong>300+</strong><span>Incidents resolved</span></div>
                <div className="landing-metric"><strong>150+</strong><span>Factories &amp; units</span></div>
                <div className="landing-metric"><strong>95%</strong><span>Faster response time</span></div>
              </div>
            </div>
            <ImageSlot className="landing-impact-art" src={impactTeam} label="Industrial workers collaborating at a refinery" />
          </div>
        </section>

        <section className="landing-section landing-benefits" id="benefits">
          <div className="landing-container landing-section-inner">
            <Eyebrow>Why MIDC Safety</Eyebrow>
            <h2 className="landing-benefits-title">Stronger workplaces. Safer people. Better outcomes.</h2>
            <div className="landing-benefit-grid">
              {BENEFITS.map(({ title, description }, index) => <article className="landing-benefit" key={title}>
                <span className="landing-benefit-icon" role="img" aria-label={`${title} icon`} style={{ backgroundImage: `url(${benefitIcons})`, backgroundPosition: `${index * 100 / 3}% center` }} /><div><h3>{title}</h3><p>{description}</p></div>
              </article>)}
            </div>
          </div>
        </section>
      </main>

    </div>
  );
};

export default LandingPage;
