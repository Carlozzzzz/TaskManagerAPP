// Infrastructure/Data/Repositories/BaseRepository.cs
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using TaskManagerAPI.Core.Interfaces;
using TaskManagerAPI.Data;

namespace TaskManagerAPI.Infrastructure.Data.Repositories
{
    /// <summary>
    /// Generic repository base class that implements common CRUD operations.
    /// Provides abstraction over DbContext for better testability.
    /// </summary>
    public class BaseRepository<T> : IRepository<T> where T : class
    {
        protected readonly AppDbContext _context;

        public BaseRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<T?> GetByIdAsync(int id)
        {
            return await _context.Set<T>().FindAsync(id);
        }

        public async Task<List<T>> GetAllAsync()
        {
            return await _context.Set<T>().AsNoTracking().ToListAsync();
        }

        public async Task<List<T>> GetAsync(Expression<Func<T, bool>> predicate)
        {
            return await _context.Set<T>()
                .AsNoTracking()
                .Where(predicate)
                .ToListAsync();
        }

        public async Task<T?> GetSingleAsync(Expression<Func<T, bool>> predicate)
        {
            return await _context.Set<T>()
                .AsNoTracking()
                .FirstOrDefaultAsync(predicate);
        }

        public async Task AddAsync(T entity)
        {
            await _context.Set<T>().AddAsync(entity);
        }

        public void Update(T entity)
        {
            _context.Set<T>().Update(entity);
        }

        public void Delete(T entity)
        {
            _context.Set<T>().Remove(entity);
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }
    }
}
