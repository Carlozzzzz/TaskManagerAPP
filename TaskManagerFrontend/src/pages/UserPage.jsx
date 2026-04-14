// MODIFIED: Integrating your Promise-based useConfirm
import React, { useState } from 'react';
import DataTable from '../components/ui/DataTable';
import LockResetIcon from '@mui/icons-material/LockReset';
import { useUsers } from '../hooks/useUsers';
import { useConfirm } from '../hooks/useConfirm';
import { Edit } from '@mui/icons-material';
import Modal from '../components/ui/Modal';
import UserAddEditForm from '../components/modules/User/UserAddEditForm';
import Button from '../components/ui/Button';

export default function UserPage() {
	const { allUsers, selectedUser, loading, setSelectedUser, updateUser, resetUserPassword } = useUsers();
	const { askConfirm } = useConfirm();

	const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
	
	const handleOpenAddEditModal = (user) => {
		setSelectedUser(user);
		setIsAddEditModalOpen(true);
	}
	
	const handleCloseAddEditModal = () => {
		setIsAddEditModalOpen(false);
		setSelectedUser(null);
	}
	
	const handleFormSubmit = async (formData) => {
		const isOk = await askConfirm({
			title: 'Update User?',
			type: 'update',
			message: 'Are you sure you want to proceed?'
		});
		
		if(isOk) {
			await updateUser(selectedUser.id, formData);
			handleCloseAddEditModal();
		} 
	}


	const handleReset = async (formData) => {
		const isOk = await askConfirm({
			title: 'Reset Password?',
			type: 'warning',
			message: 'Are you sure you want to proceed?'
		});
		
		if(isOk) {
			await resetUserPassword(formData.id);
			handleCloseAddEditModal();
		} else {
			console.log("error");
		}
	}
	const columns = [
		{ header: 'ID', accessor: 'id' },
		{ header: 'Name', accessor: 'name' },
		{ header: 'Email', accessor: 'email' },
	];

	const actions = [
		{
			icon: <Edit sx={{ fontSize: 18 }} />,
			color: 'text-green-600 hover:bg-green-50',
			onClick: (row) => handleOpenAddEditModal(row)
		},
		{
			icon: <LockResetIcon />,
			color: 'text-gray-600 hover:bg-gray-700',
			onClick: (row) => handleReset(row),
		}
	]

	return (
		<div className="space-y-6 rounded-lg bg-white p-4">
			<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-slate-500">Users</h1>
					<p className="text-sm font-medium tracking-tight text-slate-400">Manage Users, Roles and Permission</p>
				</div>
			</div>

			<div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
				<DataTable
					columns={columns}
					data={allUsers}
					isLoading={loading}
					actions={actions}
				/>
			</div>

			<Modal
				isOpen={isAddEditModalOpen}
				onClose={() => setIsAddEditModalOpen(false)}
				title={selectedUser ? "Edit User" : "Add New User"}
				footer={
					<>
						<Button variant="ghost" name="Cancel" onClick={handleCloseAddEditModal} />
						<Button
							type="submit"          // <--- MUST BE SUBMIT
							form="user-form"    // <--- MUST MATCH THE FORM ID
							variant="primary"
							name={selectedUser ? "Update" : "Create"}
						/>
					</>
				}
			>
				<UserAddEditForm
					initialData={selectedUser}
					onSubmit={handleFormSubmit}
				/>
			</Modal>

		</div>
	);
}