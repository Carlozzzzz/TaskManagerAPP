// API/Extensions/ResponseExtensions.cs
using Microsoft.AspNetCore.Mvc;
using TaskManagerAPI.API.Responses;

namespace TaskManagerAPI.API.Extensions
{
	/// <summary>
	/// Extension methods for standardized API responses.
	/// </summary>
	public static class ResponseExtensions
	{
		/// <summary>
		/// Returns a 200 OK response with data wrapped in ApiResponse
		/// </summary>
		public static ObjectResult SuccessOk<T>(this ControllerBase controller, T? data, string message = "Success")
		{
			return controller.Ok(ApiResponse<T>.SuccessResponse(data, message));
		}

		/// <summary>
		/// Returns a 201 Created response with data wrapped in ApiResponse
		/// </summary>
		public static ObjectResult SuccessCreated<T>(this ControllerBase controller, T? data, string message = "Resource created successfully")
		{
			var response = ApiResponse<T>.SuccessResponse(data, message);
			return controller.StatusCode(StatusCodes.Status201Created, response);
		}

		/// <summary>
		/// Returns a 400 Bad Request response with error message
		/// </summary>
		public static ObjectResult ErrorBadRequest<T>(this ControllerBase controller, string message, Dictionary<string, string[]>? errors = null)
		{
			return controller.BadRequest(ApiResponse<T>.ErrorResponse(message, errors));
		}

		/// <summary>
		/// Returns a 401 Unauthorized response
		/// </summary>
		public static ObjectResult ErrorUnauthorized<T>(this ControllerBase controller, string message = "Unauthorized")
		{
			return controller.Unauthorized(ApiResponse<T>.ErrorResponse(message));
		}

		/// <summary>
		/// Returns a 403 Forbidden response
		/// </summary>
		public static ObjectResult ErrorForbidden<T>(this ControllerBase controller, string message = "Forbidden")
		{
			var response = ApiResponse<T>.ErrorResponse(message);
			return controller.StatusCode(StatusCodes.Status403Forbidden, response);
		}

		/// <summary>
		/// Returns a 404 Not Found response
		/// </summary>
		public static ObjectResult ErrorNotFound<T>(this ControllerBase controller, string message = "Resource not found")
		{
			return controller.NotFound(ApiResponse<T>.ErrorResponse(message));
		}

		/// <summary>
		/// Returns a 409 Conflict response
		/// </summary>
		public static ObjectResult ErrorConflict<T>(this ControllerBase controller, string message = "Resource already exists")
		{
			var response = ApiResponse<T>.ErrorResponse(message);
			return controller.StatusCode(StatusCodes.Status409Conflict, response);
		}

		/// <summary>
		/// Returns a 500 Internal Server Error response
		/// </summary>
		public static ObjectResult ErrorInternalServerError<T>(this ControllerBase controller, string message = "An unexpected error occurred")
		{
			var response = ApiResponse<T>.ErrorResponse(message);
			return controller.StatusCode(StatusCodes.Status500InternalServerError, response);
		}
	}
}
