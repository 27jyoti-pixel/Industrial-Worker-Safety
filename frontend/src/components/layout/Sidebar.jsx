import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  FileCheck2,
  AlertOctagon,
  Building2,
  UserCheck,
  LogOut,
  X,
  ShieldCheck
} from 'lucide-react';

const Sidebar = ({ mobileOpen, onMobileClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Workers', path: '/workers', icon: Users },
    { label: 'Accidents', path: '/accidents', icon: AlertTriangle },
    { label: 'Claims', path: '/claims', icon: FileCheck2 },
    { label: 'Complaints', path: '/complaints', icon: AlertOctagon },
    { label: 'Hospitals', path: '/hospitals', icon: Building2 },
    { label: 'Profile', path: '/profile', icon: UserCheck }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`app-sidebar fixed lg:static top-0 bottom-0 left-0 z-50 w-64 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Header Mobile Close */}
          <div className="flex items-center justify-between p-4 border-b border-slate-100 lg:hidden">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <span className="font-bold text-slate-800 text-sm">Worker Safety Platform</span>
            </div>
            <button onClick={onMobileClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-3 space-y-1">
            <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Main Menu
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onMobileClose}
                  className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer: User Role Card & Logout */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60">
          {user && (
            <div className="mb-3 p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
              <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
              <p className="text-[11px] text-blue-600 font-semibold">{user.role}</p>
              {user.factoryName && (
                <p className="text-[11px] text-slate-500 truncate mt-0.5">{user.factoryName}</p>
              )}
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
