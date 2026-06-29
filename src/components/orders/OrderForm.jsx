import React, { useState, useEffect } from 'react';

const OrderForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    clientInfo: { name: '', phone: '', email: '', address: '' },
    productCourierTracking: { courierName: '', trackingId: '', status: 'On the way' },
    serviceDetails: { serviceType: 'Indoor', orderSource: 'WhatsApp', location: '', expectedShootDate: '', expectedDeliveryDate: '' },
    modelCasting: { genderFilter: '', modelId: '' },
    billing: { total: '', paid: 0, due: '', method: '', notes: '' }
  });

  const [models, setModels] = useState([]);
  const [settings, setSettings] = useState({ serviceTypes: ['Indoor', 'Outdoor'], orderSources: ['WhatsApp', 'Messenger', 'In Office', 'Phone Call'] });
  const [isCourier, setIsCourier] = useState(false);

  useEffect(() => {
    // Mock API call to fetch models based on genderFilter
    const fetchModels = async () => {
      // In reality: await fetch(`/api/models?gender=${formData.modelCasting.genderFilter}`)
      const dummyModels = [
        { _id: '1', name: 'John Doe', gender: 'Male' },
        { _id: '2', name: 'Jane Smith', gender: 'Female' }
      ];
      setModels(formData.modelCasting.genderFilter ? dummyModels.filter(m => m.gender === formData.modelCasting.genderFilter) : dummyModels);
    };
    fetchModels();
  }, [formData.modelCasting.genderFilter]);

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting:', formData);
    // await fetch('/api/orders', { method: 'POST', body: JSON.stringify(formData) })
    alert('Order Submitted!');
    setStep(1);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Book New Order - Step {step} of 4</h2>
      
      <form onSubmit={step === 4 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
        {/* Step 1: Client Info & Basics */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Client Information</h3>
            <input type="text" placeholder="Client Name" className="w-full p-2 border rounded" required
              value={formData.clientInfo.name} onChange={e => handleChange('clientInfo', 'name', e.target.value)} />
            <input type="tel" placeholder="Phone Number" className="w-full p-2 border rounded" required
              value={formData.clientInfo.phone} onChange={e => handleChange('clientInfo', 'phone', e.target.value)} />
            
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mt-4">Service Details</h3>
            <div className="flex gap-4">
              <select className="w-1/2 p-2 border rounded" value={formData.serviceDetails.serviceType} onChange={e => handleChange('serviceDetails', 'serviceType', e.target.value)}>
                {settings.serviceTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
              <select className="w-1/2 p-2 border rounded" value={formData.serviceDetails.orderSource} onChange={e => handleChange('serviceDetails', 'orderSource', e.target.value)}>
                {settings.orderSources.map(src => <option key={src} value={src}>{src}</option>)}
              </select>
            </div>
            
            {formData.serviceDetails.serviceType === 'Outdoor' && (
              <input type="text" placeholder="Outdoor Location" className="w-full p-2 border rounded"
                value={formData.serviceDetails.location} onChange={e => handleChange('serviceDetails', 'location', e.target.value)} />
            )}
          </div>
        )}

        {/* Step 2: Courier & Casting */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <input type="checkbox" id="isCourier" checked={isCourier} onChange={() => setIsCourier(!isCourier)} />
              <label htmlFor="isCourier" className="text-gray-700 dark:text-gray-300">Product sent via Courier?</label>
            </div>
            
            {isCourier && (
              <div className="space-y-4 border p-4 rounded bg-gray-50 dark:bg-gray-700">
                <input type="text" placeholder="Courier Name" className="w-full p-2 border rounded"
                  value={formData.productCourierTracking.courierName} onChange={e => handleChange('productCourierTracking', 'courierName', e.target.value)} />
                <input type="text" placeholder="Tracking ID" className="w-full p-2 border rounded"
                  value={formData.productCourierTracking.trackingId} onChange={e => handleChange('productCourierTracking', 'trackingId', e.target.value)} />
              </div>
            )}

            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mt-4">Model Casting</h3>
            <select className="w-full p-2 border rounded mb-2" value={formData.modelCasting.genderFilter} onChange={e => handleChange('modelCasting', 'genderFilter', e.target.value)}>
              <option value="">Any Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <select className="w-full p-2 border rounded" value={formData.modelCasting.modelId} onChange={e => handleChange('modelCasting', 'modelId', e.target.value)}>
              <option value="">Select a Model</option>
              {models.map(m => <option key={m._id} value={m._id}>{m.name} ({m.gender})</option>)}
            </select>
          </div>
        )}

        {/* Step 3: Dates */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Dates</h3>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400">Expected Shoot Date</label>
              <input type="date" className="w-full p-2 border rounded" 
                value={formData.serviceDetails.expectedShootDate} onChange={e => handleChange('serviceDetails', 'expectedShootDate', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400">Expected Delivery Date</label>
              <input type="date" className="w-full p-2 border rounded" 
                value={formData.serviceDetails.expectedDeliveryDate} onChange={e => handleChange('serviceDetails', 'expectedDeliveryDate', e.target.value)} />
            </div>
          </div>
        )}

        {/* Step 4: Billing */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Billing (Manual Input)</h3>
            <div className="flex gap-4">
              <input type="number" placeholder="Total Amount" className="w-1/3 p-2 border rounded" required
                value={formData.billing.total} onChange={e => handleChange('billing', 'total', e.target.value)} />
              <input type="number" placeholder="Paid Amount" className="w-1/3 p-2 border rounded" required
                value={formData.billing.paid} onChange={e => handleChange('billing', 'paid', e.target.value)} />
              <input type="number" placeholder="Due Amount" className="w-1/3 p-2 border rounded" required
                value={formData.billing.due} onChange={e => handleChange('billing', 'due', e.target.value)} />
            </div>
            <input type="text" placeholder="Payment Method (e.g., Bkash, Bank)" className="w-full p-2 border rounded"
              value={formData.billing.method} onChange={e => handleChange('billing', 'method', e.target.value)} />
            <textarea placeholder="Billing Notes" className="w-full p-2 border rounded h-24"
              value={formData.billing.notes} onChange={e => handleChange('billing', 'notes', e.target.value)} />
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          {step > 1 && (
            <button type="button" onClick={prevStep} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition">
              Back
            </button>
          )}
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition ml-auto">
            {step === 4 ? 'Submit Order' : 'Next'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;
