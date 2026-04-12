// Foundation/Repository.cs
// ─────────────────────────────────────────────────────────────────────────────
// WHAT THIS IS:
//   The single generic repository implementation for the entire project.
//   Wraps EF Core DbContext — this is the ONLY place in the codebase
//   that talks to DbContext directly (besides AppDbContext itself).
//
// IMPORTANT NOTES:
//   1. GetAllAsync() uses AsNoTracking() — read-only queries, better performance.
//      If you need to modify the result, use GetByIdAsync() instead which
//      DOES track the entity so EF can detect changes.
//
//   2. SaveAsync() calls _dbContext.SaveChangesAsync() which triggers your
//      AppDbContext.SaveChangesAsync() override — meaning CreatedAt, UpdatedAt,
//      DeletedAt, CreatedBy, UpdatedBy are all set automatically there.
//      Do NOT set those fields manually in services.
//
//   3. Delete() just calls _set.Remove(entity) — this is a HARD delete.
//      For soft delete, set entity.IsDeleted = true in the service,
//      then call SaveAsync(). Your AppDbContext global filter handles the rest.
//
// REGISTRATION (Program.cs):
//   builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
// ─────────────────────────────────────────────────────────────────────────────

using Microsoft.EntityFrameworkCore;
using TaskManagerAPI.Data;

namespace TaskManagerAPI.Foundation
{
	public class Repository<T> : IRepository<T> where T : class
	{
		protected readonly AppDbContext _dbContext;
		protected readonly DbSet<T> _set;

		public Repository(AppDbContext dbContext)
		{
			_dbContext = dbContext;
			_set = dbContext.Set<T>();
		}

		// ─── Queries ──────────────────────────────────────────────────────────

		// Use for PK lookups where you intend to modify the entity afterward.
		// EF tracks this entity — changes will be detected on SaveAsync().
		public async Task<T?> GetByIdAsync(int id)
				=> await _set.FindAsync(id);

		// Use for read-only list queries — AsNoTracking = faster, no change tracking.
		// If you need to project to a DTO, override in a specific repository
		// and use .Select() there for better performance.
		public async Task<List<T>> GetAllAsync()
				=> await _set.AsNoTracking().ToListAsync();

		// ─── Commands ─────────────────────────────────────────────────────────

		public async Task AddAsync(T entity)
				=> await _set.AddAsync(entity);

		// EF detects changes automatically for tracked entities.
		// Only needed if the entity was fetched with AsNoTracking().
		public void Update(T entity)
				=> _dbContext.Entry(entity).State = EntityState.Modified;

		// Hard delete — removes the row from the DB.
		// For soft delete: set IsDeleted = true in the service, then SaveAsync().
		public void Delete(T entity)
				=> _set.Remove(entity);

        // ─── Persistence ──────────────────────────────────────────────────────

        // This triggers AppDbContext.SaveChangesAsync() which runs your
        // audit property logic (CreatedAt, UpdatedAt, DeletedAt, etc.)
        // SaveAsync() intentionally removed — IUnitOfWork owns this.
    }
}