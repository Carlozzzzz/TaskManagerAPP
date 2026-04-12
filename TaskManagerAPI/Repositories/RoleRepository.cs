// --- FILE 3: Repositories/RoleRepository.cs ---
using Microsoft.EntityFrameworkCore;
using TaskManagerAPI.Data;
using TaskManagerAPI.Foundation;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Repositories
{
    public class RoleRepository : Repository<Role>, IRoleRepository
    {
        public RoleRepository(AppDbContext dbContext) : base(dbContext) { }

        public async Task<Role?> GetRoleWithPermissionsAsync(int id)
        {
            return await _dbContext.Roles
                .Include(r => r.Permissions)
                    .ThenInclude(p => p.Module)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<List<Role>> GetAllRolesWithPermissionsAsync()
        {
            return await _dbContext.Roles
                .AsNoTracking()
                .Include(r => r.Permissions)
                    .ThenInclude(p => p.Module)
                .ToListAsync();
        }
    }
}