// Services/UserService.cs
using Microsoft.EntityFrameworkCore;
using TaskManagerAPI.Data;
using TaskManagerAPI.DTOs;

namespace TaskManagerAPI.Services
{
	public interface IUserService
	{
		Task<UserDto?> GetUserByIdAsync(int id);
		Task<List<UserDto>> GetAllUsersAsync();
	}

	public class UserService : IUserService
	{
		private readonly AppDbContext _context;
		public UserService(AppDbContext context) => _context = context;

		public async Task<List<UserDto>> GetAllUsersAsync()
		{
			return await _context.Users
					.AsNoTracking()
					.Select(u => MapToDto(u))
					.ToListAsync();
		}

		public async Task<UserDto?> GetUserByIdAsync(int id)
		{
			var user = await _context.Users
					.AsNoTracking()
					.FirstOrDefaultAsync(u => u.Id == id);

			return user == null ? null : MapToDto(user);
		}

		private static UserDto MapToDto(Models.User u) => new UserDto
		{
			Id = u.Id,
			Name = u.Name,
			Email = u.Email,
			Role = u.Role
		};
	}
}