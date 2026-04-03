# The Golden rule for any feature
```jsx
Database → Backend → Frontend
```

## Sample Phase -- Role Module

### Phase 1 — Database
```jsx
□ 1. Create Roles table
      — id, name, description, isActive

□ 2. Create Modules table
      — id, key, name, section, path, icon, isActive, sortOrder

□ 3. Create RoleModulePermissions table
      — roleId FK, moduleId FK, canView, canAdd, canEdit, canDelete
      — UNIQUE constraint on (roleId, moduleId)

□ 4. Seed Roles
      — Admin, HR, Finance, DevMode (whatever your app needs)

□ 5. Seed Modules
      — mirror every entry from your moduleConfig.js
      — key must match exactly what the frontend config uses

□ 6. Seed RoleModulePermissions
      — define default access per role per module
      — Admin gets everything true
      — Others get only what they need
```

### Phase 2 — Backend (C# / Swagger)
```jsx
□ 1. Models / Entities
      — Role, Module, RoleModulePermission models
      — matching your DB tables exactly

□ 2. Repositories / Services
      — GetPermissionsByRoleId(roleId)
      — resolves canView auto-enable rule here
        (if canAdd/canEdit/canDelete → force canView true)

□ 3. Update Login endpoint
      — after token is generated, fetch permissions for user's role
      — apply resolution rule
      — return permissions array alongside token + user info

      Response shape:
      {
        token: "...",
        user: { id, name, email, role },
        permissions: [
          {
            key: "hasClient",
            canView: true,
            canAdd: true,
            canEdit: false,
            canDelete: false
          },
          ...
        ]
      }

□ 4. PermissionsController
      — GET  /api/permissions/roles          (list all roles)
      — GET  /api/permissions/role/{roleId}  (get permissions for a role)
      — PUT  /api/permissions/role/{roleId}  (update permissions for a role)

□ 5. ModulesController
      — GET /api/modules  (list all modules — admin only)

□ 6. Authorization attribute on all endpoints
      — every endpoint checks the matching permission flag
      — not just frontend — backend enforces it too
```

### Phase 3 — Frontend (React)
```jsx
□ 1. moduleConfig.js
      — define all modules with key, name, section, path, icon
      — permissions all default to false
      — this is just the blueprint/shape

□ 2. utils/permissions.js
      — resolvePermissions() — canView auto-enable rule
      — getModulePermission(permissions, moduleKey) — helper

□ 3. Update AuthContext
      — store permissions from login API response
      — expose permissions alongside user + role

□ 4. Update authService / login call
      — make sure it saves permissions to context on success

□ 5. ProtectedRoute component
      — accepts moduleKey + requiredPermission props
      — checks canView, redirects to /403 if false

□ 6. 403 and 404 pages
      — simple, clean error pages
      — 403 shows "You don't have access to this page"
      — 404 shows "This page doesn't exist"

□ 7. Update App.jsx
      — wrap all routes with ProtectedRoute
      — add /403 and * catch routes at the bottom

□ 8. Update Sidebar
      — loop moduleConfig grouped by section
      — filter each module by canView from context
      — hide entire section if no modules visible in it

□ 9. Update Topbar
      — show current user name + role

□ 10. Page-level button guards
       — read permissions from context per page
       — hide Add button if canAdd is false
       — hide Edit button if canEdit is false
       — hide Delete button if canDelete is false
       — build a usePermission(moduleKey) hook for this
```

### Phase 4 — Admin UI (manage roles and permissions)
```jsx
□ 1. RolesPage
      — list all roles
      — create / edit / deactivate roles

□ 2. PermissionsPage
      — select a role
      — shows a table of all modules
      — toggle canView / canAdd / canEdit / canDelete per module
      — save calls PUT /api/permissions/role/{roleId}
```

### Phase 5 — Extend with UserModulePermissions (later)

```jsx
□ Add UserModulePermissions table to DB
□ Add override resolution to backend permission service
      — check user-level first, fall back to role-level
□ Add UserPermissionsPage to admin UI
      — select a user, override specific modules
□ Nothing changes on the frontend permission reading side
      — it already reads from context, context already gets from API
      
- Deliverable: Specific users can have exceptions without changing their role.
```

## The full order visualized

```jsx
Phase 1 — DB         Tables → Seed data
              ↓
Phase 2 — Backend    Models → Services → Login → Controllers
              ↓
         TEST IN SWAGGER before moving on
              ↓
Phase 3 — Frontend   Config → Context → ProtectedRoute → Sidebar → Pages
              ↓
Phase 4 — Admin UI   Roles page → Permissions management page
              ↓
Phase 5 — Later      UserModulePermissions extension
```

## Rule fo every future feature
1. Design the DB shape first
2. Build and test the API in Swagger
3. Only then touch the frontend
4. Admin UI always comes last