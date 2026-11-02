import React from 'react';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';

// Column accent colors for Neo-Brutalist headers
const COLUMN_STYLES = {
  todo:        { accent: 'bg-[#B8C5FF]', label: 'TO DO' },
  in_progress: { accent: 'bg-[#FFD84D]', label: 'IN PROGRESS' },
  done:        { accent: 'bg-[#A8E6CF]', label: 'DONE' },
};

/**
 * Neo-Brutalist Kanban Column Component
 */
export default function KanbanColumn({
  columnId,
  title,
  tasks = [],
  onAddTask,
  onTaskClick,
  onMoveTask,
  onDeleteTask,
}) {
  const colStyle = COLUMN_STYLES[columnId] || { accent: 'bg-[#EAE6DC]', label: title.toUpperCase() };

  return (
    <div className="flex flex-col flex-1 min-w-[280px] max-w-full bg-[#F5F2EA] border-2 border-[#171717] font-sans">
      {/* Column Header */}
      <div className={`${colStyle.accent} border-b-2 border-[#171717] px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <h3 className="text-xs font-extrabold text-[#171717] tracking-widest uppercase">
            {colStyle.label}
          </h3>
          <span className="text-xs font-extrabold px-2 py-0.5 bg-[#171717] text-white border border-[#171717]">
            {tasks.length}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onAddTask && onAddTask(columnId)}
          className="w-6 h-6 border-2 border-[#171717] bg-[#FFFFFF] text-[#171717] flex items-center justify-center hover:bg-[#171717] hover:text-[#FFD84D] transition-colors"
          title={`Add task to ${title}`}
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Task List */}
      <div className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-300px)] p-4">
        {tasks.map((task) => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onClick={onTaskClick}
            onMoveTask={onMoveTask}
            onDeleteTask={onDeleteTask}
          />
        ))}

        {/* Empty State */}
        {tasks.length === 0 && (
          <div className="border-2 border-dashed border-[#171717]/30 p-8 text-center flex flex-col items-center justify-center gap-2">
            <p className="text-xs font-extrabold text-[#555555] uppercase tracking-widest">No tasks</p>
            <p className="text-[11px] text-[#555555]/70 font-semibold">Click + to add a task</p>
          </div>
        )}

        {/* Add Task Button */}
        <button
          type="button"
          onClick={() => onAddTask && onAddTask(columnId)}
          className="w-full py-2.5 border-2 border-dashed border-[#171717]/40 hover:border-[#171717] hover:bg-[#EAE6DC] text-xs font-extrabold text-[#555555] hover:text-[#171717] uppercase tracking-widest flex items-center justify-center gap-2 transition-all mt-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Task</span>
        </button>
      </div>
    </div>
  );
}
