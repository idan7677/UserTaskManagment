using FluentValidation;
using UserTaskManagment.Models.DTOs;

namespace UserTaskManagment.Validators;

public class CreateTagDtoValidator : AbstractValidator<CreateTagDto>
{
    public CreateTagDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Tag name is required")
            .MaximumLength(50).WithMessage("Tag name cannot exceed 50 characters");
    }
}