// NEW: Granular Permission Logic
import { useMemo } from 'react';
import { useAuth } from './useAuth'; // Assuming you have an Auth provider

export const usePermissions = (moduleKey) => {
	const { user } = useAuth();

	// Find permissions for the specific module from the user's permission list
	const permissions = useMemo(() => {
		const modulePerms = user?.permissions?.find(p => p.moduleKey === moduleKey);

		if (!modulePerms) {
			return { canView: false, canAdd: false, canEdit: false, canDelete: false };
		}

		// ERP Logic Rule: If any write permission is true, canView must be true
		const hasAnyWritePermission = modulePerms.canAdd || modulePerms.canEdit || modulePerms.canDelete;

		return {
			canView: modulePerms.canView || hasAnyWritePermission,
			canAdd: !!modulePerms.canAdd,
			canEdit: !!modulePerms.canEdit,
			canDelete: !!modulePerms.canDelete,
		};

		// return {
		// 	canView: true,
		// 	canAdd: true,
		// 	canEdit: true,
		// 	canDelete: true,
		// 	isDevelopmentBypass: true // Useful for debugging
		// };
	}, [user, moduleKey]);

	return permissions;
};