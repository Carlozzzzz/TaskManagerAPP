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
	[Route("api/[controller]")]   // → api/tasks
	public class TasksController : ControllerBase
	{
		private readonly ITaskService _taskService;

		// ADDED — constructor injection (service comes in, controller doesn't create it)
		public TasksController(ITaskService taskService)
		{
			_taskService = taskService;
		}
		
		private int GetUserId() =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

		// GET api/tasks
		[HttpGet]
		public ActionResult<List<TaskDto>> GetAll()
		{
			return Ok(_taskService.GetAllTasks(GetUserId()));
		}

		// GET api/tasks/1
		[HttpGet("{id}")]
		public ActionResult<TaskDto> GetById(int id)
		{
			var task = _taskService.GetTaskById(id, GetUserId());
			if (task == null) return NotFound();  // 404 if not found
			return Ok(task);
		}

		[HttpGet("get-title/{title}")]
		public ActionResult<List<TaskDto>> GetByTitle(string title)
		{
			var task = _taskService.GetTaskByTitle(title, GetUserId());
			if (task == null) return NotFound();
			return Ok(task);
		}

		// POST api/tasks
		[HttpPost]
		public ActionResult<TaskDto> Create([FromBody] CreateTaskDto dto)
		{
			var created = _taskService.CreateTask(dto, GetUserId());
			if(created == null) return BadRequest("Due date cannot be in the past");
			return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
		}
		
		[HttpPut("update-status/{id}")]
		public ActionResult UpdateStatus(UpdateTaskStatusDto dto, int id)
		{
			var updated = _taskService.UpdateStatus(dto, id, GetUserId());
			if(updated == null) return NotFound();
			return Ok(updated);
		}

		[HttpDelete("{id}")]
		public ActionResult Delete(int id)
		{
			var deleted = _taskService.DeleteData(id, GetUserId());
			if (!deleted) return NotFound();
			return NoContent();
		}
	}
}