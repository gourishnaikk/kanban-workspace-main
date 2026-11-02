import React from 'react';
import { Search, Bell, Plus, Menu } from 'lucide-react';
import Button from './Button';
import { currentUser } from '../utils/constants';
import { useTaskContext } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';

/**
 * Neo-Brutalist Top Navbar Component
 */
export default function Navbar({ onOpenNewTask, onToggleSidebar, searchQuery = '', onSearchChange }) {
  const { totalTasks } = useTaskContext();
  const { user } = useAuth();
  const activeUser = user || currentUser;

  return (
    <header className="sticky top-0 z-30 bg-[#FFFFFF] border-b-2 border-[#171717] px-5 py-3 flex items-center justify-between gap-4 font-sans">
      {/* Left: Mobile Menu + Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="lg:hidden w-9 h-9 border-2 border-[#171717] bg-[#F5F2EA] text-[#171717] hover:bg-[#FFD84D] transition-colors flex items-center justify-center shrink-0"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Search Bar */}
        <div className="relative w-full">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555555] pointer-events-none">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Search workspace..."
            className="w-full bg-[#F5F2EA] text-sm text-[#171717] placeholder:text-[#999] pl-9 pr-3 py-2 border-2 border-[#171717] focus:outline-none focus:shadow-[2px_2px_0_#FFD84D] transition-all"
          />
        </div>
      </div>

      {/* Right: Task Counter + Notifications + Avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Total Tasks Counter */}
        <div
          title="Total tasks in workspace"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#EAE6DC] border-2 border-[#171717] text-xs font-extrabold text-[#171717] select-none"
        >
          <span className="w-2 h-2 bg-[#A8E6CF] border border-[#171717]" />
          <span>{totalTasks} {totalTasks === 1 ? 'Task' : 'Tasks'}</span>
        </div>

        {/* Notification Bell */}
        <button
          type="button"
          className="relative w-9 h-9 border-2 border-[#171717] bg-[#F5F2EA] text-[#171717] hover:bg-[#FFD84D] transition-colors flex items-center justify-center"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
        </button>

        {/* Primary Action Button */}
        {onOpenNewTask && (
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={onOpenNewTask}
          >
            <span className="hidden sm:inline">New Task</span>
          </Button>
        )}

        {/* User Avatar */}
        <div className="flex items-center pl-2 border-l-2 border-[#EAE6DC]">
          <div
            title={activeUser.name}
            className="w-9 h-9 bg-[#171717] border-2 border-[#171717] text-[#FFD84D] flex items-center justify-center text-xs font-black select-none"
          >
            {activeUser.initials}
          </div>
        </div>
      </div>
    </header>
  );
}
