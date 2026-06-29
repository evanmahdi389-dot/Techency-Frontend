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
    <div className="text-white w-full h-full p-4 md:p-6">
      {!showForm ? (
        <div className="w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold">Order Management</h2>
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative">
                <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <input type="text" placeholder="Search videos..." className="bg-black/50 border border-white/10 rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-green-500 w-64 text-white placeholder-gray-500" />
              </div>
              <select className="bg-black/50 border border-white/10 rounded-md px-4 py-2 text-sm focus:outline-none focus:border-green-500 text-white">
                <option>---Status---</option>
              </select>
              <button onClick={() => setShowForm(true)} className="bg-[#00c853] hover:bg-[#00e676] text-white px-4 py-2 rounded-md font-bold flex items-center gap-2 transition-colors text-sm whitespace-nowrap">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                Add New Order
              </button>
            </div>
          </div>

          <div className="overflow-x-auto bg-[#161616] rounded-[6px] border border-white/10 shadow-xl [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-[#161616] [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/30 transition-all pb-2">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-[#0a0a0a] text-[#00c853] border-b border-white/10 whitespace-nowrap">
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
                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
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
                      <span className="bg-white/10 px-2 py-1 rounded text-gray-300">1.Saif</span>
                      <span className="bg-white/10 px-2 py-1 rounded text-gray-300">2.Ridi</span>
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
                      <button className="text-gray-400 hover:text-white transition-colors" title="View">
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
        <div className="max-w-4xl mx-auto p-6 bg-[#111] rounded-xl shadow-lg mt-8 border border-white/5 relative">
          <button onClick={() => setShowForm(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          <h2 className="text-3xl font-bold mb-6 border-b border-white/10 pb-4 pr-10">New Order Booking</h2>

          {/* Progress Bar */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className={`flex-1 h-2 rounded-full mx-1 transition-colors ${step >= s ? 'bg-green-600' : 'bg-white/10'}`} />
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Client Info */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-xl font-semibold mb-4 text-green-500">Client Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Client Name" className="p-3 bg-black border border-white/10 rounded-lg w-full focus:ring-2 focus:ring-green-500 outline-none text-white placeholder-gray-500" required
                    value={formData.clientInfo.name} onChange={(e) => handleChange('clientInfo', 'name', e.target.value)} />
                  <input type="text" placeholder="Business Name" className="p-3 bg-black border border-white/10 rounded-lg w-full focus:ring-2 focus:ring-green-500 outline-none text-white placeholder-gray-500"
                    value={formData.clientInfo.businessName} onChange={(e) => handleChange('clientInfo', 'businessName', e.target.value)} />
                  <input type="text" placeholder="Phone" className="p-3 bg-black border border-white/10 rounded-lg w-full focus:ring-2 focus:ring-green-500 outline-none text-white placeholder-gray-500" required
                    value={formData.clientInfo.phone} onChange={(e) => handleChange('clientInfo', 'phone', e.target.value)} />

                  <select className="p-3 bg-black border border-white/10 rounded-lg w-full focus:ring-2 focus:ring-green-500 outline-none text-white"
                    value={formData.clientInfo.orderSource} onChange={(e) => handleChange('clientInfo', 'orderSource', e.target.value)}>
                    {settings.orderSources.map(src => <option key={src} value={src}>{src}</option>)}
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: Courier Tracking */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-xl font-semibold mb-4 text-green-500">Product Tracking</h3>
                {formData.clientInfo.orderSource === 'In Office' ? (
                  <div className="p-4 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg">Product received in office.</div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Courier Name" className="p-3 bg-black border border-white/10 rounded-lg w-full focus:ring-2 focus:ring-green-500 outline-none text-white placeholder-gray-500"
                      value={formData.productCourierTracking.courierName} onChange={(e) => handleChange('productCourierTracking', 'courierName', e.target.value)} />
                    <input type="text" placeholder="Tracking ID" className="p-3 bg-black border border-white/10 rounded-lg w-full focus:ring-2 focus:ring-green-500 outline-none text-white placeholder-gray-500"
                      value={formData.productCourierTracking.trackingId} onChange={(e) => handleChange('productCourierTracking', 'trackingId', e.target.value)} />
                    <select className="p-3 bg-black border border-white/10 rounded-lg w-full focus:ring-2 focus:ring-green-500 outline-none col-span-2 text-white"
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
                <h3 className="text-xl font-semibold mb-4 text-green-500">Service Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <select className="p-3 bg-black border border-white/10 rounded-lg w-full focus:ring-2 focus:ring-green-500 outline-none text-white"
                    value={formData.serviceDetails.serviceType} onChange={(e) => handleChange('serviceDetails', 'serviceType', e.target.value)}>
                    {settings.serviceTypes.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                  {formData.serviceDetails.serviceType === 'Outdoor' && (
                    <input type="text" placeholder="Location" className="p-3 bg-black border border-white/10 rounded-lg w-full focus:ring-2 focus:ring-green-500 outline-none text-white placeholder-gray-500 animate-fade-in" required
                      value={formData.serviceDetails.location} onChange={(e) => handleChange('serviceDetails', 'location', e.target.value)} />
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Model Casting */}
            {step === 4 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-xl font-semibold mb-4 text-green-500">Model Casting</h3>
                <div className="grid grid-cols-2 gap-4">
                  <input type="number" placeholder="Number of Models" className="p-3 bg-black border border-white/10 rounded-lg w-full focus:ring-2 focus:ring-green-500 outline-none text-white placeholder-gray-500"
                    value={formData.modelCasting.numberOfModels} onChange={(e) => handleChange('modelCasting', 'numberOfModels', e.target.value)} />

                  <div className="col-span-2">
                    <p className="text-sm text-gray-400 mb-2">Select Models</p>
                    <div className="flex gap-4 flex-wrap">
                      {models.map(m => (
                        <label key={m._id} className="flex items-center gap-2 cursor-pointer bg-white/5 p-2 rounded-lg border border-white/10 hover:border-green-500 transition-colors">
                          <input type="checkbox"
                            className="accent-green-500"
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
                <h3 className="text-xl font-semibold mb-4 text-green-500">Billing</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Total</label>
                    <input type="number" className="p-3 bg-black border border-white/10 rounded-lg w-full focus:ring-2 focus:ring-green-500 outline-none text-white" required
                      value={formData.billing.total} onChange={(e) => handleChange('billing', 'total', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Paid Amount</label>
                    <input type="number" className="p-3 bg-black border border-white/10 rounded-lg w-full focus:ring-2 focus:ring-green-500 outline-none text-white"
                      value={formData.billing.paid} onChange={(e) => handleChange('billing', 'paid', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Due</label>
                    <input type="number" className="p-3 bg-black border border-white/10 rounded-lg w-full focus:ring-2 focus:ring-green-500 outline-none text-white" required
                      value={formData.billing.due} onChange={(e) => handleChange('billing', 'due', e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="flex justify-between mt-8 pt-4 border-t border-white/10">
              {step > 1 ? (
                <button type="button" onClick={handlePrev} className="px-6 py-2 border border-white/20 rounded-lg text-gray-300 hover:bg-white/5 transition-colors">Back</button>
              ) : <div></div>}

              {step < 5 ? (
                <button type="button" onClick={handleNext} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md">Next</button>
              ) : (
                <button type="submit" className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-lg hover:from-green-500 hover:to-emerald-400 transition-all shadow-md font-bold">Submit Order</button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SalesBookingForm;
