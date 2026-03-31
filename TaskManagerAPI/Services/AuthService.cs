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
			// Use AnyAsync for better performance
			if (await _context.Users.AnyAsync(u => u.Email == dto.Email)) return null;

			// First user is Admin logic
			var isFirstUser = !await _context.Users.AnyAsync();
			var role = isFirstUser ? UserRoles.Admin : UserRoles.User;

			var user = new User
			{
				Name = dto.Name,
				Email = dto.Email,
				PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
				Role = role
			};

			_context.Users.Add(user);
			await _context.SaveChangesAsync();
			return GenerateToken(user);
		}

		public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
		{
			var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
			if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
				return null;

			return GenerateToken(user);
		}

		private AuthResponseDto GenerateToken(User user)
		{
			var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
			var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

			var claims = new[] {
								new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
								new Claim(ClaimTypes.Name, user.Name),
								new Claim(ClaimTypes.Role, user.Role),
						};

			var token = new JwtSecurityToken(
					issuer: _config["Jwt:Issuer"],
					audience: _config["Jwt:Audience"],
					expires: DateTime.UtcNow.AddMinutes(int.Parse(_config["Jwt:ExpiryMinutes"]!)),
					claims: claims,
					signingCredentials: creds
			);

			return new AuthResponseDto
			{
				Token = new JwtSecurityTokenHandler().WriteToken(token),
				Name = user.Name,
				Role = user.Role
			};
		}
	}
}