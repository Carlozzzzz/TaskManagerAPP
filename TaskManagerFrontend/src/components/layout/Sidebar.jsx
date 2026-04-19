// src/components/layout/Sidebar.jsx
import { useEffect, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useLayout } from '../../context/LayoutContext';
import NavItem from './NavItem';
import NavDropdown from './NavDropdown';
import { getAccessibleSidebar } from '../../utils/permissionUtils'; // ADDED

import {
	HomeRounded,
	BuildCircleRounded,
	TerminalRounded,
	GroupRounded,
	AssignmentRounded,
	SecurityRounded,
	ChevronLeftRounded,
	CloseRounded,
	HelpOutlineRounded
} from '@mui/icons-material';

const ICON_MAP = {
	home: HomeRounded,
	maintenance: BuildCircleRounded,
	dev: TerminalRounded,
	tasks: AssignmentRounded,
	users: GroupRounded,
	admin: SecurityRounded,
};

export default function Sidebar() {
	const { user } = useAuth(); // Assuming user.permissions exists here
	const { isCollapsed, isMobileOpen, toggleSidebar, toggleMobile, closeMobile } = useLayout();

	// MODIFIED: Compute the dynamic sidebar whenever user permissions change
	const dynamicSidebar = useMemo(() => {
		// Pass the user's permission array to the utility
		return getAccessibleSidebar(user?.permissions || []);
	}, [user]);

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
  
  console.log(user)

	return (
		<>
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
					{Object.entries(dynamicSidebar).map(([category, config]) => {
						const IconComponent = ICON_MAP[config.icon] || HelpOutlineRounded;

						// Standalone Item (e.g. Home, Admin)
						if (config.isStandalone) {
							return (
								<NavItem
									key={category}
									to={config.items[0].to}
									icon={IconComponent}
									label={category}
									isCollapsed={isCollapsed}
								/>
							);
						}

						// Dropdown Item (e.g. Maintenance)
						return (
							<NavDropdown
								key={category}
								icon={IconComponent}
								label={category}
								isCollapsed={isCollapsed}
								items={config.items.map(i => ({ label: i.name, to: i.to }))}
							/>
						);
					})}
				</nav>
			</aside>
		</>
	);
}