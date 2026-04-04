// API/Middleware/ValidationMiddleware.cs
using FluentValidation;
using System.Net;
using System.Text.Json;
using TaskManagerAPI.API.Responses;

namespace TaskManagerAPI.API.Middleware
{
    /// <summary>
    /// Middleware for centralizing validation error handling.
    /// Catches validation exceptions and returns structured error responses.
    /// </summary>
    public class ValidationMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ValidationMiddleware> _logger;

        public ValidationMiddleware(RequestDelegate next, ILogger<ValidationMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (ValidationException ex)
            {
                _logger.LogWarning("Validation error: {Message}", ex.Message);
                await HandleValidationException(context, ex);
            }
        }

        private static Task HandleValidationException(HttpContext context, ValidationException exception)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.BadRequest;

            var errors = exception.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(e => e.ErrorMessage).ToArray()
                );

            // UPDATED: Use ApiResponse wrapper (Phase 2D)
            var response = ApiResponse<object>.ErrorResponse(
                "One or more validation errors occurred",
                errors
            );

            return context.Response.WriteAsJsonAsync(response);
        }
    }
}
