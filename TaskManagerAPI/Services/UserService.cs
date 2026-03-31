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
			// SENIOR TIP: Use .Include() to fetch roles in ONE query (Avoids N+1 problem)
			return await _context.Users
					.AsNoTracking()
					.Include(u => u.UserRoles)
							.ThenInclude(ur => ur.Role)
					.Select(u => new UserDto
					{
						Id = u.Id,
						Name = u.Name,
						Email = u.Email,
						// MODIFIED: Extract the names of all assigned roles
						Roles = u.UserRoles.Select(ur => ur.Role.Name).ToList()
					})
					.ToListAsync();
		}

		public async Task<UserDto?> GetUserByIdAsync(int id)
		{
			var user = await _context.Users
					.AsNoTracking()
					.Include(u => u.UserRoles)
							.ThenInclude(ur => ur.Role)
					.FirstOrDefaultAsync(u => u.Id == id);

			if (user == null) return null;

			return new UserDto
			{
				Id = user.Id,
				Name = user.Name,
				Email = user.Email,
				Roles = user.UserRoles.Select(ur => ur.Role.Name).ToList()
			};
		}
	}
}