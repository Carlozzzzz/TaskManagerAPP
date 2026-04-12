File Structure:

TaskManagerAPI/
│
├── Foundation/                          ← copy to every future project, never changes
│   ├── IRepository.cs                   ← generic interface (no SaveAsync — UoW owns that)
│   ├── Repository.cs                    ← generic implementation
│   ├── IUnitOfWork.cs                   ← transaction + save contract
│   └── UnitOfWork.cs                    ← transaction + save implementation
│
├── Controllers/
│   ├── BaseController.cs                ← shared controller base
│   └── CompanyController.cs             ← thin — HTTP in, response out, nothing else
│
├── Models/
│   ├── Base/
│   │   ├── BaseEntity.cs                ← Id, CreatedAt, CreatedBy, UpdatedAt, UpdatedBy
│   │   └── BaseSoftDeleteEntity.cs      ← extends BaseEntity + IsDeleted, DeletedAt, DeletedBy
│   ├── Interfaces/
│   │   └── ISoftDelete.cs               ← IsDeleted, DeletedAt, DeletedBy
│   └── Company.cs                       ← extends BaseSoftDeleteEntity
│
├── DTOs/
│   └── CompanyDto.cs                    ← CompanyDto, CreateCompanyDto, UpdateCompanyDto
│
├── Services/
│   ├── ICompanyService.cs               ← business logic contract
│   └── CompanyService.cs                ← injects IRepository<Company> + IUnitOfWork
│
├── Data/
│   └── AppDbContext.cs                  ← sets audit fields automatically on SaveChangesAsync
│
├── Migrations/
│
├── Program.cs
├── appsettings.json
└── appsettings.Development.json



When a module needs complex queries — extend only that module:

TaskManagerAPI/
│
├── Foundation/                          ← untouched
│   ├── IRepository.cs
│   ├── Repository.cs
│   ├── IUnitOfWork.cs
│   └── UnitOfWork.cs
│
├── Repositories/                        ← only created when generic repo is not enough
│   ├── IClientRepository.cs             ← extends IRepository<Client> + complex queries
│   └── ClientRepository.cs             ← extends Repository<Client> + implements complex queries
│
├── Services/
│   ├── IClientService.cs
│   └── ClientService.cs                 ← injects IClientRepository + IUnitOfWork



Adding a new module — exact files needed every time:

Controllers/
└── EmployeeController.cs                ← same shape as CompanyController

Models/
└── Employee.cs                          ← extend BaseSoftDeleteEntity or BaseEntity

DTOs/
└── EmployeeDto.cs                       ← EmployeeDto, CreateEmployeeDto, UpdateEmployeeDto

Services/
├── IEmployeeService.cs                  ← contract
└── EmployeeService.cs                   ← inject IRepository<Employee> + IUnitOfWork

Program.cs                               ← add 1 line per module
└── builder.Services.AddScoped<IEmployeeService, EmployeeService>();



Program.cs registrations — full picture:

// ─── Foundation — register ONCE, covers all entities ──────────────────────
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// ─── Modules — one line per service ───────────────────────────────────────
builder.Services.AddScoped<ICompanyService,    CompanyService>();
builder.Services.AddScoped<IEmployeeService,   EmployeeService>();
builder.Services.AddScoped<IDepartmentService, DepartmentService>();
builder.Services.AddScoped<IPayrollService,    PayrollService>();

// ─── Only add specific repos when complex queries are needed ───────────────
builder.Services.AddScoped<IClientRepository,  ClientRepository>();