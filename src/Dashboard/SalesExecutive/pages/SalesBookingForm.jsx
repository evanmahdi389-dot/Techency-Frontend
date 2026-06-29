import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SalesBookingForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    clientInfo: { name: '', businessName: '', phone: '', email: '', address: '', orderSource: 'WhatsApp' },
    productCourierTracking: { deliveryMode: 'Courier', courierName: '', trackingId: '', status: 'Not Sent Yet' },
    serviceDetails: { serviceType: 'Indoor', location: '', expectedShootDate: '', expectedDeliveryDate: '' },
    modelCasting: { numberOfModels: 0, modelTypes: [], modelIds: [] },
    billing: { total: 0, paid: 0, due: 0, method: 'Cash', notes: '' }
  });

  const [settings, setSettings] = useState({ orderSources: [], serviceTypes: [] });
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setSettings({
      orderSources: ['In Office', 'WhatsApp', 'Messenger', 'Phone Call'],
      serviceTypes: ['Indoor', 'Outdoor']
    });
    setModels([
      { _id: '1', name: 'John Doe', gender: 'Male' },
      { _id: '2', name: 'Jane Smith', gender: 'Female' }
    ]);
    setLoading(false);
  }, []);

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handlePrev = () => setStep(prev => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      payload.billing.due = payload.billing.total - payload.billing.paid;
      // await axios.post('/api/orders', payload);
      alert('Order created successfully!');
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert('Error creating order');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="text-[#002546] w-full h-full p-4 md:p-6">
      {!showForm ? (
        <div className="w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-[26px] font-extrabold text-[#002546]">Order Management</h2>
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative">
                <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A3AED0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <input type="text" placeholder="Search videos..." className="bg-white border border-slate-200 rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#002546] w-64 text-[#002546] placeholder-[#A3AED0] font-bold" />
              </div>
              <select className="bg-white border border-slate-200 rounded-md px-4 py-2 text-sm focus:outline-none focus:border-[#002546] text-[#002546] font-bold">
                <option>---Status---</option>
              </select>
              <button onClick={() => setShowForm(true)} className="bg-[#002546] hover:bg-[#013f77] text-white px-4 py-2 rounded-md font-bold flex items-center gap-2 transition-colors text-sm whitespace-nowrap shadow-[0_4px_12px_rgba(0,37,70,0.15)]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                Add New Order
              </button>
            </div>
          </div>

          <div className="overflow-x-auto bg-white rounded-[6px] border border-[#EAEFF5] shadow-[0px_12px_28px_rgba(0,37,70,0.08)] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-thumb]:bg-[#002546]/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#002546]/30 transition-all pb-2">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-[#F4F7FE] text-[#002546] border-b border-[#EAEFF5] whitespace-nowrap font-extrabold">
                <tr>
                  <th className="px-4 py-4 font-semibold">Order ID</th>
                  <th className="px-4 py-4 font-semibold">Order Type</th>
                  <th className="px-4 py-4 font-semibold">Customer Name</th>
                  <th className="px-4 py-4 font-semibold">Business Name</th>
                  <th className="px-4 py-4 font-semibold">Phone</th>
                  <th className="px-4 py-4 font-semibold">Service Type</th>
                  <th className="px-4 py-4 font-semibold text-center">Total Content</th>
                  <th className="px-4 py-4 font-semibold text-center">Number Of Media</th>
                  <th className="px-4 py-4 font-semibold">Model Type</th>
                  <th className="px-4 py-4 font-semibold">Model Name</th>
                  <th className="px-4 py-4 font-semibold text-center">Total Amount</th>
                  <th className="px-4 py-4 font-semibold text-center">Paid Amount</th>
                  <th className="px-4 py-4 font-semibold text-center">Deu Amount</th>
                  <th className="px-4 py-4 font-semibold text-center">Status</th>
                  <th className="px-4 py-4 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="whitespace-nowrap">
                {/* Mock Data Row */}
                <tr className="border-b border-[#EAEFF5] hover:bg-[#F4F7FE] transition-colors font-bold text-[#A3AED0]">
                  <td className="px-4 py-4">701</td>
                  <td className="px-4 py-4">Whatsapp</td>
                  <td className="px-4 py-4">Md Sadiqur</td>
                  <td className="px-4 py-4">Gawzia Mart</td>
                  <td className="px-4 py-4">01306359111</td>
                  <td className="px-4 py-4">Indoor</td>
                  <td className="px-4 py-4 text-center">05</td>
                  <td className="px-4 py-4 text-center">02</td>
                  <td className="px-4 py-4">Male & Female</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1 text-xs">
                      <span className="bg-[#F4F7FE] px-2 py-1 rounded text-[#002546]">1.Saif</span>
                      <span className="bg-[#F4F7FE] px-2 py-1 rounded text-[#002546]">2.Ridi</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">5000</td>
                  <td className="px-4 py-4 text-center">2500</td>
                  <td className="px-4 py-4 text-center">2500</td>
                  <td className="px-4 py-4 text-center">
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full border border-yellow-500/30">Pending</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button className="text-[#A3AED0] hover:text-[#002546] transition-colors" title="View">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      </button>
                      <button className="text-green-500 hover:text-green-400 transition-colors" title="Edit">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button className="text-red-500 hover:text-red-400 transition-colors" title="Delete">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-[0px_12px_28px_rgba(0,37,70,0.08)] mt-8 border border-slate-100 relative">
          <button onClick={() => setShowForm(false)} className="absolute top-6 right-6 text-[#A3AED0] hover:text-red-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          <h2 className="text-[26px] font-extrabold mb-6 border-b border-[#EAEFF5] pb-4 pr-10 text-[#002546]">New Order Booking</h2>

          {/* Progress Bar */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className={`flex-1 h-2 rounded-full mx-1 transition-colors ${step >= s ? 'bg-green-500' : 'bg-[#EAEFF5]'}`} />
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Client Info */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-xl font-extrabold mb-4 text-[#002546]">Client Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Client Name" className="p-3 bg-[#F4F7FE] border border-slate-200 rounded-lg w-full focus:ring-2 focus:ring-[#002546] outline-none text-[#002546] placeholder-[#A3AED0] font-bold" required
                    value={formData.clientInfo.name} onChange={(e) => handleChange('clientInfo', 'name', e.target.value)} />
                  <input type="text" placeholder="Business Name" className="p-3 bg-[#F4F7FE] border border-slate-200 rounded-lg w-full focus:ring-2 focus:ring-[#002546] outline-none text-[#002546] placeholder-[#A3AED0] font-bold"
                    value={formData.clientInfo.businessName} onChange={(e) => handleChange('clientInfo', 'businessName', e.target.value)} />
                  <input type="text" placeholder="Phone" className="p-3 bg-[#F4F7FE] border border-slate-200 rounded-lg w-full focus:ring-2 focus:ring-[#002546] outline-none text-[#002546] placeholder-[#A3AED0] font-bold" required
                    value={formData.clientInfo.phone} onChange={(e) => handleChange('clientInfo', 'phone', e.target.value)} />

                  <select className="p-3 bg-[#F4F7FE] border border-slate-200 rounded-lg w-full focus:ring-2 focus:ring-[#002546] outline-none text-[#002546] font-bold"
                    value={formData.clientInfo.orderSource} onChange={(e) => handleChange('clientInfo', 'orderSource', e.target.value)}>
                    {settings.orderSources.map(src => <option key={src} value={src}>{src}</option>)}
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: Courier Tracking */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-xl font-extrabold mb-4 text-[#002546]">Product Tracking</h3>
                {formData.clientInfo.orderSource === 'In Office' ? (
                  <div className="p-4 bg-green-50 text-green-600 border border-green-100 rounded-lg font-bold">Product received in office.</div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Courier Name" className="p-3 bg-[#F4F7FE] border border-slate-200 rounded-lg w-full focus:ring-2 focus:ring-[#002546] outline-none text-[#002546] placeholder-[#A3AED0] font-bold"
                      value={formData.productCourierTracking.courierName} onChange={(e) => handleChange('productCourierTracking', 'courierName', e.target.value)} />
                    <input type="text" placeholder="Tracking ID" className="p-3 bg-[#F4F7FE] border border-slate-200 rounded-lg w-full focus:ring-2 focus:ring-[#002546] outline-none text-[#002546] placeholder-[#A3AED0] font-bold"
                      value={formData.productCourierTracking.trackingId} onChange={(e) => handleChange('productCourierTracking', 'trackingId', e.target.value)} />
                    <select className="p-3 bg-[#F4F7FE] border border-slate-200 rounded-lg w-full focus:ring-2 focus:ring-[#002546] outline-none col-span-2 text-[#002546] font-bold"
                      value={formData.productCourierTracking.status} onChange={(e) => handleChange('productCourierTracking', 'status', e.target.value)}>
                      <option value="Not Sent Yet">Not Sent Yet</option>
                      <option value="On the Way">On the Way</option>
                      <option value="Received">Received</option>
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Service Details */}
            {step === 3 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-xl font-extrabold mb-4 text-[#002546]">Service Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <select className="p-3 bg-[#F4F7FE] border border-slate-200 rounded-lg w-full focus:ring-2 focus:ring-[#002546] outline-none text-[#002546] font-bold"
                    value={formData.serviceDetails.serviceType} onChange={(e) => handleChange('serviceDetails', 'serviceType', e.target.value)}>
                    {settings.serviceTypes.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                  {formData.serviceDetails.serviceType === 'Outdoor' && (
                    <input type="text" placeholder="Location" className="p-3 bg-[#F4F7FE] border border-slate-200 rounded-lg w-full focus:ring-2 focus:ring-[#002546] outline-none text-[#002546] placeholder-[#A3AED0] font-bold animate-fade-in" required
                      value={formData.serviceDetails.location} onChange={(e) => handleChange('serviceDetails', 'location', e.target.value)} />
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Model Casting */}
            {step === 4 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-xl font-extrabold mb-4 text-[#002546]">Model Casting</h3>
                <div className="grid grid-cols-2 gap-4">
                  <input type="number" placeholder="Number of Models" className="p-3 bg-[#F4F7FE] border border-slate-200 rounded-lg w-full focus:ring-2 focus:ring-[#002546] outline-none text-[#002546] placeholder-[#A3AED0] font-bold"
                    value={formData.modelCasting.numberOfModels} onChange={(e) => handleChange('modelCasting', 'numberOfModels', e.target.value)} />

                  <div className="col-span-2">
                    <p className="text-sm text-[#A3AED0] font-bold mb-2">Select Models</p>
                    <div className="flex gap-4 flex-wrap">
                      {models.map(m => (
                        <label key={m._id} className="flex items-center gap-2 cursor-pointer bg-[#F4F7FE] p-2 rounded-lg border border-slate-200 hover:border-[#002546] transition-colors font-bold text-[#002546]">
                          <input type="checkbox"
                            className="accent-[#002546]"
                            checked={formData.modelCasting.modelIds.includes(m._id)}
                            onChange={(e) => {
                              const ids = [...formData.modelCasting.modelIds];
                              if (e.target.checked) ids.push(m._id);
                              else ids.splice(ids.indexOf(m._id), 1);
                              handleChange('modelCasting', 'modelIds', ids);
                            }}
                          />
                          <span>{m.name} ({m.gender})</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Billing */}
            {step === 5 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-xl font-extrabold mb-4 text-[#002546]">Billing</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-[#A3AED0] font-bold mb-1">Total</label>
                    <input type="number" className="p-3 bg-[#F4F7FE] border border-slate-200 rounded-lg w-full focus:ring-2 focus:ring-[#002546] outline-none text-[#002546] font-bold" required
                      value={formData.billing.total} onChange={(e) => handleChange('billing', 'total', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm text-[#A3AED0] font-bold mb-1">Paid Amount</label>
                    <input type="number" className="p-3 bg-[#F4F7FE] border border-slate-200 rounded-lg w-full focus:ring-2 focus:ring-[#002546] outline-none text-[#002546] font-bold"
                      value={formData.billing.paid} onChange={(e) => handleChange('billing', 'paid', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm text-[#A3AED0] font-bold mb-1">Due</label>
                    <input type="number" className="p-3 bg-[#F4F7FE] border border-slate-200 rounded-lg w-full focus:ring-2 focus:ring-[#002546] outline-none text-[#002546] font-bold" required
                      value={formData.billing.due} onChange={(e) => handleChange('billing', 'due', e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="flex justify-between mt-8 pt-4 border-t border-[#EAEFF5]">
              {step > 1 ? (
                <button type="button" onClick={handlePrev} className="px-6 py-2 border border-slate-200 rounded-lg text-[#A3AED0] font-bold hover:bg-[#F4F7FE] transition-colors">Back</button>
              ) : <div></div>}

              {step < 5 ? (
                <button type="button" onClick={handleNext} className="px-6 py-2 bg-[#002546] text-white rounded-lg hover:bg-[#013f77] font-bold transition-colors shadow-[0_4px_12px_rgba(0,37,70,0.15)]">Next</button>
              ) : (
                <button type="submit" className="px-6 py-2 bg-[#002546] text-white rounded-lg hover:bg-[#013f77] transition-all font-bold shadow-[0_4px_12px_rgba(0,37,70,0.15)]">Submit Order</button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SalesBookingForm;
