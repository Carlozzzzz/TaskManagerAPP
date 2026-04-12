--- FILE: ARCHITECTURE.md ---
# 🏛 Architectural Design & Workflow

This project uses the **Repository + Unit of Work (UoW)** pattern to manage data persistence and business logic.

## 🔄 Core Data Flow

Regardless of the module, the flow follows this hierarchy:
`HTTP Request` → `Controller` → `Service` → `Repository` → `Unit of Work` → `DbContext` → `SQL Server`

### 1. Simple CRUD (Standard)
For most modules (e.g., Company), we use the **Generic Repository**.
- **Service** stages changes via `IRepository<T>`.
- **UnitOfWork** commits changes via `SaveAsync()`.

### 2. Complex Queries (Joins/Projections)
When a query requires `.Include()`, `.Select()` projections, or complex filters:
- We extend `IRepository<T>` into a specific `IXRepository`.
- The query logic is hidden inside the implementation to keep the Service clean.

### 3. Multi-Entity Transactions
For operations like **Payroll** or **Transfers** where multiple tables must update together:
- Use `IUnitOfWork.BeginTransactionAsync()`.
- If all repositories succeed → `CommitAsync()`.
- If any fail → `RollbackAsync()`.

---

## 🚦 The Decision Tree
Use this every time you add a new feature:

1. **Is it business logic or a calculation?**
   - ✅ Add to `IXService`. Done.
2. **Is it a simple DB query (GetById, GetAll, Add)?**
   - ✅ Use generic `IRepository<T>` + Map in service. Done.
3. **Does it need JOINs, Includes, or specific SQL filters?**
   - ✅ Create `IXRepository : IRepository<X>` and add the query there.
4. **Does it touch multiple entities that must "all-or-nothing" succeed?**
   - ✅ Use `IUnitOfWork` Transaction methods.

---

## ⚖️ Layer Responsibilities

| Layer | Responsibility | Constraints |
| :--- | :--- | :--- |
| **Controller** | Thin. HTTP In / Response Out. | No logic. No DB calls. |
| **Service** | The "Brain". Business logic & DTO mapping. | No EF Core references. |
| **IRepository** | Data Staging. | Never calls `SaveChanges`. |
| **IUnitOfWork** | The "Commit Point". | Only layer that saves to DB. |
| **AppDbContext** | Infrastructure. | Handles Audit Fields (CreatedAt, etc.) automatically. |
| **DTOs** | API Shape. | Plain objects. No logic. |

---

## 💎 Senior Engineering Principles Applied

- **Thin Controllers:** Logic belongs in services so it can be tested and reused.
- **Audit Automation:** `CreatedAt`, `UpdatedAt`, and `DeletedAt` are handled by `AppDbContext` overrides. Never set these manually in a Service.
- **Soft Delete:** We never delete rows. We set `IsDeleted = true`. A Global Query Filter in the DbContext ensures deleted rows never show up in queries.
- **Async/Await:** Used from the Controller down to the Database to prevent thread-blocking.
- **Dependency Injection:** We use `Scoped` lifetimes for Repositories, Services, and UnitOfWork to ensure data consistency within a single web request.

---

## 📝 Registration Pattern (Program.cs)
When adding a new module:
1. **Generic Only:** Just register the Service.
2. **Complex:** Register both the specific Repository and the Service.