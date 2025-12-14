using Microsoft.EntityFrameworkCore;
using UserTaskManagment.Models.Domain;

namespace UserTaskManagment.Data.Repositories;

public class TagRepository : Repository<Tag>, ITagRepository
{
    public TagRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Tag?> GetByNameAsync(string name)
    {
        return await _dbSet.FirstOrDefaultAsync(t => t.Name == name);
    }

    public async Task<IEnumerable<Tag>> GetTagsByIdsAsync(IEnumerable<int> ids)
    {
        return await _dbSet.Where(t => ids.Contains(t.Id)).ToListAsync();
    }
}