import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import useSearch from '../hooks/useSearch';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { searchQuery, setSearchQuery, filterItems } = useSearch([]);

  return (
    <div className="min-h-screen bg-[#F5F2EA] flex font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Navbar with live useSearch state */}
        <Navbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Page Content Outlet passing searchQuery & helpers */}
        <main className="flex-1 p-5 sm:p-7 lg:p-8 max-w-6xl w-full mx-auto relative">
          <Outlet context={{ searchQuery, setSearchQuery, filterItems }} />
        </main>
      </div>
    </div>
  );
}
