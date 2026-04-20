// --- FILE 4: Services/IRoleService.cs ---
using TaskManagerAPI.DTOs;

namespace TaskManagerAPI.Services
{
    public interface IRoleService
    {
        Task<List<RoleDto>> GetAllRolesAsync();
        Task<RoleDto?> GetRoleByIdAsync(int id);
        Task<List<RoleWithPermissionsDto>> GetAllRolesWithPermissionsAsync();
        Task<RoleWithPermissionsDto?> GetRoleByIdWithPermissionsAsync(int id);
        Task<RoleWithPermissionsDto> CreateRoleAsync(CreateRoleDto dto);
        Task<RoleWithPermissionsDto> UpdateRoleAsync(int id, CreateRoleDto dto);
        Task<bool> DeleteRoleAsync(int id);
    }
}