import React from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { useAuth } from '../context/AuthContext';
import { currentUser } from '../utils/constants';

/**
 * Neo-Brutalist Workspace Header
 * Consumes WorkspaceContext and AuthContext directly with zero props.
 */
export default function WorkspaceHeader() {
  const { workspaceName, workspaceDescription } = useWorkspace();
  const { user } = useAuth();
  const displayName = user?.name || currentUser.name;

  return (
    <div className="flex flex-col gap-3 text-left font-sans">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 bg-[#FFD84D] border-2 border-[#171717]">
          Workspace Overview
        </span>
        <span className="text-xs font-bold text-[#555555] border border-[#171717]/30 px-2 py-1 bg-[#EAE6DC]">
          {workspaceName}
        </span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-black text-[#171717] tracking-tight leading-tight">
        Welcome back,{' '}
        <span className="relative inline-block">
          {displayName}
          <span className="absolute bottom-0 left-0 w-full h-1 bg-[#FFD84D]" />
        </span>
      </h1>

      <p className="text-sm sm:text-base text-[#555555] font-semibold max-w-2xl leading-relaxed">
        {workspaceDescription || "Your team's central workspace. Create a project to start planning milestones on the Kanban board."}
      </p>
    </div>
  );
}
