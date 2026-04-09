// Services/TaskService.cs
using Microsoft.EntityFrameworkCore;
using TaskManagerAPI.Data;
using TaskManagerAPI.DTOs;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Services
{
	public interface ITaskService
	{
		Task<List<TaskDto>> GetAllTasksAsync();
		Task<List<TaskDto>> GetAllUserTasksAsync(int userId);
		Task<TaskDto?> GetTaskByIdAsync(int id, int userId);
		Task<TaskDto?> CreateTaskAsync(CreateTaskDto dto, int userId);
		Task<TaskDto?> UpdateStatusAsync(UpdateTaskStatusDto dto, int id, int userId);
		Task<bool> DeleteDataAsync(int id, int userId);

		// Admin tasks
		Task<List<TaskDto>> GetAllTaskForAdminAsync();
	}

	public class TaskService : ITaskService
	{
		private readonly AppDbContext _context;
		public TaskService(AppDbContext context) => _context = context;

		public async Task<List<TaskDto>> GetAllTasksAsync()
		{
			return await _context.Tasks
					.AsNoTracking() // Performance boost for read-only queries
					.Select(t => MapToDto(t))
					.ToListAsync();
		}
		
		public async Task<List<TaskDto>> GetAllUserTasksAsync(int userId)
		{
			return await _context.Tasks
					.AsNoTracking() // Performance boost for read-only queries
					.Where(t => t.CreatedBy == userId)
					.Select(t => MapToDto(t))
					.ToListAsync();
		}

		public async Task<TaskDto?> GetTaskByIdAsync(int id, int userId)
		{
			var task = await _context.Tasks
					.AsNoTracking()
					.FirstOrDefaultAsync(t => t.Id == id && t.CreatedBy == userId);

			return task == null ? null : MapToDto(task);
		}

		public async Task<List<TaskDto>> GetAllTaskForAdminAsync()
		{
			// Use ToListAsync() for non-blocking database read
			return await _context.Tasks
					.AsNoTracking() // Performance boost for large admin lists
					.Select(t => MapToDto(t))
					.ToListAsync();
		}

		public async Task<TaskDto?> CreateTaskAsync(CreateTaskDto dto, int userId)
		{
			if (dto.DueDate < DateTime.UtcNow) return null;

			var newTask = new TaskItem
			{
				Title = dto.Title,
				Description = dto.Description,
				Status = "todo",
				DueDate = dto.DueDate,
				CreatedBy = userId
			};

			_context.Tasks.Add(newTask);
			await _context.SaveChangesAsync(); // Non-blocking write

			return MapToDto(newTask);
		}

		public async Task<bool> DeleteDataAsync(int id, int userId)
		{
			var task = await _context.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.CreatedBy == userId);
			if (task == null) return false;

			_context.Tasks.Remove(task);
			await _context.SaveChangesAsync();
			return true;
		}

		public async Task<TaskDto?> UpdateStatusAsync(UpdateTaskStatusDto dto, int id, int userId)
		{
			var task = await _context.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.CreatedBy == userId);
			if (task == null) return null;

			task.Status = dto.Status;
			await _context.SaveChangesAsync();

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