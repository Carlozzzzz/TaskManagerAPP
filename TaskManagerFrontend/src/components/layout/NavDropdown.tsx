// src/components/layout/NavDropdown.jsx
import { useState } from 'react';
import { KeyboardArrowDownRounded } from '@mui/icons-material';

export default function NavDropdown({ icon: Icon, label, items, isCollapsed }) {
  const [isOpen, setIsOpen] = useState(false);

  // If sidebar is collapsed, we don't show the dropdown content directly 
  // (Usually handled via popover in advanced systems, but keeping it simple/clean for now)
  if (isCollapsed) {
    return (
      <div className="group relative flex cursor-pointer flex-col items-center py-2.5 text-gray-500 hover:text-blue-600">
        <Icon sx={{ fontSize: 22 }} />
        <div className="absolute left-16 z-50 scale-0 whitespace-nowrap rounded bg-gray-900 p-2 text-xs text-white transition-all group-hover:scale-100">
          {label} (Click to expand sidebar)
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
          isOpen ? 'text-gray-900' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon sx={{ fontSize: 22 }} className="shrink-0" />
          <span className="truncate">{label}</span>
        </div>
        <KeyboardArrowDownRounded 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          sx={{ fontSize: 20 }}
        />
      </button>

      {isOpen && (
        <div className="ml-9 space-y-1 border-l border-gray-100">
          {items.map((item, idx) => (
            <button
              key={idx}
              className="flex w-full items-center rounded-md px-4 py-2 text-left text-sm text-gray-500 transition-colors hover:bg-blue-50/50 hover:text-blue-600"
            >
              <span className="mr-2 text-gray-300">•</span>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}