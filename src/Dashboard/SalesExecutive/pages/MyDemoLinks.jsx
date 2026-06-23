import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { FiLink2, FiCopy, FiTrash2, FiExternalLink, FiClock } from 'react-icons/fi';

export default function MyDemoLinks() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLinks = async () => {
    try {
      const res = await api.get('/demo/my');
      setLinks(res.data.data || []);
    } catch { toast.error('Failed to fetch your demo links'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchLinks(); }, []);

  const copyLink = (linkId) => {
    navigator.clipboard.writeText(`${window.location.origin}/demo/${linkId}`);
    toast.success('Link copied!');
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this link?')) return;
    try {
      await api.delete(`/demo/${id}`);
      toast.success('Demo link deleted');
      fetchLinks();
    } catch { toast.error('Failed to delete link'); }
  };

  return (
    <div>
      <Toaster position="top-center" />
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">My Demo Links</h1>
        <p className="text-gray-500 text-sm mt-1">Manage and share the demo links you've created</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : links.length === 0 ? (
        <div className="text-center py-20 text-gray-500 flex flex-col items-center gap-3 bg-[#111] border border-white/5 rounded-2xl">
          <FiLink2 className="w-12 h-12 text-gray-700" />
          <p>You haven't created any demo links yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {links.map(link => {
            const isExpired = link.expiryDate && new Date() > new Date(link.expiryDate);
            return (
              <div key={link._id} className="bg-[#111] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all flex flex-col">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
                      <FiLink2 className="w-5 h-5" />
                    </div>
                    <div>
                      <code className="text-white text-sm font-mono block mb-1">/demo/{link.linkId}</code>
                      <p className="text-xs text-gray-500 flex items-center gap-1.5">
                        <FiClock className="w-3.5 h-3.5" />
                        Created {new Date(link.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  {isExpired ? (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-red-500/10 text-red-400 border border-red-500/20">Expired</span>
                  ) : link.expiryDate ? (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                      Expires {new Date(link.expiryDate).toLocaleDateString()}
                    </span>
                  ) : null}
                </div>

                {/* Video Previews */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                  {link.videoIds?.map((v, i) => (
                    <div key={i} className="w-20 h-12 rounded-lg bg-black border border-white/10 overflow-hidden flex-shrink-0 relative group">
                      {v.thumbnail_url ? (
                        <img src={v.thumbnail_url} alt={v.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-700 text-[10px]">No Thumb</div>
                      )}
                    </div>
                  ))}
                  <div className="flex items-center text-xs text-gray-500 ml-2 whitespace-nowrap">
                    {link.videoIds?.length} video{link.videoIds?.length !== 1 ? 's' : ''}
                  </div>
                </div>

                <div className="mt-auto flex gap-2 pt-4 border-t border-white/5">
                  <a
                    href={`/demo/${link.linkId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <FiExternalLink className="w-4 h-4" /> Open
                  </a>
                  <button
                    onClick={() => copyLink(link.linkId)}
                    className="flex-1 py-2.5 bg-green-600/20 hover:bg-green-600/30 text-green-400 text-sm font-medium rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <FiCopy className="w-4 h-4" /> Copy
                  </button>
                  <button
                    onClick={() => handleDelete(link._id)}
                    className="w-11 h-11 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all flex items-center justify-center flex-shrink-0"
                    title="Delete Link"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
