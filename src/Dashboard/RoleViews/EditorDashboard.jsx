import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiVideo, FiAlertCircle, FiLink2, FiSend } from 'react-icons/fi';

const EditorDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draftUrls, setDraftUrls] = useState({});

  useEffect(() => {
    // Mock API Call: fetch('/api/orders?editorAssigned=currentUserId')
    setTimeout(() => {
      setTasks([
        {
          _id: '201',
          clientInfo: { name: 'Initech' },
          status: 'In Editing',
          productionStates: {
            editorAssignment: { correctionNotes: [] }
          }
        },
        {
          _id: '202',
          clientInfo: { name: 'Umbrella Corp' },
          status: 'Revision in Progress',
          productionStates: {
            editorAssignment: {
              correctionNotes: [{ note: 'Make the logo bigger at 0:15', date: new Date().toISOString() }]
            }
          }
        }
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const handleUrlChange = (taskId, url) => {
    setDraftUrls(prev => ({ ...prev, [taskId]: url }));
  };

  const submitDraft = async (taskId) => {
    const draftVideoUrl = draftUrls[taskId];
    if (!draftVideoUrl) {
      alert('Please provide a draft video URL.');
      return;
    }

    try {
      // await axios.put(`/api/orders/${taskId}/submit-draft`, { draftVideoUrl });
      setTasks(tasks.filter(t => t._id !== taskId));
      alert('Draft submitted for review!');
    } catch (error) {
      console.error('Error submitting draft:', error);
      alert('Failed to submit draft.');
    }
  };

  if (loading) return <div className="flex justify-center py-16"><div className="w-7 h-7 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Editor Queue</h1>
          <p className="text-gray-500 text-sm mt-1">Manage active editing and revision tasks</p>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-16 text-gray-500 bg-[#111] border border-white/5 rounded-2xl">No active tasks at the moment</div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {tasks.map(task => {
            const isRevision = task.status === 'Revision in Progress';
            return (
              <div key={task._id} className="bg-[#111] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all flex flex-col">
                <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                      <FiVideo className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{task.clientInfo.name}</h3>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">Task ID: {task._id}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${isRevision
                      ? 'bg-red-500/10 text-red-400 border-red-500/20'
                      : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                    }`}>
                    {task.status}
                  </span>
                </div>

                <div className="flex-1 space-y-5">
                  {task.productionStates.editorAssignment.correctionNotes.length > 0 && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                      <h4 className="flex items-center gap-2 font-semibold text-red-400 text-sm mb-2">
                        <FiAlertCircle className="w-4 h-4" /> Revision Notes
                      </h4>
                      <ul className="list-disc pl-5 space-y-1.5 text-sm text-red-200/80">
                        {task.productionStates.editorAssignment.correctionNotes.map((note, idx) => (
                          <li key={idx}>{note.note}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <label className="flex items-center gap-2 text-xs text-gray-400 font-medium mb-2 uppercase tracking-wider">
                      <FiLink2 className="w-3.5 h-3.5" /> Draft Video URL (G-Drive, Frame.io)
                    </label>
                    <input type="url" placeholder="https://..."
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-all"
                      value={draftUrls[task._id] || ''}
                      onChange={e => handleUrlChange(task._id, e.target.value)} />
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5">
                  <button
                    onClick={() => submitDraft(task._id)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-purple-500/20">
                    <FiSend className="w-4 h-4" />
                    Submit Draft for Review
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EditorDashboard;
