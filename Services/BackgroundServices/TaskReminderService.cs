using UserTaskManagment.Data;
using UserTaskManagment.Infrastructure.Messaging;

namespace UserTaskManagment.Services.BackgroundServices;

public class TaskReminderService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly IRabbitMQService _rabbitMQService;
    private readonly ILogger<TaskReminderService> _logger;
    private readonly TimeSpan _checkInterval = TimeSpan.FromMinutes(5); // Check every 5 minutes

    public TaskReminderService(
        IServiceProvider serviceProvider,
        IRabbitMQService rabbitMQService,
        ILogger<TaskReminderService> logger)
    {
        _serviceProvider = serviceProvider;
        _rabbitMQService = rabbitMQService;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // Start the reminder message consumer
        _ = Task.Run(async () => await StartReminderConsumer(stoppingToken), stoppingToken);

        // Main loop to check for overdue tasks
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await CheckOverdueTasks();
                await Task.Delay(_checkInterval, stoppingToken);
            }
            catch (OperationCanceledException)
            {
                // Expected when cancellation is requested during shutdown
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in TaskReminderService execution");
                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken); // Wait before retrying
            }
        }
    }

    private async Task CheckOverdueTasks()
    {
        using var scope = _serviceProvider.CreateScope();
        var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();

        try
        {
            var overdueTasks = await unitOfWork.UserTasks.GetOverdueTasksAsync();
            _logger.LogInformation("Found {Count} overdue tasks to process", overdueTasks.Count());
            
            foreach (var task in overdueTasks)
            {
                var reminderMessage = new TaskReminderMessage
                {
                    TaskId = task.Id,
                    Title = task.Title,
                    FullName = task.FullName,
                    Email = task.Email,
                    DueDate = task.DueDate
                };

                // Insert into queue for concurrent handling
                await _rabbitMQService.PublishAsync("task-reminders", reminderMessage);
                _logger.LogInformation("Reminder inserted into queue for overdue task {TaskId}: {Title}", task.Id, task.Title);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking overdue tasks");
        }
    }

    private async Task StartReminderConsumer(CancellationToken cancellationToken)
    {
        try
        {
            await _rabbitMQService.SubscribeAsync<TaskReminderMessage>("task-reminders", async (message) =>
            {
                if (!cancellationToken.IsCancellationRequested)
                {
                    // Log exactly as requested: "Hi your Task is due {Task xxxxx}"
                    _logger.LogInformation("Hi your Task is due Task {Title}", message.Title);
                    
                    // Handle concurrent updates by processing each message independently
                    await ProcessReminderMessage(message);
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error starting reminder consumer");
        }
    }

    private async Task ProcessReminderMessage(TaskReminderMessage message)
    {
        try
        {
            // Additional processing can be added here (emails, notifications, etc.)
            // Each message is processed independently for concurrent handling
            _logger.LogInformation("Processed reminder for Task {TaskId} - {Title} (Due: {DueDate})", 
                message.TaskId, message.Title, message.DueDate);
            
            await Task.CompletedTask;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing reminder message for Task {TaskId}", message.TaskId);
            throw; // Re-throw to trigger message requeue in RabbitMQ
        }
    }
}