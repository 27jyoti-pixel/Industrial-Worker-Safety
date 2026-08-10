import React, { useState } from "react";
import Sidebar from "../components/layout/Sidebar";


const AppLayout = ({ children }) => {

  const [mobileOpen, setMobileOpen] = useState(false);


  return (

    <div className="min-h-screen bg-slate-50 flex">


      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />


      <main
        className="
        flex-1
        overflow-y-auto
        p-4
        sm:p-6
        lg:p-8
        "
      >

        {children}

      </main>


    </div>

  );

};


export default AppLayout;