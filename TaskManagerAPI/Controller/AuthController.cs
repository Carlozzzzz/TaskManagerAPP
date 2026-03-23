using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManagerAPI.Data;
using TaskManagerAPI.DTOs;
using TaskManagerAPI.Services;

namespace TaskManagerAPI.Controllers
{
	[ApiController]
	[Route("api/[controller]")] // -> api/auth
	public class AuthController : ControllerBase
	{
		private readonly IAuthService _authService;
		private readonly IUserService _userService;

		public AuthController(IAuthService authService, IUserService userService)
		{
			_authService = authService;
			_userService = userService;
		}

		[HttpPost("register")]
		public ActionResult<AuthResponseDto> Register([FromBody] RegisterDto dto)
		{
			var result = _authService.Register(dto);

			if (result == null) return Conflict("Email already exists.");
			return Ok(result);
		}

		[HttpPost("login")]
		public ActionResult<AuthResponseDto> Login([FromBody] LoginDto dto)
		{
			var result = _authService.Login(dto);

			if (result == null) return Unauthorized("Invalid email or password");
			return Ok(result);
		}

		[Authorize]
		[HttpGet("me")]
		public ActionResult<AuthResponseDto> CurrentUser()
		{
			var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
			var user = _userService.GetUserById(userId);
			if (user == null) return NotFound();
			return Ok(user);
		}
	}
}