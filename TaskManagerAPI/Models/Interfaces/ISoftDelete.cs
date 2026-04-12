// Models/Interfaces/ISoftDelete.cs
namespace TaskManagerAPI.Models.Interfaces
{
	public interface ISoftDelete
	{
		bool IsDeleted { get; set; }
		DateTime? DeletedAt { get; set; }
		int? DeletedBy { get; set; }
	}
}