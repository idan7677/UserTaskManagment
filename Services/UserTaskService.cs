using AutoMapper;
using UserTaskManagment.Data;
using UserTaskManagment.Models.Domain;
using UserTaskManagment.Models.DTOs;
using UserTaskManagment.Services.Interfaces;

namespace UserTaskManagment.Services;

public class UserTaskService : IUserTaskService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ILogger<UserTaskService> _logger;

    public UserTaskService(IUnitOfWork unitOfWork, IMapper mapper, ILogger<UserTaskService> logger)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<UserTaskResponseDto?> GetByIdAsync(int id)
    {
        var task = await _unitOfWork.UserTasks.GetByIdAsync(id);
        return task == null ? null : _mapper.Map<UserTaskResponseDto>(task);
    }

    public async Task<IEnumerable<UserTaskResponseDto>> GetAllAsync()
    {
        var tasks = await _unitOfWork.UserTasks.GetAllAsync();
        return _mapper.Map<IEnumerable<UserTaskResponseDto>>(tasks);
    }

    public async Task<UserTaskResponseDto> CreateAsync(CreateUserTaskDto createDto)
    {
        try
        {
            await _unitOfWork.BeginTransactionAsync();

            var task = _mapper.Map<UserTask>(createDto);
            task.CreatedAt = DateTime.UtcNow;
            task.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.UserTasks.AddAsync(task);
            await _unitOfWork.SaveChangesAsync();

            if (createDto.TagIds.Any())
            {
                var tags = await _unitOfWork.Tags.GetTagsByIdsAsync(createDto.TagIds);
                foreach (var tag in tags)
                {
                    task.UserTaskTags.Add(new UserTaskTag { UserTaskId = task.Id, TagId = tag.Id });
                }
                await _unitOfWork.SaveChangesAsync();
            }

            await _unitOfWork.CommitTransactionAsync();

            var createdTask = await _unitOfWork.UserTasks.GetByIdAsync(task.Id);
            return _mapper.Map<UserTaskResponseDto>(createdTask);
        }
        catch (Exception ex)
        {
            await _unitOfWork.RollbackTransactionAsync();
            _logger.LogError(ex, "Error creating task");
            throw;
        }
    }

    public async Task<UserTaskResponseDto?> UpdateAsync(int id, UpdateUserTaskDto updateDto)
    {
        try
        {
            await _unitOfWork.BeginTransactionAsync();

            var existingTask = await _unitOfWork.UserTasks.GetByIdAsync(id);
            if (existingTask == null)
                return null;

            _mapper.Map(updateDto, existingTask);
            existingTask.UpdatedAt = DateTime.UtcNow;

            // Update tags
            existingTask.UserTaskTags.Clear();
            if (updateDto.TagIds.Any())
            {
                var tags = await _unitOfWork.Tags.GetTagsByIdsAsync(updateDto.TagIds);
                foreach (var tag in tags)
                {
                    existingTask.UserTaskTags.Add(new UserTaskTag { UserTaskId = existingTask.Id, TagId = tag.Id });
                }
            }

            await _unitOfWork.UserTasks.UpdateAsync(existingTask);
            await _unitOfWork.SaveChangesAsync();
            await _unitOfWork.CommitTransactionAsync();

            var updatedTask = await _unitOfWork.UserTasks.GetByIdAsync(id);
            return _mapper.Map<UserTaskResponseDto>(updatedTask);
        }
        catch (Exception ex)
        {
            await _unitOfWork.RollbackTransactionAsync();
            _logger.LogError(ex, "Error updating task {TaskId}", id);
            throw;
        }
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var task = await _unitOfWork.UserTasks.GetByIdAsync(id);
        if (task == null)
            return false;

        await _unitOfWork.UserTasks.DeleteAsync(task);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<UserTaskResponseDto>> GetTasksWithAtLeastTwoTagsAsync()
    {
        var tasks = await _unitOfWork.UserTasks.GetTasksWithAtLeastTwoTagsAsync();
        return _mapper.Map<IEnumerable<UserTaskResponseDto>>(tasks);
    }
}