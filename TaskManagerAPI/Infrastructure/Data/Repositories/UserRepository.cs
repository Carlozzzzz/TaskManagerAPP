// Infrastructure/Data/Repositories/UserRepository.cs
using Microsoft.EntityFrameworkCore;
using TaskManagerAPI.Core.Interfaces;
using TaskManagerAPI.Data;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Infrastructure.Data.Repositories
{
    /// <summary>
    /// User-specific repository with additional query methods.
    /// </summary>
    public interface IUserRepository : IRepository<User>
    {
        Task<User?> GetUserByEmailAsync(string email);
        Task<List<User>> GetAllUsersWithRolesAsync();
        Task<User?> GetUserWithRolesAsync(int userId);
    }

    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        public UserRepository(AppDbContext context) : base(context)
        {
        }

        /// <summary>
        /// Get user by email address (case-insensitive).
        /// </summary>
        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
        }

        /// <summary>
        /// Get all users with their roles eagerly loaded (prevents N+1 queries).
        /// </summary>
        public async Task<List<User>> GetAllUsersWithRolesAsync()
        {
            return await _context.Users
                .AsNoTracking()
                .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                .ToListAsync();
        }

        /// <summary>
        /// Get specific user with roles and permissions loaded.
        /// </summary>
        public async Task<User?> GetUserWithRolesAsync(int userId)
        {
            return await _context.Users
                .AsNoTracking()
                .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                    .ThenInclude(r => r.Permissions)
                        .ThenInclude(p => p.Module)
                .FirstOrDefaultAsync(u => u.Id == userId);
        }
    }
}
