// Foundation/IRepository.cs
// ─────────────────────────────────────────────────────────────────────────────
// WHAT THIS IS:
//   The single generic repository interface for the entire project.
//   Every entity (Company, Department, Employee, etc.) uses this same
//   interface — you never write ICompanyRepository, IDepartmentRepository, etc.
//   unless that entity needs queries beyond basic CRUD.
//
// HOW TO USE:
//   Inject IRepository<YourEntity> into any service that needs data access.
//   Register it once in Program.cs — works for all entities automatically.
//
// WHEN TO EXTEND:
//   Only create ICompanyRepository : IRepository<Company> when you need
//   a query that doesn't fit here (e.g. GetActiveByClientAsync).
//   Don't create entity-specific repos just for basic CRUD — this handles it.
// RULE:
//   IRepository<T>  →  stage changes  (Add, Update, Delete)
//   IUnitOfWork     →  commit changes (SaveAsync, transactions)
//   They never swap jobs.
//
// REGISTRATION (Program.cs):
//   builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
// ─────────────────────────────────────────────────────────────────────────────

namespace TaskManagerAPI.Foundation
{
	public interface IRepository<T> where T : class
	{
		// ─── Queries ──────────────────────────────────────────────────────────
		Task<T?> GetByIdAsync(int id);
		Task<List<T>> GetAllAsync();

		// ─── Commands ─────────────────────────────────────────────────────────
		Task AddAsync(T entity);
		void Update(T entity);
		void Delete(T entity);
	}
}