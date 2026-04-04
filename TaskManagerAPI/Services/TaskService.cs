// Services/TaskService.cs
using TaskManagerAPI.DTOs;
using TaskManagerAPI.Models;
using TaskManagerAPI.Infrastructure.Data.Repositories;

namespace TaskManagerAPI.Services
{
	public interface ITaskService
	{
		Task<List<TaskDto>> GetAllTasksAsync(int userId);
		Task<TaskDto?> GetTaskByIdAsync(int id, int userId);
		Task<TaskDto?> CreateTaskAsync(CreateTaskDto dto, int userId);
		Task<TaskDto?> UpdateStatusAsync(UpdateTaskStatusDto dto, int id, int userId);
		Task<bool> DeleteDataAsync(int id, int userId);

		// Admin tasks
		Task<List<TaskDto>> GetAllTaskForAdminAsync();
	}

	public class TaskService : ITaskService
	{
		private readonly ITaskRepository _repository;

		public TaskService(ITaskRepository repository) => _repository = repository;

		public async Task<List<TaskDto>> GetAllTasksAsync(int userId)
		{
			var tasks = await _repository.GetUserTasksAsync(userId);
			return tasks.Select(MapToDto).ToList();
		}

		public async Task<TaskDto?> GetTaskByIdAsync(int id, int userId)
		{
			var task = await _repository.GetSingleAsync(t => t.Id == id && t.UserId == userId);
			return task == null ? null : MapToDto(task);
		}

		public async Task<List<TaskDto>> GetAllTaskForAdminAsync()
		{
			var tasks = await _repository.GetAllAsync();
			return tasks.Select(MapToDto).ToList();
		}

		public async Task<TaskDto?> CreateTaskAsync(CreateTaskDto dto, int userId)
		{
			// Parse the dueDate string to DateTime
			if (!DateTime.TryParse(dto.DueDate, out var parsedDueDate))
				return null;

			if (parsedDueDate < DateTime.UtcNow) return null;

			var newTask = new TaskItem
			{
				Title = dto.Title,
				Description = dto.Description,
				Status = "todo",
				DueDate = parsedDueDate,
				UserId = userId
			};

			await _repository.AddAsync(newTask);
			await _repository.SaveChangesAsync();

			return MapToDto(newTask);
		}

		public async Task<bool> DeleteDataAsync(int id, int userId)
		{
			var task = await _repository.GetSingleAsync(t => t.Id == id && t.UserId == userId);
			if (task == null) return false;

			_repository.Delete(task);
			await _repository.SaveChangesAsync();
			return true;
		}

		public async Task<TaskDto?> UpdateStatusAsync(UpdateTaskStatusDto dto, int id, int userId)
		{
			var task = await _repository.GetSingleAsync(t => t.Id == id && t.UserId == userId);
			if (task == null) return null;

			task.Status = dto.Status;
			_repository.Update(task);
			await _repository.SaveChangesAsync();

			return MapToDto(task);
		}

		private static TaskDto MapToDto(TaskItem task) => new TaskDto
		{
			Id = task.Id,
			Title = task.Title,
			Description = task.Description,
			Status = task.Status,
			DueDate = task.DueDate
		};
	}
}
