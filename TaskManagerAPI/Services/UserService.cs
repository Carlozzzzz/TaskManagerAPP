// Services/UserService.cs
using TaskManagerAPI.DTOs;
using TaskManagerAPI.Infrastructure.Data.Repositories;

namespace TaskManagerAPI.Services
{
	public interface IUserService
	{
		Task<UserDto?> GetUserByIdAsync(int id);
		Task<List<UserDto>> GetAllUsersAsync();
	}

	public class UserService : IUserService
	{
		private readonly IUserRepository _repository;

		public UserService(IUserRepository repository) => _repository = repository;

		public async Task<List<UserDto>> GetAllUsersAsync()
		{
			var users = await _repository.GetAllUsersWithRolesAsync();
			return users.Select(u => new UserDto
			{
				Id = u.Id,
				Name = u.Name,
				Email = u.Email,
				Roles = u.UserRoles.Select(ur => ur.Role.Name).ToList()
			}).ToList();
		}

		public async Task<UserDto?> GetUserByIdAsync(int id)
		{
			var user = await _repository.GetUserWithRolesAsync(id);

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
