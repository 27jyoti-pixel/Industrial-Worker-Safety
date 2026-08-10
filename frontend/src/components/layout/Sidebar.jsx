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
  ShieldCheck
} from "lucide-react";


const Sidebar = ({ mobileOpen, onMobileClose }) => {

  const { user, logout } = useAuth();
  const navigate = useNavigate();


  const handleLogout = () => {
    logout();
    navigate("/login");
  };


  const navItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard
    },

    ...(user?.role !== "Worker"
      ? [
          {
            label: "Workers",
            path: "/workers",
            icon: Users
          }
        ]
      : []),

    {
      label: "Accidents",
      path: "/accidents",
      icon: AlertTriangle
    },

    {
      label: "Claims",
      path: "/claims",
      icon: FileCheck2
    },

    {
      label: "Complaints",
      path: "/complaints",
      icon: AlertOctagon
    },

    {
      label: "Hospitals",
      path: "/hospitals",
      icon: Building2
    },

    {
      label: "Profile",
      path: "/profile",
      icon: UserCheck
    }
  ];



  return (
    <>

      {/* Mobile overlay */}

      {mobileOpen && (
        <div
          onClick={onMobileClose}
          className="
          fixed inset-0
          bg-black/30
          z-40
          lg:hidden
          "
        />
      )}



      <aside
        className={`
        fixed
        lg:static
        top-0
        left-0
        h-screen
        w-72
        bg-white
        border-r
        border-slate-200
        flex
        flex-col
        justify-between
        z-50
        transition-transform
        duration-300

        ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
        `}
      >


        <div>


          {/* Brand */}

          <div
            className="
            h-20
            px-6
            flex
            items-center
            gap-3
            border-b
            border-slate-200
            "
          >

            <div
              className="
              w-12
              h-12
              rounded-xl
              bg-gradient-to-br from-slate-900 to-slate-700
              flex
              items-center
              justify-center
              "
            >

              <ShieldCheck
                className="text-white w-7 h-7"
              />

            </div>


            <div>

              <h2
                className="
                font-bold
                text-slate-900
                text-base
                "
              >
                Industrial Safety
              </h2>


              <p
                className="
                text-xs
                text-slate-500
                "
              >
                Compensation Platform
              </p>

            </div>



            {/* Mobile close */}

            <button
              onClick={onMobileClose}
              className="
              ml-auto
              lg:hidden
              p-2
              hover:bg-slate-100
              rounded-lg
              "
            >

              <X className="w-5 h-5"/>

            </button>


          </div>





          {/* Menu */}

          <div className="p-4">


            <p
              className="
              text-xs
              font-semibold
              text-slate-500
              uppercase
              tracking-[0.15em]
              mb-3
              px-3
              "
            >
              Main Menu
            </p>



            <div className="space-y-1">


              {
                navItems.map((item)=>{

                  const Icon = item.icon;


                  return (

                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onMobileClose}

                      className={({isActive}) =>
                      `
                      flex
                      items-center
                      gap-3
                      px-4
                      py-3
                      rounded-xl
                      text-sm
                      font-medium
                      transition-all duration-200

                      ${
isActive
?
"bg-orange-50 text-orange-600 border-l-4 border-orange-500"
:
"text-slate-600 hover:bg-slate-100 hover:text-slate-900"
}
                      `
                      }

                    >

                      <Icon
                        className="
                        w-5
                        h-5
                        "
                      />

                      <span>
                        {item.label}
                      </span>


                    </NavLink>

                  );

                })
              }


            </div>


          </div>


        </div>





        {/* User section */}

        <div
          className="
          p-4
          border-t
          border-slate-200
          "
        >

          {
            user && (

              <div
                className="
                bg-slate-50
                rounded-xl
                p-4
                mb-3
                "
              >

                <p
                  className="
                  font-semibold
                  text-slate-800
                  "
                >
                  {user.name}
                </p>


                <p
                  className="
                  text-sm
                  text-orange-600
                  "
                >
                  {user.role}
                </p>


                {
                  user.factoryName && (

                    <p
                      className="
                      text-xs
                      text-slate-500
                      mt-1
                      "
                    >
                      {user.factoryName}
                    </p>

                  )
                }


              </div>

            )
          }





          <button
            onClick={handleLogout}

            className="
            w-full
            flex
            items-center
            justify-center
            gap-2
            px-4
            py-3
            rounded-xl
            bg-red-50
            text-red-600
            font-medium
            hover:bg-red-100
            transition
            "
          >

            <LogOut className="w-5 h-5"/>

            Logout

          </button>


        </div>


      </aside>


    </>
  );
};


export default Sidebar;