# Experiment 3 — State Management using React Context API

## Objective
Implement a global Task State using the React Context API (`createContext`, `useContext`, Provider pattern) to eliminate prop drilling and manage task collection and metrics centrally across components.

## Deliverables Completed
- [x] `src/context/TaskContext.jsx` — Global `TaskContext` with `TaskProvider` and custom hook `useTaskContext()`.
- [x] Global State:
  - `tasks` array (with `id`, `title`, `priority`, `status`/`columnId`, `dueDate`, `colorKey`, `assignee`, `projectId`, `createdAt`).
- [x] Actions:
  - `addTask(task)` — creates and appends task.
  - `removeTask(id)` — deletes task by id.
  - `moveTask(id, newStatus)` — updates task column / status.
  - `updateTask(id, updates)` — updates task properties.
- [x] Application Root:
  - In `main.jsx`, `<App />` is wrapped with `<TaskProvider>`.
- [x] Context Consumed Across Multiple Components:
  - **Component 1 — `Navbar.jsx`**: Displays total tasks count badge, updating automatically on any task change.
  - **Component 2 — `DashboardPage.jsx`**: Dynamically renders task stats (**Tasks**, **In Progress**, **Completed**) directly from `TaskContext`.
  - **Component 3 — `KanbanBoardPage.jsx`**: Directly invokes `addTask()`, `moveTask()`, and `removeTask()` from `TaskContext`.
