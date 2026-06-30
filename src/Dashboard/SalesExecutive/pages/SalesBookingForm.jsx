import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const SalesBookingForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    clientInfo: { name: '', businessName: '', phone: '', email: '', address: '', orderSource: 'WhatsApp' },
    productCourierTracking: { deliveryMode: 'Courier', courierName: '', trackingId: '', status: 'Not Sent Yet' },
    serviceDetails: { serviceType: 'Indoor', location: '', expectedShootDate: '', expectedDeliveryDate: '' },
    modelCasting: { totalContent: '', numberOfModels: '', numberOfProductImages: '', modelTypes: [], modelIds: [], modelContents: {}, clientVideoLink: '', numberOfContent: '' },
    billing: { total: 0, paid: 0, due: 0, method: 'Cash', notes: '' }
  });

  const [settings, setSettings] = useState({ orderSources: [], serviceTypes: [] });
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings/dynamic');
        setSettings({
          orderSources: res.data?.orderSources || ['In Office', 'WhatsApp', 'Messenger', 'Phone Call'],
          serviceTypes: res.data?.serviceTypes || ['Indoor', 'Outdoor']
        });
      } catch (error) {
        console.error('Failed to load dynamic settings', error);
        setSettings({
          orderSources: ['In Office', 'WhatsApp', 'Messenger', 'Phone Call'],
          serviceTypes: ['Indoor', 'Outdoor']
        });
      }
      try {
        const resModels = await api.get('/users?role=model');
        setModels(resModels.data?.data || resModels.data || []);
      } catch (error) {
        console.error('Failed to load models', error);
      }
      setLoading(false);
    };

    fetchSettings();
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
              <button onClick={() => setShowForm(true)} className="cursor-pointer bg-[#002546] hover:bg-[#013f77] text-white px-4 py-2 rounded-md font-bold flex items-center gap-2 transition-colors text-sm whitespace-nowrap shadow-[0_4px_12px_rgba(0,37,70,0.15)]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                Add New Order
              </button>
            </div>
          </div>

          <div className="overflow-x-auto bg-white rounded-[6px] border border-[#EAEFF5] shadow-[0px_12px_28px_rgba(0,37,70,0.08)] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-thumb]:bg-[#002546]/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#002546]/30 transition-all pb-2">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-[#e0e2e6] text-[#002546] border-b border-[#EAEFF5] whitespace-nowrap font-extrabold">
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
                <tr className="border-b border-[#EAEFF5] hover:bg-[#e0e2e6] transition-colors font-bold text-[#A3AED0]">
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
                      <span className="bg-[#e0e2e6] px-2 py-1 rounded text-[#002546]">1.Saif</span>
                      <span className="bg-[#e0e2e6] px-2 py-1 rounded text-[#002546]">2.Ridi</span>
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
                  <Input label="Client Name" type="text" placeholder="Client Name" required
                    value={formData.clientInfo.name} onChange={(e) => handleChange('clientInfo', 'name', e.target.value)} />
                  <Input label="Business Name" type="text" placeholder="Business Name"
                    value={formData.clientInfo.businessName} onChange={(e) => handleChange('clientInfo', 'businessName', e.target.value)} />
                  <Input label="Phone" type="text" placeholder="Phone" required
                    value={formData.clientInfo.phone} onChange={(e) => handleChange('clientInfo', 'phone', e.target.value)} />
                  <Select label="Order Source" options={settings.orderSources}
                    value={formData.clientInfo.orderSource} onChange={(e) => handleChange('clientInfo', 'orderSource', e.target.value)} />
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
                    <Input label="Courier Name" type="text" placeholder="Courier Name"
                      value={formData.productCourierTracking.courierName} onChange={(e) => handleChange('productCourierTracking', 'courierName', e.target.value)} />
                    <Input label="Tracking ID" type="text" placeholder="Tracking ID"
                      value={formData.productCourierTracking.trackingId} onChange={(e) => handleChange('productCourierTracking', 'trackingId', e.target.value)} />
                    <Select label="Tracking Status" containerClassName="col-span-2" options={['Not Sent Yet', 'On the Way', 'Received']}
                      value={formData.productCourierTracking.status} onChange={(e) => handleChange('productCourierTracking', 'status', e.target.value)} />
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Service Details */}
            {step === 3 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-xl font-extrabold mb-4 text-[#002546]">Service Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Select label="Service Type" options={settings.serviceTypes}
                    value={formData.serviceDetails.serviceType} onChange={(e) => handleChange('serviceDetails', 'serviceType', e.target.value)} />
                  {formData.serviceDetails.serviceType === 'Outdoor' && (
                    <Input label="Location" type="text" placeholder="Location" className="animate-fade-in" required
                      value={formData.serviceDetails.location} onChange={(e) => handleChange('serviceDetails', 'location', e.target.value)} />
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Model Casting / Video Editing Details */}
            {step === 4 && (
              <div className="space-y-4 animate-fade-in">
                {formData.serviceDetails.serviceType?.toLowerCase().includes('video editing') ? (
                  <>
                    <h3 className="text-xl font-extrabold mb-4 text-[#002546]">Video Editing Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Submit Client Video Link" type="text" placeholder="Paste link here"
                        value={formData.modelCasting.clientVideoLink} onChange={(e) => handleChange('modelCasting', 'clientVideoLink', e.target.value)} />
                      <Input label="Number of content" type="number" placeholder="Number of content"
                        value={formData.modelCasting.numberOfContent} onChange={(e) => handleChange('modelCasting', 'numberOfContent', e.target.value)} />
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-extrabold mb-4 text-[#002546]">Model Casting</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Total Content" type="number" placeholder="Total Content"
                        value={formData.modelCasting.totalContent} onChange={(e) => handleChange('modelCasting', 'totalContent', e.target.value)} />
                      <Input label="Number of Model" type="number" placeholder="Number of Model"
                        value={formData.modelCasting.numberOfModels} onChange={(e) => handleChange('modelCasting', 'numberOfModels', e.target.value)} />
                      <Input label="Number Of Product Images" type="number" placeholder="Number of Product Images"
                        value={formData.modelCasting.numberOfProductImages} onChange={(e) => handleChange('modelCasting', 'numberOfProductImages', e.target.value)} />

                      <div>
                        <p className="text-sm text-[#A3AED0] font-bold mb-2">Model Preferences</p>
                        <div className="flex gap-3 flex-wrap w-full">
                          {['Male', 'Female'].map(type => {
                            const isSelected = formData.modelCasting.modelTypes.includes(type);
                            return (
                              <label key={type} className={`relative flex items-center justify-center gap-2 cursor-pointer px-5 py-2.5 rounded-full font-bold transition-all duration-300 ease-in-out border-2 overflow-hidden shadow-sm hover:shadow-md ${isSelected ? 'border-[#002546] bg-[#002546] text-white' : 'border-slate-200 bg-white text-[#A3AED0] hover:border-slate-300 hover:text-[#002546]'}`}>
                                <input type="checkbox" className="hidden"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    const types = [...formData.modelCasting.modelTypes];
                                    if (e.target.checked) types.push(type);
                                    else types.splice(types.indexOf(type), 1);
                                    handleChange('modelCasting', 'modelTypes', types);
                                  }}
                                />
                                <span className="relative z-10">{type}</span>
                                {isSelected && (
                                  <svg className="w-4 h-4 ml-1 relative z-10 animate-fade-in" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                )}
                              </label>
                            );
                          })}
                        </div>
                      </div>

                    </div>



                    <div className="mt-6 space-y-3">
                      {models.map(m => {
                        const isSelected = formData.modelCasting.modelIds.includes(m._id);
                        return (
                          <div key={m._id} className={`group flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 ${isSelected ? 'border-[#002546] bg-[#f8fbff] shadow-md scale-[1.01]' : 'border-slate-100 bg-white hover:border-[#002546]/30 hover:shadow-sm'}`}>
                            <label className="flex items-center gap-4 flex-1 w-full cursor-pointer">
                              <div className="relative flex items-center justify-center w-6 h-6 flex-shrink-0">
                                <input type="checkbox" className="hidden"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    const ids = [...formData.modelCasting.modelIds];
                                    if (e.target.checked) ids.push(m._id);
                                    else ids.splice(ids.indexOf(m._id), 1);
                                    handleChange('modelCasting', 'modelIds', ids);
                                  }}
                                />
                                <div className={`absolute inset-0 rounded-full border-2 transition-colors ${isSelected ? 'border-[#002546] bg-[#002546]' : 'border-slate-300 group-hover:border-[#002546]/50'}`}></div>
                                {isSelected && (
                                  <svg className="absolute w-3.5 h-3.5 text-white animate-fade-in" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                )}
                              </div>

                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[#002546] font-bold shadow-sm overflow-hidden border-2 transition-colors ${isSelected ? 'border-[#002546] ring-2 ring-[#002546]/20 ring-offset-1' : 'border-slate-200 bg-[#e0e2e6]'}`}>
                                  {m.profileImage ? (
                                    <img src={m.profileImage} alt={m.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <svg className="w-5 h-5 text-[#A3AED0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                  )}
                                </div>
                                <div>
                                  <p className={`font-extrabold transition-colors ${isSelected ? 'text-[#002546]' : 'text-slate-700 group-hover:text-[#002546]'}`}>{m.name}</p>
                                  <p className="text-xs text-[#A3AED0] font-semibold">{m.gender}</p>
                                </div>
                              </div>
                            </label>

                            {isSelected && (
                              <div className="w-full sm:w-[140px] pl-10 sm:pl-0 animate-fade-in">
                                <div className="relative">
                                  <input type="number" placeholder="Content Qty"
                                    className="w-full bg-white border-2 border-[#EAEFF5] rounded-[10px] px-4 py-2.5 text-sm focus:outline-none focus:border-[#002546] text-[#002546] font-bold placeholder-[#A3AED0] shadow-inner transition-all hover:border-slate-300 focus:ring-4 focus:ring-[#002546]/10"
                                    value={formData.modelCasting.modelContents?.[m._id] || ''}
                                    onChange={(e) => {
                                      const currentContents = formData.modelCasting.modelContents || {};
                                      handleChange('modelCasting', 'modelContents', { ...currentContents, [m._id]: e.target.value });
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Step 5: Billing */}
            {step === 5 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-xl font-extrabold mb-4 text-[#002546]">Billing</h3>
                <div className="grid grid-cols-3 gap-4">
                  <Input label="Total" type="number" required
                    value={formData.billing.total} onChange={(e) => handleChange('billing', 'total', e.target.value)} />
                  <Input label="Paid Amount" type="number"
                    value={formData.billing.paid} onChange={(e) => handleChange('billing', 'paid', e.target.value)} />
                  <Input label="Due" type="number" required
                    value={formData.billing.due} onChange={(e) => handleChange('billing', 'due', e.target.value)} />
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="flex justify-between mt-8 pt-4 border-t border-[#EAEFF5]">
              {step > 1 ? (
                <button type="button" onClick={handlePrev} className="px-6 py-2 border border-slate-200 rounded-lg text-white font-bold bg-red-400 hover:bg-red-500 hover:text-white transition-colors cursor-pointer">Back</button>
              ) : <div></div>}

              <div className="flex items-center gap-3">
                {step === 5 && (
                  <button type="button" onClick={() => setShowPreview(true)} className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-bold transition-colors shadow-[0_4px_12px_rgba(59,130,246,0.2)] cursor-pointer flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    Preview
                  </button>
                )}
                {step < 6 ? (
                  <button type="button" onClick={handleNext} className="px-6 py-2 bg-[#002546] text-white rounded-lg hover:bg-[#013f77] font-bold transition-colors shadow-[0_4px_12px_rgba(0,37,70,0.15)] cursor-pointer">Next</button>
                ) : (
                  <button type="submit" className="px-6 py-2 bg-[#002546] text-white rounded-lg hover:bg-[#013f77] transition-all font-bold shadow-[0_4px_12px_rgba(0,37,70,0.15)] cursor-pointer">Submit Order</button>
                )}
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[#002546]/60 backdrop-blur-md transition-all">
          <div className="bg-[#f8fbff] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-fade-in border border-[#002546]/10 overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b border-[#EAEFF5] px-6 py-5 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#002546]/5 flex items-center justify-center text-[#002546]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-[#002546]">Booking Overview</h2>
                  <p className="text-xs text-[#A3AED0] font-semibold mt-0.5">Please review the details before submitting</p>
                </div>
              </div>
              <button onClick={() => setShowPreview(false)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-red-50 text-[#A3AED0] hover:text-red-500 flex items-center justify-center transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#002546]/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#002546]/40 transition-colors">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Client Details Card */}
                <div className="bg-white p-5 rounded-xl border border-[#EAEFF5] shadow-[0_2px_10px_rgba(0,37,70,0.02)]">
                  <h3 className="text-[15px] font-bold text-[#002546] mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#A3AED0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    Client Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-50"><span className="text-sm text-[#A3AED0] font-semibold">Name</span><span className="text-sm font-bold text-[#002546]">{formData.clientInfo.name || '-'}</span></div>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-50"><span className="text-sm text-[#A3AED0] font-semibold">Business</span><span className="text-sm font-bold text-[#002546]">{formData.clientInfo.businessName || '-'}</span></div>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-50"><span className="text-sm text-[#A3AED0] font-semibold">Phone</span><span className="text-sm font-bold text-[#002546]">{formData.clientInfo.phone || '-'}</span></div>
                    <div className="flex justify-between items-center"><span className="text-sm text-[#A3AED0] font-semibold">Source</span><span className="text-xs font-bold px-2.5 py-1 bg-[#002546]/5 text-[#002546] rounded-md">{formData.clientInfo.orderSource || '-'}</span></div>
                  </div>
                </div>

                {/* Service Details Card */}
                <div className="bg-white p-5 rounded-xl border border-[#EAEFF5] shadow-[0_2px_10px_rgba(0,37,70,0.02)]">
                  <h3 className="text-[15px] font-bold text-[#002546] mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#A3AED0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    Service Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-50"><span className="text-sm text-[#A3AED0] font-semibold">Service Type</span><span className="text-sm font-bold text-[#002546]">{formData.serviceDetails.serviceType || '-'}</span></div>
                    {formData.serviceDetails.serviceType === 'Outdoor' && (
                      <div className="flex justify-between items-center"><span className="text-sm text-[#A3AED0] font-semibold">Location</span><span className="text-sm font-bold text-[#002546]">{formData.serviceDetails.location || '-'}</span></div>
                    )}
                  </div>
                </div>
              </div>

              {/* Product Tracking & Billing Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Tracking Card */}
                <div className="bg-white p-5 rounded-xl border border-[#EAEFF5] shadow-[0_2px_10px_rgba(0,37,70,0.02)]">
                  <h3 className="text-[15px] font-bold text-[#002546] mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#A3AED0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                    Product Tracking
                  </h3>
                  {formData.clientInfo.orderSource === 'In Office' ? (
                    <div className="p-4 bg-green-50 border border-green-100 rounded-lg flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                      <span className="text-sm font-bold text-green-700">Product received in office.</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-50"><span className="text-sm text-[#A3AED0] font-semibold">Courier</span><span className="text-sm font-bold text-[#002546]">{formData.productCourierTracking.courierName || '-'}</span></div>
                      <div className="flex justify-between items-center pb-2 border-b border-slate-50"><span className="text-sm text-[#A3AED0] font-semibold">Tracking ID</span><span className="text-sm font-bold text-[#002546] font-mono">{formData.productCourierTracking.trackingId || '-'}</span></div>
                      <div className="flex justify-between items-center"><span className="text-sm text-[#A3AED0] font-semibold">Status</span>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${formData.productCourierTracking.status === 'Received' ? 'bg-green-50 text-green-600' : formData.productCourierTracking.status === 'On the Way' ? 'bg-blue-50 text-blue-600' : 'bg-yellow-50 text-yellow-600'}`}>
                          {formData.productCourierTracking.status || '-'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Billing Summary Card */}
                <div className="bg-gradient-to-br from-[#002546] to-[#013f77] p-5 rounded-xl border border-[#002546] shadow-md text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <svg className="w-24 h-24 transform translate-x-4 -translate-y-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                  <h3 className="text-[15px] font-bold text-blue-100 mb-4 flex items-center gap-2 relative z-10">
                    <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z"></path></svg>
                    Billing Summary
                  </h3>
                  <div className="space-y-3 relative z-10">
                    <div className="flex justify-between items-center pb-2 border-b border-blue-800/50"><span className="text-sm text-blue-200 font-semibold">Total Amount</span><span className="text-base font-extrabold">৳ {formData.billing.total || 0}</span></div>
                    <div className="flex justify-between items-center pb-2 border-b border-blue-800/50"><span className="text-sm text-blue-200 font-semibold">Paid Amount</span><span className="text-base font-extrabold text-green-400">৳ {formData.billing.paid || 0}</span></div>
                    <div className="flex justify-between items-center pt-1"><span className="text-sm text-blue-200 font-semibold">Due Amount</span><span className="text-xl font-black text-red-300">৳ {formData.billing.total - formData.billing.paid || 0}</span></div>
                  </div>
                </div>
              </div>

              {/* Model Casting or Video Editing Details Card - Full Width */}
              {formData.serviceDetails.serviceType?.toLowerCase().includes('video editing') ? (
                <div className="bg-white p-5 rounded-xl border border-[#EAEFF5] shadow-[0_2px_10px_rgba(0,37,70,0.02)]">
                  <h3 className="text-[15px] font-bold text-[#002546] mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#A3AED0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                    Video Editing Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 p-4 bg-[#f8fbff] rounded-lg border border-[#002546]/5">
                    <div><span className="text-xs text-[#A3AED0] font-semibold block mb-1">Client Video Link</span><a href={formData.modelCasting.clientVideoLink} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-blue-500 underline break-all">{formData.modelCasting.clientVideoLink || '-'}</a></div>
                    <div><span className="text-xs text-[#A3AED0] font-semibold block mb-1">Number of Content</span><span className="text-sm font-bold text-[#002546]">{formData.modelCasting.numberOfContent || '-'}</span></div>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-5 rounded-xl border border-[#EAEFF5] shadow-[0_2px_10px_rgba(0,37,70,0.02)]">
                  <h3 className="text-[15px] font-bold text-[#002546] mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#A3AED0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    Model Casting
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5 p-4 bg-[#f8fbff] rounded-lg border border-[#002546]/5">
                    <div><span className="text-xs text-[#A3AED0] font-semibold block mb-1">Total Content</span><span className="text-sm font-bold text-[#002546]">{formData.modelCasting.totalContent || '-'}</span></div>
                    <div><span className="text-xs text-[#A3AED0] font-semibold block mb-1">Number of Models</span><span className="text-sm font-bold text-[#002546]">{formData.modelCasting.numberOfModels || '-'}</span></div>
                    <div><span className="text-xs text-[#A3AED0] font-semibold block mb-1">Product Images</span><span className="text-sm font-bold text-[#002546]">{formData.modelCasting.numberOfProductImages || '-'}</span></div>
                    <div><span className="text-xs text-[#A3AED0] font-semibold block mb-1">Preferences</span><span className="text-sm font-bold text-[#002546]">{formData.modelCasting.modelTypes.join(', ') || '-'}</span></div>
                  </div>

                  {formData.modelCasting.modelIds.length > 0 && (
                    <div>
                      <span className="text-xs text-[#A3AED0] font-semibold mb-3 block uppercase tracking-wider">Selected Models & Content Quantity</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {formData.modelCasting.modelIds.map(id => {
                          const model = models.find(m => m._id === id);
                          return model ? (
                            <div key={id} className="bg-white border border-slate-200 p-3 rounded-xl flex items-center gap-3 hover:border-[#002546]/30 transition-colors shadow-sm group">
                              <div className="w-10 h-10 rounded-full border border-slate-200 overflow-hidden bg-slate-50 shrink-0 shadow-sm group-hover:border-[#002546]/30 transition-colors">
                                {model.profileImage ? (
                                  <img src={model.profileImage} alt={model.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[#A3AED0]"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-[#002546] truncate group-hover:text-[#013f77] transition-colors">{model.name}</p>
                                <p className="text-[11px] text-[#A3AED0] font-semibold">{model.gender}</p>
                              </div>
                              <div className="bg-[#f8fbff] border border-[#002546]/10 px-2.5 py-1 rounded-lg text-xs font-bold text-[#002546] flex flex-col items-center justify-center shrink-0 min-w-[3rem] shadow-inner">
                                <span className="text-[9px] text-[#A3AED0] font-semibold uppercase">Qty</span>
                                {formData.modelCasting.modelContents?.[id] || 0}
                              </div>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-white border-t border-[#EAEFF5] px-6 py-5 flex justify-between items-center shrink-0">
              <button onClick={() => setShowPreview(false)} className="px-5 py-2 text-slate-500 hover:text-slate-700 font-bold transition-colors">Edit Form</button>
              <button onClick={(e) => { setShowPreview(false); handleSubmit(e); }} className="px-8 py-2.5 bg-[#002546] text-white rounded-xl hover:bg-[#013f77] font-bold transition-all shadow-[0_4px_12px_rgba(0,37,70,0.15)] flex items-center gap-2 transform hover:-translate-y-0.5">
                Submit Order
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesBookingForm;
