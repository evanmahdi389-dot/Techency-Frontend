import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { FiCheck, FiX, FiTrash2, FiSearch, FiEye, FiPlay, FiCopy, FiCheckCircle } from 'react-icons/fi';

const STATUS_COLORS = {
  pending: 'text-amber-500 bg-amber-50 border-amber-200',
  approved: 'text-emerald-500 bg-emerald-50 border-emerald-200',
  rejected: 'text-red-500 bg-red-50 border-red-200',
};

// Generates a light premium gradient background based on the video title string
const getDynamicGradient = (string) => {
  const gradients = [
    'from-indigo-100 via-white to-[#F4F7FE]',
    'from-blue-100 via-white to-[#F4F7FE]',
    'from-sky-100 via-white to-[#F4F7FE]',
    'from-cyan-100 via-white to-[#F4F7FE]',
    'from-teal-100 via-white to-[#F4F7FE]'
  ];
  if (!string) return gradients[0];
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
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
      const res = await api.get('/videos', { params });
      setVideos(res.data.data || []);
    } catch {
      toast.error('Failed to fetch videos');
    } finally {
      setLoading(false);
    }
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
    } catch {
      toast.error('Failed to approve');
    }
  };

  const handleReject = async () => {
    try {
      await api.put(`/videos/${rejectModal}/approve`, { status: 'rejected', rejectionReason: rejectReason });
      toast.success('Video rejected');
      setRejectModal(null);
      setRejectReason('');
      fetchVideos();
    } catch {
      toast.error('Failed to reject');
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      await api.delete(`/videos/${deleteModal}`);
      toast.success('Video deleted');
      fetchVideos();
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleteModal(null);
    }
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
    <div className="pb-10 font-sans text-[#002546]">
      <Toaster position="top-center" />

      {/* Header Row */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[26px] font-extrabold tracking-tight">Video Library</h1>
          <p className="text-[#A3AED0] font-bold text-sm mt-1">Approve, reject or manage uploaded videos</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-auto">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A3AED0] w-4 h-4" />
            <input
              type="text"
              placeholder="Search videos..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full sm:w-64 bg-white border border-slate-200 rounded-[12px] pl-11 pr-4 py-2.5 text-sm text-[#002546] font-medium placeholder-[#A3AED0] focus:outline-none focus:ring-2 focus:ring-[#002546]/20 focus:border-[#002546] transition-all shadow-sm"
            />
          </div>

          {/* Main Category Dropdown */}
          <select
            value={selectedMainCat}
            onChange={e => { setSelectedMainCat(e.target.value); setSelectedSubCat(''); }}
            className="w-full sm:w-auto bg-white border border-slate-200 rounded-[12px] px-4 py-2.5 text-sm text-[#002546] font-bold focus:outline-none focus:ring-2 focus:ring-[#002546]/20 focus:border-[#002546] transition-all cursor-pointer shadow-sm"
          >
            <option value="">All Main Categories</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>

          {/* Sub Category Dropdown */}
          <select
            value={selectedSubCat}
            onChange={e => setSelectedSubCat(e.target.value)}
            disabled={!selectedMainCat}
            className="w-full sm:w-auto bg-white border border-slate-200 rounded-[12px] px-4 py-2.5 text-sm text-[#002546] font-bold focus:outline-none focus:ring-2 focus:ring-[#002546]/20 focus:border-[#002546] transition-all cursor-pointer disabled:opacity-50 shadow-sm"
          >
            <option value="">All Sub Categories</option>
            {selectedMainCatData?.subcategories?.map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 bg-white p-4 rounded-[16px] shadow-[0px_8px_24px_rgba(0,37,70,0.04)] border border-slate-100">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={selectAll}
            className={`px-5 py-2.5 text-sm font-bold rounded-[10px] transition-all ${selectedVideos.length === filteredVideos.length && filteredVideos.length > 0
              ? 'bg-[#002546] text-white shadow-md'
              : 'bg-[#F4F7FE] text-[#002546] hover:bg-slate-100'
              }`}
          >
            {selectedVideos.length === filteredVideos.length && filteredVideos.length > 0 ? 'Deselect All' : 'Select All'}
          </button>
          {selectedVideos.length > 0 && (
            <div className="px-5 py-2.5 bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-bold rounded-[10px]">
              {selectedVideos.length} Selected
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={expiryDays}
            onChange={e => setExpiryDays(e.target.value)}
            className="bg-[#F4F7FE] border border-slate-200 rounded-[10px] px-4 py-2.5 text-sm text-[#002546] font-bold focus:outline-none focus:ring-2 focus:ring-[#002546]/20 transition-all cursor-pointer hidden sm:block"
          >
            <option value="1">24 Hours</option>
            <option value="3">3 Days</option>
            <option value="7">7 Days</option>
            <option value="14">14 Days</option>
            <option value="30">30 Days</option>
          </select>
          <button
            onClick={generateAndCopyLink}
            disabled={creatingLink || selectedVideos.length === 0}
            className={`flex items-center justify-center gap-2 px-6 py-2.5 text-white text-sm font-bold rounded-[10px] transition-all w-full sm:w-auto shadow-md ${selectedVideos.length === 0 ? 'bg-slate-300 cursor-not-allowed' : 'bg-gradient-to-r from-red-600 to-orange-500 hover:shadow-lg hover:-translate-y-0.5'}`}
          >
            {creatingLink ? 'Creating...' : <><FiCopy className="w-4 h-4" /> Copy Video Link</>}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#002546] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="text-center py-20 text-[#A3AED0] font-bold text-lg">No videos found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.map(video => {
            const isSelected = selectedVideos.includes(video._id);
            const initialLetter = video.title ? video.title.charAt(0).toUpperCase() : 'V';
            const dynamicGradient = getDynamicGradient(video.title);

            return (
              <div
                key={video._id}
                onClick={() => toggleSelection(video._id)}
                className={`group relative aspect-[3/4] bg-white rounded-[20px] overflow-hidden cursor-pointer transition-all shadow-[0px_8px_24px_rgba(0,37,70,0.06)] hover:shadow-[0px_14px_34px_rgba(0,37,70,0.12)] hover:-translate-y-1 ${isSelected ? 'ring-4 ring-indigo-500/50' : 'ring-1 ring-slate-200'
                  }`}
              >
                {/* Clean, Premium Custom Showcase Card */}
                {video.thumbnail_url ? (
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    loading="lazy"
                    className="w-full h-[65%] object-cover border-b border-slate-100"
                  />
                ) : (
                  <div className={`w-full h-[65%] bg-gradient-to-br ${dynamicGradient} flex flex-col items-center justify-center p-6 text-center select-none border-b border-slate-100 relative overflow-hidden`}>
                     {/* Decorative subtle patterns */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-100/50 rounded-full blur-2xl -ml-10 -mb-10"></div>
                    
                    {/* Big Stylized Letter Badge */}
                    <div className="relative z-10 w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-all duration-300">
                      <span className="text-3xl font-extrabold text-[#002546]">
                        {initialLetter}
                      </span>
                    </div>
                  </div>
                )}

                {/* Selection Checkmark */}
                {isSelected && (
                  <div className="absolute top-4 right-4 z-25 w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                    <FiCheck className="w-5 h-5 text-white stroke-[3]" />
                  </div>
                )}

                {/* Play Button Icon Overlay (Only visible on hover over thumbnail area) */}
                <div
                  className="absolute top-0 left-0 right-0 h-[65%] flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-[#002546]/10 backdrop-blur-[1px]"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewVideo(video.drive_file_id);
                  }}
                >
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center hover:bg-[#002546] hover:text-white transition-all text-[#002546] shadow-xl">
                    <FiPlay className="w-5 h-5 ml-1" fill="currentColor" />
                  </div>
                </div>

                {/* Info Card at the bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-[35%] bg-white p-4 flex flex-col justify-between z-20">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-[#002546] font-bold px-2 py-0.5 bg-[#F4F7FE] rounded-md mb-1.5 inline-block border border-slate-100">
                      {video.category || 'Portfolio'}
                    </span>
                    <h3 className="text-[#002546] font-extrabold text-sm line-clamp-2 leading-snug">{video.title}</h3>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border capitalize shadow-sm ${STATUS_COLORS[video.status]}`}>
                      {video.status}
                    </span>
                    
                    {/* Hover Actions inside the white card (Approve, Reject, Delete) */}
                    <div className="flex gap-2">
                      {video.status === 'pending' && (
                        <>
                          <button
                            onClick={(e) => handleApprove(video._id, e)}
                            title="Approve"
                            className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-500 border border-emerald-100 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                          >
                            <FiCheck className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setRejectModal(video._id); }}
                            title="Reject"
                            className="w-7 h-7 rounded-full bg-amber-50 text-amber-500 border border-amber-100 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-all shadow-sm"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteModal(video._id); }}
                        title="Delete"
                        className="w-7 h-7 rounded-full bg-red-50 text-red-500 border border-red-100 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-[#002546]/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white border border-slate-100 rounded-[20px] p-8 w-full max-w-sm shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-50 border border-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTrash2 className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-[#002546] font-extrabold text-[20px] mb-2">Delete Video?</h3>
            <p className="text-[#A3AED0] font-medium text-sm mb-8">Are you sure you want to delete this video from Drive and the database? This action cannot be undone.</p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteModal(null)}
                className="flex-1 py-3 border border-slate-200 hover:bg-[#F4F7FE] text-[#002546] text-sm font-bold rounded-[12px] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-[12px] transition-all hover:shadow-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-[#002546]/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white border border-slate-100 rounded-[20px] p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-[#002546] font-extrabold text-[20px] mb-4">Reject Video</h3>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Reason for rejection (optional)..."
              rows={3}
              className="w-full bg-[#F4F7FE] border border-slate-200 rounded-[12px] px-5 py-4 text-sm text-[#002546] font-medium placeholder-[#A3AED0] focus:outline-none focus:ring-2 focus:ring-[#002546]/20 focus:border-[#002546] resize-none mb-6 transition-all"
            />
            <div className="flex gap-4">
              <button
                onClick={() => { setRejectModal(null); setRejectReason(''); }}
                className="flex-1 py-3 border border-slate-200 hover:bg-[#F4F7FE] text-[#002546] text-sm font-bold rounded-[12px] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-[12px] transition-all hover:shadow-lg"
              >
                Reject
              </button>
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