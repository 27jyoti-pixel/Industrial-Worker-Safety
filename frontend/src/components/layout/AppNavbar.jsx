import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  FileCheck2,
  AlertOctagon,
  Building2,
  UserRound,
  Menu,
  ShieldCheck,
  X,
} from 'lucide-react';

const AppNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Keep the existing navigation destinations and Worker visibility rule.
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    ...(user?.role !== 'Worker' ? [{ label: 'Workers', path: '/workers', icon: Users }] : []),
    { label: 'Accidents', path: '/accidents', icon: AlertTriangle },
    { label: 'Claims', path: '/claims', icon: FileCheck2 },
    { label: 'Complaints', path: '/complaints', icon: AlertOctagon },
    { label: 'Hospitals', path: '/hospitals', icon: Building2 },
    { label: 'Profile', path: '/profile', icon: UserRound },
  ];

  const closeMobileMenu = () => setMobileOpen(false);
  const linkClass = ({ isActive }) => `workspace-top-link${isActive ? ' is-active' : ''}`;
  const mobileLinkClass = ({ isActive }) => `workspace-mobile-link${isActive ? ' is-active' : ''}`;

  return (
    <>
      <style>{`
        .workspace-topbar { position: relative; z-index: 30; background: #fff; border-bottom: 1px solid #e7e7e7; }
        .workspace-top-link { position: relative; display: inline-flex; align-items: center; gap: 7px; min-height: 44px; padding: 0 8px; color: #555; font-size: 14px; font-weight: 500; text-decoration: none; white-space: nowrap; }
        .workspace-top-link:hover { color: #111; }
        .workspace-top-link.is-active { color: #111; }
        .workspace-top-link.is-active::after { content: ''; position: absolute; right: 8px; bottom: 0; left: 8px; height: 2px; background: #e87532; }
        .workspace-top-link.is-active svg { color: #e87532; }
        .workspace-mobile-link { display: flex; min-height: 42px; align-items: center; gap: 10px; padding: 0 12px; color: #444; font-size: 14px; font-weight: 500; text-decoration: none; }
        .workspace-mobile-link.is-active { background: #fff7f2; color: #111; }
        .workspace-mobile-link.is-active svg { color: #e87532; }
        @media (max-width: 1279px) and (min-width: 768px) {
          .workspace-top-link { gap: 8px; padding-inline: 7px; font-size: 12px; }
          .workspace-top-link svg { display: none; }
        }
        @media (prefers-reduced-motion: reduce) { .workspace-top-link, .workspace-mobile-link { transition: none; } }
      `}</style>

      <header className="workspace-topbar">
        <div className="mx-auto flex min-h-[74px] max-w-[1544px] items-center gap-6 px-4 sm:px-6 lg:px-8 md:grid md:grid-cols-[auto_minmax(0,1fr)_auto]">
          <Link to="/dashboard" className="flex shrink-0 items-center gap-3 no-underline md:col-start-1 md:justify-self-start" aria-label="MIDC Safety dashboard">
            <span className="flex h-[50px] w-[47px] items-center justify-center rounded-[10px] bg-[#111] text-white">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="hidden min-w-0 leading-tight sm:block">
              <span className="block text-[18px] font-bold tracking-[-.035em] text-[#111]">MIDC Safety</span>
              <span className="mt-1 block text-[11px] text-[#6C757D] xl:text-[12px]">Industrial worker protection</span>
            </span>
            <span className="min-w-0 leading-tight sm:hidden">
              <span className="block text-[16px] font-bold tracking-[-.035em] text-[#111]">MIDC Safety</span>
            </span>
          </Link>

          <nav className="hidden min-w-0 items-center justify-start gap-5 overflow-x-auto md:col-start-2 md:flex md:w-full md:justify-self-stretch xl:justify-center" aria-label="Main navigation">
            {navItems.map(({ label, path, icon: Icon }) => (
              <NavLink key={path} to={path} className={linkClass}>
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto hidden shrink-0 items-center md:col-start-3 md:ml-0 md:flex md:justify-self-end">
            <button type="button" onClick={handleLogout} className="inline-flex h-9 items-center gap-2 rounded-[8px] bg-[#111] px-3 text-[13px] font-medium text-white hover:bg-[#2b2b2b]" aria-label="Sign out">
              <span>Sign out</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="ml-auto flex h-10 w-10 items-center justify-center rounded-md text-[#333] hover:bg-[#f5f5f5] md:hidden"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            aria-controls="workspace-mobile-navigation"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div id="workspace-mobile-navigation" className="border-t border-[#ededed] bg-white px-4 pb-4 pt-2 md:hidden">
            <nav className="grid grid-cols-2 gap-1 sm:grid-cols-3" aria-label="Main navigation">
              {navItems.map(({ label, path, icon: Icon }) => (
                <NavLink key={path} to={path} onClick={closeMobileMenu} className={mobileLinkClass}>
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </nav>
            <div className="mt-3 flex justify-end border-t border-[#ededed] pt-3">
              <button type="button" onClick={handleLogout} className="inline-flex h-9 items-center gap-2 rounded-[8px] bg-[#111] px-3 text-[13px] font-medium text-white hover:bg-[#2b2b2b]">
                Sign out
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default AppNavbar;
