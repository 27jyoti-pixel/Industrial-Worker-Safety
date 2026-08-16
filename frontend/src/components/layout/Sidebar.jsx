import React from "react"; 
import { NavLink, useNavigate } from "react-router-dom"; 
import { useAuth } from "../../context/AuthContext"; 
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
  ShieldCheck, 
  ChevronRight, 
} from "lucide-react"; 

const Sidebar = ({ mobileOpen, onMobileClose }) => { 
  const { user, logout } = useAuth(); 
  const navigate = useNavigate(); 

  const handleLogout = () => { 
    logout(); 
    navigate("/login"); 
  }; 

  const navItems = [ 
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard }, 
    ...(user?.role !== "Worker" 
      ? [{ label: "Workers", path: "/workers", icon: Users }] 
      : []), 
    { label: "Accidents", path: "/accidents", icon: AlertTriangle }, 
    { label: "Claims", path: "/claims", icon: FileCheck2 }, 
    { label: "Complaints", path: "/complaints", icon: AlertOctagon }, 
    { label: "Hospitals", path: "/hospitals", icon: Building2 }, 
    { label: "Profile", path: "/profile", icon: UserCheck }, 
  ]; 

  return ( 
    <> 
      {mobileOpen && ( 
        <div 
          onClick={onMobileClose} 
          className="fixed inset-0 bg-[#CE93D8]/25 backdrop-blur-sm z-40 lg:hidden" 
        /> 
      )} 

      <aside 
        className={`app-sidebar fixed top-0 left-0 z-50 h-screen w-[258px] flex flex-col transition-transform duration-300 ${ 
          mobileOpen 
            ? "translate-x-0" 
            : "-translate-x-full lg:translate-x-0" 
        }`} 
      > 
        {/* BRAND */} 
        <div className="px-5 pt-5"> 
          <div className="sidebar-brand-card min-h-[88px]"> 
            <div className="sidebar-brand-icon shrink-0"> 
              <ShieldCheck /> 
            </div> 

            <div className="min-w-0"> 
              <div className="text-[15px] font-semibold tracking-tight text-[#332D38]"> 
                Industrial Safety 
              </div> 

              <div className="text-[11px] font-normal !text-[#E8F0ED] mt-1"> 
                Worker protection platform 
              </div> 
            </div> 

            <button 
              onClick={onMobileClose} 
              className="ml-auto lg:hidden p-1.5 rounded-lg hover:bg-[#CE93D8]/15 text-[#332D38]" 
              aria-label="Close navigation" 
            > 
              <X className="w-4 h-4" /> 
            </button> 
          </div> 
        </div> 

        {/* NAVIGATION */} 
        <nav className="px-4 pt-7 flex-1 overflow-y-auto sidebar-scroll"> 
          <div className="px-3 mb-3 text-[10px] font-medium uppercase tracking-[.18em] !text-[#E8F0ED]"> 
            Workspace 
          </div> 

          <div className="space-y-1"> 
            {navItems.map(({ label, path, icon: Icon }) => ( 
              <NavLink 
                key={path} 
                to={path} 
                onClick={onMobileClose} 
                className={({ isActive }) => 
                  `sidebar-nav-item group ${isActive ? "active" : ""}` 
                } 
              > 
                <span className="sidebar-nav-icon shrink-0"> 
                  <Icon /> 
                </span> 

                <span className="text-[15px] font-medium">{label}</span> 

                <ChevronRight className="sidebar-chevron" /> 
              </NavLink> 
            ))} 
          </div> 
        </nav> 

        {/* USER + LOGOUT */} 
        <div className="px-4 pb-5 space-y-2"> 
          <button 
            onClick={() => navigate("/profile")} 
            className="sidebar-user-card w-full min-h-[78px] text-left" 
          > 
            <div className="sidebar-avatar shrink-0"> 
              {user?.name 
                ? user.name.charAt(0).toUpperCase() 
                : "U"} 
            </div> 

            <div className="min-w-0 flex-1"> 
              <div className="text-sm font-medium truncate text-[#332D38]"> 
                {user?.name || "Account"} 
              </div> 

              <div className="text-[11px] font-normal !text-[#E8F0ED] truncate mt-1"> 
                {user?.role || "User"} 
              </div> 

              {user?.factoryName && ( 
                <div className="text-[10px] font-normal !text-[#E8F0ED] truncate mt-1"> 
                  {user.factoryName} 
                </div> 
              )} 
            </div> 
          </button> 

          <button 
            onClick={handleLogout} 
            className="sidebar-logout w-full h-[46px] flex items-center justify-center gap-2" 
          > 
            <LogOut className="w-4 h-4" /> 
            <span className="font-medium">Sign out</span> 
          </button> 
        </div> 
      </aside> 
    </> 
  ); 
}; 

export default Sidebar;