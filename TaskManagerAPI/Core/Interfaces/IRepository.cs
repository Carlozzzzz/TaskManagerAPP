// Core/Interfaces/IRepository.cs
using System.Linq.Expressions;

namespace TaskManagerAPI.Core.Interfaces
{
    /// <summary>
    /// Generic repository interface for data access abstraction.
    /// Enables testability and database independence.
    /// </summary>
    public interface IRepository<T> where T : class
    {
        Task<T?> GetByIdAsync(int id);
        Task<List<T>> GetAllAsync();
        Task<List<T>> GetAsync(Expression<Func<T, bool>> predicate);
        Task<T?> GetSingleAsync(Expression<Func<T, bool>> predicate);
        Task AddAsync(T entity);
        void Update(T entity);
        void Delete(T entity);
        Task<int> SaveChangesAsync();
    }
}
