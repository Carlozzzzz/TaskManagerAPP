// Infrastructure/Data/Repositories/TaskRepository.cs
using Microsoft.EntityFrameworkCore;
using TaskManagerAPI.Core.Interfaces;
using TaskManagerAPI.Data;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Infrastructure.Data.Repositories
{
    /// <summary>
    /// Task-specific repository with additional query methods beyond base CRUD.
    /// </summary>
    public interface ITaskRepository : IRepository<TaskItem>
    {
        Task<List<TaskItem>> GetUserTasksAsync(int userId, string? status = null);
        Task<List<TaskItem>> GetOverdueTasksAsync();
        Task<List<TaskItem>> GetTasksByStatusAsync(string status);
    }

    public class TaskRepository : BaseRepository<TaskItem>, ITaskRepository
    {
        public TaskRepository(AppDbContext context) : base(context)
        {
        }

        /// <summary>
        /// Get all tasks for a specific user with optional status filter.
        /// </summary>
        public async Task<List<TaskItem>> GetUserTasksAsync(int userId, string? status = null)
        {
            var query = _context.Tasks
                .AsNoTracking()
                .Where(t => t.UserId == userId);

            if (!string.IsNullOrEmpty(status))
                query = query.Where(t => t.Status == status);

            return await query.ToListAsync();
        }

        /// <summary>
        /// Get all tasks that are overdue and not completed.
        /// </summary>
        public async Task<List<TaskItem>> GetOverdueTasksAsync()
        {
            return await _context.Tasks
                .AsNoTracking()
                .Where(t => t.DueDate < DateTime.UtcNow && t.Status != "done")
                .ToListAsync();
        }

        /// <summary>
        /// Get all tasks filtered by status.
        /// </summary>
        public async Task<List<TaskItem>> GetTasksByStatusAsync(string status)
        {
            return await _context.Tasks
                .AsNoTracking()
                .Where(t => t.Status == status)
                .ToListAsync();
        }
    }
}
