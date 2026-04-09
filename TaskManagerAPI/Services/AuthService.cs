// Services/AuthService.cs
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TaskManagerAPI.Constants;
using TaskManagerAPI.Data;
using TaskManagerAPI.DTOs;
using TaskManagerAPI.Models;

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
		private readonly IConfiguration _config;

		public AuthService(AppDbContext context, IConfiguration config)
		{
			_context = context;
			_config = config;
		}

		public async Task<AuthResponseDto?> RegisterAsync(RegisterDto dto)
		{
			if (await _context.Users.AnyAsync(u => u.Email == dto.Email)) return null;

			var user = new User
			{
				Name = dto.Name,
				Email = dto.Email,
				PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
			};

			// NEW: Assign Role based on DB lookup
			var isFirstUser = !await _context.Users.IgnoreQueryFilters().AnyAsync();
			var roleName = isFirstUser ? UserRoles.Admin : UserRoles.User;
			var role = await _context.Roles.FirstOrDefaultAsync(r => r.Name == roleName);

			if (role != null)
			{
				user.UserRoles.Add(new UserRole { RoleId = role.Id });
			}

			_context.Users.Add(user);
			await _context.SaveChangesAsync();

			return await LoginAsync(new LoginDto { Email = dto.Email, Password = dto.Password });
		}

		public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
		{
			var user = await _context.Users
					.Include(u => u.UserRoles)
					.ThenInclude(ur => ur.Role)
					.ThenInclude(r => r.Permissions)
					.ThenInclude(p => p.Module)
					.FirstOrDefaultAsync(u => u.Email == dto.Email);

			if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
				return null;

			var permissions = ResolvePermissions(user);
			var role = user.UserRoles.Select(ur => ur.Role.Name).First();

			return new AuthResponseDto
			{
				Token = GenerateToken(user, role),
				Name = user.Name,
				Role = role,
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

		private string GenerateToken(User user, string role)
		{
			var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
			var claims = new List<Claim> {
						new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),

                        new Claim(ClaimTypes.Name, user.Name),
                        new Claim(ClaimTypes.Role, role)
				};

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