import React, { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Plus, FolderKanban, Kanban, ArrowRight } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import ProjectCard from '../components/ProjectCard';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import WorkspaceHeader from '../components/WorkspaceHeader';
import WorkspaceClock from '../components/WorkspaceClock';
import useModal from '../hooks/useModal';
import { useTaskContext } from '../context/TaskContext';

export default function DashboardPage({ projects = [], createProject, deleteProject }) {
  const outletCtx = useOutletContext();
  const searchQuery = outletCtx?.searchQuery || '';
  const filterItems = outletCtx?.filterItems;

  // Global Task State from TaskContext (Experiment 3)
  const { totalTasks, inProgressCount, completedCount } = useTaskContext();

  // Create Project Modal
  const {
    isOpen: isNewProjectModalOpen,
    openModal: openNewProjectModal,
    closeModal: closeNewProjectModal,
  } = useModal(false);

  // Delete Project Confirmation Modal
  const {
    isOpen: isDeleteModalOpen,
    modalData: projectToDelete,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal(false);

  const [projectName, setProjectName] = useState('');
  const [projectCategory, setProjectCategory] = useState('Coursework');

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    if (createProject) {
      createProject({
        title: projectName.trim(),
        category: projectCategory,
        description: 'Workspace project created for team milestones.',
      });
    }

    setProjectName('');
    closeNewProjectModal();
  };

  const handleDeleteConfirm = () => {
    if (projectToDelete && deleteProject) {
      deleteProject(projectToDelete.id);
    }
    closeDeleteModal();
  };

  // Filter projects by search query
  const filteredProjects = React.useMemo(() => {
    if (!searchQuery.trim()) return projects;
    if (filterItems) {
      return filterItems(projects, ['title', 'description', 'category']);
    }
    const q = searchQuery.trim().toLowerCase();
    return projects.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
    );
  }, [projects, searchQuery, filterItems]);

  const dynamicStats = [
    {
      id: 'stat_1',
      label: 'Projects',
      value: String(projects.length),
      hint: projects.length === 0 ? 'No active' : `${projects.length} active`,
      index: 0,
    },
    {
      id: 'stat_2',
      label: 'Tasks',
      value: String(totalTasks),
      hint: totalTasks === 0 ? 'None yet' : `${totalTasks} total`,
      index: 1,
    },
    {
      id: 'stat_3',
      label: 'In Progress',
      value: String(inProgressCount),
      hint: `${inProgressCount} working`,
      index: 2,
    },
    {
      id: 'stat_4',
      label: 'Completed',
      value: String(completedCount),
      hint: `${completedCount} shipped`,
      index: 3,
    },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto font-sans">
      {/* 1. Header + Action */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-2 border-[#171717]">
        <WorkspaceHeader />

        <div className="shrink-0 flex items-center gap-3">
          <Button
            variant="primary"
            size="lg"
            leftIcon={<Plus className="w-5 h-5" />}
            onClick={() => openNewProjectModal()}
            className="shadow-[4px_4px_0_#171717]"
          >
            Create Project
          </Button>
        </div>
      </div>

      {/* 2. Clock */}
      <section>
        <WorkspaceClock />
      </section>

      {/* 3. Stats Grid */}
      <section>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {dynamicStats.map((stat) => (
            <StatsCard
              key={stat.id}
              label={stat.label}
              value={stat.value}
              hint={stat.hint}
              index={stat.index}
            />
          ))}
        </div>
      </section>

      {/* 4. Projects List or Empty State */}
      {filteredProjects.length > 0 ? (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#555555] border-b-2 border-[#FFD84D] pb-0.5">
              Active Projects ({filteredProjects.length})
            </span>
          </div>
          <div className="flex flex-col gap-4">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDelete={openDeleteModal}
              />
            ))}
          </div>
        </section>
      ) : (
        <section className="bg-[#FFFFFF] border-2 border-[#171717] shadow-[4px_4px_0_#171717] p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-6">
          <div className="w-14 h-14 bg-[#FFD84D] border-2 border-[#171717] flex items-center justify-center">
            <FolderKanban className="w-7 h-7 text-[#171717]" />
          </div>

          <div className="max-w-md">
            <h3 className="text-2xl sm:text-3xl font-black text-[#171717] tracking-tight">
              {searchQuery.trim() ? 'No matching projects' : 'No active projects yet'}
            </h3>
            <p className="text-sm text-[#555555] mt-2 font-semibold leading-relaxed">
              {searchQuery.trim()
                ? `No projects matching "${searchQuery}". Try a different keyword.`
                : 'Get started by creating your first project workspace or opening the Kanban board to add tasks.'}
            </p>
          </div>

          {!searchQuery.trim() && (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                variant="primary"
                size="md"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() => openNewProjectModal()}
                className="shadow-[3px_3px_0_#171717]"
              >
                Create Project
              </Button>

              <Link to="/board">
                <Button
                  variant="outline"
                  size="md"
                  leftIcon={<Kanban className="w-4 h-4" />}
                >
                  Open Kanban Board
                </Button>
              </Link>
            </div>
          )}
        </section>
      )}

      {/* 5. Getting Started Guide */}
      {!searchQuery.trim() && (
        <section>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#555555] border-b-2 border-[#A8E6CF] pb-0.5 block mb-4">
            Getting Started
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-[#171717] shadow-[4px_4px_0_#171717]">
            <div className="bg-[#FFD84D] border-r-0 md:border-r-2 border-b-2 md:border-b-0 border-[#171717] p-6 text-left flex flex-col justify-between min-h-[150px]">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#555555]">Step 01</span>
              <div>
                <h4 className="text-lg font-black text-[#171717]">Create a Project</h4>
                <p className="text-xs text-[#555555] mt-1.5 font-semibold leading-relaxed">
                  Define your team's objective, course milestone, or hackathon scope.
                </p>
              </div>
            </div>

            <div className="bg-[#A8E6CF] border-r-0 md:border-r-2 border-b-2 md:border-b-0 border-[#171717] p-6 text-left flex flex-col justify-between min-h-[150px]">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#555555]">Step 02</span>
              <div>
                <h4 className="text-lg font-black text-[#171717]">Pin Tasks</h4>
                <p className="text-xs text-[#555555] mt-1.5 font-semibold leading-relaxed">
                  Add color-coded task cards across Kanban columns with priorities.
                </p>
              </div>
            </div>

            <div className="bg-[#B8C5FF] p-6 text-left flex flex-col justify-between min-h-[150px]">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#555555]">Step 03</span>
              <div>
                <h4 className="text-lg font-black text-[#171717]">Coordinate Team</h4>
                <p className="text-xs text-[#555555] mt-1.5 font-semibold leading-relaxed">
                  Assign tasks to teammates and track progress together.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Create Project Modal */}
      <Modal
        isOpen={isNewProjectModalOpen}
        onClose={closeNewProjectModal}
        title="Create New Project"
        description="Set up a workspace project for your team."
        size="md"
        footer={
          <>
            <Button variant="outline" size="md" onClick={closeNewProjectModal}>
              Cancel
            </Button>
            <Button variant="primary" size="md" onClick={handleCreateProject}>
              Create Project
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateProject} className="flex flex-col gap-4">
          <Input
            label="Project Title"
            required
            placeholder="e.g. Full Stack MERN Development"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-extrabold uppercase tracking-widest text-[#171717]">Category</label>
            <select
              value={projectCategory}
              onChange={(e) => setProjectCategory(e.target.value)}
              className="w-full bg-[#FFFFFF] text-sm text-[#171717] border-2 border-[#171717] p-2.5 outline-none focus:shadow-[2px_2px_0_#FFD84D] transition-all"
            >
              <option value="Coursework">Semester Coursework</option>
              <option value="Hackathon">Hackathon Sprint</option>
              <option value="Research">Research &amp; Lab</option>
              <option value="Personal">Team Project</option>
            </select>
          </div>
        </form>
      </Modal>

      {/* Delete Project Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title="Delete Project"
        size="md"
        footer={
          <>
            <Button variant="outline" size="md" onClick={closeDeleteModal}>
              Cancel
            </Button>
            <Button variant="danger" size="md" onClick={handleDeleteConfirm}>
              Delete Project
            </Button>
          </>
        }
      >
        <p className="text-sm text-[#555555] font-semibold leading-relaxed">
          Are you sure you want to delete this project? This will also remove all tasks associated with it.
        </p>
      </Modal>
    </div>
  );
}
