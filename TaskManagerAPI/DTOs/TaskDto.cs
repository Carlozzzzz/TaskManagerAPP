using System.ComponentModel.DataAnnotations;

namespace TaskManagerAPI.DTOs
{
	// What we SEND to the frontend (response)
	public class TaskDto
	{
		public int Id { get; set; }
		public string Title { get; set; } = string.Empty;
		public string Description { get; set; } = string.Empty;
		public string Status { get; set; } = string.Empty;
		public DateTime DueDate { get; set; }
	}

	// What we Recieve from the frontend (create/edit request)
	public class CreateTaskDto
	{
		[Required]
		[StringLength(50, MinimumLength = 2)]
		public string Title { get; set; } = string.Empty;

		[StringLength(200, MinimumLength = 0)]
		public string Description { get; set; } = string.Empty;

		[Required]
		public string DueDate { get; set; } = string.Empty; // CHANGED: Accept string from HTML date input
	}

	public class UpdateTaskStatusDto
	{
		public int Id { get; set; }
		public required string Status { get; set; }
	}

}
