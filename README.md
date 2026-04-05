# React + Vite __ C# + Swagger

C:\Users\Carlos\.claude\projects\d--github-personal-Practice-TaskManagerAPP\memory



### 📂 TaskManagerAPP — Master Reference Architecture
**Tech Stack:** Vite React + C# .NET Core + SQL Server (Single-Tenant / Distributed)

#### 🛡️ 1. Core & Security (The Foundation)
*   **JWT Authentication:** Secure login with refresh token logic.
*   **RBAC (Role-Based Access Control):** Granular permission management for users.
*   **Multitenancy (Single-Tenant):** Architecture designed for isolated databases per client server.
*   **Global Audit Trail:** Automatic tracking of `CreatedBy`, `ModifiedBy`, and data changes (Old vs. New values).
*   **Standardized API Wrapper:** Uniform JSON response structure for all endpoints.
*   **Global Exception Middleware:** Centralized error handling and logging.

#### 📊 2. Data & Business Logic (The ERP Layer)
*   **Feature Flagging:** Toggle modules (HR, Inventory, LMS) via client-specific configurations.
*   **Workflow & Status Engine:** Reusable logic for approvals, "Pending/Approved/Rejected" states.
*   **Soft Deletes:** `IsDeleted` implementation across all entities to prevent data loss.
*   **Excel Power Tools:** Robust Import (with column mapping) and Export (ClosedXML/EPPlus).
*   **Background Jobs (Hangfire):** Offload heavy processing (reporting, emails) to background threads.
*   **Caching Strategy:** Server-side (MemoryCache/Redis) + Client-side (TanStack Query).

#### 📁 3. Storage & Media
*   **Configurable Storage Provider:** Switch between Local File System and Cloud (Azure/AWS) via `appsettings.json`.
*   **Integrated Viewers:** High-performance components for PDF viewing and Image galleries.
*   **Secure File Access:** Token-protected routes for sensitive document downloads.

#### 🎨 4. Frontend & UX (Vite + React)
*   **Centralized UI Library:** Atomic design components (Buttons, Tables, Forms, Search, Modals).
*   **Theme Engine:** Light/Dark mode and client-branded color palettes.
*   **Multi-Platform Ready:** Prepared for Capacitor (Mobile) and Electron (Desktop) wrappers.
*   **Internationalization (i18n):** Multi-language support ready for global deployment.
*   **Real-time UI:** SignalR integration for instant notifications and task updates.

#### 🛠️ 5. Infrastructure & DevOps
*   **Database Backup/Restore:** Integrated SQL backup routines triggered from the Admin UI.
*   **Auto-Migrations:** EF Core Migrations that run on startup for seamless client updates.
*   **System Health Dashboard:** Real-time monitoring of DB connection, Disk space, and API status.
*   **Environment Agnostic:** Fully driven by Environment Variables for "Deploy Anywhere" capability.

---

### ⚠️ Architecture Warning (For Future Reference)
*   **Single-Tenant Focus:** Since each client has their own server, ensure the `ConnectionString` is never hardcoded and is always injected via environment variables.
*   **Code Sharing:** When branching this for HRMS or Inventory, keep the **Core** folder (Auth, Logging, Storage) identical across all versions to ensure patches can be applied to all products simultaneously.

---

### 📝 Next Steps for your Prompt:
When you start coding, you can tell the AI: 
> *"Using the **TaskManagerAPP Master Reference** structure, build the **[Feature Name]** focusing on the **[Core/Data/UI]** layer."*

**Which of these features would you like to define the folder structure for first?** (I recommend starting with **Core & Security** as it powers everything else).