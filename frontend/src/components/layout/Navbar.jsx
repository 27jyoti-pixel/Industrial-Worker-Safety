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
    <header className="app-navbar sticky top-0 z-30 px-4 sm:px-6 lg:px-8">
      <div className="app-navbar-inner">

        {/* LEFT — Product identity */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 rounded-xl text-sand-600 hover:bg-sand-100"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="navbar-product-mark">
            <Shield />
          </div>

          <div className="min-w-0 leading-tight">
            <h1 className="text-[16px] sm:text-[17px] font-semibold text-[#18231d] tracking-[-0.01em] truncate">
              Industrial Worker Safety
            </h1>

            <p className="mt-0.5 text-[10px] sm:text-[11px] font-medium text-[#7a847d] truncate">
              Compensation & Administration Platform
            </p>
          </div>
        </div>

        {/* RIGHT — User controls */}
        {user && (
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Notifications */}
            <button
              className="navbar-icon-button hidden sm:flex"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
            </button>

            <div className="navbar-user-divider" />

            {/* User */}
            <button
              onClick={() => navigate('/profile')}
              className="navbar-user-summary"
            >
              <div className="hidden md:block text-right leading-tight">
                <p className="text-[14px] font-semibold text-[#243229]">
                  {user.name}
                </p>

                <div className="mt-0.5 flex items-center justify-end gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />

                  <span className="text-[10px] font-medium text-[#7a847d]">
                    {user.role}
                  </span>
                </div>
              </div>

              {/* Avatar */}
              <div className="navbar-avatar">
                {user.name ? (
                  user.name.charAt(0).toUpperCase()
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="navbar-logout"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>
        )}

      </div>
    </header>
  );
};

export default Navbar;