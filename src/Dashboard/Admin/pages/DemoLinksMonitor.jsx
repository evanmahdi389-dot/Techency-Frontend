import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { FiLink2, FiCopy, FiTrash2, FiExternalLink } from 'react-icons/fi';

export default function DemoLinksMonitor() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLinks = async () => {
    try {
      const res = await api.get('/demo/all');
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
    <div>
      <Toaster position="top-center" />
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Demo Links Monitor</h1>
        <p className="text-gray-500 text-sm mt-1">All generated demo links sent to clients</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-7 h-7 border-2 border-red-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : links.length === 0 ? (
        <div className="text-center py-16 text-gray-500 flex flex-col items-center gap-3">
          <FiLink2 className="w-12 h-12 text-gray-700" />
          <p>No demo links generated yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {links.map(link => (
            <div key={link._id} className="bg-[#111] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <FiLink2 className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    <code className="text-orange-400 text-sm font-mono bg-orange-500/10 px-2 py-0.5 rounded truncate">
                      /demo/{link.linkId}
                    </code>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                    <span>Created by: <span className="text-gray-300">{link.createdBy?.name || 'Unknown'}</span></span>
                    <span>{link.videoIds?.length || 0} videos</span>
                    <span>{new Date(link.createdAt).toLocaleDateString()}</span>
                    {link.expiryDate && (
                      <span className={new Date() > new Date(link.expiryDate) ? 'text-red-400' : 'text-green-400'}>
                        {new Date() > new Date(link.expiryDate) ? 'Expired' : `Expires ${new Date(link.expiryDate).toLocaleDateString()}`}
                      </span>
                    )}
                  </div>
                  {/* Video thumbnails preview */}
                  {link.videoIds?.length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {link.videoIds.slice(0, 5).map(v => (
                        <div key={v._id} className="w-12 h-9 rounded bg-white/5 border border-white/10 overflow-hidden flex-shrink-0">
                          {v.thumbnail_url ? (
                            <img src={v.thumbnail_url} alt={v.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-700 text-xs">V</div>
                          )}
                        </div>
                      ))}
                      {link.videoIds.length > 5 && (
                        <div className="w-12 h-9 rounded bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 text-xs">
                          +{link.videoIds.length - 5}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={`/demo/${link.linkId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                    title="Open demo"
                  >
                    <FiExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => copyLink(link.linkId)}
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                    title="Copy link"
                  >
                    <FiCopy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(link._id)}
                    className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 transition-all"
                    title="Delete"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
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
