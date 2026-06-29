import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiEdit3, FiFileText, FiLink2, FiSend } from 'react-icons/fi';

const WriterDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scriptData, setScriptData] = useState({});

  useEffect(() => {
    // Mock API Call: fetch('/api/orders?status=In Scripting&writerAssigned=currentUserId')
    setTimeout(() => {
      setTasks([
        { _id: '101', clientInfo: { name: 'Acme Corp' }, status: 'In Scripting', serviceDetails: { serviceType: 'Indoor' } },
        { _id: '102', clientInfo: { name: 'Globex' }, status: 'In Scripting', serviceDetails: { serviceType: 'Outdoor' } }
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const handleScriptChange = (taskId, field, value) => {
    setScriptData(prev => ({
      ...prev,
      [taskId]: {
        ...(prev[taskId] || { text: '', fileUrl: '' }),
        [field]: value
      }
    }));
  };

  const submitScript = async (taskId) => {
    const data = scriptData[taskId] || { text: '', fileUrl: '' };
    if (!data.text && !data.fileUrl) {
      alert('Please provide either script text or a file URL.');
      return;
    }

    try {
      // await axios.put(`/api/orders/${taskId}/submit-script`, data);
      setTasks(tasks.filter(t => t._id !== taskId));
      alert('Script submitted successfully for review!');
    } catch (error) {
      console.error('Error submitting script:', error);
      alert('Failed to submit script.');
    }
  };

  if (loading) return <div className="flex justify-center py-16"><div className="w-7 h-7 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Writer Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and submit your assigned script tasks</p>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-16 text-gray-500 bg-[#111] border border-white/5 rounded-2xl">No active tasks at the moment</div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {tasks.map(task => (
            <div key={task._id} className="bg-[#111] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all flex flex-col">
              <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                    <FiEdit3 className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{task.clientInfo.name}</h3>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">{task.serviceDetails.serviceType} Service</p>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full border bg-orange-500/10 text-orange-400 border-orange-500/20 font-medium">
                  {task.status}
                </span>
              </div>

              <div className="space-y-5 flex-1">
                <div>
                  <label className="flex items-center gap-2 text-xs text-gray-400 font-medium mb-2 uppercase tracking-wider">
                    <FiLink2 className="w-3.5 h-3.5" /> Script URL
                  </label>
                  <input type="url" placeholder="https://docs.google.com/..."
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-all"
                    value={scriptData[task._id]?.fileUrl || ''}
                    onChange={e => handleScriptChange(task._id, 'fileUrl', e.target.value)} />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs text-gray-400 font-medium mb-2 uppercase tracking-wider">
                    <FiFileText className="w-3.5 h-3.5" /> Or Paste Script Text
                  </label>
                  <textarea rows="4" placeholder="Enter full script text here..."
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-all resize-none"
                    value={scriptData[task._id]?.text || ''}
                    onChange={e => handleScriptChange(task._id, 'text', e.target.value)}></textarea>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5">
                <button
                  onClick={() => submitScript(task._id)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-orange-500/20">
                  <FiSend className="w-4 h-4" />
                  Submit Script for Review
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WriterDashboard;
