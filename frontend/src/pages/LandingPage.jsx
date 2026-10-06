import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  HardHat,
  ArrowRight,
  Users,
  AlertTriangle,
  FileCheck2,
  Hospital,
  ShieldAlert,
  Building2,
  Menu,
  X
} from 'lucide-react';

const SYSTEM_CAPABILITIES = [
  {
    title: 'Worker Safety Profiles',
    desc: 'Worker identity and assignments.',
    icon: Users,
    tone: 'green'
  },
  {
    title: 'Incident Reporting',
    desc: 'Incidents and follow-up.',
    icon: AlertTriangle,
    tone: 'coral'
  },
  {
    title: 'Compensation Claims',
    desc: 'Claim review and progress.',
    icon: FileCheck2,
    tone: 'lavender'
  },
  {
    title: 'Safety Complaints',
    desc: 'Hazards and corrective action.',
    icon: ShieldAlert,
    tone: 'amber'
  },
  {
    title: 'Emergency Support',
    desc: 'Nearby hospital support.',
    icon: Hospital,
    tone: 'green'
  }
];

const ROLES = [
  {
    title: 'Industrial Worker',
    desc: 'Report incidents, submit claims and access safety services.',
    icon: HardHat,
    tone: 'green'
  },
  {
    title: 'Factory Administrator',
    desc: 'Manage workers, investigate incidents and maintain plant safety.',
    icon: Building2,
    tone: 'coral'
  },
  {
    title: 'Government Safety Officer',
    desc: 'Review compliance, incidents and statutory compensation.',
    icon: ShieldCheck,
    tone: 'lavender'
  }
];

