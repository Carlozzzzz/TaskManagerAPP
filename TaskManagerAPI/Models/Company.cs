// Path: Models/PermissionEntities.cs

using TaskManagerAPI.Models.Interfaces;

namespace TaskManagerAPI.Models
{
	public class Company : ISoftDelete
	{
		public int Id { get; set;}
		public string Description {get; set;} = string.Empty;
		public bool IsActive {get; set;}
		public bool IsDeleted { get; set; }
		public DateTime? DeletedAt { get; set; }
	}
}