import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LogOut, ChevronRight, LayoutDashboard, Kanban, FolderKanban, Users, Settings } from 'lucide-react';
import { currentUser } from '../utils/constants';
import { useWorkspace } from '../context/WorkspaceContext';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { label: 'Dashboard',    path: '/dashboard', icon: LayoutDashboard },
  { label: 'Kanban Board', path: '/board',      icon: Kanban          },
  { label: 'Projects',     path: '/projects',   icon: FolderKanban    },
  { label: 'Team',         path: '/team',       icon: Users           },
  { label: 'Settings',     path: '/settings',   icon: Settings        },
];

/**
 * Neo-Brutalist Sidebar Component
 */
export default function Sidebar({ isOpen = true, onClose }) {
  const { workspaceName } = useWorkspace();
  const { user, logout } = useAuth();
  const activeUser = user || currentUser;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#171717]/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#171717] border-r-2 border-[#171717]
        flex flex-col justify-between transition-transform duration-200 ease-in-out font-sans
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top Section: Logo + Workspace + Nav */}
        <div className="flex flex-col">
          {/* Logo / Brand */}
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-5 py-5 border-b-2 border-[#2a2a2a] hover:bg-[#FFD84D] group transition-colors duration-100"
            onClick={() => onClose && onClose()}
          >
            {/* Geometric monogram */}
            <div className="w-9 h-9 bg-[#FFD84D] border-2 border-[#FFD84D] flex items-center justify-center shrink-0 group-hover:bg-[#171717] transition-colors">
              <span className="text-[#171717] font-black text-sm group-hover:text-[#FFD84D] transition-colors">KB</span>
            </div>
            <div>
              <span className="font-black text-base text-white group-hover:text-[#171717] tracking-tight block leading-none transition-colors">
                KanbanBoard
              </span>
              <span className="text-[10px] font-bold text-[#555555] uppercase tracking-widest block mt-0.5 group-hover:text-[#171717] transition-colors">
                Workspace
              </span>
            </div>
          </Link>

          {/* Workspace Selector */}
          <Link
            to="/settings"
            className="flex items-center justify-between px-5 py-3.5 border-b-2 border-[#2a2a2a] hover:bg-[#222] transition-colors"
            onClick={() => onClose && onClose()}
          >
            <div className="truncate pr-2">
              <p className="text-[10px] font-bold text-[#555555] uppercase tracking-widest mb-0.5">
                Active Workspace
              </p>
              <p className="text-xs font-extrabold text-white truncate">{workspaceName}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#555555] shrink-0" />
          </Link>

          {/* Navigation */}
          <nav className="flex flex-col pt-3 pb-2">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#555555] px-5 py-2">
              Navigation
            </span>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  onClick={() => onClose && onClose()}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-5 py-3 text-xs font-bold transition-all duration-100 border-l-4
                    ${isActive
                      ? 'bg-[#FFD84D] text-[#171717] border-[#FFD84D]'
                      : 'text-[#AAAAAA] border-transparent hover:bg-[#222] hover:text-white hover:border-[#555555]'}
                  `}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="uppercase tracking-wider">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom: User Profile + Logout */}
        <div className="border-t-2 border-[#2a2a2a]">
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-8 h-8 bg-[#FFD84D] border-2 border-[#FFD84D] flex items-center justify-center text-xs font-black text-[#171717] shrink-0 select-none"
              >
                {activeUser.initials}
              </div>
              <div className="truncate">
                <p className="text-xs font-extrabold text-white truncate">{activeUser.name}</p>
                <p className="text-[10px] text-[#555555] font-bold truncate">{activeUser.role}</p>
              </div>
            </div>

            <Link
              to="/login"
              title="Sign Out"
              onClick={() => logout && logout()}
              className="w-8 h-8 border-2 border-[#2a2a2a] text-[#555555] hover:bg-[#FF7777] hover:border-[#FF7777] hover:text-[#171717] flex items-center justify-center transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
