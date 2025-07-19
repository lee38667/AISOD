'use client';

import React, { useState } from 'react';
import Sidebar from './ui/Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#16213e]">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <main className={`transition-all duration-300 ${
        sidebarCollapsed ? 'ml-20' : 'ml-64'
      } min-h-screen`}>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
