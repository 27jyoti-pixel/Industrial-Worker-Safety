import React from 'react';
import AppNavbar from '../components/layout/AppNavbar';

const AppLayout = ({ children }) => (
  <div className="workspace-shell min-h-screen bg-[#f7f7f7] text-[#111]">
    <style>{`.workspace-shell .app-content:before { display: none; }`}</style>
    <AppNavbar />
    <main className="min-h-[calc(100vh-74px)] overflow-x-hidden p-4 sm:p-6 lg:p-8">
      <div className="app-content mx-auto max-w-[1480px]">{children}</div>
    </main>
  </div>
);

export default AppLayout;
