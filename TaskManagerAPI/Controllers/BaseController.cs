// Controllers/BaseController.cs
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace TaskManagerAPI.Controllers
{
	[ApiController]
	public abstract class BaseController : ControllerBase
	{
		protected int GetUserId()
		{
			var claim = User.FindFirstValue(ClaimTypes.NameIdentifier);
			return int.TryParse(claim, out var id) ? id : 0;
		}

		protected string GetUserRole() => User.FindFirstValue(ClaimTypes.Role) ?? string.Empty;
	}
}