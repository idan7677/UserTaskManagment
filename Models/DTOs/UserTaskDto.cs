using System.ComponentModel.DataAnnotations;
using UserTaskManagment.Models.Domain;

namespace UserTaskManagment.Models.DTOs;

public class CreateUserTaskDto
{
    [Required]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;
    
    [Required]
    [StringLength(1000)]
    public string Description { get; set; } = string.Empty;
    
    [Required]
    public DateTime DueDate { get; set; }
    
    [Required]
    public TaskPriority Priority { get; set; }
    
    [Required]
    [StringLength(100)]
    public string FullName { get; set; } = string.Empty;
    
    [Required]
    [StringLength(20)]
    [Phone]
    public string Telephone { get; set; } = string.Empty;
    
    [Required]
    [StringLength(100)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    public List<int> TagIds { get; set; } = new();
}

public class UpdateUserTaskDto
{
    [Required]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;
    
    [Required]
    [StringLength(1000)]
    public string Description { get; set; } = string.Empty;
    
    [Required]
    public DateTime DueDate { get; set; }
    
    [Required]
    public TaskPriority Priority { get; set; }
    
    [Required]
    [StringLength(100)]
    public string FullName { get; set; } = string.Empty;
    
    [Required]
    [StringLength(20)]
    [Phone]
    public string Telephone { get; set; } = string.Empty;
    
    [Required]
    [StringLength(100)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    public List<int> TagIds { get; set; } = new();
}

public class UserTaskResponseDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime DueDate { get; set; }
    public TaskPriority Priority { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Telephone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<TagDto> Tags { get; set; } = new();
}