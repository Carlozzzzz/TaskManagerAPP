// REPLACED: Content adjusted for Layout Box
import React from 'react';
import CardDataStats from '../components/ui/CardDataStats';
import { Timer, EventNote, Payments, People, AssignmentLate, CheckCircleOutline } from '@mui/icons-material';

export default function HomePage() {
	return (
		/* 
			 IMPORTANT: p-0 here because MainLayout provides the padding.
			 We only use space-y to separate the sections.
		*/
		<div className="space-y-8">

			{/* --- 1. TOP ANNOUNCEMENT --- */}
			<div className="relative overflow-hidden rounded-[2rem] bg-[#3C50E0] p-6 text-white shadow-lg md:px-10 md:py-8">
				<div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
					<div className="max-w-xl">
						<span className="mb-2 inline-block rounded-full bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest">Company News</span>
						<h2 className="text-2xl font-black tracking-tight md:text-3xl">Annual Team Building 2024!</h2>
						<p className="mt-1 text-sm text-blue-100">Submit your dietary requirements by Friday.</p>
					</div>
					<button className="shrink-0 rounded-2xl bg-white px-6 py-3 text-xs font-black text-blue-600 shadow-md transition active:scale-95">
						View Details
					</button>
				</div>
			</div>

			{/* --- 2. HR STATISTICS --- */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<CardDataStats variant="orange" title="OT" total="12" rate="+2" icon={<Timer fontSize="inherit" />} />
				<CardDataStats variant="cyan" title="Leave" total="08" rate="-1" icon={<EventNote fontSize="inherit" />} />
				<CardDataStats variant="green" title="Avg Salary" total="$4.2K" rate="+0.5%" icon={<Payments fontSize="inherit" />} />
				<CardDataStats variant="amber" title="Headcount" total="156" rate="+4" icon={<People fontSize="inherit" />} />
			</div>

			{/* --- 3. TWO COLUMN SECTION --- */}
			<div className="grid grid-cols-12 gap-8">

				{/* PENDING ACTIONS (Larger Column) */}
				<div className="col-span-12 xl:col-span-7">
					<div className="mb-5 flex items-center justify-between">
						<h3 className="text-xl font-black tracking-tight text-slate-800">Pending Actions</h3>
						<span className="text-[10px] font-bold text-slate-400">3 TOTAL</span>
					</div>

					<div className="space-y-3">
						{[
							{ type: "OT Approval", name: "John Smith", desc: "4 Hours Weekend OT", color: "bg-orange-50 text-orange-500" },
							{ type: "Contract", name: "Jane Doe", desc: "Signature Required", color: "bg-red-50 text-red-500" },
							{ type: "Leave", name: "Mike Ross", desc: "5 Days Vacation", color: "bg-cyan-50 text-cyan-500" },
						].map((task, i) => (
							<div key={i} className="flex items-center justify-between rounded-3xl border border-slate-50 bg-slate-50/50 p-4 transition hover:border-slate-100 hover:bg-white hover:shadow-md">
								<div className="flex items-center gap-4">
									<div className={`h-11 w-11 shrink-0 rounded-2xl ${task.color} flex items-center justify-center`}>
										<AssignmentLate fontSize="small" />
									</div>
									<div>
										<h4 className="text-sm font-black text-slate-800">{task.name}</h4>
										<p className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">{task.type} • {task.desc}</p>
									</div>
								</div>
								<button className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-300 shadow-sm transition hover:border-green-500 hover:text-green-500">
									<CheckCircleOutline sx={{ fontSize: 20 }} />
								</button>
							</div>
						))}
					</div>
				</div>

				{/* EMPLOYEE DIRECTORY (Smaller Column) */}
				<div className="col-span-12 xl:col-span-5">
					<div className="mb-5 flex items-center justify-between">
						<h3 className="text-xl font-black tracking-tight text-slate-800">Employees</h3>
						<button className="text-xs font-black text-blue-600 hover:underline">View All</button>
					</div>

					<div className="rounded-[2rem] border border-slate-50 bg-slate-50/50 p-6">
						<div className="space-y-5">
							{[
								{ name: "Sarah Connor", role: "UI Designer", status: "Active" },
								{ name: "Kyle Reese", role: "DevOps", status: "On Leave" },
								{ name: "Marty McFly", role: "HR Specialist", status: "Active" },
							].map((emp, i) => (
								<div key={i} className="flex items-center justify-between border-b border-white pb-5 last:border-0 last:pb-0">
									<div className="flex items-center gap-3">
										<div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xs font-black text-slate-400 shadow-sm">
											{emp.name[0]}
										</div>
										<div>
											<h4 className="text-sm font-black text-slate-800">{emp.name}</h4>
											<p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{emp.role}</p>
										</div>
									</div>
									<span className={`text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-widest ${emp.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
										{emp.status}
									</span>
								</div>
							))}
						</div>
						<button className="mt-8 w-full rounded-2xl border border-slate-100 bg-white py-3.5 text-[10px] font-black uppercase tracking-widest text-slate-500 shadow-sm transition hover:bg-slate-100">
							+ Add Employee
						</button>
					</div>
				</div>

			</div>
		</div>
	);
}