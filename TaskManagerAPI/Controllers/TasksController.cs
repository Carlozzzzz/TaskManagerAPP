// Controllers/TasksController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManagerAPI.DTOs;
using TaskManagerAPI.Services;
using System.Security.Claims;

namespace TaskManagerAPI.Controllers
{
	[ApiController]
	[Authorize]
	[Route("api/[controller]")]
	public class TasksController : ControllerBase
	{
		private readonly ITaskService _taskService;
		public TasksController(ITaskService taskService) => _taskService = taskService;

		private int GetUserId()
		{
			var claim = User.FindFirstValue(ClaimTypes.NameIdentifier);
			return int.TryParse(claim, out var id) ? id : 0;
		}

		[HttpGet]
		public async Task<ActionResult<List<TaskDto>>> GetAll()
		{
			var tasks = await _taskService.GetAllTasksAsync();
			return Ok(tasks);
		}

		[HttpGet("user-tasks")]
		public async Task<ActionResult<List<TaskDto>>> GetAllUserTasks()
		{
			var tasks = await _taskService.GetAllUserTasksAsync(GetUserId());
			return Ok(tasks);
		}

		[HttpGet("{id}")]
		public async Task<ActionResult<TaskDto>> GetById(int id)
		{
			var task = await _taskService.GetTaskByIdAsync(id, GetUserId());
			if (task == null) return NotFound();
			return Ok(task);
		}

		[HttpPost]
		public async Task<ActionResult<TaskDto>> Create([FromBody] CreateTaskDto dto)
		{
			var created = await _taskService.CreateTaskAsync(dto, GetUserId());
			if (created == null) return BadRequest("Invalid Task Data or Past Due Date");

			// Standard REST practice: Return 201 Created with the location of the resource
			return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
		}

		[HttpPut("update-status/{id}")]
		public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateTaskStatusDto dto)
		{
			var updated = await _taskService.UpdateStatusAsync(dto, id, GetUserId());
			if (updated == null) return NotFound();
			return Ok(updated);
		}

		[HttpDelete("{id}")]
		public async Task<IActionResult> Delete(int id)
		{
			var success = await _taskService.DeleteDataAsync(id, GetUserId());
			if (!success) return NotFound();
			return NoContent(); // 204 No Content is standard for successful deletes
		}
	}
}