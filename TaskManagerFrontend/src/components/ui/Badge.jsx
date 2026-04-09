import React from 'react';

export default function Badge({ value }) {
  // Handle boolean or string
  const isActive = value === true || String(value).toLowerCase() === 'active';
  const label = isActive ? 'Active' : 'Inactive';

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border tracking-wider ${
      isActive 
        ? "bg-green-100 text-green-700 border-green-200" 
        : "bg-red-100 text-red-700 border-red-200"
    }`}>
      {label}
    </span>
  );
}