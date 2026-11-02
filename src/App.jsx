import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import KanbanBoardPage from './pages/KanbanBoardPage';
import ProjectsPage from './pages/ProjectsPage';
import TeamPage from './pages/TeamPage';
import SettingsPage from './pages/SettingsPage';
import { useTaskContext } from './context/TaskContext';
import { currentUser } from './utils/constants';

export default function App() {
  const { setTasks } = useTaskContext();

  // Shared Project State (Initialized once at App root)
  const [projects, setProjects] = useState([]);

  const createProject = (projectData) => {
    const newProject = {
      id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      title: projectData.title || 'Untitled Project',
      description: projectData.description || 'Workspace project for team milestones.',
      category: projectData.category || 'Coursework',
      tasksTotal: 0,
      tasksDone: 0,
      members: [currentUser],
      status: 'active',
      ...projectData,
    };
    setProjects((prev) => [newProject, ...prev]);
    return newProject;
  };

  const deleteProject = (projectId) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    if (setTasks) {
      setTasks((prev) => prev.filter((t) => t.projectId !== projectId));
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Marketing & Auth Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Authenticated Workspace App Routes with TaskContext */}
        <Route element={<AppLayout />}>
          <Route 
            path="/dashboard" 
            element={
              <DashboardPage 
                projects={projects} 
                createProject={createProject} 
                deleteProject={deleteProject}
              />
            } 
          />
          <Route 
            path="/board" 
            element={
              <KanbanBoardPage 
                projects={projects}
              />
            } 
          />
          <Route 
            path="/projects" 
            element={
              <ProjectsPage 
                projects={projects} 
                createProject={createProject} 
                deleteProject={deleteProject}
              />
            } 
          />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
