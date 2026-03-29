AuditLogs
─────────────────────────────
id               INT PK
userId           INT FK → Users.id
action           NVARCHAR        -- CREATE, UPDATE, DELETE
moduleKey        NVARCHAR        -- which module e.g. "hasClient"
recordId         INT NULL        -- which record was affected
oldValue         NVARCHAR NULL   -- JSON of old data
newValue         NVARCHAR NULL   -- JSON of new data
ipAddress        NVARCHAR NULL
createdAt        DATETIME
```

---

## Permission resolution rule

When loading permissions for a user — check user-level first, fall back to role-level:
```
UserModulePermissions exists for this user+module?
     YES → use user-level permissions
     NO  → use RoleModulePermissions for their role
```

And your auto-enable rule:
```
canAdd OR canEdit OR canDelete is true?
     → canView is automatically true regardless of its stored value
```

---

## What to create / adjust — full checklist

---

### Database
```
□ Create Roles table
□ Create Modules table
□ Create RoleModulePermissions table
□ Create UserModulePermissions table (optional)
□ Create AuditLogs table
□ Seed Modules table with all entries from your moduleConfig
□ Seed Roles table with your initial roles (Admin, HR, DevMode etc.)
□ Seed RoleModulePermissions with default access per role
```

---

### Backend (C# / Swagger)
```
□ ModulesController   — GET /api/modules (admin only)
□ RolesController     — CRUD for roles
□ PermissionsController
    □ GET  /api/permissions/role/{roleId}     — get all permissions for a role
    □ PUT  /api/permissions/role/{roleId}     — update role permissions
    □ GET  /api/permissions/user/{userId}     — get user overrides
    □ PUT  /api/permissions/user/{userId}     — set user overrides

□ AuthController — update login response to include permissions
    □ On login, resolve permissions (user-level override → role fallback)
    □ Apply canView auto-enable rule before returning
    □ Return shape:
        {
          token,
          refreshToken,
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

□ ProtectedRoute middleware / authorization attribute on all endpoints
□ AuditLog service — logs every CUD operation automatically
□ Soft delete — add isDeleted filter to all GET queries
```

---

### Frontend (React)

#### New files to create
```
□ src/config/moduleConfig.js
    — sections, keys, paths, icons, default permissions (all false)

□ src/utils/permissions.js
    — resolvePermissions() applies canView auto-enable rule
    — getModulePermission(permissions, moduleKey) helper

□ src/components/shared/ProtectedRoute.jsx
    — checks canView, redirects to /403 if false
    — accepts moduleKey + requiredPermission props

□ src/pages/errors/NotFoundPage.jsx       (404)
□ src/pages/errors/ForbiddenPage.jsx      (403)

□ src/pages/admin/RolesPage.jsx
    — manage roles, assign module permissions per role

□ src/pages/admin/PermissionsPage.jsx
    — assign user-level permission overrides
```

#### Files to adjust
```
□ AuthContext.jsx
    — store permissions from login API response
    — expose permissions alongside user and role

□ App.jsx
    — wrap all protected routes in ProtectedRoute
    — add 403 and 404 catch routes at the bottom

□ Sidebar.jsx
    — loop moduleConfig grouped by section
    — filter by canView from context permissions
    — hide entire section if no modules in it are visible

□ Topbar.jsx
    — show current user name and role
    — logout button

□ Every page that has Add / Edit / Delete
    — read permissions from context
    — conditionally render action buttons based on flags
```

---

## The order to build this
```
1. Database — tables + seed data
2. Backend — update login response to return permissions
3. AuthContext — store and expose permissions
4. moduleConfig.js — define all your modules
5. ProtectedRoute — wire it up in App.jsx
6. 403 and 404 pages
7. Sidebar — make it dynamic
8. Page-level button guards (canAdd, canEdit, canDelete)
9. Admin pages — roles and permissions management UI
10. Audit logging — add last, after everything works