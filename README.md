# 🌿 CrewBoard — Collaborative Kanban Platform

> **A minimal, physical-inspired Kanban task management workspace for student project teams and semester milestones.**
> *Vibe:* Pinterest × Notion × Milanote × Apple Notes (tactile, solid colors, editorial typography, calming).

CrewBoard is a collaborative task management platform designed to help student teams organize projects, manage tasks, track progress, and maintain a shared workspace. It combines an intuitive React interface with a Node.js and Express backend, MongoDB persistence, and secure authentication.

---

## ✨ Features

- **Interactive Kanban Board:** Organize tasks into To Do, In Progress, and Done columns.
- **Task Management:** Create, update, move, and delete tasks.
- **Workspace Dashboard:** View task statistics and track project progress.
- **Project Management:** Create and manage projects within the workspace.
- **Team Workspace:** Organize team information and member-related activities.
- **Global State Management:** Share task and workspace data using React Context API.
- **Persistent Workspace Settings:** Save workspace preferences across browser reloads.
- **User Authentication:** Register and log in using email and password.
- **JWT-Based Security:** Protect backend endpoints using token verification.
- **Role-Based Authorization:** Restrict administrative operations according to user roles.
- **Responsive Interface:** Navigate a clean, stationery-inspired workspace.
- **Docker Support:** Run the frontend and backend using Docker Compose.

---

## 🎨 Solid Color System & Typography

### Solid Color Palette

- **Canvas Background:** `#FFFDF8` (warm off-white cream)
- **Sidebar Canvas:** `#DCE8D7` (solid refined sage)
- **Primary Brand & Buttons:** `#2D5A45` (deep forest / eucalyptus)
- **Text Primary:** `#1E2B24` (deep charcoal-green)
- **Card Paper Surface:** `#F3F7F0` (light sage paper)
- **Pastel Sticky Note Colors:**
  - 🌿 **Sage:** `#B5D0AF`
  - 🧈 **Butter Yellow:** `#F7EBAA`
  - 🍑 **Peach:** `#F4B89B`
  - 🪻 **Lavender:** `#C7B8DF`
  - 🌊 **Powder Blue:** `#A2C0D4`

### Typography

- **Headings & Serif Accents:** Fraunces
- **Body, UI, Navigation, Buttons:** Manrope

---

## 🛠️ Technology Stack

| Layer             | Technologies                    |
| ----------------- | ------------------------------- |
| Frontend          | React, Vite, JavaScript         |
| Styling           | Tailwind CSS, custom CSS        |
| Routing           | React Router                    |
| State Management  | React Context API, custom hooks |
| Backend           | Node.js, Express.js             |
| Database          | MongoDB, Mongoose               |
| Authentication    | JWT                             |
| Password Security | bcrypt / bcryptjs               |
| Containerization  | Docker, Docker Compose          |
| Version Control   | Git, GitHub                     |

---

## 🧠 State Management

CrewBoard uses React Context API to manage shared application state across components.

| Context Provider    | Primary Responsibility                                                                                       |
| ------------------- | ------------------------------------------------------------------------------------------------------------ |
| `TaskProvider`      | Manages the global task collection and task operations such as adding, removing, moving, and updating tasks. |
| `WorkspaceProvider` | Manages workspace metadata, including the workspace name and description, with local-storage persistence.    |
| `AuthProvider`      | Manages frontend authentication state and integrates with the authentication service.                        |

These providers help components access shared data without passing props through multiple intermediate components.

---

## 🪝 Custom React Hooks

| Hook              | Primary Responsibility                                 |
| ----------------- | ------------------------------------------------------ |
| `useModal`        | Manages modal open, close, and toggle behavior.        |
| `useKanban`       | Groups tasks by column and calculates column counts.   |
| `useSearch`       | Provides case-insensitive search and filtering.        |
| `useLocalStorage` | Persists workspace preferences across browser reloads. |

---

## 🔐 Authentication & Authorization

CrewBoard supports account registration and login with backend authentication.

- User passwords are hashed before storage.
- Successful login generates a JWT authentication token.
- Authentication middleware verifies tokens before granting access to protected endpoints.
- Role-based authorization restricts administrative operations.
- Invalid, missing, and expired tokens are rejected.
- Request validation, error handling, and rate limiting provide additional safeguards.

**Security:** Store database credentials and authentication secrets in environment variables. Never commit `.env` files or real credentials to the repository.

---

## 📁 Folder Architecture

```text
CrewBoard/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── StatsCard.jsx
│   │   ├── ProjectCard.jsx
│   │   ├── TaskCard.jsx
│   │   ├── KanbanColumn.jsx
│   │   ├── Modal.jsx
│   │   ├── WorkspaceClock.jsx
│   │   └── WorkspaceHeader.jsx
│   ├── context/
│   │   ├── TaskContext.jsx
│   │   ├── WorkspaceContext.jsx
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   ├── useModal.js
│   │   ├── useKanban.js
│   │   ├── useSearch.js
│   │   └── useLocalStorage.js
│   ├── layouts/
│   │   └── AppLayout.jsx
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── KanbanBoardPage.jsx
│   │   ├── ProjectsPage.jsx
│   │   ├── TeamPage.jsx
│   │   └── SettingsPage.jsx
│   ├── services/
│   │   └── authService.js
│   ├── utils/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seedAdmin.js
│   ├── server.js
│   ├── package.json
│   └── .gitignore
├── docs/
├── docker-compose.yml
├── Dockerfile
├── package.json
└── README.md
```

*The structure above highlights the main application files. Additional files and subdirectories may exist in the repository.*

---

## 🚀 Quick Start

### Prerequisites

- Node.js and npm
- MongoDB Atlas or a local MongoDB instance
- Git
- Docker Desktop (optional)

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd CrewBoard
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `backend/.env` file with the environment variables required by the backend.

For example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
```

Use the exact variable names expected by your backend configuration. Keep this file private and do not commit it to GitHub.

### 4. Install backend dependencies

```bash
cd backend
npm install
```

### 5. Start the backend

From the `backend` directory:

```bash
npm run dev
```

### 6. Start the frontend

Open another terminal in the project root:

```bash
npm run dev
```

Open the Vite development URL displayed in the terminal, typically `http://localhost:5173`.

Ensure the frontend API configuration points to the running backend.

---

## 🐳 Docker Setup

To build and start the configured services:

```bash
docker compose up --build
```

To view logs:

```bash
docker compose logs
```

To stop the services:

```bash
docker compose down
```

Refer to the project's Docker Compose configuration for the exact service names, port mappings, and environment settings.

---

## 🔮 Future Enhancements

- **Real-Time Collaboration:** Live task updates and team activity using Socket.IO.
- **Advanced Drag & Drop:** Smooth task movement and column reordering.
- **CI/CD Automation:** Automated builds and testing with GitHub Actions.
- **Cloud Deployment:** Deploy the frontend and backend to cloud hosting platforms.
- **Enhanced Team Workflows:** Expand collaboration and project coordination features.

---

## 🎯 Project Vision

CrewBoard aims to provide student project teams with a calm, organized, and collaborative environment for managing tasks and semester milestones. By combining a tactile Kanban interface with a modern full-stack architecture, the platform brings project planning, task tracking, and workspace management together in one place.
