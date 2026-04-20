// --- FILE: Services/RoleService.cs ---
using Microsoft.EntityFrameworkCore;
using TaskManagerAPI.Data;
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
        private readonly AppDbContext _context; // ADDED: For Module lookups

        public RoleService(IRoleRepository roleRepo, IUnitOfWork unitOfWork, AppDbContext context)
        {
            _roleRepo = roleRepo;
            _unitOfWork = unitOfWork;
            _context = context;
        }

        public async Task<List<RoleDto>> GetAllRolesAsync()
        {
            var roles = await _roleRepo.GetAllAsync();

            return roles.Select(c => new RoleDto
            {
                Id = c.Id,
                Name = c.Name
            }).ToList();
        }

        public async Task<RoleDto?> GetRoleByIdAsync(int id)
        {
            var roles = await _roleRepo.GetByIdAsync(id);
            if (roles == null) return null;

            return new RoleDto
            {
                Id = roles.Id,
                Name = roles.Name,
            };
        }

        public async Task<List<RoleWithPermissionsDto>> GetAllRolesWithPermissionsAsync()
        {
            var roles = await _roleRepo.GetAllRolesWithPermissionsAsync();
            return roles.Select(MapToDto).ToList();
        }

        public async Task<RoleWithPermissionsDto?> GetRoleByIdWithPermissionsAsync(int id)
        {
            var role = await _roleRepo.GetRoleWithPermissionsAsync(id);
            return role == null ? null : MapToDto(role);
        }

        public async Task<RoleWithPermissionsDto> CreateRoleAsync(CreateRoleDto dto)
        {
            await _unitOfWork.BeginTransactionAsync();
            try
            {
                var role = new Role { Name = dto.Name };
                await _roleRepo.AddAsync(role);
                await _unitOfWork.SaveAsync();

                await ProcessPermissions(role, dto.Permissions);

                await _unitOfWork.CommitAsync();

                var createdRole = await _roleRepo.GetRoleWithPermissionsAsync(role.Id);
                return MapToDto(createdRole!);
            }
            catch
            {
                await _unitOfWork.RollbackAsync();
                throw;
            }
        }

        public async Task<RoleWithPermissionsDto> UpdateRoleAsync(int id, CreateRoleDto dto)
        {
            await _unitOfWork.BeginTransactionAsync();
            try
            {
                var role = await _roleRepo.GetRoleWithPermissionsAsync(id);
                if (role == null) throw new KeyNotFoundException("Role not found");

                role.Name = dto.Name;

                // REPLACED: Clear existing permissions to avoid complex diffing
                _context.Set<RoleModulePermission>().RemoveRange(role.Permissions);
                await _unitOfWork.SaveAsync();

                await ProcessPermissions(role, dto.Permissions);

                await _unitOfWork.CommitAsync();

                // MODIFIED: Explicitly re-fetch with Includes to ensure the DTO is fully populated
                var updatedRole = await _roleRepo.GetRoleWithPermissionsAsync(role.Id);
                return MapToDto(updatedRole!);
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

            role.IsDeleted = true; // REPLACED: Soft delete logic
            await _unitOfWork.SaveAsync();
            return true;
        }

        // HELPER: Handles the Module Key lookup or creation
        private async Task ProcessPermissions(Role role, List<CreateRolePermissionDto> permissionDtos)
        {
            foreach (var pDto in permissionDtos)
            {
                // Find or Create Module based on the Key from Frontend
                var module = await _context.Set<Module>()
                    .FirstOrDefaultAsync(m => m.Key == pDto.ModuleKey);

                if (module == null)
                {
                    module = new Module
                    {
                        Key = pDto.ModuleKey,
                        DisplayName = pDto.ModuleKey.Replace("_", " "), // Pretty print key
                        Section = "General"
                    };
                    _context.Set<Module>().Add(module);
                    await _context.SaveChangesAsync();
                }

                role.Permissions.Add(new RoleModulePermission
                {
                    RoleId = role.Id,
                    ModuleId = module.Id,
                    CanView = pDto.CanView,
                    CanAdd = pDto.CanAdd,
                    CanEdit = pDto.CanEdit,
                    CanDelete = pDto.CanDelete
                });
            }
            await _unitOfWork.SaveAsync();
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
                    ModuleKey = p.Module?.Key ?? "N/A",
                    ModuleName = p.Module?.DisplayName ?? "N/A",
                    CanView = p.CanView,
                    CanAdd = p.CanAdd,
                    CanEdit = p.CanEdit,
                    CanDelete = p.CanDelete
                }).ToList()
            };
        }        
    }
}