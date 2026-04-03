// Path: Models/AuditEntry.cs
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System.Text.Json;
using TaskManagerAPI.Models;

// ROLE: A temporary "bucket" to hold changes before they are saved to the AuditLogs table.
namespace TaskManagerAPI.Models
{
	public class AuditEntry
	{
		public AuditEntry(Microsoft.EntityFrameworkCore.ChangeTracking.EntityEntry entry)
				=> Entry = entry;

		public Microsoft.EntityFrameworkCore.ChangeTracking.EntityEntry Entry { get; }

		// MODIFIED: Use null! because these are set immediately in OnBeforeSaveChanges
		public string UserId { get; set; } = null!;
		public string TableName { get; set; } = null!;
		public string Action { get; set; } = null!;

		public Dictionary<string, object> KeyValues { get; } = new();
		public Dictionary<string, object> OldValues { get; } = new();
		public Dictionary<string, object> NewValues { get; } = new();

		public AuditLog ToAudit()
		{
			return new AuditLog
			{
				UserId = UserId,
				Action = Action,
				TableName = TableName,
				CreatedAt = DateTime.UtcNow,
				RecordId = System.Text.Json.JsonSerializer.Serialize(KeyValues),
				// Handle nulls for the database columns
				OldValues = OldValues.Count == 0 ? null : System.Text.Json.JsonSerializer.Serialize(OldValues),
				NewValues = NewValues.Count == 0 ? null : System.Text.Json.JsonSerializer.Serialize(NewValues)
			};
		}
	}
}