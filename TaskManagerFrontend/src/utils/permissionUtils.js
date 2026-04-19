// src/utils/permissionUtils.js
import { modulePermissions } from '../constants/modulePermissions';

/**
 * Merges static module config with user-specific permissions from the backend.
 * @param {Array} userPermissions - The list of permissions from the logged-in user (e.g., user.rolePermissions)
 * @returns {Object} A filtered version of modulePermissions containing only what the user can see.
 */
export const getAccessibleSidebar = (userPermissions = []) => {
	// 1. Deep clone the static config to avoid mutating the original
	const sidebarConfig = JSON.parse(JSON.stringify(modulePermissions));
	const accessibleSidebar = {};

	Object.entries(sidebarConfig).forEach(([category, config]) => {
		// 2. Filter items in this category based on backend 'canView' permission
		const filteredItems = config.items.filter(item => {
			// Find the matching permission from the backend by ModuleKey
			const perm = userPermissions.find(p => p.moduleKey === item.moduleKey);

			// Logic: If permission exists and canView is true, show it. 
			// Default to false if not found (Secure by default)
			return perm ? perm.canView : false;
		});

		// 3. Only add the category to the sidebar if it has at least one visible item
		if (filteredItems.length > 0) {
			accessibleSidebar[category] = {
				...config,
				items: filteredItems
			};
		}
	});

	return accessibleSidebar;
};