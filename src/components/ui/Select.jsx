import React from 'react';

const Select = ({ label, value, onChange, options, required, className = '', containerClassName = '' }) => {
  return (
    <div className={`flex flex-col ${containerClassName}`}>
      {label && <label className="block text-sm text-[#A3AED0] font-bold mb-1">{label} {required && <span className="text-red-500">*</span>}</label>}
      <select
        className={`p-3 bg-[#e0e2e6] border border-slate-200 rounded-lg w-full focus:ring-2 focus:ring-[#002546] outline-none text-[#002546] font-bold ${className}`}
        value={value}
        onChange={onChange}
        required={required}
      >
        {options.map((opt, idx) => {
          if (typeof opt === 'string') {
             return <option key={idx} value={opt}>{opt}</option>;
          }
          return <option key={idx} value={opt.value}>{opt.label}</option>;
        })}
      </select>
    </div>
  );
};

export default Select;
