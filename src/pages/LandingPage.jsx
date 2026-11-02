import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Kanban, Layers, Zap } from 'lucide-react';
import Button from '../components/Button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F5F2EA] flex flex-col justify-between font-sans">
      {/* ── Navbar ── */}
      <header className="border-b-2 border-[#171717] bg-[#FFFFFF]">
        <div className="max-w-7xl w-full mx-auto px-6 sm:px-10 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#FFD84D] border-2 border-[#171717] flex items-center justify-center shrink-0">
              <span className="font-black text-sm text-[#171717]">KB</span>
            </div>
            <span className="font-black text-xl text-[#171717] tracking-tight">
              KanbanBoard
            </span>
          </div>

          {/* Nav Actions */}
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="font-bold hidden sm:inline-flex">
                Sign In
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="primary" size="sm" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
                Open Workspace
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="max-w-7xl mx-auto px-6 sm:px-10 py-12 sm:py-20 flex flex-col gap-20">

        {/* ── Hero Section ── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left: Copy */}
          <div className="lg:col-span-6 flex flex-col gap-7 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FFD84D] border-2 border-[#171717] text-[#171717] text-[10px] font-extrabold uppercase tracking-widest w-fit shadow-[2px_2px_0_#171717]">
              <Kanban className="w-3 h-3" />
              Collaborative Kanban Workspace
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-[#171717] tracking-tight leading-[1.04]">
              Organize your team's work.{' '}
              <span className="relative inline-block">
                <span className="relative z-10">Visually.</span>
                <span className="absolute bottom-1 left-0 w-full h-4 bg-[#FFD84D] -z-0" />
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#555555] font-semibold leading-relaxed max-w-xl">
              A powerful Kanban board for college project teams. Organize milestones, assign tasks, and ship projects — all in one workspace.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/dashboard">
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowUpRight className="w-5 h-5" />}
                  className="shadow-[4px_4px_0_#171717] hover:shadow-[6px_6px_0_#171717]"
                >
                  Enter Workspace
                </Button>
              </Link>
              <Link to="/board">
                <Button
                  variant="secondary"
                  size="lg"
                >
                  View Kanban Board
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Board Preview */}
          <div className="lg:col-span-6">
            <div className="bg-[#FFFFFF] border-2 border-[#171717] shadow-[6px_6px_0_#171717]">
              {/* Preview header */}
              <div className="flex items-center justify-between px-5 py-3 border-b-2 border-[#171717] bg-[#FFD84D]">
                <span className="text-sm font-extrabold text-[#171717] uppercase tracking-wide">
                  Sprint Task Board
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-1 bg-[#171717] text-[#FFD84D] border-2 border-[#171717]">
                  Kanban
                </span>
              </div>

              {/* Preview columns */}
              <div className="grid grid-cols-3 gap-0 divide-x-2 divide-[#171717]">
                {/* To Do */}
                <div className="p-3 bg-[#F5F2EA]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#171717]">To Do</span>
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 bg-[#171717] text-white">2</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="bg-[#B8C5FF] border-2 border-[#171717] p-2.5 shadow-[2px_2px_0_#171717]">
                      <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 bg-[#171717] text-[#B8C5FF]">High</span>
                      <p className="text-[10px] font-extrabold text-[#171717] leading-snug mt-1.5">Design Architecture</p>
                      <p className="text-[9px] text-[#555] mt-1 font-bold">May 02</p>
                    </div>
                    <div className="bg-[#FFD84D] border-2 border-[#171717] p-2.5 shadow-[2px_2px_0_#171717]">
                      <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 bg-[#171717] text-[#FFD84D]">Normal</span>
                      <p className="text-[10px] font-extrabold text-[#171717] leading-snug mt-1.5">Component System</p>
                      <p className="text-[9px] text-[#555] mt-1 font-bold">May 08</p>
                    </div>
                  </div>
                </div>

                {/* In Progress */}
                <div className="p-3 bg-[#F5F2EA]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#171717]">In Prog.</span>
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 bg-[#171717] text-white">1</span>
                  </div>
                  <div className="bg-[#FF9B85] border-2 border-[#171717] p-2.5 shadow-[2px_2px_0_#171717]">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 bg-[#171717] text-[#FF9B85]">Urgent</span>
                    <p className="text-[10px] font-extrabold text-[#171717] leading-snug mt-1.5">API Schema Setup</p>
                    <p className="text-[9px] text-[#555] mt-1 font-bold">May 05</p>
                  </div>
                </div>

                {/* Done */}
                <div className="p-3 bg-[#F5F2EA]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#171717]">Done</span>
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 bg-[#A8E6CF] text-[#171717] border border-[#171717]">1</span>
                  </div>
                  <div className="bg-[#A8E6CF] border-2 border-[#171717] p-2.5 shadow-[2px_2px_0_#171717]">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 bg-[#171717] text-[#A8E6CF]">Low</span>
                    <p className="text-[10px] font-extrabold text-[#171717] leading-snug mt-1.5">Project Kickoff</p>
                    <p className="text-[9px] text-[#555] mt-1 font-bold">Apr 28</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Feature Blocks ── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-[#171717] shadow-[6px_6px_0_#171717]">
          {/* Feature 1 */}
          <div className="bg-[#FFD84D] border-r-0 md:border-r-2 border-b-2 md:border-b-0 border-[#171717] p-8 text-left flex flex-col gap-4">
            <div className="w-10 h-10 bg-[#171717] flex items-center justify-center">
              <Kanban className="w-5 h-5 text-[#FFD84D]" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#555555]">01 · Visual</span>
            <div>
              <h3 className="text-xl font-black text-[#171717]">Kanban Columns</h3>
              <p className="text-sm text-[#555555] mt-2 font-semibold leading-relaxed">
                Color-coded task cards across To Do, In Progress, and Done columns.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-[#A8E6CF] border-r-0 md:border-r-2 border-b-2 md:border-b-0 border-[#171717] p-8 text-left flex flex-col gap-4">
            <div className="w-10 h-10 bg-[#171717] flex items-center justify-center">
              <Layers className="w-5 h-5 text-[#A8E6CF]" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#555555]">02 · Organized</span>
            <div>
              <h3 className="text-xl font-black text-[#171717]">Project Workspaces</h3>
              <p className="text-sm text-[#555555] mt-2 font-semibold leading-relaxed">
                Group tasks by project, milestone, or sprint for full clarity.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-[#B8C5FF] p-8 text-left flex flex-col gap-4">
            <div className="w-10 h-10 bg-[#171717] flex items-center justify-center">
              <Zap className="w-5 h-5 text-[#B8C5FF]" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#555555]">03 · Fast</span>
            <div>
              <h3 className="text-xl font-black text-[#171717]">Built for Teams</h3>
              <p className="text-sm text-[#555555] mt-2 font-semibold leading-relaxed">
                Invite teammates, assign tasks, and coordinate deadlines together.
              </p>
            </div>
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className="bg-[#171717] border-2 border-[#171717] p-10 sm:p-14 flex flex-col sm:flex-row items-center justify-between gap-8 shadow-[6px_6px_0_#FFD84D]">
          <div className="text-left">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Start organizing your project today.
            </h2>
            <p className="text-sm text-[#AAA] font-semibold mt-2 max-w-md">
              Open the workspace to manage your team sprint with a bold, clear Kanban board.
            </p>
          </div>
          <Link to="/dashboard" className="shrink-0">
            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowUpRight className="w-5 h-5" />}
              className="shadow-[4px_4px_0_#FFD84D] hover:shadow-[6px_6px_0_#FFD84D]"
            >
              Open Workspace
            </Button>
          </Link>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t-2 border-[#171717] bg-[#FFFFFF]">
        <div className="max-w-7xl w-full mx-auto px-6 sm:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-[#555555]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#FFD84D] border-2 border-[#171717] flex items-center justify-center">
              <span className="text-[9px] font-black text-[#171717]">KB</span>
            </div>
            <p>KanbanBoard — Collaborative Project Workspace</p>
          </div>
          <div className="flex items-center gap-5 flex-wrap justify-center">
            <Link to="/login" className="hover:text-[#171717] uppercase tracking-wider">Sign In</Link>
            <Link to="/register" className="hover:text-[#171717] uppercase tracking-wider">Register</Link>
            <Link to="/dashboard" className="hover:text-[#171717] uppercase tracking-wider">Dashboard</Link>
            <Link to="/board" className="hover:text-[#171717] uppercase tracking-wider">Kanban</Link>
            <Link to="/projects" className="hover:text-[#171717] uppercase tracking-wider">Projects</Link>
            <Link to="/team" className="hover:text-[#171717] uppercase tracking-wider">Team</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
