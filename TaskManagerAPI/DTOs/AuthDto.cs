namespace TaskManagerAPI.DTOs
{
	public class RegisterDto
	{
		public string Name { get; set; } = string.Empty;
		public string Email { get; set; } = string.Empty;
		public string Password { get; set; } = string.Empty;
	}

	public class LoginDto
	{
		public string Email { get; set; } = string.Empty;
		public string Password { get; set; } = string.Empty;
	}

	public class AuthResponseDto
	{
		public string Token { get; set; } = string.Empty;
		public string Name { get; set; } = string.Empty;
		public List<string> Roles { get; set; } = new(); // MODIFIED: Support multiple
		public List<PermissionDto> Permissions { get; set; } = new(); // ADDED
	}

	public class PermissionDto
	{
		public string ModuleKey { get; set; } = string.Empty;
		public bool CanView { get; set; }
		public bool CanAdd { get; set; }
		public bool CanEdit { get; set; }
		public bool CanDelete { get; set; }
	}
}