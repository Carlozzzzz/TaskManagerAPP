// MODIFIED: Integrating your Promise-based useConfirm
import React, { useState } from 'react';
import { useCompany } from '../../hooks/useCompany';

import { useConfirm } from '../../hooks/useConfirm';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import { Add, Edit, Delete, PictureAsPdf } from '@mui/icons-material';
import CompanyAddEditForm from '../../components/modules/Maintenance/Company/CompanyAddEditForm';
import { usePermissions } from '../../hooks/usePermissions';
import PageTitle from '../../components/ui/PageTitle';
import Breadcrumb from '../../components/ui/Breadcrumb';

export default function CompanyPage() {
	const { companies, selectedCompany, loading, setSelectedCompany, saveCompany, deleteCompany } = useCompany();
	const { askConfirm } = useConfirm();
	const { canAdd, canEdit, canDelete } = usePermissions('companies');

	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleOpenModal = (company = null) => {
		setSelectedCompany(company);
		setIsModalOpen(true);
	};

	const handleFormSubmit = async (formData) => {
		const isOk = await askConfirm({
			title: 'Update Company?',
			message: 'Are you sure you want to proceed?'
		});

		if (isOk) {
			const success = await saveCompany(formData, selectedCompany?.id);
			if (success) setIsModalOpen(false);
		}
	};

	const handleDeleteRequest = async (company) => {
		const confirmed = await askConfirm({
			title: 'Delete Company',
			message: `Are you sure you want to delete ${company.description}?`
		});

		if (confirmed) {
			await deleteCompany(company.id);
		}
	};

	const columns = [
		{ header: 'ID', accessor: 'id' },
		{ header: 'Name', accessor: 'description' },
		{
			header: 'Contract',
			accessor: 'isActive',
			render: (val) => val ? (
				<button className="flex items-center gap-1.5 font-bold text-blue-600 transition hover:text-blue-800">
					<PictureAsPdf sx={{ fontSize: 16 }} />
					<span className="text-[11px] uppercase tracking-tighter">View PDF</span>
				</button>
			) : <span className="text-xs font-bold text-slate-300">MISSING</span>
		},
		{
			header: 'Status',
			accessor: 'isActive',
			render: (val) => <Badge value={val ? "Active" : "Inactive"} type={val ? "success" : "error"} />
		}
	];

	const actions = [
		...(canEdit ? [{
			icon: <Edit sx={{ fontSize: 18 }} />,
			color: 'text-blue-600 hover:bg-blue-50',
			onClick: (row) => handleOpenModal(row)
		}] : []),
		...(canDelete ? [{
			icon: <Delete sx={{ fontSize: 18 }} />,
			color: 'text-red-500 hover:bg-red-50',
			onClick: (row) => handleDeleteRequest(row) // Calls the async handler
		}] : [])
	];
	return (
		<div className="space-y-3 rounded-lg bg-white">
			<Breadcrumb section="Maintenance" page="Company" />
			<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

				<PageTitle title="Companies" />

				{canAdd && (
					<Button
						name="New"
						icon={<Add sx={{ fontSize: 18 }} />}
						onClick={() => handleOpenModal()}
						className="bg-blue-600 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-blue-100"
					/>
				)}
			</div>

			<div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
				<DataTable
					columns={columns}
					data={companies}
					isLoading={loading}
					actions={actions}
				/>
			</div>

			<Modal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				title={selectedCompany ? "Edit Company" : "Add New Company"}
				footer={
					<>
						<Button variant="ghost" name="Cancel" onClick={() => setIsModalOpen(false)} />
						<Button
							type="submit"          // <--- MUST BE SUBMIT
							form="company-form"    // <--- MUST MATCH THE FORM ID
							variant="primary"
							name={selectedCompany ? "Update" : "Create"}
						/>
					</>
				}
			>
				<CompanyAddEditForm
					initialData={selectedCompany}
					onSubmit={handleFormSubmit}
				/>
			</Modal>
		</div>
	);
}