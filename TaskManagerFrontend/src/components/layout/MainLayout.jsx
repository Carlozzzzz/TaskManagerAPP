// src/components/layout/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function MainLayout() {
	return (
		<div className="flex h-screen w-full bg-gray-50 overflow-hidden">
			{/* Permanent Sidebar */}
			<Sidebar />

			<div className="flex-1 flex flex-col overflow-hidden">
				{/* Permanent Topbar */}
				<Topbar />

				{/* Dynamic Content Area */}
				<main className="flex-1 overflow-y-auto p-8">
					<div className="max-w-3xl mx-auto px-4 py-8 bg-white shadow-md rounded-lg">
						<Outlet />
					</div>
				</main>
			</div>
		</div>
	);
}