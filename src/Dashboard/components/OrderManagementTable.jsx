import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const OrderManagementTable = ({ role }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for modals
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCourierModal, setShowCourierModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [paymentAmount, setPaymentAmount] = useState('');
  const [courierData, setCourierData] = useState({
    deliveryMode: 'Courier', courierName: '', trackingId: ''
  });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.put(`/orders/${id}/approve-without-payment`, { role });
      alert('Order approved successfully');
      fetchOrders();
    } catch (error) {
      alert('Failed to approve order');
    }
  };

  const handlePaymentSubmit = async () => {
    if (!paymentAmount || isNaN(paymentAmount)) return alert('Enter a valid amount');
    try {
      await api.put(`/orders/${selectedOrder._id}/update-payment`, { amount: Number(paymentAmount) });
      alert('Payment updated successfully');
      setShowPaymentModal(false);
      fetchOrders();
    } catch (error) {
      alert('Failed to update payment');
    }
  };

  const handleCourierSubmit = async () => {
    try {
      await api.put(`/orders/${selectedOrder._id}/update-courier`, courierData);
      alert('Courier updated successfully');
      setShowCourierModal(false);
      fetchOrders();
    } catch (error) {
      alert('Failed to update courier');
    }
  };

  if (loading) return <div className="p-4 text-center">Loading Orders...</div>;

  return (
    <div className="w-full">
      <div className="overflow-x-auto bg-white rounded-[6px] border border-[#EAEFF5] shadow-[0px_12px_28px_rgba(0,37,70,0.08)] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-thumb]:bg-[#002546]/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#002546]/30 transition-all pb-2">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-[#e0e2e6] text-[#002546] border-b border-[#EAEFF5] whitespace-nowrap font-extrabold">
            <tr>
              <th className="px-4 py-4 font-semibold">Order Details</th>
              <th className="px-4 py-4 font-semibold">Client & Business</th>
              <th className="px-4 py-4 font-semibold">Service Info</th>
              <th className="px-4 py-4 font-semibold">Models & Content</th>
              <th className="px-4 py-4 font-semibold">Billing</th>
              <th className="px-4 py-4 font-semibold">Courier</th>
              <th className="px-4 py-4 font-semibold text-center">Status</th>
              <th className="px-4 py-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="whitespace-nowrap">
            {orders.map((order) => (
              <tr key={order._id} className="border-b border-[#EAEFF5] last:border-b-0 hover:bg-[#e0e2e6] transition-colors font-bold text-[#A3AED0]">
                <td className="px-4 py-4">
                  <div className="text-[#002546]">ID: <span className="font-mono">{order._id?.slice(-6)}</span></div>
                  <div className="text-xs text-gray-500">Src: {order.clientInfo?.orderSource}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-[#002546]">{order.clientInfo?.name}</div>
                  <div className="text-xs">{order.clientInfo?.phone}</div>
                  <div className="text-xs font-semibold text-gray-500">{order.clientInfo?.businessName}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-[#002546]">{order.serviceDetails?.serviceType}</div>
                  {order.serviceDetails?.location && <div className="text-[10px] text-gray-500 font-semibold mb-1">Loc: {order.serviceDetails.location}</div>}
                  {order.serviceDetails?.expectedShootDate && <div className="text-[10px] text-gray-400">Shoot: {new Date(order.serviceDetails.expectedShootDate).toLocaleDateString()}</div>}
                  {order.serviceDetails?.expectedDeliveryDate && <div className="text-[10px] text-gray-400">Delivery: {new Date(order.serviceDetails.expectedDeliveryDate).toLocaleDateString()}</div>}
                </td>
                <td className="px-4 py-4">
                  {order.serviceDetails?.serviceType?.toLowerCase().includes('video editing') ? (
                    <div className="flex flex-col gap-1.5 min-w-[140px]">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-[11px] font-bold inline-block w-max">Video Editing</span>
                      <div className="text-[11px] text-[#002546]">Links: <span className="font-normal text-gray-500 break-all">{order.modelCasting?.clientVideoLink || 'N/A'}</span></div>
                      <div className="text-[11px] text-[#002546]">Content: <span className="font-bold text-gray-500">{order.modelCasting?.numberOfContent || '0'}</span></div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 min-w-[160px]">
                      <div className="flex gap-1 flex-wrap">
                        {order.modelCasting?.modelTypes?.map((type, i) => (
                           <span key={i} className="bg-[#EAEFF5] text-[#002546] px-2 py-0.5 rounded text-[10px] font-bold">{type}</span>
                        )) || <span className="text-gray-400 text-[10px]">-</span>}
                      </div>
                      
                      <div className="flex flex-col gap-1 text-[11px]">
                        {order.modelCasting?.modelIds?.length > 0 
                          ? order.modelCasting.modelIds.map((m, i) => (
                              <div key={m._id || i} className="bg-[#f4f7fe] border border-[#EAEFF5] px-2 py-1 rounded flex justify-between items-center gap-2">
                                <span className="text-[#002546] font-semibold truncate max-w-[100px]">{i + 1}. {m.name}</span>
                                {order.modelCasting.modelContents?.[m._id] && (
                                   <span className="bg-white px-1.5 py-0.5 rounded text-[9px] text-gray-500 font-bold shadow-sm border border-gray-100 shrink-0">
                                     Qty: {order.modelCasting.modelContents[m._id]}
                                   </span>
                                )}
                              </div>
                            ))
                          : <span className="text-gray-400 text-[10px] italic">No models selected</span>}
                      </div>

                      <div className="grid grid-cols-2 gap-1 text-[10px] mt-1">
                        <div className="bg-gray-50 p-1 rounded border border-gray-100 text-center">
                          <span className="text-gray-400 block mb-0.5">Videos</span>
                          <span className="font-bold text-[#002546]">{order.modelCasting?.totalContent || '0'}</span>
                        </div>
                        <div className="bg-gray-50 p-1 rounded border border-gray-100 text-center">
                          <span className="text-gray-400 block mb-0.5">Photos</span>
                          <span className="font-bold text-[#002546]">{order.modelCasting?.numberOfProductImages || '0'}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </td>
                <td className="px-4 py-4">
                  <div>Total: ৳{order.billing?.total}</div>
                  <div className="text-green-500">Paid: ৳{order.billing?.paid}</div>
                  <div className="text-red-400">Due: ৳{order.billing?.due}</div>
                </td>
                <td className="px-4 py-4">
                  <div className={`px-2 py-1 text-[10px] rounded border inline-block ${order.productCourierTracking?.status === 'Not Sent Yet' ? 'bg-yellow-500/20 text-yellow-600 border-yellow-200' : 'bg-blue-500/20 text-blue-600 border-blue-200'}`}>
                    {order.productCourierTracking?.status || 'Unknown'}
                  </div>
                  {order.productCourierTracking?.status !== 'Not Sent Yet' && (
                     <div className="text-[10px] mt-1 text-gray-500">
                        <div>{order.productCourierTracking?.deliveryMode} - {order.productCourierTracking?.courierName}</div>
                        {order.productCourierTracking?.trackingId && <div>Track: {order.productCourierTracking.trackingId}</div>}
                     </div>
                  )}
                </td>
                <td className="px-4 py-4 text-center">
                  <span className="px-2 py-1 bg-gray-200 text-[#002546] text-xs rounded-full">{order.status}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-center gap-2">
                    {/* Pay Now logic for Sales */}
                    {order.status === 'Pay Now' && role === 'Sales Executive' && (
                      <button onClick={() => { setSelectedOrder(order); setShowPaymentModal(true); setPaymentAmount(''); }} className="px-3 py-1 bg-red-500 text-white rounded text-xs">
                        Pay Now
                      </button>
                    )}

                    {/* Approve Logic for Admin / PM */}
                    {order.status === 'Pay Now' && (role === 'Admin' || role === 'Project Manager') && (
                      <button onClick={() => handleApprove(order._id)} className="px-3 py-1 bg-green-500 text-white rounded text-xs">
                        Approve
                      </button>
                    )}

                    {/* Add Product Logic */}
                    {order.productCourierTracking?.status === 'Not Sent Yet' && (
                      <button onClick={() => { setSelectedOrder(order); setShowCourierModal(true); }} className="px-3 py-1 bg-[#002546] text-white rounded text-xs">
                        Add Product
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4 text-[#002546]">Update Payment</h3>
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-1">Payment Amount (৳)</label>
              <input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} className="w-full border rounded p-2" placeholder="Amount" />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowPaymentModal(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={handlePaymentSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
            </div>
          </div>
        </div>
      )}

      {/* Courier Modal */}
      {showCourierModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4 text-[#002546]">Add Courier Info</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Delivery Mode</label>
                <input type="text" value={courierData.deliveryMode} onChange={(e) => setCourierData({...courierData, deliveryMode: e.target.value})} className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Courier Name</label>
                <input type="text" value={courierData.courierName} onChange={(e) => setCourierData({...courierData, courierName: e.target.value})} className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Tracking ID</label>
                <input type="text" value={courierData.trackingId} onChange={(e) => setCourierData({...courierData, trackingId: e.target.value})} className="w-full border rounded p-2" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowCourierModal(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={handleCourierSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagementTable;
