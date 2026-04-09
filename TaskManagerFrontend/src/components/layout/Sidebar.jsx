// src/components/layout/Sidebar.jsx
import { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useLayout } from '../../context/LayoutContext'; // ADDED
import NavItem from './NavItem';
import NavDropdown from './NavDropdown';

import {
	HomeRounded,
	BuildCircleRounded,
	TerminalRounded,
	GroupRounded,
	AssignmentRounded,
	SecurityRounded,
	ChevronLeftRounded,
	CloseRounded
} from '@mui/icons-material';

export default function Sidebar() {
	const { user } = useAuth();
	// MODIFIED: Consuming shared state instead of local state
	const { isCollapsed, isMobileOpen, toggleSidebar, toggleMobile, closeMobile } = useLayout();

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth >= 768) closeMobile();
		};
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [closeMobile]);

	const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out
    ${isCollapsed ? 'w-20' : 'w-64'}
    ${isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
    md:sticky top-0 h-screen
  `;

	return (
		<>
			{/* Mobile Overlay */}
			{isMobileOpen && (
				<div
					className="fixed inset-0 z-40 bg-gray-900/30 backdrop-blur-[2px] transition-opacity md:hidden"
					onClick={toggleMobile}
				/>
			)}

			<aside className={sidebarClasses}>
				<div className="flex h-16 items-center justify-between border-b border-gray-50 px-6">
					{!isCollapsed && (
						<h1 className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-lg font-bold text-transparent">
							HR Portal
						</h1>
					)}
					<button
						onClick={toggleSidebar}
						className={`hidden md:flex p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-blue-600 transition-all ${isCollapsed ? 'mx-auto' : ''}`}
					>
						<ChevronLeftRounded className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
					</button>
					<button onClick={toggleMobile} className="p-1.5 text-gray-400 md:hidden">
						<CloseRounded />
					</button>
				</div>

				<nav className="flex-1 space-y-2 overflow-y-auto p-4">
					<NavItem to="/dashboard" icon={HomeRounded} label="Home" isCollapsed={isCollapsed} />

					<NavDropdown
						icon={BuildCircleRounded}
						label="Maintenance"
						isCollapsed={isCollapsed}
						items={[
							{ label: 'Company', to: '/company' },  // Add your link here
							{ label: 'Client', to: '/client' },
							{ label: 'Department', to: '/department' }
						]}
					/>

					<NavDropdown
						icon={TerminalRounded}
						label="Dev Mode"
						isCollapsed={isCollapsed}
						items={[
							{ label: 'Client Identity' },
							{ label: 'Night Diff' }
						]}
					/>


					<NavItem to="/users" icon={GroupRounded} label="Users" isCollapsed={isCollapsed} />

					<div className={`my-4 border-t border-gray-100 ${isCollapsed ? 'mx-2' : 'mx-0'}`} />

					<NavItem to="/tasks" icon={AssignmentRounded} label="My Tasks" isCollapsed={isCollapsed} />

					{user?.role === 'Admin' && (
						<NavItem to="/admin" icon={SecurityRounded} label="Admin Panel" isCollapsed={isCollapsed} />
					)}
				</nav>
			</aside>
		</>
	);
}