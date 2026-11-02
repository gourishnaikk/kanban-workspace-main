import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus } from 'lucide-react';
import KanbanColumn from '../components/KanbanColumn';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import useKanban from '../hooks/useKanban';
import useModal from '../hooks/useModal';
import { useWorkspace } from '../context/WorkspaceContext';
import { useTaskContext } from '../context/TaskContext';
import { stickyNoteColors, currentUser } from '../utils/constants';

export default function KanbanBoardPage({ projects = [] }) {
  const { workspaceName } = useWorkspace();
  const outletCtx = useOutletContext();
  const searchQuery = outletCtx?.searchQuery || '';
  const filterItems = outletCtx?.filterItems;

  // Global Task State from TaskContext (Experiment 3)
  const { tasks, addTask, moveTask, removeTask } = useTaskContext();
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedColumn, setSelectedColumn] = useState('todo');

  const {
    isOpen: isTaskModalOpen,
    openModal: openTaskModal,
    closeModal: closeTaskModal,
  } = useModal(false);

  // Task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState('Normal');
  const [taskColor, setTaskColor] = useState('sage');
  const [taskDueDate, setTaskDueDate] = useState('');

  // 1. Filter tasks based on activeFilter chip
  const chipFilteredTasks = React.useMemo(() => {
    if (activeFilter === 'All') return tasks;
    if (activeFilter === 'Urgent') return tasks.filter((t) => t.priority === 'Urgent');
    if (activeFilter === 'Sage') return tasks.filter((t) => t.colorKey === 'sage');
    if (activeFilter === 'Butter') return tasks.filter((t) => t.colorKey === 'butter');
    if (activeFilter === 'Peach') return tasks.filter((t) => t.colorKey === 'peach');
    if (activeFilter === 'Lavender') return tasks.filter((t) => t.colorKey === 'lavender');
    if (activeFilter === 'My Notes') return tasks.filter((t) => t.assignee?.name === currentUser.name);
    return tasks;
  }, [tasks, activeFilter]);

  // 2. Filter tasks based on global searchQuery
  const searchAndChipFilteredTasks = React.useMemo(() => {
    if (!searchQuery.trim()) return chipFilteredTasks;
    if (filterItems) {
      return filterItems(chipFilteredTasks, ['title', 'priority', 'assignee', 'columnId', 'colorKey']);
    }
    const q = searchQuery.trim().toLowerCase();
    return chipFilteredTasks.filter((t) => {
      const titleMatch = t.title?.toLowerCase().includes(q);
      const priorityMatch = t.priority?.toLowerCase().includes(q);
      const colMatch = t.columnId?.toLowerCase().includes(q) || t.status?.toLowerCase().includes(q);
      const assigneeMatch = typeof t.assignee === 'object' ? t.assignee?.name?.toLowerCase().includes(q) : false;
      return titleMatch || priorityMatch || colMatch || assigneeMatch;
    });
  }, [chipFilteredTasks, searchQuery, filterItems]);

  // 3. Group filtered tasks
  const { todoTasks, inProgressTasks, doneTasks } = useKanban(searchAndChipFilteredTasks);

  const filterChips = ['All', 'My Notes', 'Urgent', 'Sage', 'Butter', 'Peach', 'Lavender'];

  // Chip accent colors
  const CHIP_COLORS = {
    All:      'bg-[#171717] text-white border-[#171717]',
    'My Notes': 'bg-[#EAE6DC] text-[#171717] border-[#171717]',
    Urgent:   'bg-[#FF9B85] text-[#171717] border-[#171717]',
    Sage:     'bg-[#A8E6CF] text-[#171717] border-[#171717]',
    Butter:   'bg-[#FFD84D] text-[#171717] border-[#171717]',
    Peach:    'bg-[#FF9B85] text-[#171717] border-[#171717]',
    Lavender: 'bg-[#B8C5FF] text-[#171717] border-[#171717]',
  };

  const handleOpenAddTask = (columnId = 'todo') => {
    setSelectedColumn(columnId);
    openTaskModal();
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    if (addTask) {
      addTask({
        title: taskTitle.trim(),
        columnId: selectedColumn,
        status: selectedColumn,
        priority: taskPriority,
        colorKey: taskColor,
        dueDate: taskDueDate.trim(),
        assignee: currentUser,
        projectId: projects[0]?.id || null,
      });
    }

    setTaskTitle('');
    setTaskDueDate('');
    closeTaskModal();
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto font-sans">
      {/* ── Board Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-6 border-b-2 border-[#171717]">
        <div className="text-left">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 bg-[#FFD84D] border-2 border-[#171717]">
              Kanban Board
            </span>
            <span className="text-xs font-bold text-[#555555] bg-[#EAE6DC] border border-[#171717]/20 px-2 py-1">
              {workspaceName}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-[#171717] tracking-tight">
            Sprint Task Board
          </h1>
          <p className="text-sm text-[#555555] mt-1 font-semibold">
            Pin tasks across columns to organize team milestones.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="primary"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => handleOpenAddTask('todo')}
            className="shadow-[3px_3px_0_#171717]"
          >
            Add Task
          </Button>
        </div>
      </div>

      {/* ── Filter Chips ── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#555555] mr-1">
            Filter:
          </span>
          {filterChips.map((chip) => {
            const isActive = activeFilter === chip;
            return (
              <button
                key={chip}
                type="button"
                onClick={() => setActiveFilter(chip)}
                className={`
                  text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 border-2 transition-all duration-100
                  ${isActive
                    ? `${CHIP_COLORS[chip]} shadow-[2px_2px_0_#171717]`
                    : 'bg-[#FFFFFF] text-[#555555] border-[#171717]/30 hover:border-[#171717] hover:bg-[#EAE6DC] hover:text-[#171717]'}
                `}
              >
                {chip}
              </button>
            );
          })}
        </div>

        <div className="text-[10px] font-extrabold text-[#555555] uppercase tracking-widest bg-[#EAE6DC] border border-[#171717]/20 px-3 py-1.5">
          {searchAndChipFilteredTasks.length} {searchQuery.trim() ? 'Matched' : 'Total'}{' '}
          {searchAndChipFilteredTasks.length === 1 ? 'Note' : 'Notes'}
        </div>
      </div>

      {/* ── 3 Kanban Columns ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
        <KanbanColumn
          columnId="todo"
          title="To Do"
          tasks={todoTasks}
          onAddTask={handleOpenAddTask}
          onMoveTask={moveTask}
          onDeleteTask={removeTask}
        />

        <KanbanColumn
          columnId="in_progress"
          title="In Progress"
          tasks={inProgressTasks}
          onAddTask={handleOpenAddTask}
          onMoveTask={moveTask}
          onDeleteTask={removeTask}
        />

        <KanbanColumn
          columnId="done"
          title="Done"
          tasks={doneTasks}
          onAddTask={handleOpenAddTask}
          onMoveTask={moveTask}
          onDeleteTask={removeTask}
        />
      </div>

      {/* ── Task Creation Modal ── */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={closeTaskModal}
        title="Add Task Note"
        description="Pin a task to the board."
        size="md"
        footer={
          <>
            <Button variant="outline" size="md" onClick={closeTaskModal}>
              Cancel
            </Button>
            <Button variant="primary" size="md" onClick={handleCreateTask}>
              Add Note
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateTask} className="flex flex-col gap-4">
          <Input
            label="Task Title"
            required
            placeholder="e.g. Design Wireframes"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            {/* Column Selector */}
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs font-extrabold uppercase tracking-widest text-[#171717]">Column</label>
              <select
                value={selectedColumn}
                onChange={(e) => setSelectedColumn(e.target.value)}
                className="w-full bg-[#FFFFFF] text-sm text-[#171717] border-2 border-[#171717] p-2.5 outline-none focus:shadow-[2px_2px_0_#FFD84D] transition-all"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            {/* Priority Selector */}
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs font-extrabold uppercase tracking-widest text-[#171717]">Priority</label>
              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value)}
                className="w-full bg-[#FFFFFF] text-sm text-[#171717] border-2 border-[#171717] p-2.5 outline-none focus:shadow-[2px_2px_0_#FFD84D] transition-all"
              >
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Normal">Normal</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Color Selector */}
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs font-extrabold uppercase tracking-widest text-[#171717]">Card Color</label>
              <select
                value={taskColor}
                onChange={(e) => setTaskColor(e.target.value)}
                className="w-full bg-[#FFFFFF] text-sm text-[#171717] border-2 border-[#171717] p-2.5 outline-none focus:shadow-[2px_2px_0_#FFD84D] transition-all"
              >
                {stickyNoteColors.map((color) => (
                  <option key={color.id} value={color.id}>
                    {color.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <Input
              label="Due Date"
              type="text"
              placeholder="e.g. May 15"
              value={taskDueDate}
              onChange={(e) => setTaskDueDate(e.target.value)}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
