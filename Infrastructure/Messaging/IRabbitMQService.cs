namespace UserTaskManagment.Infrastructure.Messaging;

public interface IRabbitMQService
{
    Task PublishAsync<T>(string queueName, T message);
    Task SubscribeAsync<T>(string queueName, Func<T, Task> handler);
    void Dispose();
}