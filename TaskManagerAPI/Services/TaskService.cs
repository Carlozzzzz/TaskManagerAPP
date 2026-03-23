using TaskManagerAPI.Data;
using TaskManagerAPI.DTOs;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Services
{
	public interface ITaskService
	{
		List<TaskDto> GetAllTasks(int userId);
		TaskDto? GetTaskById(int id, int userId);
		TaskDto? CreateTask(CreateTaskDto dto, int userId);
		TaskDto? UpdateStatus(UpdateTaskStatusDto dto, int id, int userId);
		List<TaskDto>? GetTaskByTitle(string title, int userId);
		bool DeleteData(int id, int userId);
		
		//  ADED - admin only: returns every tasks from every user
		List<TaskDto> GetAllTaskForAdmin();
	}

	public class TaskService : ITaskService
	{
		private readonly AppDbContext _context;

		public TaskService(AppDbContext context)
		{
			_context = context;
		}

		public List<TaskDto> GetAllTasks(int userId)
		{
			// Added - map Model -> DTO before returning (never return new Model)
			// return _fakeTasks.Select(t => MapToDto(t)).ToList();
			return _context.Tasks
					.Where(t => t.UserId == userId)
					.Select(t => MapToDto(t))
					.ToList();

		}

		public TaskDto? GetTaskById(int id, int userId)
		{
			var task = _context.Tasks.FirstOrDefault(t => t.Id == id && t.UserId == userId);
			return task == null ? null : MapToDto(task);
		}

		public List<TaskDto>? GetTaskByTitle(string title, int userId)
		{
			var task = _context.Tasks
				.Where(t => t.UserId == userId)
				.Where(t => t.Title.Trim().Equals(title.Trim(), StringComparison.CurrentCultureIgnoreCase))
				.Select(t => MapToDto(t))
				.ToList();
			return task ?? null;
		}
		public TaskDto? CreateTask(CreateTaskDto dto, int userId)
		{
			if(dto.DueDate < DateTime.UtcNow) return null;
			
			var newTask = new TaskItem
			{
				Title = dto.Title,
				Description = dto.Description,
				Status = "todo",
				DueDate = dto.DueDate,
				UserId = userId
			};

			_context.Tasks.Add(newTask);
			_context.SaveChanges();

			return MapToDto(newTask);
		}

		public bool DeleteData(int id, int userId)
		{
			// check the data if exists
			var task = _context.Tasks.FirstOrDefault(t=> t.Id == id && t.UserId == userId);
			if (task == null) return false;

			_context.Tasks.Remove(task);
			_context.SaveChanges();
			return true;
		}

		// ADDED - private helper: Model -> DTO conversion in one place
		private static TaskDto MapToDto(TaskItem task) => new TaskDto
		{
			Id = task.Id,
			Title = task.Title,
			Description = task.Description,
			Status = task.Status,
			DueDate = task.DueDate,
			// Notice: CreatedAt and UserId are deliberately excluded
		};

		public TaskDto? UpdateStatus(UpdateTaskStatusDto dto, int id, int userId)
		{
			// var task = _context.Tasks.Find(id);
			var task = _context.Tasks.FirstOrDefault(t => t.Id == id && t.UserId == userId);
			if (task == null) return null;

			task.Status = dto.Status;
			_context.SaveChanges();

			return MapToDto(task);
		}

		public List<TaskDto> GetAllTaskForAdmin()
		{
			return _context.Tasks
				.Select(t => MapToDto(t))
				.ToList();
		}
	}
}