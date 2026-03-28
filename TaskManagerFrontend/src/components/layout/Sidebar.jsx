// src/components/layout/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Sidebar() {
  const { user } = useAuth();

  const linkStyle = ({ isActive }) => 
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
      isActive ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
    }`;

  return (
    <aside className="flex h-full w-64 flex-col border-r border-gray-200 bg-white shadow-md">
      <div className="p-6">
        <h1 className="text-xl font-bold text-blue-600">TaskManagerAPP</h1>
      </div>

      <nav className="flex-1 space-y-2 px-4">
        <NavLink to="/tasks" className={linkStyle}>
          <span>📋</span> My Tasks
        </NavLink>
        
        {user?.role === 'admin' && (
          <NavLink to="/admin" className={linkStyle}>
            <span>🛡️</span> Admin Panel
          </NavLink>
        )}
      </nav>
    </aside>
  );
}