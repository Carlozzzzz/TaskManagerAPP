using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManagerAPI.Data;
using TaskManagerAPI.DTOs;
using TaskManagerAPI.Services;
using TaskManagerAPI.API.Extensions;

namespace TaskManagerAPI.Controllers
{
	[Route("api/[controller]")]
	public class AuthController : BaseController // Uses BaseController
	{
		private readonly IAuthService _authService;
		private readonly IUserService _userService;

		public AuthController(IAuthService authService, IUserService userService)
		{
			_authService = authService;
			_userService = userService;
		}

		[HttpPost("register")]
		public async Task<IActionResult> Register([FromBody] RegisterDto dto)
		{
		// ADDED: Validate DTO (Phase 2B)
		await dto.ValidateRegisterAsync();

			var result = await _authService.RegisterAsync(dto);
			return result == null ? Conflict("Email already exists") : Ok(result);
		}

		[HttpPost("login")]
		public async Task<IActionResult> Login([FromBody] LoginDto dto)
		{
		// ADDED: Validate DTO (Phase 2B)
		await dto.ValidateLoginAsync();

			var result = await _authService.LoginAsync(dto);
			return result == null ? Unauthorized("Invalid credentials") : Ok(result);
		}

		[Authorize]
		[HttpGet("me")]
		public async Task<IActionResult> GetMe()
		{
			var user = await _userService.GetUserByIdAsync(GetUserId()); // Uses shared GetUserId
			return user == null ? NotFound() : Ok(user);
		}
	}
}