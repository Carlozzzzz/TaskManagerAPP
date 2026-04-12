Workflow:

---------
Scenario 1 — Simple CRUD (most modules)

HTTP Request
     ↓
CompanyController        — receives HTTP, calls service, returns response
     ↓
ICompanyService          — business logic, DTO mapping
     ↓
IRepository<Company>     — stage the changes (Add, Update, Delete)
IUnitOfWork              — commit the changes (SaveAsync)
     ↓
AppDbContext             — sets CreatedAt, CreatedBy, UpdatedAt, DeletedAt automatically
     ↓
SQL Server
     ↓
HTTP Response
---------
Scenario 2 — Complex queries (joins, includes, projections)

HTTP Request
     ↓
ClientController         — receives HTTP, calls service, returns response
     ↓
IClientService           — business logic, DTO mapping
     ↓
IClientRepository        — extends IRepository<Client>
                           handles complex queries (.Include, .Select, .Where)
IUnitOfWork              — commit the changes (SaveAsync)
     ↓
AppDbContext             — sets audit fields automatically
     ↓
SQL Server
     ↓
HTTP Response
---------
Scenario 3 — Multi-entity transaction (Payroll, Transfers)
HTTP Request
     ↓
PayrollController        — receives HTTP, calls service, returns response
     ↓
IPayrollService
     ↓
IUnitOfWork.BeginTransactionAsync()   ← open transaction
     ↓
IRepository<Payroll>     — stage payroll changes
IRepository<Employee>    — stage employee changes
IRepository<Tax>         — stage tax changes
     ↓
IUnitOfWork.CommitAsync()             ← ONE commit — all or nothing
     ↓                 (if anything fails → RollbackAsync — nothing saved)
AppDbContext             — audit fields set automatically
     ↓
SQL Server
     ↓
HTTP Response
---------


The decision tree — use every time you add something new:

New operation needed?
         ↓
Is it business logic or a calculation?
         ↓ YES
Add to IXService only. Done.
         ↓ NO — it's a DB query
Does generic IRepository<T> handle it?
  (GetById, GetAll, Add, Update, Delete)
         ↓ YES
Use generic repo + map in service. Done.
         ↓ NO — needs JOIN, Include, projection
Create IXRepository : IRepository<X>
Add the specific query there. Done.
         ↓
Does the operation touch multiple entities
and must fully succeed or fully fail?
         ↓ YES
Use IUnitOfWork.BeginTransactionAsync()
    + CommitAsync / RollbackAsync
         ↓ NO
Use IUnitOfWork.SaveAsync() only. Done.



-------


Controller        → thin. HTTP in. Response out. Nothing else.
Service           → all business logic lives here. No EF Core.
IRepository<T>    → generic CRUD. Stage changes. Never commits.
IXRepository      → complex queries only. Created on demand, not upfront.
IUnitOfWork       → all saves and transactions. Only layer that commits.
AppDbContext      → audit fields only. Never called directly above Repository.
DTOs              → no logic. Shape of data in and out of the API.
Models/Entities   → no logic. Shape of data in the database.



-------
Repository + Unit of Work pattern on top of Clean Architecture.

Simple CRUD:

ClientController
      ↓  calls
IClientService
      ↓  calls                    ↓  calls
IRepository<Client>          IUnitOfWork
      ↓  stages changes           ↓  commits changes
      └──────────────────────────┘
                    ↓
              AppDbContext
      (sets audit fields automatically)
                    ↓
                Database


Complex queries:

ClientController
      ↓  calls
IClientService
      ↓  calls                    ↓  calls
IClientRepository            IUnitOfWork
(IS IRepository<Client>           ↓  commits changes
 + complex queries)
      ↓  stages changes           
      └──────────────────────────┘
                    ↓
              AppDbContext
      (sets audit fields automatically)
                    ↓
                Database



Multi-entity transaction (Payroll, Transfers):

PayrollController
      ↓  calls
IPayrollService
      ↓  calls                         ↓  calls
IRepository<Payroll>             IUnitOfWork
IRepository<Employee>                  ↓
IRepository<Tax>                 BeginTransactionAsync()
      ↓  all stage changes             ↓
      └───────────────────────────────┘
                    ↓
           CommitAsync() ✅ — all saved
        or RollbackAsync() ❌ — nothing saved
                    ↓
              AppDbContext
      (sets audit fields automatically)
                    ↓
                Database
-------

The most honest take:
There is no single "this is what senior devs do" answer. What IS consistent across all senior devs regardless of pattern choice is this:

✅ Controllers are thin — just HTTP in, response out
✅ Business logic lives in services — never in controllers
✅ DTOs separate API shape from DB shape
✅ Interfaces used for dependency injection
✅ Async/await throughout
✅ Soft delete handled at the infrastructure level
✅ Audit fields set automatically — never manually in services


-------