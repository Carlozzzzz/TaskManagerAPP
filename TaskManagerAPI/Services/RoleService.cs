// --- FILE 5: Services/RoleService.cs ---
using TaskManagerAPI.DTOs;
using TaskManagerAPI.Foundation;
using TaskManagerAPI.Models;
using TaskManagerAPI.Repositories;

namespace TaskManagerAPI.Services
{
    public class RoleService : IRoleService
    {
        private readonly IRoleRepository _roleRepo;
        private readonly IUnitOfWork _unitOfWork;

        public RoleService(IRoleRepository roleRepo, IUnitOfWork unitOfWork)
        {
            _roleRepo = roleRepo;
            _unitOfWork = unitOfWork;
        }

        public async Task<List<RoleWithPermissionsDto>> GetAllRolesAsync()
        {
            var roles = await _roleRepo.GetAllRolesWithPermissionsAsync();
            return roles.Select(MapToDto).ToList();
        }

        public async Task<RoleWithPermissionsDto?> GetRoleByIdAsync(int id)
        {
            var role = await _roleRepo.GetRoleWithPermissionsAsync(id);
            return role == null ? null : MapToDto(role);
        }

        public async Task<RoleWithPermissionsDto> CreateRoleAsync(CreateRoleDto dto)
        {
            // TRANSACTION START: Role + Permissions must both succeed
            await _unitOfWork.BeginTransactionAsync();
            try
            {
                var role = new Role { Name = dto.Name };
                await _roleRepo.AddAsync(role);

                // We need to save to get the Role ID for the permissions
                await _unitOfWork.SaveAsync();

                foreach (var p in dto.Permissions)
                {
                    role.Permissions.Add(new RoleModulePermission
                    {
                        RoleId = role.Id,
                        ModuleId = p.ModuleId,
                        CanView = p.CanView,
                        CanAdd = p.CanAdd,
                        CanEdit = p.CanEdit,
                        CanDelete = p.CanDelete
                    });
                }

                await _unitOfWork.CommitAsync();

                // Re-fetch to get navigation properties (Module names) for the return DTO
                var createdRole = await _roleRepo.GetRoleWithPermissionsAsync(role.Id);
                return MapToDto(createdRole!);
            }
            catch
            {
                await _unitOfWork.RollbackAsync();
                throw;
            }
        }

        public async Task<bool> DeleteRoleAsync(int id)
        {
            var role = await _roleRepo.GetByIdAsync(id);
            if (role == null) return false;

            role.IsDeleted = true; // Soft Delete logic
            await _unitOfWork.SaveAsync();
            return true;
        }

        private RoleWithPermissionsDto MapToDto(Role role)
        {
            return new RoleWithPermissionsDto
            {
                Id = role.Id,
                Name = role.Name,
                Permissions = role.Permissions.Select(p => new RolePermissionDto
                {
                    ModuleId = p.ModuleId,
                    ModuleKey = p.Module?.Key ?? "Unknown",
                    ModuleName = p.Module?.DisplayName ?? "Unknown",
                    CanView = p.CanView,
                    CanAdd = p.CanAdd,
                    CanEdit = p.CanEdit,
                    CanDelete = p.CanDelete
                }).ToList()
            };
        }
    }
}