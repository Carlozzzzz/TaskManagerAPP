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

    public class ResetUserPasswordDto
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
    }

    public class AuthResponseDto
	{
		public string Token { get; set; } = string.Empty;
		public string Name { get; set; } = string.Empty;
		public string Role { get; set; } = string.Empty;
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