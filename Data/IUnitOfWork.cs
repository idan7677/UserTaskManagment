using UserTaskManagment.Data.Repositories;

namespace UserTaskManagment.Data;

public interface IUnitOfWork : IDisposable
{
    IUserTaskRepository UserTasks { get; }
    ITagRepository Tags { get; }
    Task<int> SaveChangesAsync();
    Task BeginTransactionAsync();
    Task CommitTransactionAsync();
    Task RollbackTransactionAsync();
}