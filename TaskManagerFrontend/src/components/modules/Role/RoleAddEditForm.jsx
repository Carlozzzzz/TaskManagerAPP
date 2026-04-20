// src/components/modules/Role/RoleAddEditForm.jsx
import React, { useState, useEffect, useMemo } from 'react';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { accessType } from '../../../constants/modulePermissions';
import Button from '../../ui/Button';

export default function RoleAddEditForm({ initialData, dbModules = [], onSubmit }) {
	// MODIFIED: State for Role Name
	const [roleName, setRoleName] = useState('');

	// MODIFIED: State now uses moduleKey from DB as the object key
	const [permissions, setPermissions] = useState({});

	// STEP 1: Group flat dbModules into sections for the UI layout
	const groupedModules = useMemo(() => {
		return dbModules.reduce((acc, mod) => {
			const section = mod.section || "General";
			if (!acc[section]) acc[section] = [];
			acc[section].push(mod);
			return acc;
		}, {});
	}, [dbModules]);

	// STEP 2: Hydrate the form state
	useEffect(() => {
		// Create a "Zeroed out" permissions map based on all modules in the Database
		const skeleton = {};
		dbModules.forEach(mod => {
			skeleton[mod.key] = {
				canView: false, canAdd: false, canEdit: false, canDelete: false
			};
		});

		// If editing, merge the existing role permissions into the skeleton
		if (initialData?.permissions) {
			initialData.permissions.forEach(p => {
				// Only map if the module still exists in the DB modules list
				if (skeleton[p.moduleKey]) {
					skeleton[p.moduleKey] = {
						canView: p.canView,
						canAdd: p.canAdd,
						canEdit: p.canEdit,
						canDelete: p.canDelete
					};
				}
			});
		}

		setPermissions(skeleton);
		setRoleName(initialData?.name || '');
	}, [initialData, dbModules]);

	// HELPER: Toggles a single checkbox
	const handleCheck = (moduleKey, field) => {
		setPermissions(prev => ({
			...prev,
			[moduleKey]: {
				...prev[moduleKey],
				[field]: !prev[moduleKey][field]
			}
		}));
	};

	// HELPER: Toggles all 4 checkboxes in a single row
	const handleRowToggle = (moduleKey) => {
		const row = permissions[moduleKey];
		const isAllChecked = row && row.canView && row.canAdd && row.canEdit && row.canDelete;

		setPermissions(prev => ({
			...prev,
			[moduleKey]: {
				canView: !isAllChecked,
				canAdd: !isAllChecked,
				canEdit: !isAllChecked,
				canDelete: !isAllChecked,
			}
		}));
	};

	// UTILITY: Check every single permission for every module
	const checkAll = () => {
		const allChecked = {};
		dbModules.forEach(mod => {
			allChecked[mod.key] = { canView: true, canAdd: true, canEdit: true, canDelete: true };
		});
		setPermissions(allChecked);
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		// Convert the internal state object back into the List format required by .NET
		const formattedPermissions = Object.entries(permissions).map(([mKey, perms]) => ({
			moduleKey: mKey,
			...perms
		}));

		onSubmit({ name: roleName, permissions: formattedPermissions });
	};

	return (
		<form id="role-form" onSubmit={handleSubmit} className="space-y-6 text-gray-700">
			{/* Quick Actions Bar */}
			<div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
				<span className="text-sm font-medium text-gray-500">Quick Actions:</span>
				<Button
					icon={<CheckCircleIcon sx={{ fontSize: 18 }} />}
					name="Check All Rights"
					variant="primary"
					className="h-8 text-xs"
					onClick={(e) => { e.preventDefault(); checkAll(); }}
				/>
			</div>

			{/* Role Header Info */}
			<div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
				<div className="border-b border-gray-200 bg-gray-50/50 px-4 py-2">
					<h3 className="text-sm font-semibold text-gray-700">Template Details</h3>
				</div>
				<div className="p-4">
					<div className="space-y-1">
						<label className="text-xs font-bold uppercase text-gray-500">Role Name <span className="text-red-500">*</span></label>
						<input
							className="w-full rounded border border-gray-300 p-2 text-sm outline-none focus:border-blue-500"
							value={roleName}
							onChange={e => setRoleName(e.target.value)}
							placeholder="e.g. Sales Manager"
							required
						/>
					</div>
				</div>
			</div>

			{/* Dynamic Permission Matrix */}
			<div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
				<div className="border-b border-gray-200 bg-gray-50/50 px-4 py-2">
					<h3 className="text-sm font-semibold text-gray-700">Access Rights Mapping</h3>
				</div>

				<div className="space-y-8 p-4">
					{Object.entries(groupedModules).map(([sectionName, modules]) => (
						<div key={sectionName} className="overflow-hidden rounded-lg border border-gray-100">
							{/* Section Header */}
							<div className="bg-gray-100/80 px-4 py-2">
								<span className="text-sm font-bold text-gray-700">{sectionName}</span>
							</div>

							{/* Table Column Headers */}
							<div className="flex justify-between border-b border-gray-100 bg-white px-4 py-2">
								<span className="text-[10px] font-bold uppercase text-gray-400">Access Item</span>
								<div className="flex gap-8 pr-2 sm:gap-12">
									{accessType.map(t => (
										<span key={t.key} className="w-10 text-center text-[10px] font-bold uppercase text-gray-400">{t.name}</span>
									))}
								</div>
							</div>

							{/* Module Rows */}
							<div className="divide-y divide-gray-50">
								{modules.map(mod => {
									const rowPerms = permissions[mod.key] || {};
									const isRowFull = rowPerms.canView && rowPerms.canAdd && rowPerms.canEdit && rowPerms.canDelete;

									return (
										<div key={mod.key} className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-gray-50">
											<div className="flex items-center gap-3">
												<input
													type="checkbox"
													checked={!!isRowFull}
													onChange={() => handleRowToggle(mod.key)}
													className="h-4 w-4 rounded border-gray-300"
												/>
												<span className="text-sm font-medium text-gray-600">{mod.displayName}</span>
											</div>

											{/* Individual Checkboxes */}
											<div className="flex gap-8 pr-2 sm:gap-12">
												{accessType.map(type => (
													<div key={type.key} className="flex w-10 justify-center">
														<input
															type="checkbox"
															checked={permissions[mod.key]?.[type.key] || false}
															onChange={() => handleCheck(mod.key, type.key)}
															className="h-5 w-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-0"
														/>
													</div>
												))}
											</div>
										</div>
									);
								})}
							</div>
						</div>
					))}
				</div>
			</div>
		</form>
	);
}