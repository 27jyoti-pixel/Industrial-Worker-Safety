import React, { useEffect, useRef, useState } from 'react';
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
  X,
  ClipboardCheck,
  MapPin,
  CheckCircle2,
  FileText,
  Search
} from 'lucide-react';

const SYSTEM_CAPABILITIES = [
  {
    title: 'Worker Safety Profiles',
    desc: 'Keep worker identity, assignment and safety information organized.',
    icon: Users,
    tone: 'green'
  },
  {
    title: 'Incident Reporting',
    desc: 'Capture workplace accidents and keep follow-up visible.',
    icon: AlertTriangle,
    tone: 'coral'
  },
  {
    title: 'Compensation Claims',
    desc: 'Move claims from submission through review in one workflow.',
    icon: FileCheck2,
    tone: 'lavender'
  },
  {
    title: 'Safety Complaints',
    desc: 'Record hazards, inspections and corrective action.',
    icon: ShieldAlert,
    tone: 'amber'
  },
  {
    title: 'Emergency Support',
    desc: 'Find hospital and trauma support when an incident requires care.',
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

const toneClasses = {
  green:
    'bg-[#EEF2F0] text-[#3E5C54] border-[#D6E2DD]',
  coral:
    'bg-[#F3E7D6] text-[#C9A66B] border-[#E8D6B8]',
  amber:
    'bg-[#FAF3DE] text-[#9A7A28] border-[#E9C46A]',
  lavender:
    'bg-[#EAF3FB] text-[#2196F3] border-[#C9E1F5]'
};

const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pageRef = useRef(null);

  useEffect(() => {
    const page = pageRef.current;

    if (!page) return;

    const animatedElements = page.querySelectorAll(
      '[data-reveal], [data-reveal-child]'
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          } else {
            entry.target.classList.remove('is-visible');
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '-40px 0px -60px 0px'
      }
    );

    animatedElements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      animatedElements.forEach((element) => {
        observer.unobserve(element);
      });

      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={pageRef}
      className="midc-public-page overflow-x-hidden" landing-page-motion
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

          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-[#6C757D]">
            <a
              href="#platform"
              className="hover:text-[#3E5C54] transition"
            >
              Platform
            </a>

            <a
              href="#workflow"
              className="hover:text-[#3E5C54] transition"
            >
              How it works
            </a>

            <a
              href="#roles"
              className="hover:text-[#3E5C54] transition"
            >
              For teams
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-2">
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
              className="p-3 rounded-xl bg-[#3E5C54] text-white text-center"
            >
              Get started
            </Link>

          </div>
        )}
      </header>

      <main>

        {/* ================= HERO ================= */}

        <section className="midc-hero py-5 sm:py-8 lg:py-10">
          <div className="midc-container">

            <div className="landing-reference-card">

              {/* LEFT VISUAL */}

              <div
                className="landing-map-art"
                data-reveal="left"
              >
                <div className="landing-map-grid" />

                <div className="landing-map-shape shape-one" />
                <div className="landing-map-shape shape-two" />
                <div className="landing-map-shape shape-three" />

                <div
                  className="landing-pin pin-one"
                  data-reveal-child
                  style={{ '--delay': '180ms' }}
                >
                  <ShieldCheck />
                </div>

                <div
                  className="landing-pin pin-two"
                  data-reveal-child
                  style={{ '--delay': '320ms' }}
                >
                  <AlertTriangle />
                </div>

                <div
                  className="landing-pin pin-three"
                  data-reveal-child
                  style={{ '--delay': '460ms' }}
                >
                  <Hospital />
                </div>

                <div
                  className="landing-map-caption"
                  data-reveal-child
                  style={{ '--delay': '560ms' }}
                >
                  <span className="w-2 h-2 rounded-full bg-[#3E5C54]" />
                  Safety workspace
                </div>

                <div
                  className="landing-float-card"
                  data-reveal-child
                  style={{ '--delay': '680ms' }}
                >
                  <div className="w-9 h-9 rounded-xl bg-[#F3E7D6] text-[#C9A66B] flex items-center justify-center">
                    <ClipboardCheck className="w-5 h-5" />
                  </div>

                  <div>
                    <b>Safety records</b>
                    <span>Connected and organized</span>
                  </div>
                </div>
              </div>

              {/* RIGHT CONTENT */}

              <div
                className="landing-reference-copy"
                data-reveal="right"
              >
                <div
                  className="midc-section-label"
                  data-reveal-child
                  style={{ '--delay': '100ms' }}
                >
                  <span className="midc-dot bg-[#C9A66B]" />
                  Industrial safety platform
                </div>

                <h1
                  className="landing-reference-title"
                  data-reveal-child
                  style={{ '--delay': '180ms' }}
                >
                  Safer workplaces.
                  <br />
                  <span>Clearer action.</span>
                </h1>

                <p
                  className="midc-lead max-w-lg"
                  data-reveal-child
                  style={{ '--delay': '280ms' }}
                >
                  Bring worker records, accident reports, safety complaints,
                  compensation claims and emergency support into one calm,
                  connected workspace.
                </p>

                <div
                  className="landing-search-panel"
                  data-reveal-child
                  style={{ '--delay': '390ms' }}
                >
                  <div className="landing-search-field">
                    <MapPin className="w-4 h-4 text-[#C9A66B]" />
                    <span>Workplace safety</span>
                    <small>
                      Worker records & incident support
                    </small>
                  </div>

                  <div className="landing-search-field">
                    <FileText className="w-4 h-4 text-[#3E5C54]" />
                    <span>Safety workflow</span>
                    <small>
                      Claims, complaints & follow-up
                    </small>
                  </div>

                  <Link
                    to="/login"
                    className="landing-search-button"
                  >
                    <Search className="w-5 h-5" />
                  </Link>
                </div>

                <div
                  className="mt-6 flex flex-wrap gap-3"
                  data-reveal-child
                  style={{ '--delay': '500ms' }}
                >
                  <Link
                    to="/login"
                    className="midc-btn-primary"
                  >
                    Open safety workspace
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to="/register"
                    className="midc-btn-outline"
                  >
                    Create an account
                  </Link>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ================= PLATFORM ================= */}

        <section
          id="platform"
          className="midc-section bg-white"
        >
          <div className="midc-container py-14 lg:py-18">

            <div
              className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8"
              data-reveal="up"
            >
              <div>
                <div className="midc-section-label">
                  One connected workspace
                </div>

                <h2 className="midc-heading mt-2">
                  Everything safety teams touch.
                </h2>
              </div>

              <p className="text-sm leading-6 text-[#6C757D] max-w-md">
                A practical interface for the records and actions already
                supported by the MIDC application.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">

              {SYSTEM_CAPABILITIES.map(
                ({ title, desc, icon: Icon, tone }, index) => (
                  <article
                    key={title}
                    className="midc-feature-card"
                    data-reveal-child
                    style={{
                      '--delay': `${index * 110}ms`
                    }}
                  >
                    <div
                      className={`midc-feature-icon ${toneClasses[tone]}`}
                    >
                      <Icon />
                    </div>

                    <h3>{title}</h3>

                    <p>{desc}</p>

                    <div className="mt-5 text-[11px] font-bold text-[#6C757D] flex items-center gap-1">
                      Explore workflow
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </article>
                )
              )}

            </div>
          </div>
        </section>

        {/* ================= WORKFLOW ================= */}

        <section
          id="workflow"
          className="midc-section bg-[#F4F4F4]"
        >
          <div className="midc-container py-14 lg:py-18">

            <div className="grid lg:grid-cols-[.9fr_1.1fr] gap-10 items-center">

              <div data-reveal="left">

                <div className="midc-section-label">
                  Designed around action
                </div>

                <h2 className="midc-heading mt-2">
                  From report to response,
                  without the clutter.
                </h2>

                <p className="midc-lead mt-4">
                  Keep the next important action visible while the supporting
                  records stay close at hand.
                </p>

                <div className="mt-7 space-y-2.5">

                  {[
                    'Report an incident or hazard',
                    'Document the response and evidence',
                    'Connect the worker with support',
                    'Review claims and compliance'
                  ].map((step, i) => (
                    <div
                      key={step}
                      className="midc-workflow-row"
                      data-reveal-child
                      style={{
                        '--delay': `${i * 120}ms`
                      }}
                    >
                      <span
                        className={`midc-step-dot step-${i}`}
                      />

                      <span>{step}</span>

                      <CheckCircle2 className="ml-auto w-5 h-5 text-[#3E5C54]" />
                    </div>
                  ))}

                </div>
              </div>

              <div
                className="landing-workspace-card"
                data-reveal="right"
              >

                <div className="flex items-center justify-between">

                  <div>
                    <div className="text-[10px] uppercase tracking-[.18em] text-[#B9C9C3] font-bold">
                      Safety workspace
                    </div>

                    <h3 className="text-2xl font-extrabold text-white mt-2">
                      One view. Multiple responsibilities.
                    </h3>
                  </div>

                  <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-[#D6E2DD]" />
                  </div>

                </div>

                <div className="grid sm:grid-cols-2 gap-3 mt-7">

                  <div
                    className="landing-workspace-tile"
                    data-reveal-child
                    style={{ '--delay': '150ms' }}
                  >
                    <Users />
                    <b>Worker records</b>
                    <span>
                      Profiles, assignments and safety information.
                    </span>
                  </div>

                  <div
                    className="landing-workspace-tile"
                    data-reveal-child
                    style={{ '--delay': '260ms' }}
                  >
                    <AlertTriangle />
                    <b>Incident follow-up</b>
                    <span>
                      Reports, status and investigation details.
                    </span>
                  </div>

                  <div
                    className="landing-workspace-tile"
                    data-reveal-child
                    style={{ '--delay': '370ms' }}
                  >
                    <FileCheck2 />
                    <b>Compensation</b>
                    <span>
                      Claims and review steps in one place.
                    </span>
                  </div>

                  <div
                    className="landing-workspace-tile"
                    data-reveal-child
                    style={{ '--delay': '480ms' }}
                  >
                    <Hospital />
                    <b>Emergency support</b>
                    <span>
                      Hospital and trauma services when needed.
                    </span>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ================= ROLES ================= */}

        <section
          id="roles"
          className="midc-section bg-white"
        >
          <div className="midc-container py-14 lg:py-18">

            <div data-reveal="up">

              <div className="midc-section-label">
                Built for the people involved
              </div>

              <h2 className="midc-heading mt-2">
                A shared system, tailored by responsibility.
              </h2>

            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-8">

              {ROLES.map(
                ({ title, desc, icon: Icon, tone }, index) => (
                  <article
                    key={title}
                    className="midc-role-card"
                    data-reveal-child
                    style={{
                      '--delay': `${index * 140}ms`
                    }}
                  >
                    <div
                      className={`midc-feature-icon ${toneClasses[tone]}`}
                    >
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
              data-reveal="up"
            >
              <div>
                <div className="midc-section-label text-[#C9A66B]">
                  Ready to work safely
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold mt-2 text-[#1E1E1E]">
                  Bring the safety workflow together.
                </h2>
              </div>

              <div className="flex gap-2 shrink-0">
                <Link
                  to="/login"
                  className="midc-btn-primary"
                >
                  Sign in
                </Link>

                <Link
                  to="/register"
                  className="midc-btn-outline"
                >
                  Register
                </Link>
              </div>
            </div>

          </div>
        </section>

      </main>

      <footer className="border-t border-[#E0E0E0] bg-[#FFFFFF]">
        <div className="midc-container py-7 flex flex-col sm:flex-row justify-between gap-3 text-xs text-[#6C757D]">

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