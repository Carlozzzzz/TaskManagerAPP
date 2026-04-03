using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManagerAPI.Constants;
using TaskManagerAPI.Services;

namespace TaskManagerAPI.Controllers
{
	[Authorize(Roles = UserRoles.Admin)] // Uses Constant
	[Route("api/[controller]")]
	public class AdminController : BaseController
	{
		private readonly ITaskService _taskService;
		private readonly IUserService _userService;

		public AdminController(ITaskService taskService, IUserService userService)
		{
			_taskService = taskService;
			_userService = userService;
		}

		[HttpGet("tasks")]
		public async Task<IActionResult> GetAllTasks() => Ok(await _taskService.GetAllTaskForAdminAsync());

		[HttpGet("users")]
		public async Task<IActionResult> GetAllUsers() => Ok(await _userService.GetAllUsersAsync());
	}
}