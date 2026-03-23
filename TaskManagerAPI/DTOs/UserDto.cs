using System.ComponentModel.DataAnnotations;

namespace TaskManagerAPI.DTOs
{
	// What we SEND to the frontend (response)
	public class UserDto
	{
		public int Id { get; set; }

		[Required]
		[StringLength(200, MinimumLength = 3)]
		public string Name { get; set; } = string.Empty;
		
		[Required]
		[EmailAddress]
		[StringLength(200, MinimumLength = 3)]
		public string Email { get; set; } = string.Empty;
		
		[Required]
		[StringLength(200, MinimumLength = 3)]
		public string Role { get; set; } = string.Empty;
	}
}