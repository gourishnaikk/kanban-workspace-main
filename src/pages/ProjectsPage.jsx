import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, FolderKanban } from 'lucide-react';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import ProjectCard from '../components/ProjectCard';
import useModal from '../hooks/useModal';
import { useWorkspace } from '../context/WorkspaceContext';

export default function ProjectsPage({ projects = [], createProject, deleteProject }) {
  const { workspaceName } = useWorkspace();
  const outletCtx = useOutletContext();
  const searchQuery = outletCtx?.searchQuery || '';
  const filterItems = outletCtx?.filterItems;

  const [activeTab, setActiveTab] = useState('all');

  // Create Project Modal
  const {
    isOpen: isModalOpen,
    openModal,
    closeModal,
  } = useModal(false);

  // Delete Project Confirmation Modal
  const {
    isOpen: isDeleteModalOpen,
    modalData: projectToDelete,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal(false);

  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectType, setProjectType] = useState('Coursework');

  // Filter projects by search query
  const searchedProjects = React.useMemo(() => {
    if (!searchQuery.trim()) return projects;
    if (filterItems) {
      return filterItems(projects, ['title', 'name', 'description', 'category']);
    }
    const q = searchQuery.trim().toLowerCase();
    return projects.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
    );
  }, [projects, searchQuery, filterItems]);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!projectTitle.trim()) return;

    if (createProject) {
      createProject({
        title: projectTitle.trim(),
        description: projectDescription.trim() || 'Workspace project for team milestones.',
        category: projectType,
      });
    }

    setProjectTitle('');
    setProjectDescription('');
    closeModal();
  };

  const handleDeleteConfirm = () => {
    if (projectToDelete && deleteProject) {
      deleteProject(projectToDelete.id);
    }
    closeDeleteModal();
  };

  const displayedProjects = searchedProjects.filter((p) => {
    if (activeTab === 'all') return true;
    return p.status === activeTab;
  });

  const isSearchActive = Boolean(searchQuery.trim());

  const TABS = ['all', 'active', 'archived'];

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-2 border-[#171717]">
        <div className="text-left">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 bg-[#A8E6CF] border-2 border-[#171717]">
              Projects
            </span>
            <span className="text-xs font-bold text-[#555555] bg-[#EAE6DC] border border-[#171717]/20 px-2 py-1">
              {workspaceName}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-[#171717] tracking-tight">
            Team Projects
          </h1>
          <p className="text-sm text-[#555555] mt-1 font-semibold">
            Manage your team's active project workspaces and milestones.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={openModal}
          className="shrink-0 shadow-[3px_3px_0_#171717]"
        >
          New Project
        </Button>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-0 border-2 border-[#171717] w-fit shadow-[3px_3px_0_#171717]">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              text-[10px] font-extrabold uppercase tracking-widest px-4 py-2.5 capitalize transition-all border-r-2 last:border-r-0 border-[#171717]
              ${activeTab === tab
                ? 'bg-[#FFD84D] text-[#171717]'
                : 'bg-[#FFFFFF] text-[#555555] hover:bg-[#EAE6DC] hover:text-[#171717]'}
            `}
          >
            {tab === 'all' ? `All (${displayedProjects.length})` : tab}
          </button>
        ))}
      </div>

      {/* Projects or Empty State */}
      {displayedProjects.length > 0 ? (
        <div className="flex flex-col gap-4">
          {displayedProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={openDeleteModal}
            />
          ))}
        </div>
      ) : (
        <div className="bg-[#FFFFFF] border-2 border-[#171717] shadow-[4px_4px_0_#171717] p-10 sm:p-14 text-center flex flex-col items-center justify-center gap-5">
          <div className="w-14 h-14 bg-[#A8E6CF] border-2 border-[#171717] flex items-center justify-center">
            <FolderKanban className="w-7 h-7 text-[#171717]" />
          </div>

          <div className="max-w-md">
            <h3 className="text-2xl font-black text-[#171717] tracking-tight">
              {isSearchActive ? `No projects matching "${searchQuery}"` : 'No active projects yet'}
            </h3>
            <p className="text-sm text-[#555555] mt-1.5 font-semibold leading-relaxed">
              {isSearchActive
                ? 'Check your search query or clear the search to view all projects.'
                : 'Create your first project to start organizing team milestones and assigning tasks.'}
            </p>
          </div>

          {!isSearchActive && (
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={openModal}
              className="shadow-[3px_3px_0_#171717]"
            >
              Create Project
            </Button>
          )}
        </div>
      )}

      {/* Project Templates */}
      {!isSearchActive && (
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#555555] border-b-2 border-[#B8C5FF] pb-0.5 block mb-4">
            Project Templates
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-[#171717] shadow-[4px_4px_0_#171717]">
            {[
              { color: 'bg-[#FFD84D]', name: 'Semester Capstone', desc: '10-week sprint with milestone tracking.' },
              { color: 'bg-[#A8E6CF]', name: 'Hackathon Sprint', desc: 'Fast-paced 48-hour build roadmap.' },
              { color: 'bg-[#B8C5FF]', name: 'Research & Lab', desc: 'Literature review, dataset, and code pipeline.' },
            ].map((t, i) => (
              <div key={t.name} className={`${t.color} ${i < 2 ? 'border-r-0 md:border-r-2' : ''} border-b-2 md:border-b-0 border-[#171717] p-6 text-left flex flex-col gap-3`}>
                <span className="text-[10px] font-extrabold uppercase tracking-widest bg-[#171717] text-white px-2 py-1 w-fit border-2 border-[#171717]">
                  Template
                </span>
                <div>
                  <h4 className="text-base font-black text-[#171717]">{t.name}</h4>
                  <p className="text-xs text-[#555555] mt-1 font-semibold">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Create New Project"
        description="Set up a project in your workspace."
        size="md"
        footer={
          <>
            <Button variant="outline" size="md" onClick={closeModal}>Cancel</Button>
            <Button variant="primary" size="md" onClick={handleCreate}>Create Project</Button>
          </>
        }
      >
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <Input
            label="Project Name"
            required
            placeholder="e.g. Senior Design Capstone"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
          />

          <Input
            label="Description"
            placeholder="Brief overview of project goals..."
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
          />

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-extrabold uppercase tracking-widest text-[#171717]">Category</label>
            <select
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              className="w-full bg-[#FFFFFF] text-sm text-[#171717] border-2 border-[#171717] p-2.5 outline-none focus:shadow-[2px_2px_0_#FFD84D] transition-all"
            >
              <option value="Coursework">Semester Coursework</option>
              <option value="Hackathon">Hackathon Sprint</option>
              <option value="Research">Research &amp; Lab</option>
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
            <Button variant="outline" size="md" onClick={closeDeleteModal}>Cancel</Button>
            <Button variant="danger" size="md" onClick={handleDeleteConfirm}>Delete Project</Button>
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
