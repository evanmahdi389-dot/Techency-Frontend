import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { FiUpload, FiX, FiVideo } from 'react-icons/fi';

export default function UploadVideo() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', category: '', subcategory: '', tags: '' });
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);

  useEffect(() => {
    api.get('/category').then(res => setCategories(res.data.data || []));
  }, []);

  const selectedCat = categories.find(c => c.name === form.category);

  const handleFile = (f) => {
    if (f && f.type.startsWith('video/')) setFile(f);
    else toast.error('Please select a video file only');
  };

  const addTag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const t = tagInput.trim().replace(/,$/, '');
      if (!tags.includes(t)) setTags(prev => [...prev, t]);
      setTagInput('');
    }
  };

  const removeTag = (t) => setTags(prev => prev.filter(x => x !== t));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please select a video file');
    if (!form.title || !form.category || !form.subcategory) return toast.error('Title, category and subcategory are required');

    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('category', form.category);
    formData.append('subcategory', form.subcategory);
    formData.append('tags', tags.join(','));

    try {
      await api.post('/videos/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => setProgress(Math.round((e.loaded * 100) / e.total))
      });
      toast.success('Video uploaded! Waiting for admin approval 🎉');
      setForm({ title: '', description: '', category: '', subcategory: '', tags: '' });
      setFile(null);
      setTags([]);
      setProgress(0);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <Toaster position="top-center" />
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Upload Video</h1>
        <p className="text-gray-500 text-sm mt-1">Upload a video — it will be sent for admin approval</p>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
            onClick={() => document.getElementById('editor-video-input').click()}
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
              dragOver ? 'border-blue-500 bg-blue-500/5' : file ? 'border-green-500/50 bg-green-500/5' : 'border-white/10 hover:border-white/20 bg-[#111]'
            }`}
          >
            <input id="editor-video-input" type="file" accept="video/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />
            {file ? (
              <div className="flex items-center justify-center gap-3 text-green-400">
                <FiVideo className="w-8 h-8" />
                <div className="text-left">
                  <p className="font-medium text-white">{file.name}</p>
                  <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                </div>
                <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); }} className="ml-2 text-gray-500 hover:text-red-400 transition-colors">
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div>
                <FiUpload className="w-10 h-10 mx-auto mb-3 text-gray-600" />
                <p className="font-medium text-gray-400">Drag & drop your video here</p>
                <p className="text-sm text-gray-600 mt-1">or click to browse • MP4, MOV, AVI • Max 500MB</p>
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Uploading to Google Drive...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-2 text-center">Please wait while your video is being uploaded...</p>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs text-gray-400 font-medium mb-2 uppercase tracking-wider">Title *</label>
            <input
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              placeholder="e.g. Organic Honey Product Video"
              className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs text-gray-400 font-medium mb-2 uppercase tracking-wider">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Brief description..."
              rows={2}
              className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-all resize-none"
            />
          </div>

          {/* Category + Subcategory */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 font-medium mb-2 uppercase tracking-wider">Category *</label>
              <select
                value={form.category}
                onChange={e => setForm(p => ({ ...p, category: e.target.value, subcategory: '' }))}
                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
              >
                <option value="">Select category</option>
                {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 font-medium mb-2 uppercase tracking-wider">Subcategory *</label>
              <select
                value={form.subcategory}
                onChange={e => setForm(p => ({ ...p, subcategory: e.target.value }))}
                disabled={!selectedCat}
                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-all disabled:opacity-40"
              >
                <option value="">Select subcategory</option>
                {selectedCat?.subcategories?.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs text-gray-400 font-medium mb-2 uppercase tracking-wider">Tags (press Enter or comma to add)</label>
            <div className="bg-[#111] border border-white/10 rounded-xl px-3 py-2 focus-within:border-blue-500 transition-all min-h-[48px] flex flex-wrap gap-2 items-center">
              {tags.map(t => (
                <span key={t} className="flex items-center gap-1 bg-blue-500/15 text-blue-400 text-xs px-2.5 py-1 rounded-full border border-blue-500/20">
                  {t}
                  <button type="button" onClick={() => removeTag(t)} className="hover:text-red-400 transition-colors"><FiX className="w-3 h-3" /></button>
                </span>
              ))}
              <input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={addTag}
                placeholder={tags.length === 0 ? 'organic, product, reel...' : ''}
                className="flex-1 min-w-24 bg-transparent text-sm text-white placeholder-gray-600 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white font-semibold rounded-xl transition-all disabled:opacity-60 shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
          >
            {uploading ? (
              <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Uploading...</>
            ) : (
              <><FiUpload className="w-5 h-5" /> Submit for Approval</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
