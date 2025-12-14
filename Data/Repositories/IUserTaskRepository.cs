using UserTaskManagment.Models.Domain;

namespace UserTaskManagment.Data.Repositories;

public interface IUserTaskRepository : IRepository<UserTask>
{
    Task<IEnumerable<UserTask>> GetTasksWithTagsAsync();
    Task<IEnumerable<UserTask>> GetTasksWithAtLeastTwoTagsAsync();
    Task<IEnumerable<UserTask>> GetOverdueTasksAsync();
    Task<UserTask?> GetTaskWithTagsAsync(int id);
}