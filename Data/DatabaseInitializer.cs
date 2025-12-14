using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;

namespace UserTaskManagment.Data;

public static class DatabaseInitializer
{
    public static async Task InitializeAsync(IServiceProvider serviceProvider, ILogger logger)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        
        try
        {
            // Check if database exists and create if it doesn't
            var canConnect = await context.Database.CanConnectAsync();
            
            if (!canConnect)
            {
                logger.LogInformation("Database does not exist. Creating database...");
                await context.Database.EnsureCreatedAsync();
                logger.LogInformation("Database created successfully.");
            }
            else
            {
                logger.LogInformation("Database already exists.");
            }
            
            // Seed the database
            await DbSeeder.SeedAsync(context);
            logger.LogInformation("Database initialization completed successfully.");
        }
        catch (SqlException sqlEx) when (sqlEx.Number == 2) // Cannot open database
        {
            logger.LogWarning("Database connection failed. Attempting to create database...");
            
            try
            {
                // Try to create the database using master connection
                await CreateDatabaseIfNotExistsAsync(context, logger);
                await context.Database.EnsureCreatedAsync();
                await DbSeeder.SeedAsync(context);
                logger.LogInformation("Database created and initialized successfully.");
            }
            catch (Exception createEx)
            {
                logger.LogError(createEx, "Failed to create database. Please ensure SQL Server is running and accessible.");
                throw;
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred during database initialization.");
            throw;
        }
    }
    
    private static async Task CreateDatabaseIfNotExistsAsync(ApplicationDbContext context, ILogger logger)
    {
        var connectionString = context.Database.GetConnectionString();
        var builder = new SqlConnectionStringBuilder(connectionString);
        var databaseName = builder.InitialCatalog;
        
        // Connect to master database to create the target database
        builder.InitialCatalog = "master";
        var masterConnectionString = builder.ConnectionString;
        
        using var connection = new SqlConnection(masterConnectionString);
        await connection.OpenAsync();
        
        // Check if database exists
        var checkDbCommand = new SqlCommand($"SELECT COUNT(*) FROM sys.databases WHERE name = '{databaseName}'", connection);
        var dbExists = (int)await checkDbCommand.ExecuteScalarAsync() > 0;
        
        if (!dbExists)
        {
            logger.LogInformation($"Creating database '{databaseName}'...");
            var createDbCommand = new SqlCommand($"CREATE DATABASE [{databaseName}]", connection);
            await createDbCommand.ExecuteNonQueryAsync();
            logger.LogInformation($"Database '{databaseName}' created successfully.");
        }
        else
        {
            logger.LogInformation($"Database '{databaseName}' already exists.");
        }
    }
}