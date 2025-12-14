# User Task Management System


## Features

- **Task Management**: Create, read, update, and delete tasks with full user details
- **Tag System**: N:N relationship between tasks and tags for better organization
- **Priority System**: Low, Medium, High, and Critical priority levels
- **Validation**: Comprehensive validation on all fields
- **Background Service**: Monitors overdue tasks and sends reminders via RabbitMQ
- **RESTful API**: Clean API design with proper HTTP status codes
- **Microservices Architecture**: Modular design with separation of concerns

## Architecture

### Backend (.NET Core 9)
- **Controllers**: RESTful API endpoints
- **Services**: Business logic layer with interfaces
- **Repositories**: Data access layer with Unit of Work pattern
- **Domain Models**: Entity classes with proper relationships
- **DTOs**: Data transfer objects for API communication
- **AutoMapper**: Object-to-object mapping
- **Entity Framework**: ORM for database operations
- **Background Services**: Task monitoring and reminder system
- **RabbitMQ**: Message queuing for task reminders

### Database Schema
- **UserTasks**: Main task entity with user details
- **Tags**: Tag definitions
- **UserTaskTags**: Junction table for N:N relationship

## Prerequisites

- .NET 9.0 SDK
- SQL Server or SQL Server LocalDB
- RabbitMQ Server
- Visual Studio 2022 or VS Code

## Setup Instructions

### 1. Prerequisites
- .NET 9.0 SDK
- SQL Server or SQL Server LocalDB
- RabbitMQ Server (optional for full functionality)
- Visual Studio 2022 or VS Code

### 2. Database Setup
The application uses SQL Server LocalDB by default. The database will be created automatically on first run with sample data.

To use a different SQL Server instance, update the connection string in `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Your SQL Server connection string here"
  }
}
```

### 3. RabbitMQ Setup (Optional)
For the background service and task reminders to work, install RabbitMQ server:

**Windows:**
1. Download and install Erlang from https://www.erlang.org/downloads
2. Download and install RabbitMQ from https://www.rabbitmq.com/download.html
3. Start RabbitMQ service

**Docker (Alternative):**
```bash
docker run -d --hostname rabbitmq --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

Update RabbitMQ configuration in `appsettings.json` if needed:
```json
{
  "ConnectionStrings": {
    "RabbitMQ": "localhost"
  },
  "RabbitMQ": {
    "Username": "guest",
    "Password": "guest"
  }
}
```

### 4. Running the Application
```bash
# Navigate to the project directory
cd UserTaskManagment

# Restore packages
dotnet restore

# Build the application
dotnet build

# Run the application
dotnet run
```

The API will be available at:
- HTTPS: `https://localhost:7000`
- HTTP: `http://localhost:5000`
- OpenAPI/Swagger: `https://localhost:7000/openapi/v1.json`

### 5. Testing the API
Use the provided `test-api.http` file with VS Code REST Client extension or any HTTP client like Postman.

## API Endpoints

### Tasks
- `GET /api/usertasks` - Get all tasks
- `GET /api/usertasks/{id}` - Get task by ID
- `POST /api/usertasks` - Create new task
- `PUT /api/usertasks/{id}` - Update task
- `DELETE /api/usertasks/{id}` - Delete task
- `GET /api/usertasks/with-multiple-tags` - Get tasks with at least 2 tags

### Tags
- `GET /api/tags` - Get all tags
- `GET /api/tags/{id}` - Get tag by ID
- `POST /api/tags` - Create new tag
- `PUT /api/tags/{id}` - Update tag
- `DELETE /api/tags/{id}` - Delete tag


**Sample Output:**
| Id | Title | TagNames | TagCount |
|----|-------|----------|----------|
| 2 | Fix Login Bug | Bug Fix, Urgent, Work | 3 |
| 1 | Complete Project Documentation | Development, Work | 2 |
| 3 | Team Meeting Preparation | Meeting, Work | 2 |



## Background Service

The `TaskReminderService` runs continuously and:
1. Checks for overdue tasks every 5 minutes
2. Publishes reminder messages to RabbitMQ queue
3. Subscribes to the same queue and logs reminder messages
4. Handles concurrent updates through message queuing

## Error Handling

- Comprehensive exception handling in controllers and services
- Structured logging with Serilog
- Proper HTTP status codes
- Transaction rollback on failures

## Validation

- Data annotations on DTOs
- FluentValidation integration
- Model state validation in controllers
- Business rule validation in services

## Testing

The application is designed for easy testing with:
- Interface-based architecture
- Dependency injection
- Separation of concerns
- Mock-friendly design

## Sample Data

The application includes sample data with:
- 6 predefined tags (Urgent, Work, Personal, Meeting, Development, Bug Fix)
- 3 sample tasks with various tag combinations
- One overdue task for testing the reminder system