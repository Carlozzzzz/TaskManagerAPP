using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManagerAPI.Constants;
using TaskManagerAPI.Services;

namespace TaskManagerAPI.Controllers
{
	[ApiController]
	[Authorize]
	[Route("api/[controller]")]
	public class UserController : BaseController
	{
		private readonly IUserService _userService;

		public UserController(IUserService userService)
		{
			_userService = userService;
		}

		[HttpGet("users")]
		public async Task<IActionResult> GetAllUsers() => Ok(await _userService.GetAllUsersAsync());
	}
}