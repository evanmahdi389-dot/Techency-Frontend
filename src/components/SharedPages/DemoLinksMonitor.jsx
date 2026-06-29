import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { FiLink2, FiCopy, FiTrash2, FiExternalLink } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

export default function DemoLinksMonitor() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  const fetchLinks = async () => {
    try {
      const endpoint = user?.role === 'admin' ? '/demo/all' : '/demo/my';
      const res = await api.get(endpoint);
      setLinks(res.data.data || []);
    } catch { toast.error('Failed to fetch demo links'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchLinks(); }, []);

  const copyLink = (linkId) => {
    navigator.clipboard.writeText(`${window.location.origin}/demo/${linkId}`);
    toast.success('Link copied!');
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this demo link?')) return;
    try {
      await api.delete(`/demo/${id}`);
      toast.success('Demo link deleted');
      fetchLinks();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="font-sans text-[#002546] pb-10">
      <Toaster position="top-center" />
      <div className="mb-8">
        <h1 className="text-[26px] font-extrabold tracking-tight">Demo Links Monitor</h1>
        <p className="text-[#A3AED0] font-bold text-sm mt-1">
          {user?.role === 'admin' ? 'All generated demo links sent to clients' : 'Manage and share the demo links you\'ve created'}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-7 h-7 border-2 border-[#002546] border-t-transparent rounded-full animate-spin" /></div>
      ) : links.length === 0 ? (
        <div className="text-center py-20 text-[#A3AED0] flex flex-col items-center gap-3">
          <FiLink2 className="w-16 h-16 text-[#A3AED0] opacity-50" />
          <p className="font-bold">No demo links generated yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {links.map(link => (
            <div key={link._id} className="bg-white rounded-[20px] shadow-[0px_8px_24px_rgba(0,37,70,0.06)] border border-white hover:shadow-[0px_12px_28px_rgba(0,37,70,0.1)] transition-all p-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50/50 pointer-events-none"></div>
              <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center border border-orange-200">
                      <FiLink2 className="w-4 h-4 text-orange-500 stroke-[3]" />
                    </div>
                    <code className="text-[#002546] text-sm font-bold bg-[#F4F7FE] border border-slate-200 px-3 py-1 rounded-[8px] truncate">
                      /demo/{link.linkId}
                    </code>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold text-[#A3AED0]">
                    <span>Created by: <span className="text-[#002546]">{link.createdBy?.name || 'Unknown'}</span></span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#A3AED0]"></span> {link.videoIds?.length || 0} videos</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#A3AED0]"></span> {new Date(link.createdAt).toLocaleDateString()}</span>
                    {link.expiryDate && (
                      <span className={`flex items-center gap-1 ${new Date() > new Date(link.expiryDate) ? 'text-red-500' : 'text-emerald-500'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${new Date() > new Date(link.expiryDate) ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
                        {new Date() > new Date(link.expiryDate) ? 'Expired' : `Expires ${new Date(link.expiryDate).toLocaleDateString()}`}
                      </span>
                    )}
                  </div>
                  {/* Video thumbnails preview */}
                  {link.videoIds?.length > 0 && (
                    <div className="flex gap-2 mt-4 flex-wrap">
                      {link.videoIds.slice(0, 5).map(v => (
                        <div key={v._id} className="w-14 h-10 rounded-[8px] bg-[#F4F7FE] border border-slate-200 overflow-hidden flex-shrink-0 shadow-sm">
                          {v.thumbnail_url ? (
                            <img src={v.thumbnail_url} alt={v.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#A3AED0] font-bold text-xs">V</div>
                          )}
                        </div>
                      ))}
                      {link.videoIds.length > 5 && (
                        <div className="w-14 h-10 rounded-[8px] bg-[#F4F7FE] border border-slate-200 flex items-center justify-center text-[#002546] font-bold text-xs shadow-sm">
                          +{link.videoIds.length - 5}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 mt-4 md:mt-0">
                  <a
                    href={`/demo/${link.linkId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 rounded-[10px] bg-[#F4F7FE] border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-[#002546] transition-all shadow-sm"
                    title="Open demo"
                  >
                    <FiExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => copyLink(link.linkId)}
                    className="w-10 h-10 rounded-[10px] bg-[#F4F7FE] border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-[#002546] transition-all shadow-sm"
                    title="Copy link"
                  >
                    <FiCopy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(link._id)}
                    className="w-10 h-10 rounded-[10px] bg-red-50 hover:bg-red-100 border border-red-100 flex items-center justify-center text-red-500 hover:shadow-sm transition-all"
                    title="Delete"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
