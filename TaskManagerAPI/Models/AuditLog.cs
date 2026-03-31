namespace TaskManagerAPI.Models
{
	public class AuditLog
	{
		public int Id { get; set; }
		public string UserId { get; set; } = null!; // MODIFIED: Added null!
		public string Action { get; set; } = null!; // MODIFIED
		public string TableName { get; set; } = null!; // MODIFIED
		public string RecordId { get; set; } = null!; // MODIFIED
		public string? OldValues { get; set; } // MODIFIED: Made nullable ? because deletes have no new values
		public string? NewValues { get; set; } // MODIFIED: Made nullable ?
		public DateTime CreatedAt { get; set; }
	}
}