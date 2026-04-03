namespace TaskManagerAPI.Services
{
	public interface ICurrentUserService
	{
		int? GetUserId(); // Extracts User ID from the JWT Claims
	}
}