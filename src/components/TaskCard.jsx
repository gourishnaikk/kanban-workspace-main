import React from 'react';
import { Trash2 } from 'lucide-react';

// Neo-Brutalist sticky note color mappings
// These map the existing colorKey data values to the Neo-Brutalist palette
const STICKY_COLORS = {
  sage: {
    bg: 'bg-[#A8E6CF]',
    border: 'border-[#171717]',
    text: 'text-[#171717]',
    pillBg: 'bg-[#171717]',
    pillText: 'text-[#A8E6CF]',
  },
  butter: {
    bg: 'bg-[#FFD84D]',
    border: 'border-[#171717]',
    text: 'text-[#171717]',
    pillBg: 'bg-[#171717]',
    pillText: 'text-[#FFD84D]',
  },
  peach: {
    bg: 'bg-[#FF9B85]',
    border: 'border-[#171717]',
    text: 'text-[#171717]',
    pillBg: 'bg-[#171717]',
    pillText: 'text-[#FF9B85]',
  },
  lavender: {
    bg: 'bg-[#B8C5FF]',
    border: 'border-[#171717]',
    text: 'text-[#171717]',
    pillBg: 'bg-[#171717]',
    pillText: 'text-[#B8C5FF]',
  },
  powderBlue: {
    bg: 'bg-[#93C5FD]',
    border: 'border-[#171717]',
    text: 'text-[#171717]',
    pillBg: 'bg-[#171717]',
    pillText: 'text-[#93C5FD]',
  },
};

/**
 * Neo-Brutalist Task Card
 * Preserves all existing props: task, onClick, onMoveTask, onDeleteTask
 */
export default function TaskCard({ task, onClick, onMoveTask, onDeleteTask }) {
  if (!task) return null;

  const style = STICKY_COLORS[task.colorKey] || STICKY_COLORS.butter;

  return (
    <div
      onClick={() => onClick && onClick(task)}
      className={`
        group relative ${style.bg} ${style.border}
        border-2 shadow-[3px_3px_0_#171717] cursor-pointer
        flex flex-col justify-between gap-3 select-none min-h-[120px] text-left
        transition-all duration-100 hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[4px_4px_0_#171717]
        active:translate-x-0 active:translate-y-0 active:shadow-[1px_1px_0_#171717]
        p-4 font-sans
      `}
    >
      {/* Top: Priority Badge, Status Dropdown, Delete Button */}
      <div className="flex items-center justify-between gap-2">
        <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 border border-[#171717] ${style.pillBg} ${style.pillText}`}>
          {task.priority || 'Normal'}
        </span>

        <div className="flex items-center gap-1.5">
          {/* Status Movement Dropdown */}
          <select
            value={task.columnId || 'todo'}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              e.stopPropagation();
              if (onMoveTask) onMoveTask(task.id, e.target.value);
            }}
            className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 bg-[#FFFFFF] text-[#171717] border-2 border-[#171717] outline-none cursor-pointer hover:bg-[#FFD84D] transition-colors"
            title="Move task to another column"
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>

          {/* Delete Icon Button (visible on hover) */}
          {onDeleteTask && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteTask(task.id);
              }}
              className="w-6 h-6 border-2 border-[#171717] bg-[#FFFFFF] hover:bg-[#FF7777] text-[#171717] flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
              title="Delete task"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Task Title */}
      <h4 className={`text-sm font-extrabold tracking-tight leading-snug ${style.text}`}>
        {task.title}
      </h4>

      {/* Bottom: Due Date & Assignee Avatar */}
      <div className="flex items-center justify-between gap-2 text-xs font-bold text-[#171717] border-t border-[#171717]/20 pt-2 mt-1">
        <span className="text-[11px] font-bold opacity-70">{task.dueDate || 'No due date'}</span>

        {task.assignee && (
          <div
            title={`${task.assignee.name} (${task.assignee.role || 'Member'})`}
            className="w-6 h-6 border-2 border-[#171717] bg-[#171717] text-[#FFD84D] flex items-center justify-center text-[10px] font-extrabold shrink-0 select-none"
          >
            {task.assignee.initials}
          </div>
        )}
      </div>
    </div>
  );
}
