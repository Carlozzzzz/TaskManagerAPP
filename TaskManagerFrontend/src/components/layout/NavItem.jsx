// src/components/layout/NavItem.jsx
import { NavLink } from 'react-router-dom';

export default function NavItem({ to, icon: Icon, label, isCollapsed, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
          isActive 
            ? 'bg-blue-50 text-blue-600 shadow-sm' 
            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
        }`
      }
    >
      <div className={`flex items-center justify-center ${isCollapsed ? 'w-full' : ''}`}>
        <Icon sx={{ fontSize: 22 }} className="shrink-0" />
      </div>
      
      {!isCollapsed && (
        <span className="truncate whitespace-nowrap">{label}</span>
      )}

      {/* Tooltip for collapsed mode */}
      {isCollapsed && (
        <div className="absolute left-16 z-50 scale-0 rounded bg-gray-900 p-2 text-xs text-white transition-all group-hover:scale-100">
          {label}
        </div>
      )}
    </NavLink>
  );
}