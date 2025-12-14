namespace UserTaskManagment.Infrastructure.Messaging;

public class NullRabbitMQService : IRabbitMQService
{
    public Task PublishAsync<T>(string queueName, T message)
    {
        // No-op implementation when RabbitMQ is not available
        return Task.CompletedTask;
    }

    public Task SubscribeAsync<T>(string queueName, Func<T, Task> handler)
    {
        // No-op implementation when RabbitMQ is not available
        return Task.CompletedTask;
    }

    public void Dispose()
    {
        // No-op implementation
    }
}