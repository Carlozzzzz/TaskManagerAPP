// Application/Validators/TaskValidators.cs
using FluentValidation;
using TaskManagerAPI.DTOs;

namespace TaskManagerAPI.Application.Validators
{
    /// <summary>
    /// Validates task creation requests.
    /// </summary>
    public class CreateTaskValidator : AbstractValidator<CreateTaskDto>
    {
        public CreateTaskValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title is required")
                .MinimumLength(2).WithMessage("Title must be at least 2 characters")
                .MaximumLength(50).WithMessage("Title cannot exceed 50 characters");

            RuleFor(x => x.Description)
                .MaximumLength(200).WithMessage("Description cannot exceed 200 characters");

            RuleFor(x => x.DueDate)
                .NotEmpty().WithMessage("Due date is required")
                .GreaterThan(DateTime.UtcNow).WithMessage("Due date cannot be in the past");
        }
    }

    /// <summary>
    /// Validates task status update requests.
    /// </summary>
    public class UpdateTaskStatusValidator : AbstractValidator<UpdateTaskStatusDto>
    {
        public UpdateTaskStatusValidator()
        {
            RuleFor(x => x.Status)
                .NotEmpty().WithMessage("Status is required")
                .Must(BeValidStatus).WithMessage("Status must be 'todo', 'in-progress', or 'done'");
        }

        private bool BeValidStatus(string status)
        {
            return status == "todo" || status == "in-progress" || status == "done";
        }
    }
}
