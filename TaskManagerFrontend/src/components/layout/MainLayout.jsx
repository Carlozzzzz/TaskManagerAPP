// src/components/layout/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function MainLayout() {
	return (
		<div className="flex h-screen w-full overflow-hidden bg-gray-50">
			{/* Permanent Sidebar */}
			<Sidebar />

			<div className="flex flex-1 flex-col overflow-hidden">
				{/* Permanent Topbar */}
				<Topbar />

				{/* Dynamic Content Area */}
				<main className="flex-1 overflow-y-auto p-8">
					<div className="mx-auto max-w-3xl rounded-lg bg-white px-4 py-8 shadow-md">
						<Outlet />
					</div>
				</main>
			</div>
		</div>
	);
}