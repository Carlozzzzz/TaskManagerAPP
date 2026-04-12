// Path: Models/PermissionEntities.cs

using TaskManagerAPI.Models.Base;
using TaskManagerAPI.Models.Interfaces;

namespace TaskManagerAPI.Models
{
	// Logic: User <-> UserRoles <-> Role <-> RoleModulePermission -> Module
	public class Role : BaseSoftDeleteEntity
    {
		public string Name { get; set; } = null!;
		public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
		public virtual ICollection<RoleModulePermission> Permissions { get; set; } = new List<RoleModulePermission>();
	}

	public class Module : BaseSoftDeleteEntity
    {
		public string Key { get; set; } = null!;
		public string DisplayName { get; set; } = null!;
		public string Section { get; set; } = null!;
	}

	public class RoleModulePermission : BaseSoftDeleteEntity
    {
		public int RoleId { get; set; }
		public int ModuleId { get; set; }
		public bool CanView { get; set; }
		public bool CanAdd { get; set; }
		public bool CanEdit { get; set; }
		public bool CanDelete { get; set; }

		public virtual Role Role { get; set; } = null!;    // MODIFIED
		public virtual Module Module { get; set; } = null!; // MODIFIED
    }

	// Join Table for Many-to-Many
	public class UserRole : BaseSoftDeleteEntity
    {
		public int UserId { get; set; }
		public int RoleId { get; set; }
		public virtual User User { get; set; } = null!;
		public virtual Role Role { get; set; } = null!;
	}
}