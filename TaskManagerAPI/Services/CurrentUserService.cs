using System.Security.Claims;

namespace TaskManagerAPI.Services
{

	public class CurrentUserService : ICurrentUserService
	{
		private readonly IHttpContextAccessor _httpContextAccessor;

		public CurrentUserService(IHttpContextAccessor httpContextAccessor)
		{
			_httpContextAccessor = httpContextAccessor;
		}

		public int? GetUserId()
		{
			var userId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
			return userId != null ? int.Parse(userId) : null;
		}
	}
}