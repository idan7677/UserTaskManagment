using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.EntityFrameworkCore;
using Serilog;
using System.Text.Json.Serialization;
using UserTaskManagment.Data;
using UserTaskManagment.Data.Repositories;
using UserTaskManagment.Infrastructure.Messaging;
using UserTaskManagment.Mappings;
using UserTaskManagment.Services;
using UserTaskManagment.Services.BackgroundServices;
using UserTaskManagment.Services.Interfaces;

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("logs/log-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

var builder = WebApplication.CreateBuilder(args);

// Add Serilog
builder.Host.UseSerilog();

// Add services to the container.
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy =>
        {
            policy
             .AllowAnyOrigin()
             .AllowAnyHeader()
             .AllowAnyMethod();
        });
});

// Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Repositories and Unit of Work
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IUserTaskRepository, UserTaskRepository>();
builder.Services.AddScoped<ITagRepository, TagRepository>();

// Services
builder.Services.AddScoped<IUserTaskService, UserTaskService>();
builder.Services.AddScoped<ITagService, TagService>();

// Infrastructure (RabbitMQ - optional)
builder.Services.AddSingleton<IRabbitMQService>(provider =>
{
    var logger = provider.GetRequiredService<ILogger<RabbitMQService>>();
    try
    {
        var service = new RabbitMQService(provider.GetRequiredService<IConfiguration>(), logger);
        logger.LogInformation("RabbitMQ service initialized successfully");
        return service;
    }
    catch (Exception ex)
    {
        logger.LogWarning(ex, "RabbitMQ is not available. Using null implementation.");
        return new NullRabbitMQService();
    }
});

// AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfile));

// Background Services
builder.Services.AddHostedService<TaskReminderService>();

// Controllers
builder.Services.AddControllers()
    .AddJsonOptions(o =>
        o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

// FluentValidation
builder.Services.AddFluentValidationAutoValidation()
    .AddFluentValidationClientsideAdapters()
    .AddValidatorsFromAssemblyContaining<Program>();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Initialize database
try
{
    var logger = app.Services.GetRequiredService<ILogger<Program>>();
    await DatabaseInitializer.InitializeAsync(app.Services, logger);
}
catch (Exception ex)
{
    var logger = app.Services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "Failed to initialize database. Application will continue but may not function properly.");
}

app.UseHttpsRedirection();

app.UseCors(MyAllowSpecificOrigins);

app.UseAuthorization();

app.MapControllers();

app.Run();

Log.CloseAndFlush();
