// Services/UserService.cs
using Microsoft.EntityFrameworkCore;
using TaskManagerAPI.Data;
using TaskManagerAPI.DTOs;
using TaskManagerAPI.Foundation;
using TaskManagerAPI.Models;
using TaskManagerAPI.Repositories;

namespace TaskManagerAPI.Services
{
	public interface IUserService
	{
		Task<UserDto?> GetUserByIdAsync(int id);
		Task<List<UserDto>> GetAllUsersAsync();
		Task<UserDto?> Update(UpdateUserDto dto);
    }

	public class UserService : IUserService
	{
		private readonly AppDbContext _context;
        private readonly IUnitOfWork _unitOfWork;
		private readonly IRoleRepository _roleRepository;
		public UserService(
            AppDbContext context,
            IUnitOfWork unitOfWork,
            IRoleRepository roleRepository)
        {
            _unitOfWork = unitOfWork;
            _context = context;
            _roleRepository = roleRepository;
        }

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

        public async Task<UserDto?> Update(UpdateUserDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(t => t.Id == dto.Id );
            if (user == null) return null;

            user.Name= dto.Name;
            await _unitOfWork.SaveAsync();

            return MapToDto(user);
        }

        private UserDto MapToDto(User m) => new UserDto
        {
            Id = m.Id,
            Name = m.Name,
            Email = m.Email,
            Roles = m.UserRoles.Select(ur => ur.Role.Name).ToList()
        };
    }
}