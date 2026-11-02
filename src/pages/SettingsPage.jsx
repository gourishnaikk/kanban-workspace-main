import React, { useState, useEffect } from 'react';
import { Sliders, Palette, Bell, Save } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import { useWorkspace } from '../context/WorkspaceContext';
import { stickyNoteColors } from '../utils/constants';

// Neo-Brutalist color mapping for settings palette preview
const NB_PALETTE = {
  sage:       '#A8E6CF',
  butter:     '#FFD84D',
  peach:      '#FF9B85',
  lavender:   '#B8C5FF',
  powderBlue: '#93C5FD',
};

export default function SettingsPage() {
  const {
    workspaceName,
    workspaceDescription,
    updateWorkspaceName,
    updateWorkspaceDescription,
  } = useWorkspace();

  const [formName, setFormName] = useState(workspaceName);
  const [formDesc, setFormDesc] = useState(workspaceDescription);
  const [savedNotice, setSavedNotice] = useState(false);

  // Sync state if context changes
  useEffect(() => {
    setFormName(workspaceName);
  }, [workspaceName]);

  useEffect(() => {
    setFormDesc(workspaceDescription);
  }, [workspaceDescription]);

  const handleSave = (e) => {
    e.preventDefault();
    updateWorkspaceName(formName);
    updateWorkspaceDescription(formDesc);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto font-sans text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-2 border-[#171717]">
        <div>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 bg-[#FF9B85] border-2 border-[#171717]">
              Preferences
            </span>
            <span className="text-xs font-bold text-[#555555] bg-[#EAE6DC] border border-[#171717]/20 px-2 py-1">
              {workspaceName}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-[#171717] tracking-tight">
            Workspace Settings
          </h1>
          <p className="text-sm text-[#555555] mt-1 font-semibold">
            Configure workspace details, card palette, and notifications.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={<Save className="w-4 h-4" />}
          onClick={handleSave}
          className="shrink-0 shadow-[3px_3px_0_#171717]"
        >
          {savedNotice ? 'Saved ✓' : 'Save Changes'}
        </Button>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        {/* Workspace Details Section */}
        <section className="bg-[#FFFFFF] border-2 border-[#171717] shadow-[4px_4px_0_#171717] overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b-2 border-[#171717] bg-[#EAE6DC]">
            <Sliders className="w-4 h-4 text-[#171717]" />
            <h3 className="text-sm font-extrabold text-[#171717] uppercase tracking-widest">
              General Details
            </h3>
          </div>
          <div className="p-6 flex flex-col gap-5">
            <Input
              label="Workspace Name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
            />

            <Input
              label="Description"
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
            />
          </div>
        </section>

        {/* Color Palette Section */}
        <section className="bg-[#FFFFFF] border-2 border-[#171717] shadow-[4px_4px_0_#171717] overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b-2 border-[#171717] bg-[#EAE6DC]">
            <Palette className="w-4 h-4 text-[#171717]" />
            <h3 className="text-sm font-extrabold text-[#171717] uppercase tracking-widest">
              Task Card Palette
            </h3>
          </div>
          <div className="p-6">
            <p className="text-xs text-[#555555] font-semibold mb-4">
              Active colors available for task cards on the Kanban board.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {stickyNoteColors.map((color) => {
                const nbColor = NB_PALETTE[color.id] || color.bg;
                return (
                  <div
                    key={color.id}
                    style={{ backgroundColor: nbColor }}
                    className="border-2 border-[#171717] p-4 flex flex-col justify-between min-h-[80px] shadow-[2px_2px_0_#171717] select-none"
                  >
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#171717]">
                      Color
                    </span>
                    <span className="text-xs font-extrabold text-[#171717]">
                      {color.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="bg-[#FFFFFF] border-2 border-[#171717] shadow-[4px_4px_0_#171717] overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b-2 border-[#171717] bg-[#EAE6DC]">
            <Bell className="w-4 h-4 text-[#171717]" />
            <h3 className="text-sm font-extrabold text-[#171717] uppercase tracking-widest">
              Notification Preferences
            </h3>
          </div>

          <div className="p-6 flex flex-col gap-3">
            <label className="flex items-center justify-between p-4 bg-[#F5F2EA] border-2 border-[#171717]/20 cursor-pointer hover:border-[#171717] hover:bg-[#EAE6DC] transition-all">
              <div>
                <span className="text-xs font-extrabold text-[#171717] block uppercase tracking-wider">Task Assignments</span>
                <span className="text-[11px] text-[#555555] font-semibold">Notify me when a task is assigned to me</span>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 accent-[#FFD84D] border-2 border-[#171717]"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-[#F5F2EA] border-2 border-[#171717]/20 cursor-pointer hover:border-[#171717] hover:bg-[#EAE6DC] transition-all">
              <div>
                <span className="text-xs font-extrabold text-[#171717] block uppercase tracking-wider">Column Moves</span>
                <span className="text-[11px] text-[#555555] font-semibold">Notify when tasks move to the Done column</span>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 accent-[#FFD84D] border-2 border-[#171717]"
              />
            </label>
          </div>
        </section>
      </form>
    </div>
  );
}
