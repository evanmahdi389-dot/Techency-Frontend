import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { FiEye, FiClock, FiCheckCircle, FiXCircle, FiTrash2 } from 'react-icons/fi';

const STATUS_CONFIG = {
  pending: { icon: FiClock, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
  approved: { icon: FiCheckCircle, color: 'text-green-400 bg-green-500/10 border-green-500/20' },
  rejected: { icon: FiXCircle, color: 'text-red-400 bg-red-500/10 border-red-500/20' },
};

export default function MyUploads() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewVideo, setPreviewVideo] = useState(null);

  const fetchVideos = async () => {
    try {
      const res = await api.get('/videos/my-uploads');
      setVideos(res.data.data || []);
    } catch { toast.error('Failed to fetch your uploads'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchVideos(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    try {
      await api.delete(`/videos/${id}`); // Assuming admin role or editor can delete own
      // Wait, standard API might only let admin delete. If so, this will fail for editor unless we adjust backend.
      // Assuming editor can't delete in current backend, let's keep it but handle error gracefully.
      // Wait, videoRoutes: router.delete('/:id', roleMiddleware(['admin']), ...)
      // So editors CANNOT delete. I'll remove the delete button for editors.
      toast.success('Video deleted');
      fetchVideos();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to delete'); }
  };

  return (
    <div>
      <Toaster position="top-center" />
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">My Uploads</h1>
        <p className="text-gray-500 text-sm mt-1">Track the approval status of your uploaded videos</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : videos.length === 0 ? (
        <div className="text-center py-16 text-gray-500">You haven't uploaded any videos yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {videos.map(video => {
            const StatusIcon = STATUS_CONFIG[video.status].icon;
            return (
              <div key={video._id} className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all flex flex-col group">
                {/* Thumbnail */}
                <div className="aspect-video w-full bg-black relative">
                  {video.thumbnail_url ? (
                    <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 bg-white/5">No Preview</div>
                  )}
                  {/* Status Badge */}
                  <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 backdrop-blur-md ${STATUS_CONFIG[video.status].color}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    <span className="capitalize">{video.status}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-white font-semibold text-lg line-clamp-1 mb-1" title={video.title}>{video.title}</h3>
                  <div className="text-xs text-gray-500 flex items-center gap-2 mb-3">
                    <span className="bg-white/5 px-2 py-0.5 rounded">{video.category}</span>
                    <span className="bg-white/5 px-2 py-0.5 rounded">{video.subcategory}</span>
                  </div>

                  {video.status === 'rejected' && video.rejectionReason && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mt-2 mb-3">
                      <p className="text-red-400 text-xs font-medium">Rejection Reason:</p>
                      <p className="text-red-300 text-sm mt-0.5">{video.rejectionReason}</p>
                    </div>
                  )}

                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
                    <span className="text-xs text-gray-600">{new Date(video.createdAt).toLocaleDateString()}</span>
                    <button
                      onClick={() => setPreviewVideo(video.drive_file_id)}
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1"
                    >
                      <FiEye className="w-4 h-4" /> Preview
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Preview Modal */}
      {previewVideo && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] px-4">
          <div className="bg-[#151515] border border-white/10 rounded-2xl p-4 w-full max-w-4xl shadow-2xl flex flex-col h-[80vh]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-semibold text-lg">Video Preview</h3>
              <button onClick={() => setPreviewVideo(null)} className="text-gray-400 hover:text-white transition-colors">
                <FiXCircle className="w-6 h-6" />
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
