// REPLACED: High-Density Compact HR Dashboard
import React from 'react';
import {
	Timer, EventNote, Payments, People,
	AssignmentLate, CheckCircleOutline, TrendingUp
} from '@mui/icons-material';

const StatCard = ({ title, total, rate, icon, variant = "blue" }) => {
	const styles = {
		blue: "bg-blue-50 border-blue-100 text-blue-600",
		indigo: "bg-indigo-50 border-indigo-100 text-indigo-600",
		cyan: "bg-cyan-50 border-cyan-100 text-cyan-600",
		emerald: "bg-emerald-50 border-emerald-100 text-emerald-600",
	};
	return (
		<div className={`rounded-xl border p-4 flex items-center gap-4 transition-all hover:shadow-sm ${styles[variant]}`}>
			<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
				{icon}
			</div>
			<div>
				<p className="text-xs font-semibold text-gray-500">{title}</p>
				<h4 className="text-xl font-bold leading-tight text-gray-900">{total}</h4>
				<p className="mt-0.5 text-[10px] font-bold opacity-80">{rate} <span className="font-normal text-gray-400 opacity-60">vs last month</span></p>
			</div>
		</div>
	);
};

export default function HomePage() {
	return (
		<div className="space-y-6">

			{/* --- DASHBOARD HEADER --- */}
			<div className="mb-2">
				<h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
				<p className="text-sm text-gray-400">Your HR management overview</p>
			</div>

			{/* --- 1. COMPACT ANNOUNCEMENT (BLUE) --- */}
			<div className="relative overflow-hidden rounded-xl bg-[#3C50E0] p-6 text-white shadow-md">
				<div className="relative z-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
					<div>
						<h2 className="text-xl font-bold tracking-tight">Annual Team Building 2024!</h2>
						<p className="text-sm text-blue-100 opacity-80">Submit dietary requirements by Friday.</p>
					</div>
					<button className="rounded-lg bg-white px-5 py-2 text-xs font-bold text-blue-600 shadow-sm transition active:scale-95">
						Read More
					</button>
				</div>
				{/* Subtle background glow */}
				<div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
			</div>

			{/* --- 2. TOP STATS (Compact Row) --- */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<StatCard variant="blue" title="OT Requests" total="12" rate="+5%" icon={<Timer />} />
				<StatCard variant="indigo" title="Leave Requests" total="08" rate="-2%" icon={<EventNote />} />
				<StatCard variant="emerald" title="Net Salary" total="$4.2K" rate="+10%" icon={<Payments />} />
				<StatCard variant="cyan" title="Headcount" total="156" rate="+4%" icon={<People />} />
			</div>

			{/* --- 3. MIDDLE SECTION (Pending & Employees) --- */}
			<div className="grid grid-cols-12 gap-6">

				{/* PENDING ACTIONS (7/12) */}
				<div className="col-span-12 space-y-4 xl:col-span-8">
					{/* Secondary Stats Row (like Profit/Expenses in reference) */}
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div className="group flex items-start justify-between rounded-xl border border-gray-100 bg-white p-5 transition hover:border-blue-200">
							<div>
								<h4 className="text-xl font-bold text-gray-900">$25,458</h4>
								<p className="text-xs font-medium text-gray-400">Monthly Payroll</p>
								<div className="mt-4 flex items-center gap-2">
									<span className="text-[10px] font-bold text-emerald-500">+35%</span>
									<span className="text-[10px] text-gray-300">vs Last Month</span>
								</div>
							</div>
							<TrendingUp className="text-blue-500 opacity-40 transition group-hover:opacity-100" />
						</div>
						<div className="group flex items-start justify-between rounded-xl border border-gray-100 bg-white p-5 transition hover:border-blue-200">
							<div>
								<h4 className="text-xl font-bold text-gray-900">03</h4>
								<p className="text-xs font-medium text-gray-400">Critical Tasks</p>
								<div className="mt-4 flex items-center gap-2">
									<span className="text-[10px] font-bold text-red-500">-20%</span>
									<span className="text-[10px] text-gray-300">vs Last Month</span>
								</div>
							</div>
							<AssignmentLate className="text-red-400 opacity-40 transition group-hover:opacity-100" />
						</div>
					</div>

					{/* Pending List Area */}
					<div className="rounded-xl border border-gray-100 bg-white p-6">
						<h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-gray-900">Pending Approvals</h3>
						<div className="space-y-4">
							{[1, 2].map(i => (
								<div key={i} className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0">
									<div className="flex items-center gap-4">
										<div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-xs font-bold text-slate-400">JD</div>
										<div>
											<p className="text-sm font-bold tracking-tight text-gray-800">John Doe</p>
											<p className="text-[10px] font-medium text-gray-400">Vacation Request • 2 days</p>
										</div>
									</div>
									<div className="flex gap-2">
										<button className="text-[10px] font-bold uppercase text-gray-400 hover:text-red-500">Reject</button>
										<button className="text-[10px] font-bold uppercase text-blue-600 hover:text-blue-700">Approve</button>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* EMPLOYEE SUMMARY (5/12) */}
				<div className="col-span-12 rounded-xl border border-gray-100 bg-white p-6 xl:col-span-4">
					<div className="mb-8 flex items-center justify-between">
						<h3 className="text-sm font-bold uppercase tracking-tight tracking-wider text-gray-900">Company Pulse</h3>
						<select className="rounded border-none bg-slate-50 px-2 py-1 text-[10px] font-bold text-gray-400 outline-none">
							<option>Last 7 Days</option>
						</select>
					</div>

					<div className="flex flex-col items-center py-4">
						{/* Minimal Donut Placeholder */}
						<div className="relative flex h-32 w-32 items-center justify-center rounded-full border-[10px] border-slate-50 border-r-indigo-400 border-t-blue-500">
							<span className="text-xl font-bold text-gray-800">92%</span>
						</div>
						<p className="mt-4 text-center text-[10px] font-bold uppercase tracking-widest text-gray-400">Average Attendance</p>
					</div>

					<div className="mt-10 grid grid-cols-2 gap-4 border-t border-gray-50 pt-6">
						<div>
							<p className="text-xs font-bold uppercase text-gray-400">Active</p>
							<p className="text-lg font-bold text-gray-900">142</p>
						</div>
						<div className="text-right">
							<p className="text-xs font-bold uppercase text-gray-400">On Leave</p>
							<p className="text-lg font-bold text-gray-900">14</p>
						</div>
					</div>
				</div>

			</div>
		</div>
	);
}