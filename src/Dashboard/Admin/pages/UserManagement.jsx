import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { FiPlus, FiTrash2, FiEdit2, FiX, FiUser } from 'react-icons/fi';
import { FaUserCircle } from "react-icons/fa";

const DEFAULT_FORM = { name: '', email: '', password: '', role: 'editor' };

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState(['admin', 'editor', 'sales', 'pm', 'writer']);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);

  const getRoleColor = (role) => {
    const colors = {
      admin: 'text-red-600 bg-red-50 border-red-200',
      editor: 'text-blue-600 bg-blue-50 border-blue-200',
      sales: 'text-green-600 bg-green-50 border-green-200',
      pm: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      writer: 'text-orange-600 bg-orange-50 border-orange-200',
    };
    return colors[role?.toLowerCase()] || 'text-gray-600 bg-gray-50 border-gray-200'; // Fallback
  };

  const fetchData = async () => {
    try {
      const [usersRes, settingsRes] = await Promise.all([
        api.get('/users'),
        api.get('/settings').catch(() => ({ data: { roles: [] } }))
      ]);
      setUsers(usersRes.data.data || []);
      if (settingsRes.data?.roles?.length > 0) {
        setRoles(settingsRes.data.roles);
      }
    } catch { toast.error('Failed to fetch data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setForm({ ...DEFAULT_FORM, role: roles[0] || 'editor' }); setEditUser(null); setShowModal(true); };
  const openEdit = (user) => {
    setForm({ name: user.name, email: user.email, password: '', role: user.role });
    setEditUser(user);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.email || (!editUser && !form.password)) {
      return toast.error('Please fill all required fields');
    }
    setSaving(true);
    try {
      if (editUser) {
        const updateData = { name: form.name, email: form.email, role: form.role };
        if (form.password) updateData.password = form.password;
        await api.put(`/users/${editUser._id}`, updateData);
        toast.success('User updated!');
      } else {
        await api.post('/users', form);
        toast.success('User created!');
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success('User deleted');
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  return (
    <div className="font-sans text-[#002546]">
      <Toaster position="top-center" />
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[26px] font-extrabold tracking-tight">User Management</h1>
        </div>
        <button
          onClick={openCreate}
          id="create-user-btn"
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#002546] to-[#00478A] hover:shadow-lg hover:-translate-y-0.5 text-white text-sm font-semibold rounded-[10px] transition-all shadow-[0px_8px_20px_rgba(0,37,70,0.15)]"
        >
          <FiPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-7 h-7 border-2 border-[#002546] border-t-transparent rounded-full animate-spin" /></div>
      ) : users.length === 0 ? (
        <div className="text-center py-16 text-[#A3AED0] font-bold">No users found</div>
      ) : (
        <div className="bg-white rounded-[6px] shadow-[0px_12px_28px_rgba(0,37,70,0.08)] border border-white overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50/50 pointer-events-none"></div>
          <div className="overflow-x-auto relative z-10">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className=' bg-[#1a3b59]'>
                  <th className="text-left text-xs text-[#A3AED0] font-bold uppercase tracking-wider px-6 py-4 border-b border-[#F4F7FE]">User</th>
                  <th className="text-left text-xs text-[#A3AED0] font-bold uppercase tracking-wider px-6 py-4 border-b border-[#F4F7FE]">Role</th>
                  <th className="text-left text-xs text-[#A3AED0] font-bold uppercase tracking-wider px-6 py-4 hidden md:table-cell border-b border-[#F4F7FE]">Joined</th>
                  <th className="text-right text-xs text-[#A3AED0] font-bold uppercase tracking-wider px-6 py-4 border-b border-[#F4F7FE]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id} className="hover:bg-[#F4F7FE]/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#F4F7FE] flex items-center justify-center text-[#002546] font-bold text-sm shadow-sm border border-white">
                          <FaUserCircle className='text-[30px]' />
                        </div>
                        <div>
                          <p className="text-[#002546] text-sm font-bold">{user.name}</p>
                          <p className="text-[#A3AED0] text-xs font-semibold">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full capitalize shadow-sm ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell text-[#A3AED0] text-sm font-bold">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => openEdit(user)}
                          className="w-9 h-9 rounded-[10px] bg-[#F4F7FE] hover:bg-indigo-50 border border-slate-100 flex items-center justify-center text-indigo-600 hover:shadow-sm transition-all"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="w-9 h-9 rounded-[10px] bg-red-50 hover:bg-red-100 border border-red-100 flex items-center justify-center text-red-500 hover:shadow-sm transition-all"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[#002546]/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white border border-slate-100 rounded-[20px] p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[#002546] font-extrabold text-[20px]">{editUser ? 'Edit User' : 'New User'}</h3>
              <button onClick={() => setShowModal(false)} className="text-[#A3AED0] hover:text-red-500 bg-[#F4F7FE] p-2 rounded-full transition-colors">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-5">
              {[
                { label: 'Full Name', key: 'name', type: 'text', placeholder: 'John Doe' },
                { label: 'Email', key: 'email', type: 'email', placeholder: 'john@techency.com' },
                { label: editUser ? 'New Password (leave blank to keep)' : 'Password', key: 'password', type: 'password', placeholder: '••••••••' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs text-[#A3AED0] font-bold mb-2 uppercase tracking-wider">{label}</label>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full bg-[#F4F7FE] border border-slate-200 rounded-[12px] px-5 py-3 text-sm text-[#002546] font-medium placeholder-[#A3AED0] focus:outline-none focus:ring-2 focus:ring-[#002546]/20 focus:border-[#002546] transition-all"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs text-[#A3AED0] font-bold mb-2 uppercase tracking-wider">Role</label>
                <select
                  value={form.role}
                  onChange={e => setForm(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full bg-[#F4F7FE] border border-slate-200 rounded-[12px] px-5 py-3 text-sm text-[#002546] font-medium focus:outline-none focus:ring-2 focus:ring-[#002546]/20 focus:border-[#002546] transition-all capitalize"
                >
                  {roles.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-[12px] border border-slate-200 text-[#002546] font-bold hover:bg-[#F4F7FE] text-sm transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-3 rounded-[12px] bg-gradient-to-r from-[#002546] to-[#00478A] hover:shadow-lg text-white text-sm font-bold transition-all disabled:opacity-60"
              >
                {saving ? 'Saving...' : editUser ? 'Save Changes' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
