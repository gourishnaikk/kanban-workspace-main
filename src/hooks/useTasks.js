import { useState, useMemo, useCallback } from 'react';

/**
 * Custom hook for managing tasks state and computing task metrics.
 * 
 * @param {Array} [initialTasks=[]] - Initial array of task items.
 */
export default function useTasks(initialTasks = []) {
  const [tasks, setTasks] = useState(initialTasks);

  const createTask = useCallback((taskData) => {
    const newTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      title: taskData.title || 'Untitled Task',
      columnId: taskData.columnId || 'todo',
      priority: taskData.priority || 'Normal',
      colorKey: taskData.colorKey || 'sage',
      dueDate: taskData.dueDate || '',
      assignee: taskData.assignee || null,
      createdAt: new Date().toISOString(),
      ...taskData,
    };

    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  }, []);

  const updateTask = useCallback((taskId, updates) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, ...updates } : task))
    );
  }, []);

  const deleteTask = useCallback((taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  }, []);

  const moveTask = useCallback((taskId, targetColumnId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, columnId: targetColumnId } : task
      )
    );
  }, []);

  // Computed metrics
  const totalTasks = tasks.length;

  const inProgressCount = useMemo(
    () => tasks.filter((t) => t.columnId === 'in_progress').length,
    [tasks]
  );

  const completedCount = useMemo(
    () => tasks.filter((t) => t.columnId === 'done').length,
    [tasks]
  );

  const dueThisWeekCount = useMemo(
    () => tasks.filter((t) => t.dueDate && t.columnId !== 'done').length,
    [tasks]
  );

  return {
    tasks,
    setTasks,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    totalTasks,
    inProgressCount,
    completedCount,
    dueThisWeekCount,
  };
}
