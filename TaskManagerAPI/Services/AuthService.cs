using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using TaskManagerAPI.Data;
using TaskManagerAPI.DTOs;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Services
{
	public interface IAuthService
	{
		AuthResponseDto? Register (RegisterDto dto);
		AuthResponseDto? Login (LoginDto dto);
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
		
		public AuthResponseDto? Register(RegisterDto dto)
		{
			// ADDED - check if email already exists
			var exists = _context.Users.Any(u => u.Email == dto.Email);
			if (exists) return null;
			
			var role = _context.Users.Any() ? "user" : "admin";
			
			var user = new User
			{
				Name = dto.Name,
				Email = dto.Email,
				PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
				Role = role
			};
			
			_context.Users.Add(user);
			_context.SaveChanges();
			return GenerateToken(user);
		}

		public AuthResponseDto? Login(LoginDto dto)
		{
			// ADDED : find user by email
			var user = _context.Users.FirstOrDefault(u => u.Email == dto.Email);
			if(user == null) return null;
			
			// ADDED - verify password against stored hash
			var validPassword = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
			if(!validPassword) return null;
			
			return GenerateToken(user);
		}
		
		private AuthResponseDto GenerateToken(User user)
		{
			var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
			var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
			
			// Claims are facts baked into token
			var claims = new[]
			{
				new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()), // userId
				new Claim(ClaimTypes.Name, user.Name),
				new Claim(ClaimTypes.Role, user.Role),
			};
			
			var token = new JwtSecurityToken(
				issuer: _config["Jwt:Issuer"],
				audience: _config["Jwt:Audience"],
				expires: DateTime.UtcNow.AddMinutes(
					int.Parse(_config["Jwt:ExpiryMinutes"]!)),
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