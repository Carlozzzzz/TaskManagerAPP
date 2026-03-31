// src/components/layout/Topbar.jsx
import { useAuth } from '../../hooks/useAuth';
import { useLayout } from '../../context/LayoutContext';
import {
	MenuRounded,
	NotificationsNoneRounded,
	SearchRounded,
	LogoutRounded
} from '@mui/icons-material';

export default function Topbar() {
	const { user, logout } = useAuth();
	const { toggleMobile } = useLayout(); // MODIFIED: Use shared layout state

	return (
		<header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-4 backdrop-blur-md md:px-8">

			{/* LEFT SIDE: Mobile Menu & Search */}
			<div className="flex items-center gap-4">
				{/* Mobile Toggle - Only visible on small screens */}
				<button
					onClick={toggleMobile}
					className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 md:hidden"
				>
					<MenuRounded />
				</button>

				{/* Search Bar - Modern Minimalist */}
				<div className="group hidden items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-3 py-1.5 transition-all focus-within:border-blue-300 focus-within:bg-white sm:flex">
					<SearchRounded className="text-gray-400" sx={{ fontSize: 20 }} />
					<input
						type="text"
						placeholder="Search tasks..."
						className="w-48 border-none bg-transparent text-sm text-gray-700 focus:outline-none md:w-64"
					/>
				</div>
			</div>

			{/* RIGHT SIDE: Notifications & Profile */}
			<div className="flex items-center gap-3 md:gap-6">

				{/* Notifications */}
				<button className="relative rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100">
					<NotificationsNoneRounded />
					<span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-red-500"></span>
				</button>

				{/* Vertical Divider */}
				<div className="hidden h-6 w-[1px] bg-gray-200 sm:block"></div>

				{/* User Profile Section */}
				<div className="flex items-center gap-4">
					<div className="hidden flex-col items-end md:flex">
						<div className="flex items-center gap-2">
							{/* MODIFIED: Matching your existing Admin badge logic */}
							{user?.role === 'admin' && (
								<span className="rounded border border-purple-100 bg-purple-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-600">
									Admin
								</span>
							)}
							<span className="text-sm font-semibold text-gray-900">
								{user?.name}
							</span>
						</div>
						<p className="text-[11px] text-gray-500">{user?.email}</p>
					</div>

					{/* Logout Button */}
					<button
						onClick={() => logout({ forced: false })}
						title="Logout"
						className="flex items-center gap-2 rounded-lg p-2 text-gray-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600 md:px-3 md:py-2"
					>
						<LogoutRounded sx={{ fontSize: 20 }} />
						<span className="hidden text-sm font-medium md:inline">Logout</span>
					</button>
				</div>
			</div>
		</header>
	);
}