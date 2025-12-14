using System.ComponentModel.DataAnnotations;

namespace UserTaskManagment.Models.DTOs;

public class CreateTagDto
{
    [Required]
    [StringLength(50)]
    public string Name { get; set; } = string.Empty;
}

public class UpdateTagDto
{
    [Required]
    [StringLength(50)]
    public string Name { get; set; } = string.Empty;
}

public class TagDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}