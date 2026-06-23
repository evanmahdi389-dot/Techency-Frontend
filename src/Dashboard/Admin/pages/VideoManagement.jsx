import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { FiCheck, FiX, FiTrash2, FiSearch, FiEye, FiPlay, FiCopy, FiCheckCircle } from 'react-icons/fi';

const STATUS_COLORS = {
  pending: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  approved: 'text-green-400 bg-green-500/10 border-green-500/20',
  rejected: 'text-red-400 bg-red-500/10 border-red-500/20',
};
export default function VideoManagement() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Category states for filtering
  const [categories, setCategories] = useState([]);
  const [selectedMainCat, setSelectedMainCat] = useState('');
  const [selectedSubCat, setSelectedSubCat] = useState('');

  // Selection state
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [creatingLink, setCreatingLink] = useState(false);
  const [expiryDays, setExpiryDays] = useState('7');

  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [previewVideo, setPreviewVideo] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/category');
      setCategories(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch categories');
    }
  };

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      // Note: Assuming backend supports filtering by category/subcategory. If not, filtering can be done client-side below.
      const res = await api.get('/videos', { params });
      setVideos(res.data.data || []);
    } catch { toast.error('Failed to fetch videos'); }
    finally { setLoading(false); }
  };

  useEffect(() => { 
    fetchCategories(); 
  }, []);

  useEffect(() => { 
    fetchVideos(); 
  }, [search]);

  const handleApprove = async (id, e) => {
    e.stopPropagation();
    try {
      await api.put(`/videos/${id}/approve`, { status: 'approved' });
      toast.success('Video approved!');
      fetchVideos();
    } catch { toast.error('Failed to approve'); }
  };

  const handleReject = async () => {
    try {
      await api.put(`/videos/${rejectModal}/approve`, { status: 'rejected', rejectionReason: rejectReason });
      toast.success('Video rejected');
      setRejectModal(null);
      setRejectReason('');
      fetchVideos();
    } catch { toast.error('Failed to reject'); }
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

  const toggleSelection = (id) => {
    if (selectedVideos.includes(id)) {
      setSelectedVideos(selectedVideos.filter(v => v !== id));
    } else {
      setSelectedVideos([...selectedVideos, id]);
    }
  };

  const selectAll = () => {
    if (selectedVideos.length === filteredVideos.length) {
      setSelectedVideos([]);
    } else {
      setSelectedVideos(filteredVideos.map(v => v._id));
    }
  };

  const generateAndCopyLink = async () => {
    if (selectedVideos.length === 0) return toast.error('No videos selected');
    setCreatingLink(true);
    try {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + parseInt(expiryDays));

      const res = await api.post('/demo/create', {
        videoIds: selectedVideos,
        expiryDate: expiryDate.toISOString()
      });
      const generatedLink = res.data.data.linkId;
      navigator.clipboard.writeText(`${window.location.origin}/demo/${generatedLink}`);
      toast.success('Demo link copied to clipboard!');
      setSelectedVideos([]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate link');
    } finally {
      setCreatingLink(false);
    }
  };

  // Client-side filtering for categories since backend might not support it natively yet
  const filteredVideos = videos.filter(video => {
    let match = true;
    if (selectedMainCat) {
      const cat = categories.find(c => c._id === selectedMainCat);
      if (cat && video.category !== cat.name) match = false;
    }
    if (selectedSubCat && video.subcategory !== selectedSubCat) match = false;
    return match;
  });

  const selectedMainCatData = categories.find(c => c._id === selectedMainCat);

  return (
    <div className="pb-10">
      <Toaster position="top-center" />

      {/* Header Row */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Video Management</h1>
          <p className="text-gray-500 text-sm mt-1">Approve, reject or delete uploaded videos</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-auto">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search videos..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full sm:w-64 bg-[#111] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-all"
            />
          </div>
          
          {/* Main Category Dropdown */}
          <select
            value={selectedMainCat}
            onChange={e => { setSelectedMainCat(e.target.value); setSelectedSubCat(''); }}
            className="w-full sm:w-auto bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-400 focus:outline-none focus:border-red-500 transition-all cursor-pointer"
          >
            <option value="">-----Main Category-----</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>

          {/* Sub Category Dropdown */}
          <select
            value={selectedSubCat}
            onChange={e => setSelectedSubCat(e.target.value)}
            disabled={!selectedMainCat}
            className="w-full sm:w-auto bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-400 focus:outline-none focus:border-red-500 transition-all cursor-pointer disabled:opacity-50"
          >
            <option value="">-----Sub Category-----</option>
            {selectedMainCatData?.subcategories?.map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={selectAll}
            className={`px-6 py-2.5 text-white text-sm font-medium rounded-xl transition-all ${
              selectedVideos.length === filteredVideos.length && filteredVideos.length > 0
                ? 'bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 shadow-lg shadow-red-500/20 border border-transparent'
                : 'bg-[#111] border border-white/10 hover:border-white/20'
            }`}
          >
            {selectedVideos.length === filteredVideos.length && filteredVideos.length > 0 ? 'Deselect All' : 'Select All'}
          </button>
          {selectedVideos.length > 0 && (
            <button className="px-6 py-2.5 bg-[#111] border border-white/10 text-white text-sm font-medium rounded-xl">
              Select {selectedVideos.length} Video{selectedVideos.length > 1 ? 's' : ''}
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={expiryDays}
            onChange={e => setExpiryDays(e.target.value)}
            className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-400 focus:outline-none focus:border-red-500 transition-all cursor-pointer hidden sm:block"
          >
            <option value="1">24 Hours</option>
            <option value="3">3 Days</option>
            <option value="7">7 Days</option>
            <option value="14">14 Days</option>
            <option value="30">30 Days</option>
          </select>
          <button 
            onClick={generateAndCopyLink}
            disabled={creatingLink}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#111] border border-white/10 hover:border-white/20 text-white text-sm font-medium rounded-xl transition-all w-full sm:w-auto disabled:opacity-50"
          >
            {creatingLink ? 'Creating...' : <><FiCopy className="w-4 h-4" /> Copy Video Link</>}
          </button>
        </div>
      </div>



      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No videos found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.map(video => {
            const isSelected = selectedVideos.includes(video._id);
            return (
              <div 
                key={video._id} 
                onClick={() => toggleSelection(video._id)}
                className={`group relative aspect-[3/4] bg-[#111] rounded-2xl overflow-hidden cursor-pointer transition-all ${
                  isSelected ? 'border-2 border-red-600 shadow-lg shadow-red-500/20' : 'border border-transparent hover:border-white/10'
                }`}
              >
                {/* Thumbnail */}
                {video.thumbnail_url ? (
                  <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#1a1a1a] text-gray-600 text-xs text-center p-4">
                    {video.title}
                  </div>
                )}
                
                {/* Gradient Overlay for better visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                {/* Selection Checkmark */}
                {isSelected && (
                  <div className="absolute top-4 right-4 z-10 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-[#111]">
                    <FiCheck className="w-5 h-5 text-white stroke-[3]" />
                  </div>
                )}

                {/* Play Button Icon */}
                <div 
                  className="absolute inset-0 flex items-center justify-center z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewVideo(video.drive_file_id);
                  }}
                >
                  <div className="w-14 h-14 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-600 hover:scale-110 transition-all text-white shadow-xl">
                    <FiPlay className="w-5 h-5 ml-1" fill="currentColor" />
                  </div>
                </div>

                {/* Info Overlay at the bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                  <h3 className="text-white font-medium text-sm truncate drop-shadow-md">{video.title}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-gray-300 text-xs drop-shadow-md truncate max-w-[60%]">
                      {video.category}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border capitalize ${STATUS_COLORS[video.status]}`}>
                      {video.status}
                    </span>
                  </div>
                </div>

                {/* Hover Actions (Approve, Reject, Delete) */}
                <div className="absolute top-4 left-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {video.status === 'pending' && (
                    <>
                      <button
                        onClick={(e) => handleApprove(video._id, e)}
                        title="Approve"
                        className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-400 shadow-lg"
                      >
                        <FiCheck className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setRejectModal(video._id); }}
                        title="Reject"
                        className="w-8 h-8 rounded-full bg-yellow-500 text-white flex items-center justify-center hover:bg-yellow-400 shadow-lg"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteModal(video._id); }}
                    title="Delete"
                    className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-500 shadow-lg"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-[#151515] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTrash2 className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Delete Video?</h3>
            <p className="text-gray-400 text-sm mb-6">Are you sure you want to delete this video from Drive and the database? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white text-sm transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-[#151515] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-white font-semibold text-lg mb-4">Reject Video</h3>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Reason for rejection (optional)..."
              rows={3}
              className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-500 resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setRejectModal(null); setRejectReason(''); }}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white text-sm transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-all"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewVideo && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] px-4">
          <div className="bg-[#151515] border border-white/10 rounded-2xl p-4 w-full max-w-4xl shadow-2xl flex flex-col h-[80vh]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-semibold text-lg">Video Preview</h3>
              <button onClick={() => setPreviewVideo(null)} className="text-gray-400 hover:text-white transition-colors">
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 bg-black rounded-xl overflow-hidden relative">
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
