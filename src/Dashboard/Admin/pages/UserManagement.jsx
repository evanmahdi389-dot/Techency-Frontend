import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { FiPlus, FiTrash2, FiEdit2, FiX, FiUser } from 'react-icons/fi';

const ROLE_COLORS = {
  admin: 'text-red-400 bg-red-500/10 border-red-500/20',
  editor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  sales: 'text-green-400 bg-green-500/10 border-green-500/20',
};

const DEFAULT_FORM = { name: '', email: '', password: '', role: 'editor' };

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data.data || []);
    } catch { toast.error('Failed to fetch users'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const openCreate = () => { setForm(DEFAULT_FORM); setEditUser(null); setShowModal(true); };
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
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success('User deleted');
      fetchUsers();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  return (
    <div>
      <Toaster position="top-center" />
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage team members — editors, sales, admins</p>
        </div>
        <button
          onClick={openCreate}
          id="create-user-btn"
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-red-500/20"
        >
          <FiPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-7 h-7 border-2 border-red-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : users.length === 0 ? (
        <div className="text-center py-16 text-gray-500">No users found</div>
      ) : (
        <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs text-gray-500 font-medium uppercase tracking-wider px-5 py-4">User</th>
                <th className="text-left text-xs text-gray-500 font-medium uppercase tracking-wider px-5 py-4">Role</th>
                <th className="text-left text-xs text-gray-500 font-medium uppercase tracking-wider px-5 py-4 hidden md:table-cell">Joined</th>
                <th className="text-right text-xs text-gray-500 font-medium uppercase tracking-wider px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map(user => (
                <tr key={user._id} className="hover:bg-white/2 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {user.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{user.name}</p>
                        <p className="text-gray-500 text-xs">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full border capitalize ${ROLE_COLORS[user.role]}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell text-gray-500 text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(user)}
                        className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                      >
                        <FiEdit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 transition-all"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-[#151515] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold text-lg">{editUser ? 'Edit User' : 'New User'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white transition-colors">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Full Name', key: 'name', type: 'text', placeholder: 'John Doe' },
                { label: 'Email', key: 'email', type: 'email', placeholder: 'john@techency.com' },
                { label: editUser ? 'New Password (leave blank to keep)' : 'Password', key: 'password', type: 'password', placeholder: '••••••••' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs text-gray-400 font-medium mb-1.5">{label}</label>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-all"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs text-gray-400 font-medium mb-1.5">Role</label>
                <select
                  value={form.role}
                  onChange={e => setForm(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 transition-all"
                >
                  <option value="editor">Editor</option>
                  <option value="sales">Sales Executive</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white text-sm transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white text-sm font-medium transition-all disabled:opacity-60"
              >
                {saving ? '...' : editUser ? 'Save Changes' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
