import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { FiUpload, FiX, FiVideo, FiImage, FiSearch, FiEdit, FiEye, FiTrash2, FiCheck } from 'react-icons/fi';

const STATUS_COLORS = {
  pending: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  approved: 'text-green-400 bg-green-500/10 border-green-500/20',
  rejected: 'text-red-400 bg-red-500/10 border-red-500/20',
};

export default function AdminUpload() {
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
      const res = await api.get('/videos', { params });
      setVideos(res.data.data || []);
    } catch { toast.error('Failed to fetch videos'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    api.get('/category').then(res => setCategories(res.data.data || []));
  }, []);

  useEffect(() => { fetchVideos(); }, [search]);

  const selectedCat = categories.find(c => c.name === form.category);

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
      // Build concurrent upload promises
      const uploads = [];

      // 1) Video upload to Google Drive
      const videoFormData = new FormData();
      videoFormData.append('video', videoFile);
      const videoPromise = api.post('/videos/upload-video', videoFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => setVideoProgress(Math.round((e.loaded * 100) / e.total)),
      });
      uploads.push(videoPromise);

      // 2) Thumbnail upload to Cloudinary (only if file selected)
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

      // 3) Save final video record to MongoDB
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

  const filteredVideos = videos.filter(video => {
    if (statusFilter && video.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="pb-10">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Video Management</h1>
          <p className="text-gray-500 text-sm mt-1">Approve, reject or delete uploaded videos</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
          <div className="relative w-full sm:w-auto">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input type="text" placeholder="Search videos..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full sm:w-64 bg-[#111] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-all" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-400 focus:outline-none focus:border-red-500 transition-all cursor-pointer">
            <option value="">-----Status-----</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
          <button onClick={() => setIsModalOpen(true)}
            className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white text-sm font-medium rounded-xl shadow-lg shadow-red-500/20 transition-all w-full sm:w-auto">
            Upload
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-white font-medium">
                <th className="py-4 px-6">Video</th>
                <th className="py-4 px-6 text-center">Main Category</th>
                <th className="py-4 px-6 text-center">SubCategory</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan="5" className="py-10 text-center"><div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" /></td></tr>
              ) : filteredVideos.length === 0 ? (
                <tr><td colSpan="5" className="py-10 text-center text-gray-500">No videos found</td></tr>
              ) : (
                filteredVideos.map(video => (
                  <tr key={video._id} className="hover:bg-white/5 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-14 bg-[#1a1a1a] rounded-lg overflow-hidden flex-shrink-0 relative">
                          {video.thumbnail_url ? (
                            <img src={video.thumbnail_url} alt={video.title} loading="lazy" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-red-900/30 to-neutral-900 flex items-center justify-center text-gray-500 text-[10px] text-center p-1 font-medium">
                              {video.title}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center text-white text-sm font-medium">{video.category || 'N/A'}</td>
                    <td className="py-4 px-6 text-center text-white text-sm font-medium">{video.subcategory || 'N/A'}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`text-[10px] px-2.5 py-1 rounded-full border capitalize ${STATUS_COLORS[video.status] || 'text-gray-400 border-gray-500/20'}`}>{video.status}</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors"><FiEdit className="w-4 h-4" /></button>
                        <button className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors"><FiEye className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteModal(video._id)} className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 flex items-center justify-center transition-colors"><FiTrash2 className="w-4 h-4" /></button>
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
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-[#151515] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4"><FiTrash2 className="w-8 h-8 text-red-500" /></div>
            <h3 className="text-white font-semibold text-lg mb-2">Delete Video?</h3>
            <p className="text-gray-400 text-sm mb-6">Are you sure you want to delete this video? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModal(null)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white text-sm transition-all">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4 py-8 overflow-y-auto">
          <div className="bg-[#151515] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl my-auto">
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h3 className="text-white font-semibold text-lg">Upload Video</h3>
              <button onClick={() => !uploading && setIsModalOpen(false)}
                className={`cursor-pointer text-gray-400 hover:text-red-500 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={uploading}>
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Video Drop Zone */}
                <div>
                  <label className="block text-xs text-gray-400 font-medium mb-2 tracking-wider">Video File <span className="text-red-500">*</span></label>
                  <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop}
                    onClick={() => !uploading && document.getElementById('admin-video-input').click()}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${dragOver ? 'border-red-500 bg-red-500/5' : videoFile ? 'border-green-500/50 bg-green-500/5' : 'border-white/10 hover:border-white/20 bg-[#111]'}`}>
                    <input id="admin-video-input" type="file" accept="video/*" className="hidden" onChange={e => handleVideoFile(e.target.files[0])} disabled={uploading} />
                    {videoFile ? (
                      <div className="flex items-center justify-center gap-3 text-green-400">
                        <FiVideo className="w-7 h-7" />
                        <div className="text-left">
                          <p className="font-medium truncate max-w-[200px]">{videoFile.name}</p>
                          <p className="text-xs text-gray-400">{(videoFile.size / 1024 / 1024).toFixed(1)} MB</p>
                        </div>
                        {!uploading && (
                          <button type="button" onClick={(e) => { e.stopPropagation(); setVideoFile(null); }} className="ml-2 text-gray-500 hover:text-red-400"><FiX className="w-5 h-5" /></button>
                        )}
                      </div>
                    ) : (
                      <div className="text-gray-500">
                        <FiUpload className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                        <p className="font-medium text-gray-400 text-sm">Drag & drop video here</p>
                        <p className="text-xs mt-1">or click to browse — MP4, MOV, AVI (max 500MB)</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Thumbnail File Input */}
                <div>
                  <label className="block text-xs text-gray-400 font-medium mb-2 tracking-wider">Thumbnail Image <span className="text-gray-600">(optional)</span></label>
                  <div onClick={() => !uploading && document.getElementById('admin-thumb-input').click()}
                    className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${thumbnailFile ? 'border-blue-500/50 bg-blue-500/5' : 'border-white/10 hover:border-white/20 bg-[#111]'}`}>
                    <input id="admin-thumb-input" type="file" accept="image/*" className="hidden" onChange={e => handleThumbnailFile(e.target.files[0])} disabled={uploading} />
                    {thumbnailFile ? (
                      <div className="flex items-center justify-center gap-3 text-blue-400">
                        {thumbnailPreview && <img src={thumbnailPreview} alt="Preview" className="w-16 h-10 object-cover rounded-lg" />}
                        <div className="text-left">
                          <p className="font-medium truncate max-w-[180px] text-sm">{thumbnailFile.name}</p>
                          <p className="text-xs text-gray-400">{(thumbnailFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        {!uploading && (
                          <button type="button" onClick={(e) => { e.stopPropagation(); setThumbnailFile(null); setThumbnailPreview(null); }} className="ml-2 text-gray-500 hover:text-red-400"><FiX className="w-5 h-5" /></button>
                        )}
                      </div>
                    ) : (
                      <div className="text-gray-500">
                        <FiImage className="w-7 h-7 mx-auto mb-1 text-gray-600" />
                        <p className="text-sm text-gray-400">Click to upload thumbnail</p>
                        <p className="text-[11px] mt-0.5">JPG, PNG, WebP (max 10MB) — auto-optimized</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Upload Progress Bars */}
                {uploading && (
                  <div className="space-y-3 p-4 bg-[#0a0a0a] rounded-xl border border-white/5">
                    {/* Video Progress */}
                    <div>
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span className="flex items-center gap-1.5">
                          <FiVideo className="w-3.5 h-3.5" />
                          {videoProgress >= 100 ? <span className="text-green-400">Video uploaded ✓</span> : 'Uploading video to Drive...'}
                        </span>
                        <span>{videoProgress}%</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-300 ${videoProgress >= 100 ? 'bg-green-500' : 'bg-gradient-to-r from-red-600 to-orange-500'}`}
                          style={{ width: `${videoProgress}%` }} />
                      </div>
                    </div>
                    {/* Thumbnail Progress */}
                    {thumbnailFile && (
                      <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span className="flex items-center gap-1.5">
                            <FiImage className="w-3.5 h-3.5" />
                            {thumbnailProgress >= 100 ? <span className="text-green-400">Thumbnail uploaded ✓</span> : 'Uploading thumbnail to Cloudinary...'}
                          </span>
                          <span>{thumbnailProgress}%</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-300 ${thumbnailProgress >= 100 ? 'bg-green-500' : 'bg-gradient-to-r from-blue-600 to-cyan-500'}`}
                            style={{ width: `${thumbnailProgress}%` }} />
                        </div>
                      </div>
                    )}
                    {/* Saving phase indicator */}
                    {uploadPhase === 'saving' && (
                      <div className="flex items-center gap-2 text-xs text-amber-400 mt-1">
                        <span className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                        Saving video record...
                      </div>
                    )}
                  </div>
                )}

                {/* Title */}
                <div>
                  <label className="block text-xs text-gray-400 font-medium mb-2 tracking-wider">Page Name <span className="text-red-500">*</span></label>
                  <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Organic Honey Product Ad" disabled={uploading}
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-all disabled:opacity-50" />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs text-gray-400 font-medium mb-2 tracking-wider">Description</label>
                  <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief description of the video..." rows={2} disabled={uploading}
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-all resize-none disabled:opacity-50" />
                </div>

                {/* Category + Subcategory */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 font-medium mb-2 tracking-wider">Category <span className="text-red-500">*</span></label>
                    <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value, subcategory: '' }))} disabled={uploading}
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-all disabled:opacity-50">
                      <option value="">Select category</option>
                      {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 font-medium mb-2 tracking-wider">Sub Category <span className="text-red-500">*</span></label>
                    <select value={form.subcategory} onChange={e => setForm(p => ({ ...p, subcategory: e.target.value }))} disabled={!selectedCat || uploading}
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-all disabled:opacity-40">
                      <option value="">Select subcategory</option>
                      {selectedCat?.subcategories?.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs text-gray-400 font-medium mb-2 tracking-wider">Tags (comma separated)</label>
                  <input value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} placeholder="organic, product, ad, 2024" disabled={uploading}
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-all disabled:opacity-50" />
                </div>

                <div className="pt-2 flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} disabled={uploading}
                    className="flex-1 py-3.5 border border-white/10 text-gray-400 hover:text-white font-medium rounded-xl transition-all disabled:opacity-50">Cancel</button>
                  <button type="submit" disabled={uploading}
                    className="flex-[2] py-3.5 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-semibold rounded-xl transition-all disabled:opacity-60 shadow-lg shadow-red-500/20 flex items-center justify-center gap-2">
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
    </div>
  );
}
