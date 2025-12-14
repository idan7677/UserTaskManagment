using UserTaskManagment.Models.Domain;

namespace UserTaskManagment.Data.Repositories;

public interface ITagRepository : IRepository<Tag>
{
    Task<Tag?> GetByNameAsync(string name);
    Task<IEnumerable<Tag>> GetTagsByIdsAsync(IEnumerable<int> ids);
}