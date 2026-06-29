import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { FiPlus, FiTrash2, FiEye, FiEdit, FiX } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab') || 'main';

  // Main Category Modal State
  const [isMainModalOpen, setIsMainModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  // Edit Main Category Modal State
  const [isEditMainModalOpen, setIsEditMainModalOpen] = useState(false);
  const [editCatId, setEditCatId] = useState(null);
  const [editCatName, setEditCatName] = useState('');

  const [creating, setCreating] = useState(false);

  // Sub Category form state
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [selectedMainCat, setSelectedMainCat] = useState('');
  const [newSubName, setNewSubName] = useState('');

  // Edit Sub Category Modal State
  const [isEditSubModalOpen, setIsEditSubModalOpen] = useState(false);
  const [editSubMainCatId, setEditSubMainCatId] = useState('');
  const [editSubOldName, setEditSubOldName] = useState('');
  const [editSubNewName, setEditSubNewName] = useState('');

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfig, setDeleteConfig] = useState({ type: null, catId: null, subName: null });

  const fetchCategories = async () => {
    try {
      const res = await api.get('/category');
      setCategories(res.data.data || []);
    } catch { toast.error('Failed to fetch categories'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCategories(); }, []);

  const createCategory = async () => {
    if (!newCatName.trim()) return;
    setCreating(true);
    try {
      await api.post('/category', { name: newCatName.trim() });
      toast.success('Category created!');
      setNewCatName('');
      setIsMainModalOpen(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create category');
    } finally { setCreating(false); }
  };

  const updateCategory = async () => {
    if (!editCatName.trim()) return;
    setCreating(true);
    try {
      await api.put(`/category/${editCatId}`, { name: editCatName.trim() });
      toast.success('Category updated!');
      setIsEditMainModalOpen(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update category');
    } finally { setCreating(false); }
  };

  const addSubcategory = async (e) => {
    if (e) e.preventDefault();
    if (!selectedMainCat) return toast.error('Please select a main category');
    if (!newSubName.trim()) return toast.error('Please enter sub category name');

    setCreating(true);
    try {
      await api.post(`/category/${selectedMainCat}/subcategory`, { subcategory: newSubName.trim() });
      toast.success('Subcategory added!');
      setNewSubName('');
      setIsSubModalOpen(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add subcategory');
    } finally {
      setCreating(false);
    }
  };

  const updateSubcategory = async (e) => {
    if (e) e.preventDefault();
    if (!editSubNewName.trim()) return toast.error('Please enter new sub category name');
    setCreating(true);
    try {
      await api.put(`/category/${editSubMainCatId}/subcategory`, {
        oldSubcategory: editSubOldName,
        newSubcategory: editSubNewName.trim()
      });
      toast.success('Subcategory updated!');
      setIsEditSubModalOpen(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update subcategory');
    } finally {
      setCreating(false);
    }
  };

  const confirmDelete = (type, catId, subName = null) => {
    setDeleteConfig({ type, catId, subName });
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    setCreating(true);
    try {
      if (deleteConfig.type === 'main') {
        await api.delete(`/category/${deleteConfig.catId}`);
        toast.success('Category deleted');
      } else if (deleteConfig.type === 'sub') {
        await api.delete(`/category/${deleteConfig.catId}/subcategory`, { data: { subcategory: deleteConfig.subName } });
        toast.success('Subcategory removed');
      }
      setIsDeleteModalOpen(false);
      fetchCategories();
    } catch {
      toast.error(deleteConfig.type === 'main' ? 'Failed to delete category' : 'Failed to remove subcategory');
    } finally {
      setCreating(false);
    }
  };

  const openEditModal = (cat) => {
    setEditCatId(cat._id);
    setEditCatName(cat.name);
    setIsEditMainModalOpen(true);
  };

  const openEditSubModal = (catId, subName) => {
    setEditSubMainCatId(catId);
    setEditSubOldName(subName);
    setEditSubNewName(subName);
    setIsEditSubModalOpen(true);
  };

  return (
    <div className="pb-10 font-sans text-[#002546]">
      <Toaster position="top-center" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[26px] font-extrabold tracking-tight">Category Management</h1>
          <p className="text-[#A3AED0] font-bold text-sm mt-1">
            {currentTab === 'main' ? 'Manage main categories' : 'Manage sub categories'}
          </p>
        </div>

        <button
          onClick={() => currentTab === 'main' ? setIsMainModalOpen(true) : setIsSubModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#002546] to-[#00478A] hover:shadow-lg hover:-translate-y-0.5 text-white text-sm font-semibold rounded-[10px] transition-all shadow-[0px_8px_20px_rgba(0,37,70,0.15)]"
        >
          <FiPlus className="w-4 h-4" /> Add New
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-7 h-7 border-2 border-[#002546] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {currentTab === 'main' && (
            <div className="bg-white rounded-[6px] shadow-[0px_12px_28px_rgba(0,37,70,0.08)] border border-white overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50/50 pointer-events-none"></div>
              <div className="overflow-x-auto relative z-10 ">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className=' bg-[#1a3b59]'>
                      <th className="px-6 py-4 text-xs font-bold text-[#A3AED0] uppercase tracking-wider border-b border-[#F4F7FE]">ID</th>
                      <th className="px-6 py-4 text-xs font-bold text-[#A3AED0] uppercase tracking-wider border-b border-[#F4F7FE]">Category name</th>
                      <th className="px-6 py-4 text-xs font-bold text-[#A3AED0] uppercase tracking-wider border-b border-[#F4F7FE] text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="px-6 py-10 text-center font-bold text-[#A3AED0]">
                          No main categories found. Click Add New to create one.
                        </td>
                      </tr>
                    ) : (
                      categories.map((cat, idx) => (
                        <tr key={cat._id} className="hover:bg-[#F4F7FE]/50 transition-colors group">
                          <td className="px-6 py-3 text-sm font-bold text-[#A3AED0]">{idx + 1}</td>
                          <td className="px-6 py-3 text-sm font-bold text-[#002546]">{cat.name}</td>
                          <td className="px-6 py-3">
                            <div className="flex items-center justify-end gap-3">
                              <button onClick={() => openEditModal(cat)} className="w-9 h-9 rounded-[10px] bg-[#F4F7FE] hover:bg-indigo-50 border border-slate-100 flex items-center justify-center text-indigo-600 hover:shadow-sm transition-all">
                                <FiEdit className="w-4 h-4" />
                              </button>
                              <button onClick={() => confirmDelete('main', cat._id)} className="w-9 h-9 rounded-[10px] bg-red-50 hover:bg-red-100 border border-red-100 flex items-center justify-center text-red-500 hover:shadow-sm transition-all">
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {currentTab === 'sub' && (
            <div className="bg-white rounded-[6px] shadow-[0px_12px_28px_rgba(0,37,70,0.08)] border border-white overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50/50 pointer-events-none"></div>
              <div className="overflow-x-auto relative z-10">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className=' bg-[#1a3b59]'>
                      <th className="px-6 py-4 text-xs font-bold text-[#A3AED0] uppercase tracking-wider border-b border-[#F4F7FE] w-1/3">Main Category</th>
                      <th className="px-6 py-4 text-xs font-bold text-[#A3AED0] uppercase tracking-wider border-b border-[#F4F7FE]">Sub Categories</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.length === 0 ? (
                      <tr>
                        <td colSpan="2" className="px-6 py-10 text-center font-bold text-[#A3AED0]">
                          No categories available.
                        </td>
                      </tr>
                    ) : (
                      categories.map((cat) => (
                        <tr key={cat._id} className="hover:bg-[#F4F7FE]/50 transition-colors group">
                          <td className="px-6 py-4 text-sm font-bold text-[#002546] border-b border-[#F4F7FE]">{cat.name}</td>
                          <td className="px-6 py-4 border-b border-[#F4F7FE]">
                            <div className="flex flex-wrap gap-3">
                              {cat.subcategories?.length > 0 ? (
                                cat.subcategories.map(sub => (
                                  <div key={sub} className="flex items-center gap-3 bg-white border border-slate-200 rounded-[8px] px-3 py-1.5 text-xs text-[#002546] font-bold shadow-sm">
                                    {sub}
                                    <div className="flex items-center gap-1.5 ml-1">
                                      <button onClick={() => openEditSubModal(cat._id, sub)} className="text-[#A3AED0] hover:text-indigo-600 transition-colors">
                                        <FiEdit className="w-3.5 h-3.5" />
                                      </button>
                                      <button onClick={() => confirmDelete('sub', cat._id, sub)} className="text-[#A3AED0] hover:text-red-500 transition-colors">
                                        <FiTrash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <span className="text-xs font-bold text-[#A3AED0]">None</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Main Category Modal */}
      {isMainModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#002546]/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-100 rounded-[20px] w-full max-w-md shadow-2xl relative p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[20px] font-extrabold text-[#002546]">Add Main Category</h2>
              <button
                onClick={() => setIsMainModalOpen(false)}
                className="text-[#A3AED0] hover:text-red-500 bg-[#F4F7FE] p-2 rounded-full transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div>
              <label className="block text-xs text-[#A3AED0] font-bold mb-2 uppercase tracking-wider">Name</label>
              <input
                type="text"
                value={newCatName}
                onChange={e => setNewCatName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && createCategory()}
                placeholder="Main category name"
                className="w-full bg-[#F4F7FE] border border-slate-200 rounded-[12px] px-5 py-3 text-sm text-[#002546] font-medium placeholder-[#A3AED0] focus:outline-none focus:ring-2 focus:ring-[#002546]/20 focus:border-[#002546] transition-all mb-8"
                autoFocus
              />
              <div className="flex justify-end">
                <button
                  onClick={createCategory}
                  disabled={creating}
                  className="w-full py-3 bg-gradient-to-r from-[#002546] to-[#00478A] hover:shadow-lg text-white text-sm font-bold rounded-[12px] transition-all disabled:opacity-60"
                >
                  {creating ? 'Saving...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Main Category Modal */}
      {isEditMainModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#002546]/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-100 rounded-[20px] w-full max-w-md shadow-2xl relative p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[20px] font-extrabold text-[#002546]">Edit Main Category</h2>
              <button
                onClick={() => setIsEditMainModalOpen(false)}
                className="text-[#A3AED0] hover:text-red-500 bg-[#F4F7FE] p-2 rounded-full transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div>
              <label className="block text-xs text-[#A3AED0] font-bold mb-2 uppercase tracking-wider">Name</label>
              <input
                type="text"
                value={editCatName}
                onChange={e => setEditCatName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && updateCategory()}
                placeholder="Main category name"
                className="w-full bg-[#F4F7FE] border border-slate-200 rounded-[12px] px-5 py-3 text-sm text-[#002546] font-medium placeholder-[#A3AED0] focus:outline-none focus:ring-2 focus:ring-[#002546]/20 focus:border-[#002546] transition-all mb-8"
                autoFocus
              />
              <div className="flex justify-end">
                <button
                  onClick={updateCategory}
                  disabled={creating}
                  className="w-full py-3 bg-gradient-to-r from-[#002546] to-[#00478A] hover:shadow-lg text-white text-sm font-bold rounded-[12px] transition-all disabled:opacity-60"
                >
                  {creating ? 'Updating...' : 'Update'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub Category Modal */}
      {isSubModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#002546]/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-100 rounded-[20px] w-full max-w-md shadow-2xl relative p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[20px] font-extrabold text-[#002546]">Add Sub Category</h2>
              <button
                onClick={() => setIsSubModalOpen(false)}
                className="text-[#A3AED0] hover:text-red-500 bg-[#F4F7FE] p-2 rounded-full transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div>
              <label className="block text-xs text-[#A3AED0] font-bold mb-2 uppercase tracking-wider">Select Main Category</label>
              <select
                value={selectedMainCat}
                onChange={(e) => setSelectedMainCat(e.target.value)}
                className="w-full bg-[#F4F7FE] border border-slate-200 rounded-[12px] px-5 py-3 text-sm text-[#002546] font-medium focus:outline-none focus:ring-2 focus:ring-[#002546]/20 focus:border-[#002546] transition-all mb-5"
              >
                <option value="">-- Choose Category --</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>

              <label className="block text-xs text-[#A3AED0] font-bold mb-2 uppercase tracking-wider">Sub Category Name</label>
              <input
                type="text"
                value={newSubName}
                onChange={e => setNewSubName(e.target.value)}
                placeholder="e.g. Graphic Design"
                className="w-full bg-[#F4F7FE] border border-slate-200 rounded-[12px] px-5 py-3 text-sm text-[#002546] font-medium placeholder-[#A3AED0] focus:outline-none focus:ring-2 focus:ring-[#002546]/20 focus:border-[#002546] transition-all mb-8"
              />
              <div className="flex justify-end">
                <button
                  onClick={addSubcategory}
                  disabled={creating}
                  className="w-full py-3 bg-gradient-to-r from-[#002546] to-[#00478A] hover:shadow-lg text-white text-sm font-bold rounded-[12px] transition-all disabled:opacity-60"
                >
                  {creating ? 'Saving...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Sub Category Modal */}
      {isEditSubModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#002546]/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-100 rounded-[20px] w-full max-w-md shadow-2xl relative p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[20px] font-extrabold text-[#002546]">Edit Sub Category</h2>
              <button
                onClick={() => setIsEditSubModalOpen(false)}
                className="text-[#A3AED0] hover:text-red-500 bg-[#F4F7FE] p-2 rounded-full transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div>
              <label className="block text-xs text-[#A3AED0] font-bold mb-2 uppercase tracking-wider">Sub Category Name</label>
              <input
                type="text"
                value={editSubNewName}
                onChange={e => setEditSubNewName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && updateSubcategory()}
                placeholder="Sub category name"
                className="w-full bg-[#F4F7FE] border border-slate-200 rounded-[12px] px-5 py-3 text-sm text-[#002546] font-medium placeholder-[#A3AED0] focus:outline-none focus:ring-2 focus:ring-[#002546]/20 focus:border-[#002546] transition-all mb-8"
                autoFocus
              />
              <div className="flex justify-end">
                <button
                  onClick={updateSubcategory}
                  disabled={creating}
                  className="w-full py-3 bg-gradient-to-r from-[#002546] to-[#00478A] hover:shadow-lg text-white text-sm font-bold rounded-[12px] transition-all disabled:opacity-60"
                >
                  {creating ? 'Updating...' : 'Update'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#002546]/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-100 rounded-[20px] w-full max-w-sm shadow-2xl relative p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 text-red-500 flex items-center justify-center mx-auto mb-4">
              <FiTrash2 className="w-8 h-8" />
            </div>
            <h2 className="text-[#002546] font-extrabold text-[20px] mb-2">Are you sure?</h2>
            <p className="text-[#A3AED0] font-medium text-sm mb-8">
              {deleteConfig.type === 'main'
                ? "Do you really want to delete this main category and all its subcategories? This process cannot be undone."
                : `Do you really want to delete the subcategory "${deleteConfig.subName}"? This process cannot be undone.`}
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-3 border border-slate-200 hover:bg-[#F4F7FE] text-[#002546] text-sm font-bold rounded-[12px] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                disabled={creating}
                className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-[12px] transition-all hover:shadow-lg disabled:opacity-60"
              >
                {creating ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
