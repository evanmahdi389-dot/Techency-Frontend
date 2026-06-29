import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { FiPlus, FiX, FiSearch, FiEdit2, FiTrash2, FiAlertCircle } from 'react-icons/fi';

export default function OrderSourceManagement() {
  const [settings, setSettings] = useState({ orderSources: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Add/Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [itemInput, setItemInput] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings/dynamic');
      setSettings(res.data || { orderSources: [] });
    } catch (err) { toast.error('Failed to load order sources'); }
    finally { setLoading(false); }
  };

  const openAddModal = () => {
    setModalMode('add'); setItemInput(''); setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setModalMode('edit'); setEditingItem(item); setItemInput(item); setIsModalOpen(true);
  };

  const handleSaveModal = async () => {
    const val = itemInput.trim().toLowerCase();
    if (!val) { toast.error('Order Source cannot be empty'); return; }

    const currentSources = settings.orderSources || [];
    let newSources;

    if (modalMode === 'add') {
      if (currentSources.includes(val)) return toast.error('Order Source already exists');
      newSources = [...currentSources, val];
    } else if (modalMode === 'edit') {
      if (val !== editingItem && currentSources.includes(val)) return toast.error('Order Source already exists');
      newSources = currentSources.map(i => (i === editingItem ? val : i));
    }

    setSaving(true);
    try {
      const res = await api.get('/settings/dynamic');
      const updatedSettings = { ...(res.data || {}), orderSources: newSources };
      await api.put('/settings/dynamic', updatedSettings);
      setSettings(updatedSettings);
      toast.success(modalMode === 'add' ? 'Order Source added!' : 'Order Source updated!');
      setIsModalOpen(false); setItemInput('');
    } catch (err) { toast.error('Failed to save Order Source'); }
    finally { setSaving(false); }
  };

  const confirmDelete = (item) => {
    setItemToDelete(item); setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    const currentSources = settings.orderSources || [];
    const newSources = currentSources.filter(i => i !== itemToDelete);

    setSaving(true);
    try {
      const res = await api.get('/settings/dynamic');
      const updatedSettings = { ...(res.data || {}), orderSources: newSources };
      await api.put('/settings/dynamic', updatedSettings);
      setSettings(updatedSettings);
      toast.success('Order Source deleted!');
      setIsDeleteModalOpen(false); setItemToDelete(null);
    } catch (err) { toast.error('Failed to delete Order Source'); }
    finally { setSaving(false); }
  };

  const filteredItems = (settings.orderSources || []).filter(item => item.toLowerCase().includes(searchQuery.toLowerCase()));

  if (loading) return <div className="flex justify-center py-16"><div className="w-7 h-7 border-2 border-[#002546] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="flex flex-col h-full font-sans text-[#002546] pb-10">
      <Toaster position="top-center" />

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-[26px] font-extrabold tracking-tight text-[#002546]">Order Sources</h1>
          <p className="text-[#A3AED0] font-bold text-sm mt-1">Manage global order source types (e.g. Instagram, WhatsApp)</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A3AED0] w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-slate-200 rounded-[10px] pl-10 pr-4 py-2.5 text-sm text-[#002546] font-medium placeholder-[#A3AED0] focus:outline-none focus:ring-2 focus:ring-[#002546]/20 focus:border-[#002546] w-full sm:w-64 transition-all shadow-sm"
            />
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#002546] to-[#00478A] hover:shadow-lg hover:-translate-y-0.5 text-white text-sm font-semibold rounded-[10px] transition-all shadow-[0px_8px_20px_rgba(0,37,70,0.15)]"
          >
            <FiPlus className="w-4 h-4" /> Add New
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
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-[#A3AED0] border-b border-[#F4F7FE]">ID</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-[#A3AED0] text-center border-b border-[#F4F7FE]">Order Source</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-[#A3AED0] text-center border-b border-[#F4F7FE]">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#F4F7FE]/50 transition-colors group">
                    <td className="px-6 py-4 text-[#A3AED0] font-bold">#{String(idx + 1).padStart(3, '0')}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="capitalize font-bold text-[#002546] bg-[#F4F7FE] px-4 py-1.5 rounded-full shadow-sm border border-slate-100">
                        {item}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center flex flex-row justify-center gap-3">
                      <button
                        onClick={() => openEditModal(item)}
                        className="w-9 h-9 rounded-[10px] bg-[#F4F7FE] hover:bg-indigo-50 border border-slate-100 flex items-center justify-center text-indigo-600 hover:shadow-sm transition-all"
                        title="Edit Source"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => confirmDelete(item)}
                        className="w-9 h-9 rounded-[10px] bg-red-50 hover:bg-red-100 border border-red-100 flex items-center justify-center text-red-500 hover:shadow-sm transition-all"
                        title="Delete Source"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-10 text-center font-bold text-[#A3AED0]">No order sources found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#002546]/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-100 rounded-[20px] p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[#002546] font-extrabold text-[20px]">
                {modalMode === 'add' ? 'Add Order Source' : 'Edit Order Source'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#A3AED0] hover:text-red-500 bg-[#F4F7FE] p-2 rounded-full transition-colors">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-6">
              <label className="block text-xs text-[#A3AED0] font-bold mb-2 uppercase tracking-wider">Source Name</label>
              <input
                type="text"
                value={itemInput}
                onChange={e => setItemInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !saving && handleSaveModal()}
                placeholder="e.g. instagram"
                disabled={saving}
                className="w-full bg-[#F4F7FE] border border-slate-200 rounded-[12px] px-5 py-4 text-sm text-[#002546] font-medium placeholder-[#A3AED0] focus:outline-none focus:ring-2 focus:ring-[#002546]/20 focus:border-[#002546] transition-all disabled:opacity-50"
                autoFocus
              />
            </div>
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={saving}
                className="flex-1 py-4 rounded-[12px] border border-slate-200 text-[#002546] font-bold hover:bg-[#F4F7FE] text-sm transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveModal}
                disabled={saving}
                className="flex-1 py-4 rounded-[12px] bg-gradient-to-r from-[#002546] to-[#00478A] hover:shadow-lg text-white text-sm font-bold transition-all disabled:opacity-60"
              >
                {saving ? 'Saving...' : (modalMode === 'add' ? 'Save' : 'Update')}
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
            <h3 className="text-[20px] font-extrabold text-[#002546] mb-2">Delete Source?</h3>
            <p className="text-sm text-[#A3AED0] font-medium mb-8">
              Are you sure you want to delete <span className="text-[#002546] font-bold capitalize">"{itemToDelete}"</span>? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={saving}
                className="flex-1 py-4 rounded-[12px] border border-slate-200 text-[#002546] font-bold hover:bg-[#F4F7FE] text-sm transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={saving}
                className="flex-1 py-4 rounded-[12px] bg-red-600 hover:bg-red-500 hover:shadow-lg text-white text-sm font-bold transition-all disabled:opacity-50"
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
