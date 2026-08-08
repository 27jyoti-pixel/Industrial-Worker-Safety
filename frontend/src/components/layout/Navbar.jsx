import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, Menu, User, LogOut, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onMobileMenuToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="app-navbar sticky top-0 z-30 h-16 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile Toggle & Brand Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight leading-tight">
              Industrial Worker Safety
            </h1>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Compensation & Administration Platform
            </p>
          </div>
        </div>
      </div>

      {/* Right: User Information & Actions */}
      <div className="flex items-center gap-3">
        {user && (
          <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
            <div className="text-right hidden md:block">
              <p className="text-xs font-semibold text-slate-800">{user.name}</p>
              <div className="flex items-center justify-end gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span className="text-[11px] text-slate-500 font-medium">{user.role}</span>
              </div>
            </div>

            <div
              onClick={() => navigate('/profile')}
              className="w-9 h-9 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-semibold cursor-pointer hover:bg-blue-100 transition-colors"
              title="View Profile"
            >
              {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
