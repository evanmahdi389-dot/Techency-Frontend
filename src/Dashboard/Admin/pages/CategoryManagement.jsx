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
    <div className="pb-10">
      <Toaster position="top-center" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Category Management</h1>
          <p className="text-gray-500 text-sm mt-1">
            {currentTab === 'main' ? 'Manage main categories' : 'Manage sub categories'}
          </p>
        </div>
        
        <button
          onClick={() => currentTab === 'main' ? setIsMainModalOpen(true) : setIsSubModalOpen(true)}
          className="px-6 py-2 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
        >
          <FiPlus className="w-4 h-4" /> Add New
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-7 h-7 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {currentTab === 'main' && (
            <div className="bg-[#0e0e0e] border border-white/5 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/5">
                      <th className="px-6 py-4 text-sm font-semibold text-white">ID</th>
                      <th className="px-6 py-4 text-sm font-semibold text-white">Category name</th>
                      <th className="px-6 py-4 text-sm font-semibold text-white">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="px-6 py-8 text-center text-gray-500 text-sm">
                          No main categories found. Click Add New to create one.
                        </td>
                      </tr>
                    ) : (
                      categories.map((cat, idx) => (
                        <tr key={cat._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-300">{idx + 1}</td>
                          <td className="px-6 py-4 text-sm text-white font-medium">{cat.name}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <button className="text-gray-400 hover:text-white transition-colors">
                                <FiEye className="w-4 h-4" />
                              </button>
                              <button onClick={() => openEditModal(cat)} className="text-gray-400 hover:text-white transition-colors">
                                <FiEdit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => confirmDelete('main', cat._id)}
                                className="text-red-500 hover:text-red-400 transition-colors"
                              >
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
            <div className="space-y-8">
              {/* Subcategories List Table */}
              <div className="bg-[#0e0e0e] border border-white/5 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/5">
                        <th className="px-6 py-4 text-sm font-semibold text-white">Main Category</th>
                        <th className="px-6 py-4 text-sm font-semibold text-white">Sub Categories</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.length === 0 ? (
                        <tr>
                          <td colSpan="2" className="px-6 py-8 text-center text-gray-500 text-sm">
                            No categories available.
                          </td>
                        </tr>
                      ) : (
                        categories.map((cat) => (
                          <tr key={cat._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 text-sm text-white font-medium">{cat.name}</td>
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-2">
                                {cat.subcategories?.length > 0 ? (
                                  cat.subcategories.map(sub => (
                                    <div key={sub} className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-full px-3 py-1.5 text-xs text-gray-300">
                                      {sub}
                                      <div className="flex items-center gap-1.5 ml-1">
                                        <button onClick={() => openEditSubModal(cat._id, sub)} className="text-gray-400 hover:text-white transition-colors">
                                          <FiEdit className="w-3 h-3" />
                                        </button>
                                        <button onClick={() => confirmDelete('sub', cat._id, sub)} className="text-red-500 hover:text-red-400 transition-colors">
                                          <FiTrash2 className="w-3 h-3" />
                                        </button>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <span className="text-xs text-gray-500">None</span>
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
            </div>
          )}
        </>
      )}

      {/* Main Category Modal */}
      {isMainModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl relative">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <h2 className="text-white font-semibold text-lg">Add Main Category</h2>
              <button 
                onClick={() => setIsMainModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              <label className="block text-sm text-white font-medium mb-3">Name</label>
              <input
                type="text"
                value={newCatName}
                onChange={e => setNewCatName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && createCategory()}
                placeholder="Main category name"
                className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-all mb-6"
                autoFocus
              />
              <div className="flex justify-end">
                <button
                  onClick={createCategory}
                  disabled={creating}
                  className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-red-500/20"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl relative">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <h2 className="text-white font-semibold text-lg">Edit Main Category</h2>
              <button 
                onClick={() => setIsEditMainModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              <label className="block text-sm text-white font-medium mb-3">Name</label>
              <input
                type="text"
                value={editCatName}
                onChange={e => setEditCatName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && updateCategory()}
                placeholder="Main category name"
                className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-all mb-6"
                autoFocus
              />
              <div className="flex justify-end">
                <button
                  onClick={updateCategory}
                  disabled={creating}
                  className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-red-500/20"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl relative">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <h2 className="text-white font-semibold text-lg">Add Sub Category</h2>
              <button 
                onClick={() => setIsSubModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              <label className="block text-sm text-white font-medium mb-3">Select Main Category</label>
              <select
                value={selectedMainCat}
                onChange={(e) => setSelectedMainCat(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-all mb-4"
              >
                <option value="">-- Choose Category --</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>

              <label className="block text-sm text-white font-medium mb-3">Sub Category Name</label>
              <input
                type="text"
                value={newSubName}
                onChange={e => setNewSubName(e.target.value)}
                placeholder="e.g. Graphic Design"
                className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-all mb-6"
              />
              <div className="flex justify-end">
                <button
                  onClick={addSubcategory}
                  disabled={creating}
                  className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-red-500/20"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl relative">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <h2 className="text-white font-semibold text-lg">Edit Sub Category</h2>
              <button 
                onClick={() => setIsEditSubModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              <label className="block text-sm text-white font-medium mb-3">Sub Category Name</label>
              <input
                type="text"
                value={editSubNewName}
                onChange={e => setEditSubNewName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && updateSubcategory()}
                placeholder="Sub category name"
                className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-all mb-6"
                autoFocus
              />
              <div className="flex justify-end">
                <button
                  onClick={updateSubcategory}
                  disabled={creating}
                  className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-red-500/20"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl relative">
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4">
                <FiTrash2 className="w-8 h-8" />
              </div>
              <h2 className="text-white font-semibold text-xl mb-2">Are you sure?</h2>
              <p className="text-gray-400 text-sm mb-6">
                {deleteConfig.type === 'main' 
                  ? "Do you really want to delete this main category and all its subcategories? This process cannot be undone."
                  : `Do you really want to delete the subcategory "${deleteConfig.subName}"? This process cannot be undone.`}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={executeDelete}
                  disabled={creating}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-red-500/20"
                >
                  {creating ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
