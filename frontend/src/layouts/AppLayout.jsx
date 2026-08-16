import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';

const AppLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-shell min-h-screen">
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        onMobileMenuToggle={() => setMobileOpen(true)}
      />

      <div className="app-main lg:ml-[258px] min-h-screen flex flex-col">
        <main className="app-main-scroll flex-1 p-4 sm:p-6 lg:p-8">
          <div className="app-content max-w-[1480px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;