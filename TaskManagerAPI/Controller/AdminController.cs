using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManagerAPI.DTOs;

namespace TaskManagerAPI.Services
{
 [ApiController]
 [Authorize(Roles = "admin")] // ADDED - admin only, regular users get 403
 [Route("api/[controller]")] // -> api/admin
	public class AdminController : ControllerBase
	{
		private readonly ITaskService _taskService;
		private readonly IUserService _userService;
		
		public AdminController(ITaskService taskService, IUserService userService)
		{
			_taskService = taskService;
			_userService = userService;
		}
		
		// GET api/admin/tasks = all tasks from all users
		[HttpGet("tasks")]
		public ActionResult<List<TaskDto>> GetAllTask()
		{
			var result = _taskService.GetAllTaskForAdmin();
			return Ok(result);
		}
		
		// GET api/admin/users - all users
		[HttpGet("users")]
		public ActionResult<List<UserDto>> GetAllUsers()
		{
			var result = _userService.GetAllUsers();
			return Ok(result);
		}
		
	}
}