// Models/User.cs
using TaskManagerAPI.Models.Base;
using TaskManagerAPI.Models.Interfaces; // Ensure you have the ISoftDelete interface

namespace TaskManagerAPI.Models
{
    // MODIFIED: Inherit from ISoftDelete to enable the "Invisible Guard"
    public class User : BaseSoftDeleteEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;

        // This allows you to say: myUser.UserRoles.Select(ur => ur.Role.Name)
        public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    }
}