import { useMemo } from 'react';

/**
 * Custom hook for managing and grouping Kanban columns from tasks.
 * 
 * @param {Array} tasks - Array of task items.
 */
export default function useKanban(tasks = []) {
  const todoTasks = useMemo(
    () => tasks.filter((t) => t.columnId === 'todo'),
    [tasks]
  );

  const inProgressTasks = useMemo(
    () => tasks.filter((t) => t.columnId === 'in_progress'),
    [tasks]
  );

  const doneTasks = useMemo(
    () => tasks.filter((t) => t.columnId === 'done'),
    [tasks]
  );

  const columnCounts = useMemo(
    () => ({
      todo: todoTasks.length,
      in_progress: inProgressTasks.length,
      done: doneTasks.length,
    }),
    [todoTasks, inProgressTasks, doneTasks]
  );

  const columns = useMemo(
    () => [
      { id: 'todo', title: 'To Do', tasks: todoTasks, count: todoTasks.length },
      { id: 'in_progress', title: 'In Progress', tasks: inProgressTasks, count: inProgressTasks.length },
      { id: 'done', title: 'Done', tasks: doneTasks, count: doneTasks.length },
    ],
    [todoTasks, inProgressTasks, doneTasks]
  );

  return {
    todoTasks,
    inProgressTasks,
    doneTasks,
    columns,
    columnCounts,
  };
}
