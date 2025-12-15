import React from 'react';
import clsx from 'clsx';

const Select = ({ 
  label, 
  error, 
  required = false,
  options = [],
  placeholder = 'Select an option',
  className = '',
  ...props 
}) => {
  const selectClasses = clsx(
    'block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
    {
      'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500': error,
      'border-gray-300': !error
    },
    className
  );

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select className={selectClasses} {...props}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Select;