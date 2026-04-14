// DTOs/UserDto.cs
using System.ComponentModel.DataAnnotations;

namespace TaskManagerAPI.DTOs
{
	// What we SEND to the frontend (response)
	public class UserDto
	{
		public int Id { get; set; }
		public string Name { get; set; } = string.Empty;
		public string Email { get; set; } = string.Empty;

		// MODIFIED: From 'string' to 'List<string>' to support RBAC
		public List<string> Roles { get; set; } = new();
	}

    public class UpdateUserDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }
}