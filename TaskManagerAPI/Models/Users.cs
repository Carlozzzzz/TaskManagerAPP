// Models/User.cs
using TaskManagerAPI.Models.Interfaces; // Ensure you have the ISoftDelete interface

namespace TaskManagerAPI.Models
{
    // MODIFIED: Inherit from ISoftDelete to enable the "Invisible Guard"
    public class User : ISoftDelete
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;

        // REMOVED: public string Role { get; set; } 
        // Logic: We no longer store the role as a simple string. 
        // It now lives in the 'UserRoles' join table.

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // --- NEW SENIOR FEATURES ---

        // 1. Soft Delete Properties
        public bool IsDeleted { get; set; } = false;
        public DateTime? DeletedAt { get; set; }

        // 2. Navigation Property (The Link)
        // This allows you to say: myUser.UserRoles.Select(ur => ur.Role.Name)
        public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
        public int? DeletedBy { get; set; }
    }
}