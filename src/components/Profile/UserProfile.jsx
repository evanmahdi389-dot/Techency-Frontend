import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiCamera, FiSave, FiUser, FiMail, FiLock } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function UserProfile() {
  const { user, login } = useAuth(); // assuming login can update local context/token

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
  });

  const [imagePreview, setImagePreview] = useState(user?.profileImage || null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
      });
      setImagePreview(user.profileImage || null);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      if (formData.password) {
        data.append('password', formData.password);
      }
      if (selectedImage) {
        data.append('profileImage', selectedImage);
      }

      const token = localStorage.getItem('vam_token');
      const response = await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/profile`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      toast.success('Profile updated successfully');

      // Update local storage and context
      if (response.data.data) {
        const updatedUser = response.data.data;
        login(token, updatedUser); // Assuming token doesn't change, we just re-login with new user data
      }

      setFormData(prev => ({ ...prev, password: '' }));

    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-[#002546] to-[#013f77] h-32 relative">
          <h2 className="text-white text-2xl font-bold absolute bottom-4 left-6">My Profile</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="flex flex-col items-center -mt-20 mb-8 relative">
            <div className="relative group cursor-pointer">
              <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-100 shadow-md flex items-center justify-center">
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-5xl">{user?.name?.[0]?.toUpperCase()}</span>
                )}
              </div>

              <label className="absolute bottom-0 right-0 w-10 h-10 bg-[#013f77] rounded-full border-2 border-white flex items-center justify-center text-white cursor-pointer hover:bg-[#002546] transition-colors shadow-sm">
                <FiCamera className="w-5 h-5" />
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            </div>
            <p className="text-gray-500 text-sm mt-2">Click icon to change photo</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#013f77] focus:border-transparent outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#013f77] focus:border-transparent outline-none transition-all"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password <span className="text-xs text-gray-400 font-normal">(Leave blank to keep current)</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#013f77] focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-[#013f77] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#002546] transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <FiSave className="w-5 h-5" />
                )}
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
