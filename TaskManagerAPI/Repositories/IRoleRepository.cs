// --- FILE 2: Repositories/IRoleRepository.cs ---
using TaskManagerAPI.Foundation;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Repositories
{
    public interface IRoleRepository : IRepository<Role>
    {
        Task<Role?> GetRoleWithPermissionsAsync(int id);
        Task<List<Role>> GetAllRolesWithPermissionsAsync();
    }
}