const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="midc-public-page overflow-x-hidden"
    >
      <style>{`
        .landing-page-motion .midc-public-header {
          transition: background-color .25s ease, box-shadow .25s ease;
        }

        .landing-page-motion .midc-public-header:hover {
          box-shadow: 0 8px 28px rgba(30, 30, 30, .06);
        }

        .landing-page-motion .midc-brand-mark {
          transition: transform .3s ease, box-shadow .3s ease;
        }

        .landing-page-motion .midc-brand-mark:hover {
          transform: translateY(-2px) rotate(-3deg);
          box-shadow: 0 8px 18px rgba(62, 92, 84, .16);
        }

        .landing-page-motion .landing-pin {
          transition: transform .3s ease, box-shadow .3s ease;
        }

        .landing-page-motion .landing-pin:hover {
          transform: translateY(-5px) scale(1.07);
          box-shadow: 0 12px 24px rgba(62, 92, 84, .18);
        }

        .landing-page-motion .landing-float-card {
          transition: transform .35s ease, box-shadow .35s ease;
        }

        .landing-page-motion .landing-float-card:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 18px 32px rgba(30, 30, 30, .12);
        }

        .landing-page-motion .landing-search-field {
          transition: transform .25s ease, background-color .25s ease;
        }

        .landing-page-motion .landing-search-field:hover {
          transform: translateY(-2px);
          background-color: rgba(255, 255, 255, .82);
        }

        .landing-page-motion .landing-search-button {
          transition: transform .25s ease, box-shadow .25s ease;
        }

        .landing-page-motion .landing-search-button:hover {
          transform: translateY(-2px) scale(1.04);
          box-shadow: 0 10px 22px rgba(62, 92, 84, .20);
        }

        .landing-page-motion .midc-feature-card,
        .landing-page-motion .midc-role-card {
          transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease;
        }

        .landing-page-motion .midc-feature-card:hover,
        .landing-page-motion .midc-role-card:hover {
          transform: translateY(-7px);
          box-shadow: 0 16px 34px rgba(30, 30, 30, .09);
          border-color: rgba(62, 92, 84, .28);
        }

        .landing-page-motion .midc-feature-icon {
          transition: transform .3s ease;
        }

        .landing-page-motion .midc-feature-card:hover .midc-feature-icon,
        .landing-page-motion .midc-role-card:hover .midc-feature-icon {
          transform: translateY(-2px) scale(1.06);
        }

        .landing-page-motion .midc-workflow-row {
          transition: transform .25s ease, box-shadow .25s ease, background-color .25s ease;
        }

        .landing-page-motion .midc-workflow-row:hover {
          transform: translateX(5px);
          box-shadow: 0 8px 20px rgba(30, 30, 30, .06);
        }

        .landing-page-motion .landing-workspace-card {
          transition: transform .35s ease, box-shadow .35s ease;
        }

        .landing-page-motion .landing-workspace-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 22px 45px rgba(30, 30, 30, .14);
        }

        .landing-page-motion .landing-workspace-tile {
          transition: transform .25s ease, background-color .25s ease, border-color .25s ease;
        }

        .landing-page-motion .landing-workspace-tile:hover {
          transform: translateY(-4px);
          background-color: rgba(255, 255, 255, .14);
          border-color: rgba(255, 255, 255, .22);
        }

        .landing-page-motion .midc-btn-primary,
        .landing-page-motion .midc-btn-outline {
          transition: transform .25s ease, box-shadow .25s ease, background-color .25s ease;
        }

        .landing-page-motion .midc-btn-primary:hover,
        .landing-page-motion .midc-btn-outline:hover {
          transform: translateY(-2px);
        }

        .landing-page-motion .midc-btn-primary:hover {
          box-shadow: 0 12px 26px rgba(62, 92, 84, .18);
        }

        .landing-page-motion a:focus-visible,
        .landing-page-motion button:focus-visible {
          outline: 2px solid #C9A66B;
          outline-offset: 3px;
        }

        .midc-public-page .midc-container {
          width: min(92vw, 1420px);
          max-width: none;
        }

        .midc-public-page { background: #fff !important; color: #111 !important; }
        .midc-public-page .midc-public-header {
          background: #fff !important; border-bottom: 1px solid #e5e5e5 !important; backdrop-filter: none;
        }
        .midc-public-header .midc-container {
          display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; height: 78px;
        }
        .midc-public-header .midc-container > a { justify-self: start; color: #111; }
        .midc-public-header .landing-nav-actions { justify-self: end; }
        .midc-public-header nav { color: #171717; font-size: .9375rem; font-weight: 500; }
        .midc-public-header .midc-brand-mark + div > div:first-child { font-size: 1.1875rem; font-weight: 700; letter-spacing: -.035em; }
        .midc-public-header .midc-brand-mark + div > div:last-child { font-size: .8125rem; font-weight: 400; line-height: 1.4; }
        .midc-public-page .midc-brand-mark {
          width: 47px; height: 50px; border-radius: 10px; background: #111 !important; color: #fff !important;
          box-shadow: none !important; animation: none !important;
        }
        .midc-public-page .midc-btn-primary {
          min-height: 42px; padding: .625rem 1rem; border: 1px solid #111; border-radius: 9px;
          font-family: inherit; font-size: .875rem; font-weight: 700; line-height: 1.15;
          background: #111 !important; color: #fff !important; box-shadow: none !important;
        }
        .midc-public-page .midc-btn-primary:hover { background: #2a2a2a !important; box-shadow: none !important; }
        .midc-public-page .midc-btn-outline {
          min-height: 42px; padding: .625rem 1rem; border-radius: 9px; border-color: #d8d8d8 !important;
          font-family: inherit; font-size: .875rem; font-weight: 600; line-height: 1.15;
          color: #111 !important; background: #fff !important;
        }
        .midc-public-page .landing-mobile-start { background: #111 !important; color: #fff !important; }
        .landing-nav-actions { gap: .5rem; }
        .landing-nav-actions > a:first-child {
          display: inline-flex; align-items: center; justify-content: center; height: 42px; padding: 0 .75rem;
          font-size: .875rem; font-weight: 500; line-height: 1.15;
        }
        .landing-nav-actions .midc-btn-primary { height: 42px; min-height: 42px; padding: 0 1rem; }
        .landing-mobile-start { font-size: .875rem; font-weight: 700; line-height: 1.15; }
        .midc-public-page .midc-hero { overflow: visible; background: #fff !important; }
        .midc-public-page .midc-hero::before { display: none; }

        @media (min-width: 768px) {
          .midc-public-page .midc-hero {
            display: flex;
            align-items: center;
            min-height: calc(100vh - 78px - 152px - 32px);
            min-height: calc(100svh - 78px - 152px - 32px);
          }
        }

        .landing-centered-hero { padding: 76px 16px 42px; text-align: center; }
        .landing-centered-hero .midc-section-label {
          justify-content: center; color: #565656; letter-spacing: 0; font-size: .95rem; font-weight: 500; text-transform: none;
        }
        .landing-centered-hero .midc-dot { background: #f2672e; }
        .landing-centered-title {
          max-width: 920px; margin: 30px auto 24px; color: #111; font-size: clamp(3rem, 4vw, 3.375rem);
          font-weight: 700; letter-spacing: -.055em; line-height: 1.1;
        }
        .landing-centered-title span { color: inherit; }
        .landing-centered-copy { max-width: 760px; margin: 0 auto; color: #686868; font-size: 1rem; font-weight: 400; line-height: 1.65; }

        .midc-public-page .midc-section { border-top-color: #e5e5e5 !important; background: #fff !important; }
        .midc-public-page .midc-heading {
          color: #111; font-size: clamp(1.75rem, 2.3vw, 2rem); font-weight: 700;
          line-height: 1.16; letter-spacing: -.035em;
        }
        .midc-public-page .midc-role-card h3,
        .midc-public-page .midc-feature-card h3 { color: #111; font-size: 1rem; font-weight: 600; line-height: 1.35; }
        .midc-public-page .midc-section-label { color: #666; font-size: .72rem; font-weight: 600; letter-spacing: .08em; }
        .midc-public-page .midc-lead { font-size: 1rem; font-weight: 400; line-height: 1.65; }
        .midc-public-page .midc-feature-card,
        .midc-public-page .midc-role-card {
          border-color: #e5e5e5; border-radius: 0; background: #fff; box-shadow: none;
        }
        .midc-public-page .midc-feature-icon { border: 0; border-radius: 0; background: transparent; color: #f2672e; }
        .midc-public-page .midc-final-cta { border-color: #e5e5e5; border-radius: 0; background: #fff; }
        .midc-public-page .midc-final-cta .midc-section-label { color: #f2672e; }
        .midc-public-page footer { border-color: #e5e5e5; background: #fff; }

        .capability-strip {
          display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); border-top: 1px solid #e5e5e5;
          border-bottom: 1px solid #e5e5e5;
        }
        .capability-item { min-width: 0; padding: 18px 20px; border-left: 1px solid #e5e5e5; }
        .capability-item:first-child { border-left: 0; }
        .capability-meta { display: flex; align-items: center; gap: 22px; color: #777; font-size: .75rem; font-weight: 500; line-height: 1.3; }
        .capability-meta svg { width: 21px; height: 21px; color: #f2672e; }
        .capability-title-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; min-height: 2.7em; margin-top: 14px; }
        .capability-title-row h3 { margin: 0; color: #111; font-size: 1rem; font-weight: 600; line-height: 1.35; }
        .capability-title-row svg { width: 16px; height: 16px; margin-top: .1rem; color: #888; flex: none; }
        .capability-item p { min-height: 2.4em; margin-top: 6px; color: #686868; font-size: .8125rem; font-weight: 400; line-height: 1.55; }
        .midc-public-page .midc-role-card { padding: 16px; }
        .midc-public-page .midc-role-card h3 { min-height: 2.7em; margin-top: 12px; }
        .midc-public-page .midc-role-card p { font-size: .8125rem; font-weight: 400; line-height: 1.6; }
        .midc-public-page .midc-final-cta h2 { font-size: clamp(1.5rem, 2vw, 2rem); font-weight: 700; line-height: 1.2; letter-spacing: -.025em; }
        .midc-public-page .midc-final-cta { margin-top: 40px; padding: 16px 20px; }
        .midc-public-page #workflow > .midc-container { padding-block: 56px 60px; }
        .midc-public-page #roles > .midc-container { padding-block: 60px 48px; }
        .midc-public-page .workflow-intro h2 { margin-top: 8px; }
        .midc-public-page .workflow-intro p { margin-top: 14px; }

        .midc-public-header .midc-container > a {
          align-items: center;
          gap: .75rem;
        }

        .midc-public-header .midc-brand-mark {
          flex: none;
        }

        .midc-public-header .midc-brand-mark + div {
          line-height: 1.25;
        }

        .workflow-sequence {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          margin-top: 24px;
        }

        .workflow-step {
          position: relative;
          min-width: 0;
          padding: 14px 1.5rem;
          border-left: 1px solid #e5e5e5;
        }

        .workflow-step:first-child {
          padding-left: 0;
          border-left: 0;
        }

        .workflow-step-number {
          display: block;
          margin-bottom: .55rem;
          color: #f2672e;
          font-size: .75rem;
          font-weight: 700;
        }

        .workflow-step h3 {
          margin: 0;
          color: #1E1E1E;
          font-size: 1rem;
          font-weight: 600;
          line-height: 1.35;
        }

        .workflow-step p {
          margin: .4rem 0 0;
          color: #6C757D;
          font-size: .875rem;
          line-height: 1.5;
        }

        .workflow-step-arrow {
          position: absolute;
          top: .9rem;
          right: .35rem;
          width: 1rem;
          height: 1rem;
        }

        @media (max-width: 767px) {
          .midc-public-header .midc-container { grid-template-columns: 1fr auto; height: 68px; }
          .midc-public-header nav,
          .midc-public-header .landing-nav-actions { display: none; }
          .landing-centered-hero { padding: 58px 8px 32px; }
          .landing-centered-title { font-size: clamp(2.25rem, 7vw, 3rem); }
          .landing-centered-copy { font-size: 1rem; line-height: 1.6; }
          .capability-strip { grid-template-columns: 1fr 1fr; }
          .capability-item { padding: 16px 14px; border-bottom: 1px solid #e5e5e5; }
          .midc-public-page #workflow > .midc-container { padding-block: 42px; }
          .midc-public-page #roles > .midc-container { padding-block: 42px 36px; }
          .midc-public-page .midc-final-cta { margin-top: 36px; }

          .workflow-sequence {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .workflow-step,
          .workflow-step:first-child {
            padding: 8px 0 8px 1rem;
            border-left: 1px solid #e5e5e5;
          }

          .workflow-step-arrow {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .landing-page-motion *,
          .landing-page-motion *::before,
          .landing-page-motion *::after {
            transition-duration: .01ms !important;
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>

      {/* ================= HEADER ================= */}

      <header className="midc-public-header sticky top-0 z-50">
        <div className="midc-container h-[72px] flex items-center justify-between">

          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <div className="midc-brand-mark">
              <ShieldCheck className="w-5 h-5" />
            </div>

            <div>
              <div className="font-extrabold text-[#1E1E1E] leading-tight">
                MIDC Safety
              </div>

              <div className="text-[11px] text-[#6C757D]">
                Industrial worker protection
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-9 text-sm font-semibold text-[#6C757D]">
            <a
              href="#platform"
              className="hover:text-[#F2672E] transition"
            >
              Platform
            </a>

            <a
              href="#workflow"
              className="hover:text-[#F2672E] transition"
            >
              How it works
            </a>

            <a
              href="#roles"
              className="hover:text-[#F2672E] transition"
            >
              For teams
            </a>
          </nav>

          <div className="landing-nav-actions hidden md:flex items-center gap-2">
            <Link
              to="/login"
              className="px-4 py-2.5 rounded-xl text-sm font-bold text-[#1E1E1E] hover:bg-[#F4F4F4] transition"
            >
              Sign in
            </Link>

            <Link
              to="/register"
              className="midc-btn-primary px-4 py-2.5 text-sm"
            >
              Get started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden p-2 rounded-xl hover:bg-[#F4F4F4]"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden px-5 pb-4 border-t border-[#E0E0E0] bg-[#FFFFFF] flex flex-col gap-1 pt-3">

            <a
              href="#platform"
              onClick={() => setMenuOpen(false)}
              className="p-3 rounded-xl hover:bg-[#F4F4F4]"
            >
              Platform
            </a>

            <a
              href="#workflow"
              onClick={() => setMenuOpen(false)}
              className="p-3 rounded-xl hover:bg-[#F4F4F4]"
            >
              How it works
            </a>

            <Link
              to="/login"
              className="p-3 rounded-xl hover:bg-[#F4F4F4]"
            >
              Sign in
            </Link>

            <Link
              to="/register"
              className="landing-mobile-start p-3 rounded-xl text-center"
            >
              Get started
            </Link>

          </div>
        )}
      </header>

      <main>

        {/* ================= HERO ================= */}

        <section className="midc-hero">
          <div className="midc-container">
            <div className="landing-centered-hero">
              <div className="midc-section-label">
                <span className="midc-dot" />
                MIDC Safety · Worker protection
              </div>
              <h1 className="landing-centered-title">
                A clearer way to<br />manage workplace<br /><span>safety.</span>
              </h1>
              <p className="landing-centered-copy">
                Bring worker records, incident response, safety concerns and compensation<br className="hidden sm:block" /> workflows together in one dependable workspace.
              </p>
            </div>
          </div>
        </section>

        {/* ================= PLATFORM ================= */}

        <section
          id="platform"
          className="midc-section bg-white"
        >
          <div className="midc-container">
            <div className="capability-strip">

              {SYSTEM_CAPABILITIES.map(
                ({ title, desc, icon: Icon }, index) => (
                  <article
                    key={title}
                    className="capability-item"
                  >
                    <div className="capability-meta">
                      <span>0{index + 1}</span>
                      <Icon aria-hidden="true" />
                    </div>
                    <div className="capability-title-row">
                      <h3>{title}</h3>
                      <ArrowRight aria-hidden="true" />
                    </div>
                    <p>{desc}</p>
                  </article>
                )
              )}

            </div>
          </div>
        </section>

        {/* ================= WORKFLOW ================= */}
        <section id="workflow" className="midc-section bg-[#F4F4F4]">
          <div className="midc-container py-14 lg:py-18">
            <div className="workflow-intro">
              <div className="midc-section-label">Designed around action</div>
              <h2 className="midc-heading mt-2">From report to response, without the clutter.</h2>
              <p className="midc-lead mt-4">Keep the next important action visible while the supporting records stay close at hand.</p>
            </div>
            <div className="workflow-sequence" aria-label="Safety workflow steps">
              {[
                { title: 'Report', description: 'Capture an incident or hazard.' },
                { title: 'Document', description: 'Keep evidence and response details together.' },
                { title: 'Review', description: 'Track claims, investigation and follow-up.' },
                { title: 'Support', description: 'Connect the worker with the right support.' }
              ].map((step, index) => (
                <article className="workflow-step" key={step.title}>
                  <span className="workflow-step-number">0{index + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                  {index < 3 && <ArrowRight className="workflow-step-arrow" aria-hidden="true" />}
                </article>
              ))}
            </div>
          </div>
        </section>
        {/* ================= ROLES ================= */}

        <section
          id="roles"
          className="midc-section bg-white"
        >
          <div className="midc-container py-14 lg:py-18">

            <div>

              <div className="midc-section-label">
                Built for the people involved
              </div>

              <h2 className="midc-heading mt-2">
                A shared system, tailored by responsibility.
              </h2>

            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-8">

              {ROLES.map(
                ({ title, desc, icon: Icon }) => (
                  <article
                    key={title}
                    className="midc-role-card"
                  >
                    <div className="midc-feature-icon">
                      <Icon />
                    </div>

                    <h3>{title}</h3>

                    <p>{desc}</p>
                  </article>
                )
              )}

            </div>

            <div
              className="midc-final-cta mt-10"
            >
              <div>
                <div className="midc-section-label text-[#C9A66B]">
                  Ready to work safely
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold mt-2 text-[#1E1E1E]">
                  Bring the safety workflow together.
                </h2>
              </div>

            </div>

          </div>
        </section>

      </main>

      <footer className="border-t border-[#E0E0E0] bg-[#FFFFFF]">
        <div className="midc-container py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#6C757D]">

          <span>
            MIDC Safety · Worker protection & compensation management
          </span>

          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Safety support workspace
          </span>

        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
