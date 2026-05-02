// MODIFIED: Integrating your Promise-based useConfirm
import React, { useState } from 'react';
import { useEmployee } from '../../hooks/useEmployee';

import { useConfirm } from '../../hooks/useConfirm';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import { Add, Edit, Delete, PictureAsPdf } from '@mui/icons-material';
import EmployeeAddEditForm from '../../components/modules/Personnel/Employee/EmployeeAddEditForm';
import { usePermissions } from '../../hooks/usePermissions';
import PageTitle from '../../components/ui/PageTitle';
import Breadcrumb from '../../components/ui/Breadcrumb';

export default function EmployeePage() {
	const { employees, selectedEmployee, loading, saveEmployee, deleteEmployee, fetchEmployeeById, clearEmployeeSelection } = useEmployee();
	const { askConfirm } = useConfirm();
	const { canAdd, canEdit, canDelete } = usePermissions('EMPLOYEE');

	const [isModalOpen, setIsEmployeeModalOpen] = useState(false);

	const handleOpenEmployeeModal = (employee = null) => {

		if (employee?.id) {
			fetchEmployeeById(employee.id);
			console.log("Fetch by employee ID:", employee.id);
		} else {
			clearEmployeeSelection();
		}
		setIsEmployeeModalOpen(true);
	};

	const handleCloseEmployeeModal = () => {
		setIsEmployeeModalOpen(false);
		setTimeout(() => clearEmployeeSelection(), 300);
	};

	const handleFormSubmit = async (formData) => {
		const isOk = await askConfirm({
			title: 'Update Employee?',
			message: 'Are you sure you want to proceed?'
		});

		if (isOk) {
			const success = await saveEmployee(formData, selectedEmployee?.id);
			if (success) handleCloseEmployeeModal();
		}
	};

	const handleDeleteRequest = async (employee) => {
		const confirmed = await askConfirm({
			title: 'Delete Employee',
			message: `Are you sure you want to delete ${employee.description}?`
		});

		if (confirmed) {
			await deleteEmployee(employee.id);
		}
	};

	const columns = [
		{ header: 'ID', accessor: 'id' },
		{ header: 'Name', accessor: 'name' },
	];

	const actions = [
		...(canEdit ? [{
			icon: <Edit sx={{ fontSize: 18 }} />,
			color: 'text-blue-600 hover:bg-blue-50',
			onClick: (row) => handleOpenEmployeeModal(row)
		}] : []),
		...(canDelete ? [{
			icon: <Delete sx={{ fontSize: 18 }} />,
			color: 'text-red-500 hover:bg-red-50',
			onClick: (row) => handleDeleteRequest(row) // Calls the async handler
		}] : [])
	];

	return (
		<div className="space-y-3 rounded-lg bg-white">
			<Breadcrumb section="Maintenance" page="Employee" />
			<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

				<PageTitle title="Employees" />

				{canAdd && (
					<Button
						name="New"
						icon={<Add sx={{ fontSize: 18 }} />}
						onClick={() => handleOpenEmployeeModal()}
						className="bg-blue-600 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-blue-100"
					/>
				)}
			</div>

			<div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
				<DataTable
					columns={columns}
					data={employees || []}
					isLoading={loading}
					actions={actions}
				/>
			</div>

			<Modal
				isOpen={isModalOpen}
				onClose={handleCloseEmployeeModal}
				title={selectedEmployee ? "Edit Employee" : "Add New Employee"}
				footer={
					<>
						<Button variant="ghost" name="Cancel" onClick={handleCloseEmployeeModal} />
						<Button
							type="submit"          // <--- MUST BE SUBMIT
							form="employee-form"    // <--- MUST MATCH THE FORM ID
							variant="primary"
							name={selectedEmployee ? "Update" : "Create"}
						/>
					</>
				}
			>
				<EmployeeAddEditForm
					initialData={selectedEmployee}
					onSubmit={handleFormSubmit}
				/>
			</Modal>
		</div>
	);
}