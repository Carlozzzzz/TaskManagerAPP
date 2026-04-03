// API/Extensions/ValidationExtensions.cs
using FluentValidation;
using TaskManagerAPI.DTOs;
using TaskManagerAPI.Application.Validators;

namespace TaskManagerAPI.API.Extensions
{
    /// <summary>
    /// Extension methods for validation in controllers.
    /// </summary>
    public static class ValidationExtensions
    {
        private static readonly IValidator<RegisterDto> _registerValidator = new RegisterValidator();
        private static readonly IValidator<LoginDto> _loginValidator = new LoginValidator();
        private static readonly IValidator<CreateTaskDto> _createTaskValidator = new CreateTaskValidator();
        private static readonly IValidator<UpdateTaskStatusDto> _updateTaskStatusValidator = new UpdateTaskStatusValidator();

        /// <summary>
        /// Validates the DTO and throws ValidationException if invalid.
        /// </summary>
        public static async Task ValidateAsync<T>(this T dto, IValidator<T> validator) where T : class
        {
            var result = await validator.ValidateAsync(dto);
            if (!result.IsValid)
                throw new ValidationException(result.Errors);
        }

        /// <summary>
        /// Validate RegisterDto
        /// </summary>
        public static async Task ValidateRegisterAsync(this RegisterDto dto)
        {
            await dto.ValidateAsync(_registerValidator);
        }

        /// <summary>
        /// Validate LoginDto
        /// </summary>
        public static async Task ValidateLoginAsync(this LoginDto dto)
        {
            await dto.ValidateAsync(_loginValidator);
        }

        /// <summary>
        /// Validate CreateTaskDto
        /// </summary>
        public static async Task ValidateCreateTaskAsync(this CreateTaskDto dto)
        {
            await dto.ValidateAsync(_createTaskValidator);
        }

        /// <summary>
        /// Validate UpdateTaskStatusDto
        /// </summary>
        public static async Task ValidateUpdateTaskStatusAsync(this UpdateTaskStatusDto dto)
        {
            await dto.ValidateAsync(_updateTaskStatusValidator);
        }
    }
}
