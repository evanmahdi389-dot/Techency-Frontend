import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiCheckCircle, FiUser, FiArrowRight, FiVideo, FiMessageSquare } from 'react-icons/fi';

const PMDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEditor, setSelectedEditor] = useState('');
  const [correctionText, setCorrectionText] = useState('');
  const [editors, setEditors] = useState([{ _id: 'e1', name: 'Alice Editor' }, { _id: 'e2', name: 'Bob Editor' }]);

  const fetchOrders = async () => {
    try {
      // Mocked axios call. You would use: const res = await axios.get('/api/orders'); setOrders(res.data);
      const mockOrders = [
        { _id: '1', clientInfo: { name: 'Acme Corp' }, status: 'Pending PM Review', productCourierTracking: { status: 'On the Way' }, productionStates: { shootTracking: { totalVideos: 0, shotCompleted: 0, remaining: 0 } } },
        { _id: '2', clientInfo: { name: 'Beta Ltd' }, status: 'Script Submitted', productionStates: { shootTracking: { totalVideos: 0, shotCompleted: 0, remaining: 0 } } },
        { _id: '3', clientInfo: { name: 'Gamma Inc' }, status: 'Ready for Shoot', productionStates: { shootTracking: { totalVideos: 5, shotCompleted: 2, remaining: 3 } } },
        { _id: '4', clientInfo: { name: 'Delta LLC' }, status: 'Review Pending', productionStates: { shootTracking: { totalVideos: 0, shotCompleted: 0, remaining: 0 } } }
      ];
      setOrders(mockOrders);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch orders');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleAction = async (id, actionType, payload) => {
    // Make corresponding API call here
    console.log(`Action: ${actionType} on Order ${id} with Payload:`, payload);

    // Optimistic UI update for demo
    setOrders(prev => prev.filter(o => o._id !== id));

    // In real scenario:
    // await axios.put(`/api/orders/${id}/${actionType}`, payload);
    // fetchOrders();
  };

  const columns = ['Pending PM Review', 'Script Submitted', 'Ready for Shoot', 'Review Pending'];

  if (loading) return <div className="flex justify-center py-16"><div className="w-7 h-7 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">PM Pipeline Matrix</h1>
          <p className="text-gray-500 text-sm mt-1">Drag and oversee orders across the production lifecycle</p>
        </div>
      </div>

      <div className="flex gap-6 flex-1 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {columns.map(statusCol => {
          const colTasks = orders.filter(o => o.status === statusCol);
          return (
            <div key={statusCol} className="flex-none w-[340px] bg-[#111] rounded-2xl flex flex-col border border-white/5 overflow-hidden">
              <div className="p-4 bg-white/2 border-b border-white/5 sticky top-0 z-10 flex items-center justify-between">
                <span className="font-semibold text-white text-sm uppercase tracking-wider">{statusCol}</span>
                <span className="bg-indigo-500/20 text-indigo-400 text-xs px-2 py-0.5 rounded-full font-bold">{colTasks.length}</span>
              </div>

              <div className="p-4 flex-1 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent">
                {colTasks.map(order => (
                  <div key={order._id} className="bg-[#151515] p-5 rounded-xl border border-white/5 hover:border-indigo-500/30 hover:-translate-y-0.5 transition-all shadow-lg flex flex-col gap-3 group">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-white text-base leading-tight">{order.clientInfo.name}</h3>
                        <div className="text-[11px] text-gray-500 font-mono mt-1">ID: {order._id}</div>
                      </div>
                    </div>

                    {statusCol === 'Pending PM Review' && (
                      <div className="space-y-3 pt-2 border-t border-white/5">
                        <p className="text-xs text-gray-400 font-medium">Product Status: <span className="text-indigo-400">{order.productCourierTracking?.status}</span></p>
                        <button onClick={() => handleAction(order._id, 'approve-order', { writerId: 'w1' })} className="w-full flex justify-center items-center gap-2 py-2 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 text-white rounded-lg text-xs font-semibold transition-all">
                          Assign Writer <FiArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    {statusCol === 'Script Submitted' && (
                      <div className="space-y-3 pt-2 border-t border-white/5">
                        <button onClick={() => handleAction(order._id, 'approve-script', {})} className="w-full flex justify-center items-center gap-2 py-2 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white rounded-lg text-xs font-semibold transition-all">
                          <FiCheckCircle className="w-3.5 h-3.5" /> Approve Script
                        </button>
                      </div>
                    )}

                    {statusCol === 'Ready for Shoot' && (
                      <div className="space-y-3 pt-2 border-t border-white/5">
                        <div className="flex justify-between text-xs text-gray-400 bg-black/40 p-2 rounded-lg border border-white/5">
                          <span className="text-center w-1/3 border-r border-white/5">Total<br /><span className="text-white font-bold text-sm">{order.productionStates.shootTracking.totalVideos}</span></span>
                          <span className="text-center w-1/3 border-r border-white/5">Done<br /><span className="text-green-400 font-bold text-sm">{order.productionStates.shootTracking.shotCompleted}</span></span>
                          <span className="text-center w-1/3">Left<br /><span className="text-orange-400 font-bold text-sm">{order.productionStates.shootTracking.remaining}</span></span>
                        </div>
                        <div className="relative">
                          <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-3.5 h-3.5" />
                          <select className="w-full text-xs pl-9 pr-3 py-2 bg-black border border-white/10 rounded-lg outline-none text-white focus:border-indigo-500 transition-all appearance-none" value={selectedEditor} onChange={e => setSelectedEditor(e.target.value)}>
                            <option value="">Assign Editor...</option>
                            {editors.map(e => <option key={e._id} value={e._id}>{e.name}</option>)}
                          </select>
                        </div>
                        <button onClick={() => handleAction(order._id, 'update-shoot', { shotCompleted: order.productionStates.shootTracking.shotCompleted + 1, remaining: Math.max(0, order.productionStates.shootTracking.remaining - 1), editorId: selectedEditor })} className="w-full flex justify-center items-center gap-2 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold transition-all border border-white/10">
                          <FiVideo className="w-3.5 h-3.5" /> Log 1 Shoot Completed
                        </button>
                      </div>
                    )}

                    {statusCol === 'Review Pending' && (
                      <div className="space-y-3 pt-2 border-t border-white/5">
                        <div className="relative">
                          <FiMessageSquare className="absolute left-3 top-2.5 text-gray-500 w-3.5 h-3.5" />
                          <textarea placeholder="Type correction notes here..." className="w-full text-xs pl-9 pr-3 py-2.5 bg-black border border-white/10 rounded-lg outline-none text-white focus:border-indigo-500 transition-all resize-none placeholder-gray-600 h-20" value={correctionText} onChange={e => setCorrectionText(e.target.value)}></textarea>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleAction(order._id, 'process-review', { action: 'reject', correctionNote: correctionText })} className="flex-1 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg text-xs font-semibold transition-all">Reject</button>
                          <button onClick={() => handleAction(order._id, 'process-review', { action: 'approve' })} className="flex-1 py-2 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white rounded-lg text-xs font-semibold transition-all">Approve</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {colTasks.length === 0 && (
                  <div className="text-center text-xs text-gray-600 py-8 bg-black/20 rounded-xl border border-white/5 border-dashed">
                    No tasks in this column
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PMDashboard;
