import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { FiPlus, FiX, FiSearch, FiEdit2, FiTrash2, FiAlertCircle } from 'react-icons/fi';

export default function RoleManagement() {
  const [settings, setSettings] = useState({ roles: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Add/Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [roleInput, setRoleInput] = useState('');
  const [editingRole, setEditingRole] = useState(null);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings/dynamic');
      setSettings(res.data || { roles: [] });
    } catch (err) { toast.error('Failed to load roles'); }
    finally { setLoading(false); }
  };

  const openAddModal = () => {
    setModalMode('add'); setRoleInput(''); setIsModalOpen(true);
  };

  const openEditModal = (role) => {
    setModalMode('edit'); setEditingRole(role); setRoleInput(role); setIsModalOpen(true);
  };

  const handleSaveModal = async () => {
    const val = roleInput.trim().toLowerCase();
    if (!val) { toast.error('Role name cannot be empty'); return; }

    let newRoles;
    if (modalMode === 'add') {
      if (settings.roles.includes(val)) return toast.error('Role already exists');
      newRoles = [...settings.roles, val];
    } else if (modalMode === 'edit') {
      if (val !== editingRole && settings.roles.includes(val)) return toast.error('Role already exists');
      newRoles = settings.roles.map(r => (r === editingRole ? val : r));
    }

    setSaving(true);
    try {
      const res = await api.get('/settings/dynamic');
      const updatedSettings = { ...(res.data || {}), roles: newRoles };
      await api.put('/settings/dynamic', updatedSettings);
      setSettings(updatedSettings);
      toast.success(modalMode === 'add' ? 'Role added successfully!' : 'Role updated successfully!');
      setIsModalOpen(false); setRoleInput('');
    } catch (err) { toast.error('Failed to save role'); }
    finally { setSaving(false); }
  };

  const confirmDelete = (role) => {
    if (role === 'admin') return toast.error('Cannot remove admin role');
    setRoleToDelete(role); setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!roleToDelete) return;
    const newRoles = settings.roles.filter(i => i !== roleToDelete);
    setSaving(true);
    try {
      const res = await api.get('/settings/dynamic');
      const updatedSettings = { ...(res.data || {}), roles: newRoles };
      await api.put('/settings/dynamic', updatedSettings);
      setSettings(updatedSettings);
      toast.success('Role deleted successfully!');
      setIsDeleteModalOpen(false); setRoleToDelete(null);
    } catch (err) { toast.error('Failed to delete role'); }
    finally { setSaving(false); }
  };

  const filteredRoles = settings.roles?.filter(role => role.toLowerCase().includes(searchQuery.toLowerCase())) || [];

  if (loading) return <div className="flex justify-center py-16"><div className="w-7 h-7 border-2 border-[#002546] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="flex flex-col h-full font-sans text-[#002546]">
      <Toaster position="top-center" />

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-[26px] font-extrabold tracking-tight text-[#002546]">Role Management</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A3AED0] w-4 h-4" />
            <input
              type="text"
              placeholder="Search roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-slate-200 rounded-[10px] pl-10 pr-4 py-2.5 text-sm text-[#002546] font-medium placeholder-[#A3AED0] focus:outline-none focus:ring-2 focus:ring-[#002546]/20 focus:border-[#002546] w-full sm:w-64 transition-all shadow-sm"
            />
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#002546] to-[#00478A] hover:shadow-lg hover:-translate-y-0.5 text-white text-sm font-semibold rounded-[10px] transition-all shadow-[0px_8px_20px_rgba(0,37,70,0.15)]"
          >
            <FiPlus className="w-4 h-4" /> Add New Role
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-[6px] shadow-[0px_12px_28px_rgba(0,37,70,0.08)] border border-white overflow-hidden relative flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50/50 pointer-events-none"></div>
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left text-sm whitespace-nowrap border-collapse">
            <thead>
              <tr className=' bg-[#1a3b59]'>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-[#A3AED0] border-b border-[#F4F7FE]">Role ID</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-[#A3AED0] text-center border-b border-[#F4F7FE]">Role Name</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-[#A3AED0] text-center border-b border-[#F4F7FE]">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoles.length > 0 ? (
                filteredRoles.map((role, idx) => (
                  <tr key={idx} className="hover:bg-[#F4F7FE]/50 transition-colors group">
                    <td className="px-6 py-3 text-[#A3AED0] font-bold">#{String(idx + 1).padStart(3, '0')}</td>
                    <td className="px-6 py-3 text-center">
                      <span className="capitalize font-bold text-[#002546] bg-[#F4F7FE] px-4 py-1.5 rounded-full shadow-sm border border-slate-100">
                        {role}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-center flex flex-row justify-center gap-3">
                      <button
                        onClick={() => openEditModal(role)}
                        className="w-9 h-9 rounded-[10px] bg-[#F4F7FE] hover:bg-indigo-50 border border-slate-100 flex items-center justify-center text-indigo-600 hover:shadow-sm transition-all"
                        title="Edit Role"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => confirmDelete(role)}
                        disabled={role === 'admin'}
                        className="w-9 h-9 rounded-[10px] bg-red-50 hover:bg-red-100 border border-red-100 flex items-center justify-center text-red-500 hover:shadow-sm disabled:opacity-30 transition-all"
                        title={role === 'admin' ? "Cannot remove admin role" : "Remove role"}
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-10 text-center font-bold text-[#A3AED0]">No roles found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Role Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#002546]/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-100 rounded-[20px] p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[#002546] font-extrabold text-[20px]">
                {modalMode === 'add' ? 'Add New Role' : 'Edit Role'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#A3AED0] hover:text-red-500 bg-[#F4F7FE] p-2 rounded-full transition-colors">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-6">
              <label className="block text-xs text-[#A3AED0] font-bold mb-2 uppercase tracking-wider">Role Name</label>
              <input
                type="text"
                value={roleInput}
                onChange={e => setRoleInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !saving && handleSaveModal()}
                placeholder="e.g. manager, analyst"
                disabled={saving}
                className="w-full bg-[#F4F7FE] border border-slate-200 rounded-[12px] px-5 py-3 text-sm text-[#002546] font-medium placeholder-[#A3AED0] focus:outline-none focus:ring-2 focus:ring-[#002546]/20 focus:border-[#002546] transition-all disabled:opacity-50"
                autoFocus
              />
            </div>
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={saving}
                className="flex-1 py-3 rounded-[12px] border border-slate-200 text-[#002546] font-bold hover:bg-[#F4F7FE] text-sm transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveModal}
                disabled={saving}
                className="flex-1 py-3 rounded-[12px] bg-gradient-to-r from-[#002546] to-[#00478A] hover:shadow-lg text-white text-sm font-bold transition-all disabled:opacity-60"
              >
                {saving ? 'Saving...' : (modalMode === 'add' ? 'Add Role' : 'Update Role')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#002546]/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-100 rounded-[20px] p-8 w-full max-w-sm shadow-2xl text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-50 border border-red-100 mb-4">
              <FiAlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-[20px] font-extrabold text-[#002546] mb-2">Delete Role?</h3>
            <p className="text-sm text-[#A3AED0] font-medium mb-8">
              Are you sure you want to delete the <span className="text-[#002546] font-bold capitalize">"{roleToDelete}"</span> role? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={saving}
                className="flex-1 py-3 rounded-[12px] border border-slate-200 text-[#002546] font-bold hover:bg-[#F4F7FE] text-sm transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={saving}
                className="flex-1 py-3 rounded-[12px] bg-red-600 hover:bg-red-500 hover:shadow-lg text-white text-sm font-bold transition-all disabled:opacity-50"
              >
                {saving ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
