using UserTaskManagment.Models.DTOs;

namespace UserTaskManagment.Services.Interfaces;

public interface ITagService
{
    Task<TagDto?> GetByIdAsync(int id);
    Task<IEnumerable<TagDto>> GetAllAsync();
    Task<TagDto> CreateAsync(CreateTagDto createDto);
    Task<TagDto?> UpdateAsync(int id, UpdateTagDto updateDto);
    Task<bool> DeleteAsync(int id);
}