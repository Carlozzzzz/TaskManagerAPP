// MODIFIED: Permanent Action Visibility
import React from 'react';
import { SwapVert } from '@mui/icons-material';

{/* 
  Add multiple select features
  Add custom renderer features for the column data
*/}

export default function DataTable({
	columns,
	data,
	actions = [],
	isLoading
}) {
	return (
		<div className="w-full overflow-hidden">
			<table className="w-full border-collapse text-left">
				<thead className="border-b border-slate-100 bg-[#F9FAFB]">
					<tr>
						{columns.map((col, idx) => (
							<th key={idx} className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
								<div className="flex cursor-pointer items-center gap-1 transition hover:text-blue-600">
									{col.header} <SwapVert sx={{ fontSize: 14, opacity: 0.5 }} />
								</div>
							</th>
						))}
						{actions.length > 0 && (
							<th className="px-6 py-3.5 text-right text-[10px] font-bold uppercase tracking-widest text-slate-400">
								Actions
							</th>
						)}
					</tr>
				</thead>
				<tbody className="divide-y divide-slate-50">
					{isLoading ? (
						<tr><td colSpan="100%" className="animate-pulse py-16 text-center text-sm font-medium text-slate-300">Fetching records...</td></tr>
					) : data.length === 0 ? (
						<tr><td colSpan="100%" className="py-16 text-center text-sm font-medium text-slate-400">No records found.</td></tr>
					) : (
						data.map((row, rIdx) => (
							<tr key={rIdx} className="group transition-colors hover:bg-blue-50/20">
								{columns.map((col, cIdx) => (
									<td key={cIdx} className="px-6 py-4 text-sm font-medium text-slate-600">
										{col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
									</td>
								))}

								{actions.length > 0 && (
									<td className="px-6 py-4 text-right">
										<div className="flex justify-end gap-2">
											{actions.map((act, aIdx) => (
												<button
													key={aIdx}
													onClick={() => act.onClick(row)}
													className={`p-2 rounded-lg transition-all active:scale-90 bg-slate-50 border border-slate-100 shadow-sm ${act.color}`}
												>
													<div className="flex items-center justify-center">
														{act.icon}
													</div>
												</button>
											))}
										</div>
									</td>
								)}
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
}