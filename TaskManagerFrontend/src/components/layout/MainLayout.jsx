// MODIFIED: Removing the "Box-in-Box" to match reference
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { LayoutProvider } from '../../context/LayoutContext';

export default function MainLayout() {
	return (
		<LayoutProvider>
			<div className="flex h-screen w-full overflow-hidden bg-[#FDFDFF] text-slate-900">
				<Sidebar />

				<div className="flex flex-1 flex-col overflow-hidden">
					<Topbar />
					
					<main className="flex-1 overflow-y-auto bg-gray-50 p-4 px-6">
						<div className="mx-auto w-full max-w-[1600px]">
							<Outlet />
						</div>
					</main>
					
				</div>
			</div>
		</LayoutProvider>
	);
}