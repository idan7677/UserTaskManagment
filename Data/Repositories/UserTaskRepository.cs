using Microsoft.EntityFrameworkCore;
using UserTaskManagment.Models.Domain;

namespace UserTaskManagment.Data.Repositories;

public class UserTaskRepository : Repository<UserTask>, IUserTaskRepository
{
    public UserTaskRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<UserTask>> GetTasksWithTagsAsync()
    {
        return await _dbSet
            .Include(t => t.UserTaskTags)
            .ThenInclude(tt => tt.Tag)
            .ToListAsync();
    }

    public async Task<IEnumerable<UserTask>> GetTasksWithAtLeastTwoTagsAsync()
    {
        return await _dbSet
            .Include(t => t.UserTaskTags)
            .ThenInclude(tt => tt.Tag)
            .Where(t => t.UserTaskTags.Count >= 2)
            .OrderByDescending(t => t.UserTaskTags.Count)
            .ToListAsync();
    }

    public async Task<IEnumerable<UserTask>> GetOverdueTasksAsync()
    {
        return await _dbSet
            .Where(t => t.DueDate < DateTime.UtcNow)
            .ToListAsync();
    }

    public async Task<UserTask?> GetTaskWithTagsAsync(int id)
    {
        return await _dbSet
            .Include(t => t.UserTaskTags)
            .ThenInclude(tt => tt.Tag)
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public override async Task<UserTask?> GetByIdAsync(int id)
    {
        return await GetTaskWithTagsAsync(id);
    }

    public override async Task<IEnumerable<UserTask>> GetAllAsync()
    {
        return await GetTasksWithTagsAsync();
    }
}