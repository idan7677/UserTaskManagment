using FluentValidation;
using UserTaskManagment.Models.DTOs;

namespace UserTaskManagment.Validators;

public class CreateUserTaskDtoValidator : AbstractValidator<CreateUserTaskDto>
{
    public CreateUserTaskDtoValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required")
            .MaximumLength(200).WithMessage("Title cannot exceed 200 characters");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required")
            .MaximumLength(1000).WithMessage("Description cannot exceed 1000 characters");

        RuleFor(x => x.DueDate)
            .NotEmpty().WithMessage("Due date is required")
            .GreaterThan(DateTime.UtcNow.AddMinutes(-1)).WithMessage("Due date must be in the future");

        RuleFor(x => x.Priority)
            .IsInEnum().WithMessage("Invalid priority value");

        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Full name is required")
            .MaximumLength(100).WithMessage("Full name cannot exceed 100 characters");

        RuleFor(x => x.Telephone)
            .NotEmpty().WithMessage("Telephone is required")
            .Matches(@"^(?:\+972|0)(?:[23489]|5\d|7\d)\d{7}$").WithMessage("Invalid telephone format");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format")
            .MaximumLength(100).WithMessage("Email cannot exceed 100 characters");
    }
}