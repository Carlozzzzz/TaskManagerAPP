### 📂 File Structure: Role & Permission Feature

This follows your **Repository + Unit of Work** pattern. New files are marked with `[NEW]`.

```text
Project Root
│
├── 📁 Controllers
│   └── 📄 RolesController.cs            [NEW]  <- HTTP Endpoints
│
├── 📁 Services
│   ├── 📄 IRoleService.cs               [NEW]  <- Business Interface
│   ├── 📄 RoleService.cs                [NEW]  <- Logic & Transactions
│   └── 📄 AuthService.cs                [MOD]  <- Flattens permissions for JWT
│
├── 📁 Repositories
│   ├── 📄 IRoleRepository.cs            [NEW]  <- Custom Query Interface
│   └── 📄 RoleRepository.cs             [NEW]  <- EF Core Joins (.Include)
│
├── 📁 DTOs
│   └── 📄 RoleDtos.cs                   [NEW]  <- Request/Response Shapes
│
├── 📁 Models
│   ├── 📄 PermissionEntities.cs         [MOD]  <- Role, Module, RoleModulePermission
│   └── 📄 User.cs                       [MOD]  <- Linked to UserRoles
│
├── 📁 Foundation (The Engine)
│   ├── 📄 IRepository.cs / Repository.cs       <- Generic CRUD
│   └── 📄 IUnitOfWork.cs / UnitOfWork.cs       <- Transaction management
│
└── 📁 Data
    └── 📄 AppDbContext.cs               [MOD]  <- Audit logic & Model config
```

---

### 🔄 The Workflow: Creating a Role with Permissions

Here is the "Senior Engineer" breakdown of what happens when you hit **POST** `/api/roles`.

#### Step 1: The Request (Controller)
The `RolesController` receives a `CreateRoleDto`.
*   **Action:** Validates the model and passes it to the `RoleService`.
*   **Why:** We keep the controller "thin"—it doesn't know how to save data; it only knows how to route requests.

#### Step 2: The Transaction (Service + UoW)
The `RoleService` calls `_unitOfWork.BeginTransactionAsync()`.
*   **Why:** Creating a role is a "Multi-step" process. If we save the Role name but the Permissions fail, we would have a "Broken" role in the DB. The transaction ensures it's **all or nothing**.

#### Step 3: Staging the Role (Repository)
We map the Name to a `Role` entity and call `_roleRepo.AddAsync(role)`.
*   **Crucial Step:** We then call `_unitOfWork.SaveAsync()`.
*   **Why:** We need SQL Server to generate the `Id` for the Role so we can link the permissions to it in the next step.

#### Step 4: Staging Permissions
We loop through the permissions in the DTO, create `RoleModulePermission` entities, and attach the new `RoleId` to them.
*   **Action:** `role.Permissions.Add(...)`.

#### Step 5: The Commit (Unit of Work)
We call `_unitOfWork.CommitAsync()`.
*   **What happens under the hood:**
    1.  `AppDbContext` triggers `SaveChangesAsync`.
    2.  The **Audit Engine** kicks in, setting `CreatedAt` and `CreatedBy`.
    3.  The **AuditLog** records the creation.
    4.  The Database transaction is finalized.

---

### 🎓 Learning Moment: Why "Flatten" Permissions?

In your `AuthService`, we used a **"Permission Flattener"**.

**The Scenario:**
*   User has **Role A (Manager)**: `CanEditCompanies = true`
*   User has **Role B (Support)**: `CanEditCompanies = false`

**The Concept (Additive Permissions):**
In professional systems, permissions are usually **additive**. If any assigned role grants a permission, the user has it.

**The Code Logic:**
```csharp
.GroupBy(p => p.Module.Key)
.Select(g => new PermissionDto {
    CanEdit = g.Any(x => x.CanEdit) // If ANY role says true, it is true.
})
```
This protects you from "Permission Conflicts." Instead of failing, the system finds the highest level of access the user is entitled to.
