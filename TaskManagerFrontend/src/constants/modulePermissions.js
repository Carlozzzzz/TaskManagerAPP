// src\constants\modulePermissions.js
// MODIFIED: Access types now match .NET Backend property names exactly
export const accessType = [
	{ key: "canAdd", name: "Create", value: false },
	{ key: "canEdit", name: "Change", value: false },
	{ key: "canDelete", name: "Delete", value: false },
	{ key: "canView", name: "View", value: false },
];

const modulePermissionsRaw = {
	Home: {
		icon: 'home',
		isStandalone: true,
		items: [{ name: 'Home', to: '/dashboard', moduleKey: 'HOME', hasAccess: true }] // REPLACED: key/value with moduleKey
	},
	Maintenance: {
		icon: 'maintenance',
		items: [
			{ name: 'Company', to: '/company', moduleKey: 'COMPANY', hasAccess: true },
			{ name: 'Client', to: '/client', moduleKey: 'CLIENT', hasAccess: true },
			{ name: 'Department', to: '/department', moduleKey: 'DEPARTMENT', hasAccess: false },
			{ name: 'Position', to: '/position', moduleKey: 'POSITION', hasAccess: false },
		]
	},
	DevMode: {
		icon: 'dev',
		items: [
			{ name: 'Client Identity', to: '/clientIdentity', moduleKey: 'IDENTITY', hasAccess: true },
			{ name: 'Night Diff', to: '/nightDiff', moduleKey: 'NIGHTDIFF', hasAccess: false },
		]
	},
	MyTasks: {
		icon: 'tasks',
		items: [{ name: 'Task List', to: '/tasks', moduleKey: 'TASKS', hasAccess: true }]
	},
	Users: {
		icon: 'users',
		isStandalone: true,
		items: [{ name: 'Manage Users', to: '/users', moduleKey: 'USER', hasAccess: true }]
	},
	Admin: {
		icon: 'admin',
		isStandalone: true,
		items: [{ name: 'Admin Panel', to: '/admin', moduleKey: 'ADMIN', hasAccess: true }]
	},
};

// Logic to build the final object with default permissions attached
export const modulePermissions = Object.entries(modulePermissionsRaw).reduce(
	(acc, [category, config]) => {
		acc[category] = {
			...config,
			items: config.items.map(item => ({
				...item,
				// MODIFIED: Automatically attach the standard permission set to every item
				accessType: accessType.map(type => ({ ...type }))
			}))
		};
		return acc;
	},
	{}
);

/**
 * HELPER: Use this when you fetch a Role from .NET
 * It merges the backend permissions into your frontend config structure.
 */
export const mergeBackendPermissions = (backendPermissions) => {
	// Logic: Iterate through modulePermissions and update 'value' based on backend response
	// where item.moduleKey === backendPermission.moduleKey
};