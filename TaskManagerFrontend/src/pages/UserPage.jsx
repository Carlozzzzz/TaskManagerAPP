// src/pages/UserPage.jsx
import React, { useState, useEffect } from 'react'; // MODIFIED
import DataTable from '../components/ui/DataTable';
import LockResetIcon from '@mui/icons-material/LockReset';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import Edit from '@mui/icons-material/Edit'; // MODIFIED

import { useUsers } from '../hooks/useUsers';
import { useRoles } from '../hooks/useRoles'; // ADDED
import { useConfirm } from '../hooks/useConfirm';
import Modal from '../components/ui/Modal';
import UserAddEditForm from '../components/modules/User/UserAddEditForm';
import RoleAddEditForm from '../components/modules/Role/RoleAddEditForm'; // ADDED
import Button from '../components/ui/Button';
import PageTitle from '../components/ui/PageTitle';
import Breadcrumb from '../components/ui/Breadcrumb';
import SyncIcon from '@mui/icons-material/Sync';
import { useModules } from '../hooks/useModules';

export default function UserPage() {
	const {
		allUsers,
		selectedUser, setSelectedUser,
		loading: usersLoading,
		updateUser,
		resetUserPassword
	} = useUsers();
	const {
		roles,
		rolePermissions,
		selectedRole, setSelectedRole,
		loading: rolesLoading,
		fetchRoles,
		fetchRolePermission,
		clearRoleSelection,
		saveRole
	} = useRoles();
	const { modules, loading: dbModulesLoading, fetchModules, syncModules } = useModules();
	const { askConfirm } = useConfirm();

	// User Modal States
	const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);

	// ADDED: Role Modal States
	const [isRoleListModalOpen, setIsRoleListModalOpen] = useState(false);
	const [isRoleEntryModalOpen, setIsRoleEntryModalOpen] = useState(false);

	// --- USER HANDLERS ---
	const handleOpenAddEditModal = (user) => {
		setSelectedUser(user);
		setIsAddEditModalOpen(true);
	};

	const handleCloseAddEditModal = () => {
		setIsAddEditModalOpen(false);
		setSelectedUser(null);
	};

	const handleFormSubmit = async (formData) => {
		const isOk = await askConfirm({
			title: 'Update User?',
			type: 'update',
			message: 'Are you sure you want to proceed?'
		});

		if (isOk) {
			await updateUser(selectedUser.id, formData);
			handleCloseAddEditModal();
		}
	};

	const handleReset = async (formData) => {
		const isOk = await askConfirm({
			title: 'Reset Password?',
			type: 'warning',
			message: 'Are you sure you want to proceed?'
		});

		if (isOk) {
			await resetUserPassword(formData.id);
			handleCloseAddEditModal();
		}
	};

	// --- ADDED: ROLE HANDLERS ---
	const handleOpenRoleManagement = async () => {
		await Promise.all([
			fetchRoles(),
			fetchModules()
		]);
		setIsRoleListModalOpen(true);
	};

	const handleOpenRoleEntry = (role = null) => {
		setSelectedRole(role);

		if (role) {
			// Fetch fresh permissions from API for the selected role
			fetchRolePermission(role.id);
		} else {
			// Clear permissions state for "Create New" mode
			clearRoleSelection();
		}

		setIsRoleEntryModalOpen(true);
	};

	const handleCloseRoleEntry = () => {
		setIsRoleEntryModalOpen(false);
		// Cleanup state AFTER the modal is closed so the user doesn't 
		// see the fields disappear while the modal is still fading out.
		setTimeout(() => clearRoleSelection(), 300);
	};


	const handleRoleSubmit = async (formData) => {
		const isOk = await askConfirm({
			title: selectedRole ? 'Update Role?' : 'Create Role?',
			type: selectedRole ? 'update' : 'success',
			message: 'This will update permissions for all users assigned to this role.'
		});

		if (!isOk) return;

		const success = await saveRole(selectedRole?.id, formData);
		if (success) {
			handleCloseRoleEntry();
		}
	};

	const handleSyncModules = async () => {
		const isOk = await askConfirm({
			title: 'Sync Modules?',
			message: 'This will align the database with your current app configuration. Continue?',
			type: 'warning'
		});

		if (isOk) {
			await syncModules();
		}
	};


	// Column Definitions
	const userColumns = [
		{ header: 'ID', accessor: 'id' },
		{ header: 'Name', accessor: 'name' },
		{ header: 'Email', accessor: 'email' },
	];

	// ADDED: Role Table Columns
	const roleColumns = [
		{ header: 'Role Name', accessor: 'name' },
	];

	const userActions = [
		{
			icon: <Edit sx={{ fontSize: 18 }} />,
			color: 'text-green-500 hover:text-green-600',
			onClick: (row) => handleOpenAddEditModal(row)
		},
		{
			icon: <LockResetIcon />,
			color: 'text-red-600 hover:text-red-700',
			onClick: (row) => handleReset(row),
		}
	];

	// ADDED: Role Table Actions
	const roleActions = [
		{
			icon: <Edit sx={{ fontSize: 18 }} />,
			color: 'text-blue-500',
			onClick: (row) => handleOpenRoleEntry(row)
		}
	];

	return (
		<div className="space-y-3 rounded-lg bg-white p-4">
			<Breadcrumb page="Company" />
			<PageTitle title="Users" />

			<div className='flex flex-row items-center justify-between'>
				<div className='flex flex-row'>
					<Button
						name="Register User"
						icon={<HowToRegIcon sx={{ fontSize: 18 }} />}
						variant='success'
						onClick={() => handleOpenAddEditModal(null)}
						className="rounded-r-none uppercase"
					/>
					<Button
						name="Manage Roles"
						icon={<AppRegistrationIcon sx={{ fontSize: 18 }} />}
						variant='primary'
						onClick={handleOpenRoleManagement}
						className="rounded-l-none uppercase"
					/>
				</div>

				{/* ADDED: Global Sync Button (Admin Only) */}
				<Button
					name="Sync Config"
					icon={<SyncIcon sx={{ fontSize: 18 }} />}
					variant="ghost"
					onClick={handleSyncModules}
					className="text-slate-400 hover:text-blue-600"
				/>
			</div>

			<div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
				<DataTable
					columns={userColumns}
					data={allUsers}
					isLoading={usersLoading}
					actions={userActions}
				/>
			</div>

			{/* User Edit Modal */}
			<Modal
				isOpen={isAddEditModalOpen}
				onClose={handleCloseAddEditModal}
				title={selectedUser ? "Edit User" : "Add New User"}
				footer={
					<>
						<Button variant="ghost" name="Cancel" onClick={handleCloseAddEditModal} />
						<Button type="submit" form="user-form" variant="primary" name={selectedUser ? "Update" : "Create"} />
					</>
				}
			>
				<UserAddEditForm initialData={selectedUser} onSubmit={handleFormSubmit} />
			</Modal>

			{/* ADDED: Role List Modal */}
			<Modal
				isOpen={isRoleListModalOpen}
				onClose={() => setIsRoleListModalOpen(false)}
				title="Role Management"
				size="lg"
				footer={<Button name="Add New Role" variant="success" onClick={() => handleOpenRoleEntry(null)} />}
			>
				<DataTable
					columns={roleColumns}
					data={roles}
					isLoading={rolesLoading}
					actions={roleActions}
				/>
			</Modal>

			{/* ADDED: Role Permission Entry Modal (The Matrix) */}
			<Modal
				isOpen={isRoleEntryModalOpen}
				onClose={handleCloseRoleEntry}
				title={selectedRole ? `Edit Permissions: ${selectedRole.name}` : "Create New Role"}
				size="xl"
				footer={
					<>
						<Button variant="ghost" name="Back" onClick={() => setIsRoleEntryModalOpen(false)} />
						{/* ADDED: Disable save button while loading permissions */}
						<Button
							type="submit"
							form="role-form"
							variant="primary"
							name="Save Permissions"
							disabled={rolesLoading}
						/>
					</>
				}
			>
				{/* Senior Tip: Check for rolePermissions only if we are in EDIT mode */}
				{rolesLoading && selectedRole ? (
					<div className="p-10 text-center">Loading Permissions...</div>
				) : (
					<RoleAddEditForm
						initialData={rolePermissions} // This now gets fresh data from the fetch
						modules={modules}
						onSubmit={handleRoleSubmit}
					/>
				)}
			</Modal>
		</div>
	);
}