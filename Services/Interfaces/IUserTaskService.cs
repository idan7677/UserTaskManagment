using UserTaskManagment.Models.DTOs;

namespace UserTaskManagment.Services.Interfaces;

public interface IUserTaskService
{
    Task<UserTaskResponseDto?> GetByIdAsync(int id);
    Task<IEnumerable<UserTaskResponseDto>> GetAllAsync();
    Task<UserTaskResponseDto> CreateAsync(CreateUserTaskDto createDto);
    Task<UserTaskResponseDto?> UpdateAsync(int id, UpdateUserTaskDto updateDto);
    Task<bool> DeleteAsync(int id);
    Task<IEnumerable<UserTaskResponseDto>> GetTasksWithAtLeastTwoTagsAsync();
}