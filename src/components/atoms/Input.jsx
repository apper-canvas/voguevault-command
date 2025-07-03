import React from 'react';

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-accent ml-1">*</span>}
        </label>
      )}
      
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-black transition-colors duration-200 ${
          error ? 'border-accent' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
      
      {error && (
        <p className="text-sm text-accent">{error}</p>
      )}
    </div>
  );
};

export default Input;