// --- FILE 1: DTOs/RoleDtos.cs ---
namespace TaskManagerAPI.DTOs
{
    public class RoleDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
    }

    public class RoleWithPermissionsDto : RoleDto
    {
        public List<RolePermissionDto> Permissions { get; set; } = new();
    }

    public class RolePermissionDto
    {
        public int ModuleId { get; set; }
        public string ModuleKey { get; set; } = null!;
        public string ModuleName { get; set; } = null!;
        public bool CanView { get; set; }
        public bool CanAdd { get; set; }
        public bool CanEdit { get; set; }
        public bool CanDelete { get; set; }
    }

    public class CreateRoleDto
    {
        public string Name { get; set; } = null!;
        public List<CreateRolePermissionDto> Permissions { get; set; } = new();
    }

    public class CreateRolePermissionDto
    {
        // MODIFIED: Added ModuleKey as the primary identifier from Frontend
        public string ModuleKey { get; set; } = null!;
        public bool CanView { get; set; }
        public bool CanAdd { get; set; }
        public bool CanEdit { get; set; }
        public bool CanDelete { get; set; }
    }
}