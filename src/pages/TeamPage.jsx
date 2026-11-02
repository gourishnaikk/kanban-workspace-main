import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, Mail, Shield, Users } from 'lucide-react';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import useModal from '../hooks/useModal';
import { useWorkspace } from '../context/WorkspaceContext';

export default function TeamPage() {
  const { workspaceName } = useWorkspace();
  const outletCtx = useOutletContext();
  const searchQuery = outletCtx?.searchQuery || '';
  const filterItems = outletCtx?.filterItems;

  const [members, setMembers] = useState([]);

  const {
    isOpen: isInviteModalOpen,
    openModal: openInviteModal,
    closeModal: closeInviteModal,
  } = useModal(false);

  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Member');

  // Filter members by shared search query
  const searchedMembers = React.useMemo(() => {
    if (!searchQuery.trim()) return members;
    if (filterItems) {
      return filterItems(members, ['name', 'email', 'role']);
    }
    const q = searchQuery.trim().toLowerCase();
    return members.filter(
      (m) =>
        m.name?.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q) ||
        m.role?.toLowerCase().includes(q)
    );
  }, [members, searchQuery, filterItems]);

  const handleInvite = (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    const memberName = inviteName.trim() || inviteEmail.split('@')[0];
    const initials = memberName.charAt(0).toUpperCase();

    // Assign accent colors based on position
    const colorPalette = ['#FFD84D', '#A8E6CF', '#B8C5FF', '#FF9B85', '#EAE6DC'];
    const assignedColor = colorPalette[members.length % colorPalette.length];

    const newMember = {
      id: `usr_${Date.now()}`,
      name: memberName,
      email: inviteEmail.trim(),
      role: inviteRole,
      initials,
      color: assignedColor,
      textColor: '#171717',
      status: members.length === 0 ? 'Owner' : 'Member',
    };

    setMembers((prev) => [...prev, newMember]);
    setInviteName('');
    setInviteEmail('');
    closeInviteModal();
  };

  const isSearchActive = Boolean(searchQuery.trim());

  const STATUS_COLORS = {
    Owner: 'bg-[#FFD84D] border-[#171717] text-[#171717]',
    Member: 'bg-[#EAE6DC] border-[#171717]/20 text-[#555555]',
  };

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-2 border-[#171717]">
        <div className="text-left">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 bg-[#B8C5FF] border-2 border-[#171717]">
              Team Roster
            </span>
            <span className="text-xs font-bold text-[#555555] bg-[#EAE6DC] border border-[#171717]/20 px-2 py-1">
              {workspaceName}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-[#171717] tracking-tight">
            Team Members
          </h1>
          <p className="text-sm text-[#555555] mt-1 font-semibold">
            Manage your project collaborators and role assignments.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={openInviteModal}
          className="shrink-0 shadow-[3px_3px_0_#171717]"
        >
          Invite Member
        </Button>
      </div>

      {/* Members Grid or Empty State */}
      {searchedMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {searchedMembers.map((member) => (
            <div
              key={member.id}
              className="bg-[#FFFFFF] border-2 border-[#171717] shadow-[3px_3px_0_#171717] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[4px_4px_0_#171717] transition-all duration-100 overflow-hidden"
            >
              {/* Accent top bar matching member color */}
              <div style={{ backgroundColor: member.color }} className="h-1.5 w-full border-b-2 border-[#171717]" />
              
              <div className="flex items-center justify-between gap-4 p-5">
                <div className="flex items-center gap-4 min-w-0">
                  {/* Initials square */}
                  <div
                    className="w-11 h-11 border-2 border-[#171717] flex items-center justify-center text-sm font-extrabold shrink-0 select-none"
                    style={{ backgroundColor: member.color, color: '#171717' }}
                  >
                    {member.initials}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-extrabold text-[#171717] truncate">
                        {member.name}
                      </h3>
                      <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 border ${STATUS_COLORS[member.status] || STATUS_COLORS.Member}`}>
                        {member.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#555555] font-bold mt-0.5">{member.role}</p>
                    <p className="text-[11px] text-[#555555]/70 truncate font-semibold">{member.email}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#FFFFFF] border-2 border-[#171717] shadow-[4px_4px_0_#171717] p-10 sm:p-14 text-center flex flex-col items-center justify-center gap-5">
          <div className="w-14 h-14 bg-[#B8C5FF] border-2 border-[#171717] flex items-center justify-center">
            <Users className="w-7 h-7 text-[#171717]" />
          </div>

          <div className="max-w-md">
            <h3 className="text-2xl font-black text-[#171717] tracking-tight">
              {isSearchActive ? `No members matching "${searchQuery}"` : 'No members added yet'}
            </h3>
            <p className="text-sm text-[#555555] mt-1.5 font-semibold leading-relaxed">
              {isSearchActive
                ? 'Check your search query or clear the search to view all team members.'
                : 'Invite your teammates to start assigning tasks and collaborating.'}
            </p>
          </div>

          {!isSearchActive && (
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={openInviteModal}
              className="shadow-[3px_3px_0_#171717]"
            >
              Invite First Member
            </Button>
          )}
        </div>
      )}

      {/* Workspace Roles Panel */}
      <div className="bg-[#FFFFFF] border-2 border-[#171717] shadow-[4px_4px_0_#171717] overflow-hidden">
        <div className="flex items-center gap-3 p-5 border-b-2 border-[#171717] bg-[#EAE6DC]">
          <Shield className="w-4 h-4 text-[#171717]" />
          <h3 className="text-sm font-extrabold text-[#171717] uppercase tracking-widest">
            Workspace Roles
          </h3>
        </div>
        <p className="text-xs text-[#555555] font-semibold px-5 pt-4 pb-2">
          Standard permissions for team members in this workspace.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y-2 sm:divide-y-0 sm:divide-x-2 divide-[#171717] border-t-2 border-[#171717]">
          <div className="p-5 bg-[#FFD84D]/20">
            <span className="text-xs font-extrabold text-[#171717] block mb-1 uppercase tracking-wider">Lead / Owner</span>
            <p className="text-xs text-[#555555] font-semibold">Can manage workspace settings, invite members, and configure project boards.</p>
          </div>
          <div className="p-5">
            <span className="text-xs font-extrabold text-[#171717] block mb-1 uppercase tracking-wider">Team Member</span>
            <p className="text-xs text-[#555555] font-semibold">Can create and edit task notes across columns on the Kanban board.</p>
          </div>
        </div>
      </div>

      {/* Invite Member Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={closeInviteModal}
        title="Invite Team Member"
        description="Add a collaborator to this workspace."
        size="md"
        footer={
          <>
            <Button variant="outline" size="md" onClick={closeInviteModal}>Cancel</Button>
            <Button variant="primary" size="md" onClick={handleInvite}>Send Invite</Button>
          </>
        }
      >
        <form onSubmit={handleInvite} className="flex flex-col gap-4">
          <Input
            label="Full Name"
            placeholder="e.g. Anushka"
            value={inviteName}
            onChange={(e) => setInviteName(e.target.value)}
          />

          <Input
            label="Email Address"
            type="email"
            required
            placeholder="teammate@university.edu"
            leftIcon={<Mail className="w-4 h-4" />}
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-extrabold uppercase tracking-widest text-[#171717]">Role</label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="w-full bg-[#FFFFFF] text-sm text-[#171717] border-2 border-[#171717] p-2.5 outline-none focus:shadow-[2px_2px_0_#FFD84D] transition-all"
            >
              <option value="Member">Team Member</option>
              <option value="Lead">Co-Lead</option>
              <option value="Viewer">Observer</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
}
