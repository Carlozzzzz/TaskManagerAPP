using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Mvc;
using TaskManagerAPI.Constants;
using TaskManagerAPI.DTOs;
using TaskManagerAPI.Services;

namespace TaskManagerAPI.Controllers
{
	[ApiController]
	[Authorize]
	[Route("api/[controller]")]
	public class UserController : BaseController
	{
		private readonly IUserService _userService;

		public UserController(IUserService userService)
		{
			_userService = userService;
		}

		[HttpGet("users")]
		public async Task<IActionResult> GetAllUsers() => Ok(await _userService.GetAllUsersAsync());

		[HttpPut("{id}")]
        public async Task<ActionResult<UserDto>> Update(int id, [FromBody] UpdateUserDto dto)
        {
            if (id != dto.Id) return BadRequest("ID mismatch between URL and body.");

            var user = await _userService.Update(dto);
            if (user == null) return NotFound();

            return Ok(user);
        }
    }
}