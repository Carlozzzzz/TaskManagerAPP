// src/components/layout/NavDropdown.jsx
import { useState, useEffect } from 'react';
import { KeyboardArrowDownRounded } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom'; // 1. Added useLocation

export default function NavDropdown({ icon: Icon, label, items, isCollapsed }) {
	const location = useLocation(); // Get the current URL path

	// 2. Check if any child item's path matches the current URL
	const isChildActive = items.some(item => location.pathname === item.to);

	// 3. Initialize isOpen to true if a child is active (keeps it open on refresh)
	const [isOpen, setIsOpen] = useState(isChildActive);

	// Update isOpen if the path changes (e.g., navigating via browser back button)
	useEffect(() => {
		if (isChildActive) setIsOpen(true);
	}, [location.pathname, isChildActive]);

	if (isCollapsed) {
		return (
			<div className={`group relative flex cursor-pointer flex-col items-center py-2.5 transition-colors ${isChildActive ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
				}`}>
				<Icon sx={{ fontSize: 22 }} />
				<div className="absolute left-16 z-50 scale-0 whitespace-nowrap rounded bg-gray-900 p-2 text-xs text-white transition-all group-hover:scale-100">
					{label}
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-1">
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isChildActive
						? 'bg-blue-50 text-blue-600' // Style when a sub-item is active
						: 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
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
					{items.map((item, idx) => {
						// 4. Check if this specific item is the active one
						const isActive = location.pathname === item.to;

						return (
							<Link
								key={idx}
								to={item.to || "#"}
								className={`flex w-full items-center rounded-md px-4 py-2 text-left text-sm transition-colors ${isActive
										? 'font-semibold text-blue-600' // Style for active sub-item
										: 'text-gray-500 hover:bg-blue-50/50 hover:text-blue-600'
									}`}
							>
								<span className={`mr-2 ${isActive ? 'text-blue-600' : 'text-gray-300'}`}>•</span>
								{item.label}
							</Link>
						);
					})}
				</div>
			)}
		</div>
	);
}