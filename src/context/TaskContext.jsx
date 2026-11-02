import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';

/**
 * Task Context for global task management across KanbanBoard
 */
export const TaskContext = createContext(null);

/**
 * Task Provider Component
 * Manages global task array and provides addTask, removeTask, moveTask, and computed metrics.
 */
export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);

  // Action 1: addTask (also aliased as createTask)
  const addTask = useCallback((taskData) => {
    const newTask = {
      id: taskData.id || `task_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      title: taskData.title || 'Untitled Task',
      priority: taskData.priority || 'Normal',
      status: taskData.status || taskData.columnId || 'todo',
      columnId: taskData.columnId || taskData.status || 'todo',
      dueDate: taskData.dueDate || '',
      colorKey: taskData.colorKey || 'sage',
      assignee: taskData.assignee || null,
      projectId: taskData.projectId || null,
      createdAt: taskData.createdAt || new Date().toISOString(),
      ...taskData,
    };

    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  }, []);

  // Action 2: removeTask (also aliased as deleteTask)
  const removeTask = useCallback((taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  }, []);

  // Action 3: moveTask (changes status / columnId)
  const moveTask = useCallback((taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, status: newStatus, columnId: newStatus }
          : task
      )
    );
  }, []);

  // Action 4: updateTask
  const updateTask = useCallback((taskId, updates) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              ...updates,
              ...(updates.columnId ? { status: updates.columnId } : {}),
              ...(updates.status ? { columnId: updates.status } : {}),
            }
          : task
      )
    );
  }, []);

  // Computed metrics
  const totalTasks = tasks.length;

  const inProgressCount = useMemo(
    () =>
      tasks.filter(
        (t) => t.columnId === 'in_progress' || t.status === 'in_progress'
      ).length,
    [tasks]
  );

  const completedCount = useMemo(
    () =>
      tasks.filter((t) => t.columnId === 'done' || t.status === 'done').length,
    [tasks]
  );

  const dueThisWeekCount = useMemo(
    () =>
      tasks.filter(
        (t) => t.dueDate && t.columnId !== 'done' && t.status !== 'done'
      ).length,
    [tasks]
  );

  const value = {
    tasks,
    setTasks,
    addTask,
    createTask: addTask,
    removeTask,
    deleteTask: removeTask,
    moveTask,
    updateTask,
    totalTasks,
    inProgressCount,
    completedCount,
    dueThisWeekCount,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

/**
 * Custom hook to consume TaskContext
 */
export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}

export default TaskContext;
