# Experiment 2 — Custom React Hooks (State Management Foundation)

## Objective
Refactor CrewBoard by extracting reusable state and business logic into custom React hooks while keeping the Experiment 1 UI, layout, palette, and routing completely intact.

## Deliverables Completed
- [x] `src/hooks/useModal.js` — Modal visibility and payload management (`isOpen`, `openModal`, `closeModal`, `toggleModal`).
- [x] `src/hooks/useTasks.js` — Core task state management (`createTask`, `updateTask`, `deleteTask`, `moveTask`) and computed metrics (`totalTasks`, `inProgressCount`, `completedCount`, `dueThisWeekCount`).
- [x] `src/hooks/useKanban.js` — Column grouping (`todoTasks`, `inProgressTasks`, `doneTasks`, `columnCounts`).
- [x] `src/hooks/useSearch.js` — Reusable case-insensitive multi-field search and filter logic.
- [x] `src/hooks/useLocalStorage.js` — Persistent workspace settings for name & description with fallback.
- [x] Zero mock data: Workspace starts completely empty; tasks, projects, and members are created and managed purely through React state in the UI.
