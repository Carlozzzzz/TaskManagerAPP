# ERP Base System

A reusable, configurable ERP foundation built with React + C# (.NET) + SQL Server.
Designed to be the starting point for future ERP projects.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TailwindCSS, React Router |
| Backend | C# .NET, Swagger |
| Database | SQL Server |
| Auth | JWT + Refresh Token |

---

## Current Features

### Infrastructure
- JWT Authentication with Refresh Token
- Global Toast Notification System
- Global Confirmation Modal
- Global Loading Overlay
- Persistent Sidebar + Topbar Layout

### Access Control
- Role-based authentication (Admin / User)
- Protected routes per role

### Modules
- Task Management (CRUD) — used as base module reference

---

## Roadmap

### 🔧 Frontend

#### 1. Reusable Data Table
- Column sorting
- Search and filter
- Pagination (client-side first, server-side ready)
- Loading and empty states
- Per-row action buttons (view, edit, delete)
- Plug-and-play — any module just passes columns + data

#### 2. Configurable Module System
- Single config file defines all modules
- Each module declares:
  - Module name and ID
  - API endpoint / database access key
  - Sidebar section it belongs to (e.g. HR, Finance, Inventory)
  - Icon and route path
- Sidebar and routing are auto-generated from this config
- Adding a new module = adding one entry to the config file

#### 3. Granular Permission System
- Permissions are per role per module — not just admin/user
- Each module supports four permission flags:
  - `canView` — read-only access
  - `canAdd` — create new records
  - `canEdit` — modify existing records
  - `canDelete` — remove records
- Rule: if any of `canAdd`, `canEdit`, or `canDelete` is enabled, `canView` is automatically enabled
- UI adapts per permission:
  - Add button hidden if `canAdd` is false
  - Edit button hidden if `canEdit` is false
  - Delete button hidden if `canDelete` is false
  - Entire page redirects or shows read-only if `canView` is false
- Permissions are stored in the database and loaded on login
- Example role setup:
  - HR role on Employee page → `canView`, `canAdd`, `canEdit` only
  - HR role on Payroll page → `canView` only
  - Admin → all permissions on all modules

#### 4. Improved Sidebar
- Auto-generated from module config
- Grouped by section (e.g. HR, Finance, Inventory)
- Collapsible sections
- Active route highlighting
- Hides modules the current user has no access to

#### 5. Improved Topbar
- Current user display (name + role)
- Notification center
- Quick profile / logout menu

#### 6. Standardized Form Validation Pattern
- Reusable validation hook
- Field-level inline errors
- Clears error on user correction
- Same pattern used across all module forms

#### 7. Role-based Route Guards
- Routes protected by both role and module permission
- Unauthorized access redirects to a proper 403 page
- Not just admin/user — checks granular permission flags

---

### ⚙️ Backend (C# / .NET)

#### 1. Refresh Token
- JWT access token (short-lived)
- Refresh token (long-lived, stored in DB)
- Auto-refresh on expiry — user stays logged in

#### 2. Soft Delete
- No hard deletes on any ERP data
- All records have `isDeleted` flag and `deletedAt` timestamp
- Queries filter out soft-deleted records by default

#### 3. Audit Trail
- Every create, update, and delete is logged
- Logs: who did it, what changed, old value, new value, timestamp
- Viewable per record and per user in the admin panel

#### 4. Role & Permission API
- Permissions stored in DB per role per module
- Loaded and returned on login as part of the auth response
- Frontend reads this to build the sidebar and control UI elements

---

## Module Config Structure (reference)
```js
// src/config/modules.js

export const modules = [
  {
    id: 'employees',
    name: 'Employees',
    section: 'HR',
    icon: 'Users',
    path: '/hr/employees',
    apiEndpoint: '/api/employees',
  },
  {
    id: 'payroll',
    name: 'Payroll',
    section: 'HR',
    icon: 'Banknote',
    path: '/hr/payroll',
    apiEndpoint: '/api/payroll',
  },
  {
    id: 'inventory',
    name: 'Inventory',
    section: 'Warehouse',
    icon: 'Package',
    path: '/warehouse/inventory',
    apiEndpoint: '/api/inventory',
  },
];
```

---

## Permission Structure (reference)
```js
// Shape returned from the API on login

permissions: [
  {
    moduleId: 'employees',
    canView: true,
    canAdd: true,
    canEdit: true,
    canDelete: false,
  },
  {
    moduleId: 'payroll',
    canView: true,
    canAdd: false,
    canEdit: false,
    canDelete: false,
  },
]
```

---

## Project Rules

- Pages are thin — they compose components, never fetch directly
- Components are dumb — they receive props, never own page state
- All API calls go through services
- All shared types defined in `types/`
- Config that changes per environment lives in `config/` not `constants/`
- No hard deletes — ever
- All destructive actions require a confirmation modal
- Permissions are always checked on both frontend and backend