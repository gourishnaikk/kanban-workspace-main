import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Trash2 } from 'lucide-react';
import Button from './Button';

// Project card accent colors cycling through palette
const CATEGORY_COLORS = {
  Coursework: 'bg-[#B8C5FF]',
  Hackathon:  'bg-[#FFD84D]',
  Research:   'bg-[#A8E6CF]',
  Personal:   'bg-[#FF9B85]',
  General:    'bg-[#EAE6DC]',
};

/**
 * Neo-Brutalist Project Card Component
 */
export default function ProjectCard({ project, onOpenBoard, onDelete }) {
  if (!project) return null;

  const {
    title = 'Untitled Project',
    description = 'No description provided.',
    category = 'General',
    tasksTotal = 0,
    tasksDone = 0,
    members = [],
  } = project;

  const accentColor = CATEGORY_COLORS[category] || CATEGORY_COLORS.General;

  return (
    <div className="relative group bg-[#FFFFFF] border-2 border-[#171717] shadow-[4px_4px_0_#171717] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0_#171717] transition-all duration-100 font-sans text-left">
      {/* Accent top bar */}
      <div className={`${accentColor} h-2 w-full border-b-2 border-[#171717]`} />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6">
        {/* Delete Project Action Button (Visible on Hover) */}
        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(project);
            }}
            className="absolute top-4 right-4 w-8 h-8 border-2 border-[#171717] bg-[#FFFFFF] text-[#555555] hover:bg-[#FF7777] hover:text-[#171717] flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10"
            title="Delete Project"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        <div className="flex flex-col gap-3 max-w-xl text-left">
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2 py-1 border-2 border-[#171717] ${accentColor}`}>
              {category}
            </span>
            <span className="text-xs text-[#555555] font-bold">
              {tasksDone} / {tasksTotal} tasks done
            </span>
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-[#171717] tracking-tight">
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-[#555555] mt-1 font-medium leading-relaxed">
              {description}
            </p>
          </div>

          {/* Team Initials Stack */}
          {members.length > 0 && (
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center -space-x-1.5">
                {members.map((member) => (
                  <div
                    key={member.id}
                    title={`${member.name} (${member.role})`}
                    className="w-7 h-7 border-2 border-[#171717] bg-[#171717] text-[#FFD84D] flex items-center justify-center text-xs font-extrabold select-none"
                  >
                    {member.initials}
                  </div>
                ))}
              </div>
              <span className="text-xs font-bold text-[#555555]">
                {members.length} member{members.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        <div className="shrink-0 pt-2 md:pt-0">
          <Link to="/board">
            <Button
              variant="primary"
              size="md"
              rightIcon={<ArrowUpRight className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              Open Board
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
