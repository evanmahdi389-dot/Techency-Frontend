import React from 'react';

const Input = ({ label, type = 'text', placeholder, value, onChange, required, className = '', containerClassName = '', error, disabled = false }) => {
  return (
    <div className={`flex flex-col ${containerClassName}`}>
      {label && <label className="block text-sm text-[#A3AED0] font-bold mb-1">{label} {required && <span className="text-red-500">*</span>}</label>}
      <input
        type={type}
        placeholder={placeholder}
        className={`p-3 bg-[#e0e2e6] border ${error ? 'border-red-500' : 'border-slate-200'} rounded-lg w-full focus:ring-2 focus:ring-[#002546] outline-none text-[#002546] placeholder-[#A3AED0] font-bold disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        required={required}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      {error && <span className="text-xs text-red-500 mt-1 font-semibold">{error}</span>}
    </div>
  );
};

export default Input;
