// Services/AuthService.cs
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TaskManagerAPI.Data;
using TaskManagerAPI.DTOs;
using TaskManagerAPI.Models;
using TaskManagerAPI.Core.Interfaces;
using TaskManagerAPI.Infrastructure.Data.Repositories;

namespace TaskManagerAPI.Services
{
	public interface IAuthService
	{
		Task<AuthResponseDto?> RegisterAsync(RegisterDto dto);
		Task<AuthResponseDto?> LoginAsync(LoginDto dto);
	}

	public class AuthService : IAuthService
	{
		private readonly AppDbContext _context;
		private readonly IUserRepository _userRepository;
		private readonly IConfiguration _config;

		public AuthService(AppDbContext context, IUserRepository userRepository, IConfiguration config)
		{
			_context = context;
			_userRepository = userRepository;
			_config = config;
		}

		public async Task<AuthResponseDto?> RegisterAsync(RegisterDto dto)
		{
			var existingUser = await _userRepository.GetUserByEmailAsync(dto.Email);
			if (existingUser != null) return null;

			var user = new User
			{
				Name = dto.Name,
				Email = dto.Email,
				PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
			};

			// NEW: Assign Role based on DB lookup
			var isFirstUser = !await _context.Users.IgnoreQueryFilters().AnyAsync();
			var roleName = isFirstUser ? "Admin" : "User";
			var role = await _context.Roles.FirstOrDefaultAsync(r => r.Name == roleName);

			if (role != null)
			{
				user.UserRoles.Add(new UserRole { RoleId = role.Id });
			}

			await _userRepository.AddAsync(user);
			await _userRepository.SaveChangesAsync();

			return await LoginAsync(new LoginDto { Email = dto.Email, Password = dto.Password });
		}

		public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
		{
			var user = await _context.Users
					.Include(u => u.UserRoles).ThenInclude(ur => ur.Role)
							.ThenInclude(r => r.Permissions).ThenInclude(p => p.Module)
					.FirstOrDefaultAsync(u => u.Email == dto.Email);

			if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
				return null;

			var permissions = ResolvePermissions(user);
			var roles = user.UserRoles.Select(ur => ur.Role.Name).ToList();

			return new AuthResponseDto
			{
				Token = GenerateToken(user, roles),
				Name = user.Name,
				Roles = roles,
				Permissions = permissions
			};
		}

		// THE FLATTENER: Squashes multiple roles into additive permissions
		private List<PermissionDto> ResolvePermissions(User user)
		{
			return user.UserRoles
					.SelectMany(ur => ur.Role.Permissions)
					.GroupBy(p => p.Module.Key)
					.Select(g => new PermissionDto
					{
						ModuleKey = g.Key,
						CanAdd = g.Any(x => x.CanAdd),
						CanEdit = g.Any(x => x.CanEdit),
						CanDelete = g.Any(x => x.CanDelete),
						// Implicit View Rule: If they can do anything, they can view.
						CanView = g.Any(x => x.CanView || x.CanAdd || x.CanEdit || x.CanDelete)
					}).ToList();
		}

		private string GenerateToken(User user, List<string> roles)
		{
			var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
			var claims = new List<Claim> {
						new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
						new Claim(ClaimTypes.Name, user.Name)
				};

			// ADDED: Add multiple role claims
			roles.ForEach(r => claims.Add(new Claim(ClaimTypes.Role, r)));

			var token = new JwtSecurityToken(
					issuer: _config["Jwt:Issuer"],
					audience: _config["Jwt:Audience"],
					claims: claims,
					expires: DateTime.UtcNow.AddMinutes(60),
					signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
			);

			return new JwtSecurityTokenHandler().WriteToken(token);
		}
	}
}
