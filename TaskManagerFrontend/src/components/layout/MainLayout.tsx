// src/components/layout/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { LayoutProvider } from '../../context/LayoutContext'; // ADDED

export default function MainLayout() {
	return (
		<LayoutProvider> {/* ADDED: Wraps the layout so Sidebar & Topbar can share state */}
			<div className="flex h-screen w-full overflow-hidden bg-gray-50 text-gray-900">

				{/* Sidebar: Now consumes state from LayoutProvider */}
				<Sidebar />

				<div className="flex flex-1 flex-col overflow-hidden">
					{/* Topbar: Now has the mobile hamburger button */}
					<Topbar />

					{/* Dynamic Content Area */}
					<main className="flex-1 overflow-y-auto p-4 md:p-8">
						{/* MODIFIED: Increased max-width to 6xl for a more professional HR/Admin feel */}
						<div className="mx-auto min-h-[calc(100vh-160px)] max-w-6xl rounded-xl border border-gray-100 bg-white px-6 py-8 shadow-sm">
							<Outlet />
						</div>
					</main>
				</div>
			</div>
		</LayoutProvider>
	);
}