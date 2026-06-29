import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { FiUpload, FiX, FiVideo, FiImage, FiSearch, FiEdit, FiEye, FiTrash2, FiCheck } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const STATUS_COLORS = {
  pending: 'text-amber-500 bg-amber-50 border-amber-200',
  approved: 'text-emerald-500 bg-emerald-50 border-emerald-200',
  rejected: 'text-red-500 bg-red-50 border-red-200',
};

export default function UploadCenter() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', category: '', subcategory: '', tags: '' });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [thumbnailProgress, setThumbnailProgress] = useState(0);
  const [uploadPhase, setUploadPhase] = useState(''); // 'uploading' | 'saving' | ''
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ id: '', title: '', description: '', category: '', subcategory: '', tags: '' });
  const [previewVideo, setPreviewVideo] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Table states
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteModal, setDeleteModal] = useState(null);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      const endpoint = user?.role === 'admin' ? '/videos' : '/videos/my-uploads';
      const res = await api.get(endpoint, { params });
      setVideos(res.data.data || []);
    } catch { toast.error('Failed to fetch videos'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    api.get('/category').then(res => setCategories(res.data.data || []));
  }, []);

  useEffect(() => { fetchVideos(); }, [search]);

  const selectedCat = categories.find(c => c.name === form.category);
  const selectedEditCat = categories.find(c => c.name === editForm.category);

  const handleVideoFile = (f) => {
    if (f && f.type.startsWith('video/')) setVideoFile(f);
    else toast.error('Please select a video file');
  };

  const handleThumbnailFile = (f) => {
    if (f && f.type.startsWith('image/')) {
      setThumbnailFile(f);
      setThumbnailPreview(URL.createObjectURL(f));
    } else {
      toast.error('Please select an image file (JPG, PNG, WebP)');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleVideoFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) return toast.error('Please select a video file');
    if (!form.title || !form.category || !form.subcategory) return toast.error('Please fill all required fields');

    setUploading(true);
    setVideoProgress(0);
    setThumbnailProgress(0);
    setUploadPhase('uploading');

    try {
      const uploads = [];

      const videoFormData = new FormData();
      videoFormData.append('video', videoFile);
      const videoPromise = api.post('/videos/upload-video', videoFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => setVideoProgress(Math.round((e.loaded * 100) / e.total)),
      });
      uploads.push(videoPromise);

      let thumbnailPromise = Promise.resolve(null);
      if (thumbnailFile) {
        const thumbFormData = new FormData();
        thumbFormData.append('thumbnail', thumbnailFile);
        thumbnailPromise = api.post('/videos/upload-thumbnail', thumbFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (e) => setThumbnailProgress(Math.round((e.loaded * 100) / e.total)),
        });
      }
      uploads.push(thumbnailPromise);

      const [videoRes, thumbRes] = await Promise.all(uploads);

      setUploadPhase('saving');
      const driveFileId = videoRes.data.data.drive_file_id;
      const thumbnailUrl = thumbRes?.data?.data?.thumbnail_url || '';

      await api.post('/videos/save', {
        ...form,
        drive_file_id: driveFileId,
        thumbnail_url: thumbnailUrl,
      });

      toast.success('Video uploaded successfully!');
      setForm({ title: '', description: '', category: '', subcategory: '', tags: '' });
      setVideoFile(null);
      setThumbnailFile(null);
      setThumbnailPreview(null);
      setVideoProgress(0);
      setThumbnailProgress(0);
      setIsModalOpen(false);
      fetchVideos();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      setUploadPhase('');
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      await api.delete(`/videos/${deleteModal}`);
      toast.success('Video deleted');
      fetchVideos();
    } catch { toast.error('Failed to delete'); }
    finally { setDeleteModal(null); }
  };

  const handleEditClick = (video) => {
    setEditForm({
      id: video._id,
      title: video.title || '',
      description: video.description || '',
      category: video.category || '',
      subcategory: video.subcategory || '',
      tags: (video.tags || []).join(', ')
    });
    setEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editForm.title || !editForm.category || !editForm.subcategory) return toast.error('Please fill all required fields');

    setUpdating(true);
    try {
      await api.put(`/videos/${editForm.id}`, {
        title: editForm.title,
        description: editForm.description,
        category: editForm.category,
        subcategory: editForm.subcategory,
        tags: editForm.tags
      });
      toast.success('Video updated successfully!');
      setEditModalOpen(false);
      fetchVideos();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  const filteredVideos = videos.filter(video => {
    if (statusFilter && video.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="font-sans text-[#002546] pb-10">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[26px] font-extrabold tracking-tight">Upload Center</h1>
          <p className="text-[#A3AED0] font-bold text-sm mt-1">Upload and manage demo videos</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
          <div className="relative w-full sm:w-auto">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A3AED0] w-4 h-4" />
            <input type="text" placeholder="Search videos..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full sm:w-64 bg-white border border-slate-200 rounded-[10px] pl-10 pr-4 py-2.5 text-sm text-[#002546] font-medium placeholder-[#A3AED0] focus:outline-none focus:ring-2 focus:ring-[#002546]/20 focus:border-[#002546] transition-all shadow-sm" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto bg-white border border-slate-200 rounded-[10px] px-4 py-2.5 text-sm text-[#002546] font-bold focus:outline-none focus:ring-2 focus:ring-[#002546]/20 focus:border-[#002546] transition-all cursor-pointer shadow-sm">
            <option value="">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
          <button onClick={() => setIsModalOpen(true)}
            className="px-6 py-2.5 bg-gradient-to-r from-[#002546] to-[#00478A] hover:shadow-lg hover:-translate-y-0.5 text-white text-sm font-semibold rounded-[10px] shadow-[0px_8px_20px_rgba(0,37,70,0.15)] transition-all w-full sm:w-auto flex items-center justify-center gap-2">
            <FiUpload className="w-4 h-4" /> Upload New
          </button>
        </div>
      </div>

      {/* Table */}
      <div className=" rounded-[6px] shadow-[0px_12px_28px_rgba(0,37,70,0.08)] border border-white overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50/50 pointer-events-none"></div>
        <div className="overflow-x-auto relative z-10 ">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className=' bg-[#1a3b59]'>
                <th className="py-4 px-6 text-xs font-bold text-[#A3AED0] uppercase tracking-wider border-b border-[#F4F7FE]">Video</th>
                <th className="py-4 px-6 text-center text-xs font-bold text-[#A3AED0] uppercase tracking-wider border-b border-[#F4F7FE]">Category</th>
                <th className="py-4 px-6 text-center text-xs font-bold text-[#A3AED0] uppercase tracking-wider border-b border-[#F4F7FE]">SubCategory</th>
                <th className="py-4 px-6 text-center text-xs font-bold text-[#A3AED0] uppercase tracking-wider border-b border-[#F4F7FE]">Status</th>
                <th className="py-4 px-6 text-right text-xs font-bold text-[#A3AED0] uppercase tracking-wider border-b border-[#F4F7FE]">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="py-16 text-center"><div className="w-8 h-8 border-2 border-[#002546] border-t-transparent rounded-full animate-spin mx-auto" /></td></tr>
              ) : filteredVideos.length === 0 ? (
                <tr><td colSpan="5" className="py-16 text-center font-bold text-[#A3AED0]">No videos found</td></tr>
              ) : (
                filteredVideos.map(video => (
                  <tr key={video._id} className="hover:bg-[#F4F7FE]/50 transition-colors group border-b border-[#F4F7FE]">
                    <td className="py-2 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-14 bg-[#F4F7FE] border border-slate-200 rounded-[8px] overflow-hidden flex-shrink-0 relative shadow-sm">
                          {video.thumbnail_url ? (
                            <img src={video.thumbnail_url} alt={video.title} loading="lazy" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-[#EAEFF5] flex items-center justify-center text-[#A3AED0] text-[10px] text-center p-1 font-bold">
                              {video.title}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-6 text-center text-[#002546] text-sm font-bold">{video.category || 'N/A'}</td>
                    <td className="py-2 px-6 text-center text-[#A3AED0] text-sm font-bold">{video.subcategory || 'N/A'}</td>
                    <td className="py-2 px-6 text-center">
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full capitalize shadow-sm border ${STATUS_COLORS[video.status] || 'text-slate-500 bg-slate-50 border-slate-200'}`}>{video.status}</span>
                    </td>
                    <td className="py-2 px-6">
                      <div className="flex items-center justify-end gap-3">
                        {['admin', 'project manager'].includes(user?.role) && (
                          <button onClick={() => handleEditClick(video)} className=" cursor-pointer w-9 h-9 rounded-[10px] bg-[#F4F7FE] border border-slate-100 hover:bg-indigo-50 text-indigo-600 flex items-center justify-center transition-all shadow-sm"><FiEdit className="w-4 h-4" /></button>
                        )}
                        <button onClick={() => setPreviewVideo(video.drive_file_id)} className=" cursor-pointer w-9 h-9 rounded-[10px] bg-[#F4F7FE] border border-slate-100 hover:bg-slate-100 text-[#002546] flex items-center justify-center transition-all shadow-sm"><FiEye className="w-4 h-4" /></button>
                        {['admin', 'project manager'].includes(user?.role) && (
                          <button onClick={() => setDeleteModal(video._id)} className=" cursor-pointer w-9 h-9 rounded-[10px] bg-red-50 hover:bg-red-100 border border-red-100 text-red-500 flex items-center justify-center transition-all shadow-sm"><FiTrash2 className="w-4 h-4" /></button>
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

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-[#002546]/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white border border-slate-100 rounded-[20px] p-8 w-full max-w-sm shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-50 border border-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><FiTrash2 className="w-8 h-8 text-red-500" /></div>
            <h3 className="text-[#002546] font-extrabold text-[20px] mb-2">Delete Video?</h3>
            <p className="text-[#A3AED0] font-medium text-sm mb-8">Are you sure you want to delete this video? This action cannot be undone.</p>
            <div className="flex gap-4">
              <button onClick={() => setDeleteModal(null)} className="flex-1 py-3 border border-slate-200 hover:bg-[#F4F7FE] text-[#002546] text-sm font-bold rounded-[12px] transition-all">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-3 bg-red-600 hover:bg-red-500 hover:shadow-lg text-white text-sm font-bold rounded-[12px] transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#002546]/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-8 overflow-y-auto">
          <div className="bg-white border border-slate-100 rounded-[24px] w-full max-w-2xl shadow-2xl my-auto">
            <div className="flex justify-between items-center p-8 border-b border-[#F4F7FE]">
              <h3 className="text-[#002546] font-extrabold text-2xl">Upload Video</h3>
              <button onClick={() => !uploading && setIsModalOpen(false)}
                className={`w-10 h-10 rounded-full bg-[#F4F7FE] flex items-center justify-center text-[#A3AED0] hover:text-red-500 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`} disabled={uploading}>
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Video Drop Zone */}
                <div>
                  <label className="block text-xs text-[#A3AED0] font-bold mb-2 uppercase tracking-wider">Video File <span className="text-red-500">*</span></label>
                  <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop}
                    onClick={() => !uploading && document.getElementById('admin-video-input').click()}
                    className={`border-2 border-dashed rounded-[16px] p-8 text-center transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${dragOver ? 'border-[#002546] bg-[#002546]/5' : videoFile ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 hover:border-[#002546]/50 bg-[#F4F7FE]'}`}>
                    <input id="admin-video-input" type="file" accept="video/*" className="hidden" onChange={e => handleVideoFile(e.target.files[0])} disabled={uploading} />
                    {videoFile ? (
                      <div className="flex items-center justify-center gap-4 text-emerald-600">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                          <FiVideo className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <p className="font-bold truncate max-w-[200px] text-sm">{videoFile.name}</p>
                          <p className="text-xs text-emerald-500/70 font-semibold">{(videoFile.size / 1024 / 1024).toFixed(1)} MB</p>
                        </div>
                        {!uploading && (
                          <button type="button" onClick={(e) => { e.stopPropagation(); setVideoFile(null); }} className="ml-4 text-slate-400 hover:text-red-500"><FiX className="w-5 h-5" /></button>
                        )}
                      </div>
                    ) : (
                      <div className="text-[#A3AED0]">
                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-slate-100">
                          <FiUpload className="w-6 h-6 text-[#002546]" />
                        </div>
                        <p className="font-bold text-[#002546] text-sm">Drag & drop video here</p>
                        <p className="text-xs font-semibold mt-1">or click to browse — MP4, MOV, AVI (max 500MB)</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Thumbnail File Input */}
                <div>
                  <label className="block text-xs text-[#A3AED0] font-bold mb-2 uppercase tracking-wider">Thumbnail Image <span className="text-[#A3AED0]/60">(optional)</span></label>
                  <div onClick={() => !uploading && document.getElementById('admin-thumb-input').click()}
                    className={`border-2 border-dashed rounded-[16px] p-6 text-center transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${thumbnailFile ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 hover:border-[#002546]/50 bg-[#F4F7FE]'}`}>
                    <input id="admin-thumb-input" type="file" accept="image/*" className="hidden" onChange={e => handleThumbnailFile(e.target.files[0])} disabled={uploading} />
                    {thumbnailFile ? (
                      <div className="flex items-center justify-center gap-4 text-indigo-600">
                        {thumbnailPreview && <img src={thumbnailPreview} alt="Preview" className="w-16 h-10 object-cover rounded-lg shadow-sm border border-indigo-200" />}
                        <div className="text-left">
                          <p className="font-bold truncate max-w-[180px] text-sm">{thumbnailFile.name}</p>
                          <p className="text-xs text-indigo-500/70 font-semibold">{(thumbnailFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        {!uploading && (
                          <button type="button" onClick={(e) => { e.stopPropagation(); setThumbnailFile(null); setThumbnailPreview(null); }} className="ml-4 text-slate-400 hover:text-red-500"><FiX className="w-5 h-5" /></button>
                        )}
                      </div>
                    ) : (
                      <div className="text-[#A3AED0] flex items-center justify-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
                          <FiImage className="w-4 h-4 text-[#002546]" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold text-[#002546]">Upload thumbnail</p>
                          <p className="text-[11px] font-semibold">JPG, PNG, WebP</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Upload Progress Bars */}
                {uploading && (
                  <div className="space-y-4 p-5 bg-[#F4F7FE] rounded-[16px] border border-slate-200">
                    {/* Video Progress */}
                    <div>
                      <div className="flex justify-between text-xs font-bold text-[#A3AED0] mb-2 uppercase tracking-wider">
                        <span className="flex items-center gap-2">
                          <FiVideo className="w-4 h-4" />
                          {videoProgress >= 100 ? <span className="text-emerald-500">Video uploaded ✓</span> : 'Uploading to Drive...'}
                        </span>
                        <span className="text-[#002546]">{videoProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-300 ${videoProgress >= 100 ? 'bg-emerald-500' : 'bg-[#002546]'}`}
                          style={{ width: `${videoProgress}%` }} />
                      </div>
                    </div>
                    {/* Thumbnail Progress */}
                    {thumbnailFile && (
                      <div>
                        <div className="flex justify-between text-xs font-bold text-[#A3AED0] mb-2 uppercase tracking-wider">
                          <span className="flex items-center gap-2">
                            <FiImage className="w-4 h-4" />
                            {thumbnailProgress >= 100 ? <span className="text-indigo-500">Thumbnail uploaded ✓</span> : 'Uploading to Cloudinary...'}
                          </span>
                          <span className="text-[#002546]">{thumbnailProgress}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-300 ${thumbnailProgress >= 100 ? 'bg-indigo-500' : 'bg-indigo-400'}`}
                            style={{ width: `${thumbnailProgress}%` }} />
                        </div>
                      </div>
                    )}
                    {/* Saving phase indicator */}
                    {uploadPhase === 'saving' && (
                      <div className="flex items-center gap-2 text-xs text-amber-500 font-bold mt-2">
                        <span className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                        Saving video record...
                      </div>
                    )}
                  </div>
                )}

                {/* Title */}
                <div>
                  <label className="block text-xs text-[#A3AED0] font-bold mb-2 uppercase tracking-wider">Page Name <span className="text-red-500">*</span></label>
                  <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Organic Honey Product Ad" disabled={uploading}
                    className="w-full bg-[#F4F7FE] border border-slate-200 rounded-[12px] px-5 py-3 text-sm text-[#002546] font-medium placeholder-[#A3AED0] focus:outline-none focus:ring-2 focus:ring-[#002546]/20 focus:border-[#002546] transition-all disabled:opacity-50" />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs text-[#A3AED0] font-bold mb-2 uppercase tracking-wider">Description</label>
                  <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief description of the video..." rows={2} disabled={uploading}
                    className="w-full bg-[#F4F7FE] border border-slate-200 rounded-[12px] px-5 py-3 text-sm text-[#002546] font-medium placeholder-[#A3AED0] focus:outline-none focus:ring-2 focus:ring-[#002546]/20 focus:border-[#002546] transition-all resize-none disabled:opacity-50" />
                </div>

                {/* Category + Subcategory */}
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs text-[#A3AED0] font-bold mb-2 uppercase tracking-wider">Category <span className="text-red-500">*</span></label>
                    <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value, subcategory: '' }))} disabled={uploading}
                      className="w-full bg-[#F4F7FE] border border-slate-200 rounded-[12px] px-5 py-3 text-sm text-[#002546] font-medium focus:outline-none focus:ring-2 focus:ring-[#002546]/20 focus:border-[#002546] transition-all disabled:opacity-50">
                      <option value="">Select category</option>
                      {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[#A3AED0] font-bold mb-2 uppercase tracking-wider">Sub Category <span className="text-red-500">*</span></label>
                    <select value={form.subcategory} onChange={e => setForm(p => ({ ...p, subcategory: e.target.value }))} disabled={!selectedCat || uploading}
                      className="w-full bg-[#F4F7FE] border border-slate-200 rounded-[12px] px-5 py-3 text-sm text-[#002546] font-medium focus:outline-none focus:ring-2 focus:ring-[#002546]/20 focus:border-[#002546] transition-all disabled:opacity-50">
                      <option value="">Select subcategory</option>
                      {selectedCat?.subcategories?.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs text-[#A3AED0] font-bold mb-2 uppercase tracking-wider">Tags (comma separated)</label>
                  <input value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} placeholder="organic, product, ad, 2024" disabled={uploading}
                    className="w-full bg-[#F4F7FE] border border-slate-200 rounded-[12px] px-5 py-3 text-sm text-[#002546] font-medium placeholder-[#A3AED0] focus:outline-none focus:ring-2 focus:ring-[#002546]/20 focus:border-[#002546] transition-all disabled:opacity-50" />
                </div>

                <div className="pt-4 flex gap-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} disabled={uploading}
                    className="flex-1 py-3.5 border border-slate-200 text-[#002546] hover:bg-[#F4F7FE] font-bold rounded-[12px] transition-all disabled:opacity-50">Cancel</button>
                  <button type="submit" disabled={uploading}
                    className="flex-[2] py-3.5 bg-gradient-to-r from-[#002546] to-[#00478A] hover:shadow-lg text-white font-bold rounded-[12px] transition-all disabled:opacity-60 shadow-[0px_8px_20px_rgba(0,37,70,0.15)] flex items-center justify-center gap-2">
                    {uploading ? (
                      <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Uploading...</>
                    ) : (
                      <><FiUpload className="w-5 h-5" /> Upload Video</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-[#002546]/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-8 overflow-y-auto">
          <div className="bg-white border border-slate-100 rounded-[24px] w-full max-w-2xl shadow-2xl my-auto">
            <div className="flex justify-between items-center p-8 border-b border-[#F4F7FE]">
              <h3 className="text-[#002546] font-extrabold text-2xl">Edit Video</h3>
              <button onClick={() => !updating && setEditModalOpen(false)}
                className={`w-10 h-10 rounded-full bg-[#F4F7FE] flex items-center justify-center text-[#A3AED0] hover:text-red-500 transition-colors ${updating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`} disabled={updating}>
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8">
              <form onSubmit={handleUpdate} className="space-y-6">
                <div>
                  <label className="block text-xs text-[#A3AED0] font-bold mb-2 uppercase tracking-wider">Page Name <span className="text-red-500">*</span></label>
                  <input value={editForm.title} onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Organic Honey Product Ad" disabled={updating}
                    className="w-full bg-[#F4F7FE] border border-slate-200 rounded-[12px] px-5 py-3 text-sm text-[#002546] font-medium placeholder-[#A3AED0] focus:outline-none focus:ring-2 focus:ring-[#002546]/20 focus:border-[#002546] transition-all disabled:opacity-50" />
                </div>
                <div>
                  <label className="block text-xs text-[#A3AED0] font-bold mb-2 uppercase tracking-wider">Description</label>
                  <textarea value={editForm.description} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief description of the video..." rows={3} disabled={updating}
                    className="w-full bg-[#F4F7FE] border border-slate-200 rounded-[12px] px-5 py-3 text-sm text-[#002546] font-medium placeholder-[#A3AED0] focus:outline-none focus:ring-2 focus:ring-[#002546]/20 focus:border-[#002546] transition-all resize-none disabled:opacity-50" />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs text-[#A3AED0] font-bold mb-2 uppercase tracking-wider">Category <span className="text-red-500">*</span></label>
                    <select value={editForm.category} onChange={e => setEditForm(p => ({ ...p, category: e.target.value, subcategory: '' }))} disabled={updating}
                      className="w-full bg-[#F4F7FE] border border-slate-200 rounded-[12px] px-5 py-3 text-sm text-[#002546] font-medium focus:outline-none focus:ring-2 focus:ring-[#002546]/20 focus:border-[#002546] transition-all disabled:opacity-50">
                      <option value="">Select category</option>
                      {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[#A3AED0] font-bold mb-2 uppercase tracking-wider">Sub Category <span className="text-red-500">*</span></label>
                    <select value={editForm.subcategory} onChange={e => setEditForm(p => ({ ...p, subcategory: e.target.value }))} disabled={!selectedEditCat || updating}
                      className="w-full bg-[#F4F7FE] border border-slate-200 rounded-[12px] px-5 py-3 text-sm text-[#002546] font-medium focus:outline-none focus:ring-2 focus:ring-[#002546]/20 focus:border-[#002546] transition-all disabled:opacity-50">
                      <option value="">Select subcategory</option>
                      {selectedEditCat?.subcategories?.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-[#A3AED0] font-bold mb-2 uppercase tracking-wider">Tags (comma separated)</label>
                  <input value={editForm.tags} onChange={e => setEditForm(p => ({ ...p, tags: e.target.value }))} placeholder="organic, product, ad, 2024" disabled={updating}
                    className="w-full bg-[#F4F7FE] border border-slate-200 rounded-[12px] px-5 py-3 text-sm text-[#002546] font-medium placeholder-[#A3AED0] focus:outline-none focus:ring-2 focus:ring-[#002546]/20 focus:border-[#002546] transition-all disabled:opacity-50" />
                </div>
                <div className="pt-4 flex gap-4">
                  <button type="button" onClick={() => setEditModalOpen(false)} disabled={updating}
                    className="flex-1 py-3.5 border border-slate-200 text-[#002546] hover:bg-[#F4F7FE] font-bold rounded-[12px] transition-all disabled:opacity-50">Cancel</button>
                  <button type="submit" disabled={updating}
                    className="flex-[2] py-3.5 bg-gradient-to-r from-[#002546] to-[#00478A] hover:shadow-lg text-white font-bold rounded-[12px] transition-all disabled:opacity-60 shadow-[0px_8px_20px_rgba(0,37,70,0.15)] flex items-center justify-center gap-2">
                    {updating ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewVideo && (
        <div className="fixed inset-0 bg-[#002546]/80 backdrop-blur-md flex items-center justify-center z-[60] px-4">
          <div className="bg-white rounded-[24px] p-2 w-full max-w-4xl shadow-2xl flex flex-col h-[80vh] relative overflow-hidden">
            <div className="absolute top-4 right-4 z-50">
              <button onClick={() => setPreviewVideo(null)} className="w-10 h-10 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white rounded-full flex items-center justify-center transition-all">
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 bg-black rounded-[20px] overflow-hidden relative">
              <iframe
                src={`https://drive.google.com/file/d/${previewVideo}/preview`}
                className="absolute inset-0 w-full h-full border-0"
                allow="autoplay"
                title="Video Preview"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
