using Microsoft.AspNetCore.Mvc;
using TaskManagerAPI.Data;
using TaskManagerAPI.DTOs;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Services
{
	public interface IUserService
	{
		UserDto? GetUserById(int id);

		// ADDED - admin only: returns all user
		List<UserDto> GetAllUsers();
	}

	public class UserService : IUserService
	{

		private readonly AppDbContext _context;

		public UserService(AppDbContext context)
		{
			_context = context;
		}

		public List<UserDto> GetAllUsers()
		{
			return _context.Users
				.Select(u => new UserDto
				{
					Id = u.Id,
					Name = u.Name,
					Email = u.Email,
					Role = u.Role
				})
				.ToList();
		}

		public UserDto? GetUserById(int id)
		{
			var result = _context.Users.FirstOrDefault(u => u.Id == id);
			if (result == null) return null;

			return new UserDto
			{
				Id = result.Id,
				Name = result.Name,
				Email = result.Email,
				Role = result.Role
			};
		}
	}
}