// src/components/modules/Role/RoleAddEditForm.jsx
import React, { useState, useEffect } from 'react';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { modulePermissions, accessType } from '../../../constants/modulePermissions';
import Button from '../../ui/Button';

export default function RoleAddEditForm({ initialData, dbModules = [], onSubmit }) {
	const [roleName, setRoleName] = useState(initialData?.name || '');

	// MODIFIED: State now uses moduleKey as the object key for absolute reliability
	const [permissions, setPermissions] = useState({});

	useEffect(() => {
		if (initialData?.permissions) {
			const prefill = {};
			initialData.permissions.forEach(p => {
				// Map existing permissions from backend by their Key
				prefill[p.moduleKey] = {
					canView: p.canView, canAdd: p.canAdd,
					canEdit: p.canEdit, canDelete: p.canDelete
				};
			});
			setPermissions(prefill);
		}
	}, [initialData]);

	const handleCheck = (moduleKey, field) => {
		setPermissions(prev => ({
			...prev,
			[moduleKey]: {
				...(prev[moduleKey] || { canView: false, canAdd: false, canEdit: false, canDelete: false }),
				[field]: !prev[moduleKey]?.[field]
			}
		}));
	};

	const handleRowToggle = (moduleKey) => {
		const row = permissions[moduleKey];
		const isAllChecked = row && row.canView && row.canAdd && row.canEdit && row.canDelete;

		setPermissions(prev => ({
			...prev,
			[moduleKey]: {
				canView: !isAllChecked, canAdd: !isAllChecked,
				canEdit: !isAllChecked, canDelete: !isAllChecked,
			}
		}));
	};

	const checkAll = () => {
		const newPerms = {};
		Object.values(modulePermissions).forEach(category => {
			category.items.forEach(item => {
				newPerms[item.moduleKey] = { canView: true, canAdd: true, canEdit: true, canDelete: true };
			});
		});
		setPermissions(newPerms);
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		// MODIFIED: Formatting the payload to include ModuleKey (Required by Backend)
		const formattedPermissions = Object.entries(permissions).map(([mKey, perms]) => ({
			moduleKey: mKey, // ADDED: Critical missing property
			...perms
		}));

		onSubmit({ name: roleName, permissions: formattedPermissions });
	};

	return (
		<form id="role-form" onSubmit={handleSubmit} className="space-y-6 text-gray-700">
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

			<div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
				<div className="border-b border-gray-200 bg-gray-50/50 px-4 py-2">
					<h3 className="text-sm font-semibold text-gray-700">Template Details</h3>
				</div>
				<div className="p-4">
					<div className="space-y-1">
						<label className="text-xs font-bold uppercase text-gray-500">Description <span className="text-red-500">*</span></label>
						<input className="w-full rounded border border-gray-300 p-2 text-sm outline-none focus:border-blue-500" value={roleName} onChange={e => setRoleName(e.target.value)} placeholder="Enter role description" required />
					</div>
				</div>
			</div>

			<div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
				<div className="border-b border-gray-200 bg-gray-50/50 px-4 py-2">
					<h3 className="text-sm font-semibold text-gray-700">Access Rights Mapping</h3>
				</div>

				<div className="space-y-8 p-4">
					{Object.entries(modulePermissions).map(([category, config]) => (
						<div key={category} className="overflow-hidden rounded-lg border border-gray-100">
							<div className="bg-gray-100/80 px-4 py-2">
								<span className="text-sm font-bold text-gray-700">{category}</span>
							</div>

							<div className="flex justify-between border-b border-gray-100 bg-white px-4 py-2">
								<span className="text-[10px] font-bold uppercase text-gray-400">Access Item</span>
								<div className="flex gap-8 pr-2 sm:gap-12">
									{accessType.map(t => (
										<span key={t.key} className="w-10 text-center text-[10px] font-bold uppercase text-gray-400">{t.name}</span>
									))}
								</div>
							</div>

							<div className="divide-y divide-gray-50">
								{config.items.map(item => {
									const rowPerms = permissions[item.moduleKey] || {};
									const isRowFull = rowPerms.canView && rowPerms.canAdd && rowPerms.canEdit && rowPerms.canDelete;

									return (
										<div key={item.moduleKey} className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-gray-50">
											<div className="flex items-center gap-3">
												<input
													type="checkbox"
													checked={!!isRowFull}
													onChange={() => handleRowToggle(item.moduleKey)}
													className="h-4 w-4 rounded border-gray-300"
												/>
												<span className="text-sm font-medium text-gray-600">{item.name}</span>
											</div>

											<div className="flex gap-8 pr-2 sm:gap-12">
												{accessType.map(type => (
													<div key={type.key} className="flex w-10 justify-center">
														<input
															type="checkbox"
															checked={permissions[item.moduleKey]?.[type.key] || false}
															onChange={() => handleCheck(item.moduleKey, type.key)}
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