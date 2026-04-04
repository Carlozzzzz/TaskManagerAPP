// API/Responses/ApiResponse.cs
namespace TaskManagerAPI.API.Responses
{
	/// <summary>
	/// Standard API response wrapper for all endpoints.
	/// Provides consistency across success and error responses.
	/// </summary>
	public class ApiResponse<T>
	{
		public bool Success { get; set; }
		public required string Message { get; set; }
		public T? Data { get; set; }
		public Dictionary<string, string[]>? Errors { get; set; }

		/// <summary>
		/// Create a successful response
		/// </summary>
		public static ApiResponse<T> SuccessResponse(T? data, string message = "Success")
		{
			return new ApiResponse<T>
			{
				Success = true,
				Message = message,
				Data = data,
				Errors = null
			};
		}

		/// <summary>
		/// Create an error response
		/// </summary>
		public static ApiResponse<T> ErrorResponse(string message, Dictionary<string, string[]>? errors = null)
		{
			return new ApiResponse<T>
			{
				Success = false,
				Message = message,
				Data = default,
				Errors = errors
			};
		}
	}
}
