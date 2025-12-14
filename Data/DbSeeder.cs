using UserTaskManagment.Models.Domain;

namespace UserTaskManagment.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        if (context.Tags.Any() || context.UserTasks.Any())
            return; // Database already seeded

        // Create sample tags
        var tags = new List<Tag>
        {
            new() { Name = "Urgent", Description = "High priority tasks" },
            new() { Name = "Work", Description = "Work related tasks" },
            new() { Name = "Personal", Description = "Personal tasks" },
            new() { Name = "Meeting", Description = "Meeting related tasks" },
            new() { Name = "Development", Description = "Software development tasks" },
            new() { Name = "Bug Fix", Description = "Bug fixing tasks" }
        };

        context.Tags.AddRange(tags);
        await context.SaveChangesAsync();

        // Create sample tasks
        var tasks = new List<UserTask>
        {
            new()
            {
                Title = "Complete Project Documentation",
                Description = "Finish writing the technical documentation for the new project",
                DueDate = DateTime.UtcNow.AddDays(7),
                Priority = TaskPriority.High,
                FullName = "John Doe",
                Telephone = "+1-555-0123",
                Email = "john.doe@example.com"
            },
            new()
            {
                Title = "Fix Login Bug",
                Description = "Resolve the authentication issue in the login module",
                DueDate = DateTime.UtcNow.AddDays(-2), // Overdue task
                Priority = TaskPriority.Critical,
                FullName = "Jane Smith",
                Telephone = "+1-555-0124",
                Email = "jane.smith@example.com"
            },
            new()
            {
                Title = "Team Meeting Preparation",
                Description = "Prepare agenda and materials for the weekly team meeting",
                DueDate = DateTime.UtcNow.AddDays(2),
                Priority = TaskPriority.Medium,
                FullName = "Bob Johnson",
                Telephone = "+1-555-0125",
                Email = "bob.johnson@example.com"
            }
        };

        context.UserTasks.AddRange(tasks);
        await context.SaveChangesAsync();

        // Add tags to tasks
        var taskTagRelations = new List<UserTaskTag>
        {
            // Task 1: Work + Development
            new() { UserTaskId = tasks[0].Id, TagId = tags[1].Id },
            new() { UserTaskId = tasks[0].Id, TagId = tags[4].Id },
            
            // Task 2: Urgent + Work + Bug Fix
            new() { UserTaskId = tasks[1].Id, TagId = tags[0].Id },
            new() { UserTaskId = tasks[1].Id, TagId = tags[1].Id },
            new() { UserTaskId = tasks[1].Id, TagId = tags[5].Id },
            
            // Task 3: Work + Meeting
            new() { UserTaskId = tasks[2].Id, TagId = tags[1].Id },
            new() { UserTaskId = tasks[2].Id, TagId = tags[3].Id }
        };

        context.UserTaskTags.AddRange(taskTagRelations);
        await context.SaveChangesAsync();
    }
}