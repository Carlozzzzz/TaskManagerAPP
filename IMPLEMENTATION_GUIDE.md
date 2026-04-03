# Implementation Guide - Code Examples

## Quick-Win Code Patterns (Copy & Adapt)

---

## 1. REPOSITORY PATTERN

### Step 1: Define Interface
```csharp
// Core/Interfaces/IRepository.cs
public interface IRepository<T> where T : class
{
    Task<T?> GetByIdAsync(int id);
    Task<List<T>> GetAllAsync();
    Task<List<T>> GetAsync(Expression<Func<T, bool>> predicate);
    Task<T?> GetSingleAsync(Expression<Func<T, bool>> predicate);
    Task AddAsync(T entity);
    void Update(T entity);
    void Delete(T entity);
    Task SaveChangesAsync();
}
```

### Step 2: Implement Base Repository
```csharp
// Infrastructure/Data/Repositories/BaseRepository.cs
public class BaseRepository<T> : IRepository<T> where T : class
{
    protected readonly AppDbContext _context;

    public BaseRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<T?> GetByIdAsync(int id)
    {
        return await _context.Set<T>().FindAsync(id);
    }

    public async Task<List<T>> GetAllAsync()
    {
        return await _context.Set<T>().AsNoTracking().ToListAsync();
    }

    public async Task<List<T>> GetAsync(Expression<Func<T, bool>> predicate)
    {
        return await _context.Set<T>()
            .AsNoTracking()
            .Where(predicate)
            .ToListAsync();
    }

    public async Task<T?> GetSingleAsync(Expression<Func<T, bool>> predicate)
    {
        return await _context.Set<T>()
            .AsNoTracking()
            .FirstOrDefaultAsync(predicate);
    }

    public async Task AddAsync(T entity)
    {
        await _context.Set<T>().AddAsync(entity);
    }

    public void Update(T entity)
    {
        _context.Set<T>().Update(entity);
    }

    public void Delete(T entity)
    {
        _context.Set<T>().Remove(entity);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
```

### Step 3: Create Specific Repository (if needed)
```csharp
// Infrastructure/Data/Repositories/TaskRepository.cs
public interface ITaskRepository : IRepository<TaskItem>
{
    Task<List<TaskItem>> GetUserTasksAsync(int userId, string? status = null);
    Task<List<TaskItem>> GetOverdueTasksAsync();
}

public class TaskRepository : BaseRepository<TaskItem>, ITaskRepository
{
    public TaskRepository(AppDbContext context) : base(context) { }

    public async Task<List<TaskItem>> GetUserTasksAsync(int userId, string? status = null)
    {
        var query = _context.Tasks.AsNoTracking().Where(t => t.UserId == userId);
        if (!string.IsNullOrEmpty(status))
            query = query.Where(t => t.Status == status);
        return await query.ToListAsync();
    }

    public async Task<List<TaskItem>> GetOverdueTasksAsync()
    {
        return await _context.Tasks
            .AsNoTracking()
            .Where(t => t.DueDate < DateTime.UtcNow && t.Status != "done")
            .ToListAsync();
    }
}
```

### Step 4: Update Dependency Injection
```csharp
// Program.cs
builder.Services.AddScoped<ITaskRepository, TaskRepository>();
builder.Services.AddScoped(typeof(IRepository<>), typeof(BaseRepository<>));
```

### Step 5: Use in Service
```csharp
// Services/TaskService.cs
public class TaskService : ITaskService
{
    private readonly ITaskRepository _taskRepository;

    public TaskService(ITaskRepository taskRepository)
    {
        _taskRepository = taskRepository;
    }

    public async Task<List<TaskDto>> GetUserTasksAsync(int userId)
    {
        var tasks = await _taskRepository.GetUserTasksAsync(userId);
        return tasks.Select(t => MapToDto(t)).ToList();
    }
}
```

---

## 2. INPUT VALIDATION (FluentValidation)

### Step 1: Install NuGet
```
dotnet add package FluentValidation
```

### Step 2: Create Validators
```csharp
// Application/Validators/CreateTaskValidator.cs
public class CreateTaskValidator : AbstractValidator<CreateTaskDto>
{
    public CreateTaskValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required")
            .Length(2, 50).WithMessage("Title must be between 2 and 50 characters");

        RuleFor(x => x.Description)
            .MaximumLength(200).WithMessage("Description cannot exceed 200 characters");

        RuleFor(x => x.DueDate)
            .NotEmpty().WithMessage("Due date is required")
            .GreaterThan(DateTime.UtcNow).WithMessage("Due date cannot be in the past");
    }
}

public class RegisterValidator : AbstractValidator<RegisterDto>
{
    public RegisterValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Email must be valid");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required")
            .MinimumLength(6).WithMessage("Password must be at least 6 characters");
    }
}
```

### Step 3: Register Validators in DI
```csharp
// Program.cs
builder.Services.AddValidatorsFromAssemblyContaining(typeof(CreateTaskValidator));
```

### Step 4: Use in Controller
```csharp
// Controllers/TasksController.cs
[HttpPost]
public async Task<ActionResult<TaskDto>> Create([FromBody] CreateTaskDto dto)
{
    var validator = new CreateTaskValidator();
    var result = await validator.ValidateAsync(dto);

    if (!result.IsValid)
        return BadRequest(new { errors = result.Errors.Select(e => e.ErrorMessage) });

    var created = await _taskService.CreateTaskAsync(dto, GetUserId());
    return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
}
```

---

## 3. STRUCTURED LOGGING (Serilog)

### Step 1: Install NuGet
```
dotnet add package Serilog
dotnet add package Serilog.AspNetCore
dotnet add package Serilog.Sinks.File
dotnet add package Serilog.Sinks.Console
```

### Step 2: Configure in Program.cs
```csharp
// Program.cs
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.Console()
    .WriteTo.File(
        path: "logs/app-.txt",
        rollingInterval: RollingInterval.Day,
        retainedFileCountLimit: 30,
        outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level}] {Message:lj}{NewLine}{Exception}")
    .Enrich.FromLogContext()
    .Enrich.WithProperty("Application", "TaskManagerAPI")
    .CreateLogger();

builder.Host.UseSerilog();

try
{
    Log.Information("Application starting...");
    // ... rest of config
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    await Log.CloseAndFlushAsync();
}
```

### Step 3: Use Logging in Services
```csharp
// Services/TaskService.cs
public class TaskService : ITaskService
{
    private readonly ITaskRepository _taskRepository;
    private readonly ILogger<TaskService> _logger;

    public TaskService(ITaskRepository taskRepository, ILogger<TaskService> logger)
    {
        _taskRepository = taskRepository;
        _logger = logger;
    }

    public async Task<TaskDto?> CreateTaskAsync(CreateTaskDto dto, int userId)
    {
        _logger.LogInformation("Creating task for user {UserId}: {TaskTitle}", userId, dto.Title);

        try
        {
            var newTask = new TaskItem { /* ... */ };
            await _taskRepository.AddAsync(newTask);
            await _taskRepository.SaveChangesAsync();

            _logger.LogInformation("Task created successfully: {TaskId}", newTask.Id);
            return MapToDto(newTask);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating task for user {UserId}", userId);
            throw;
        }
    }
}
```

---

## 4. STANDARDIZED API RESPONSE

### Step 1: Create Response Wrapper
```csharp
// Application/DTOs/Response/ApiResponse.cs
public class ApiResponse<T>
{
    public bool Success { get; set; }
    public T? Data { get; set; }
    public string Message { get; set; } = string.Empty;
    public List<string> Errors { get; set; } = new();
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    public static ApiResponse<T> SuccessResponse(T data, string message = "Success")
    {
        return new ApiResponse<T>
        {
            Success = true,
            Data = data,
            Message = message
        };
    }

    public static ApiResponse<T> ErrorResponse(string message, List<string>? errors = null)
    {
        return new ApiResponse<T>
        {
            Success = false,
            Message = message,
            Errors = errors ?? new()
        };
    }
}

public class PaginatedResponse<T>
{
    public List<T> Items { get; set; } = new();
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int Total { get; set; }
    public int TotalPages => (Total + PageSize - 1) / PageSize;
}
```

### Step 2: Use in Controller
```csharp
// Controllers/TasksController.cs
[HttpGet]
public async Task<ActionResult<ApiResponse<List<TaskDto>>>> GetAll()
{
    try
    {
        var tasks = await _taskService.GetAllTasksAsync(GetUserId());
        return Ok(ApiResponse<List<TaskDto>>.SuccessResponse(tasks, "Tasks retrieved successfully"));
    }
    catch (Exception ex)
    {
        return StatusCode(500, ApiResponse<List<TaskDto>>.ErrorResponse("An error occurred", new { ex.Message }));
    }
}
```

---

## 5. ERROR BOUNDARY (React Frontend)

### Step 1: Create Error Boundary Component
```jsx
// src/features/common/components/shared/ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log to error reporting service (e.g., Sentry)
    console.error('Error Boundary caught:', error, errorInfo);
    // Example: reportToSentry(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-red-100 p-3">
                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h2 className="text-center text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
            <p className="text-center text-gray-600 mb-6">
              We're sorry for the inconvenience. The application encountered an unexpected error.
            </p>
            {process.env.NODE_ENV === 'development' && (
              <details className="mb-6 rounded bg-red-50 p-3 text-sm text-red-800">
                <summary className="cursor-pointer font-semibold">Error Details</summary>
                <pre className="mt-2 overflow-auto text-xs">
                  {this.state.error?.toString()}
                  {'\n\n'}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            <button
              onClick={this.handleReset}
              className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.replace('/tasks')}
              className="mt-2 w-full rounded bg-gray-200 py-2 text-gray-900 hover:bg-gray-300"
            >
              Go to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### Step 2: Use Error Boundary
```jsx
// src/App.jsx
import ErrorBoundary from './features/common/components/shared/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <LoadingProvider>
          <ToastProvider>
            <ConfirmProvider>
              <AuthProvider>
                {/* ... rest of app */}
              </AuthProvider>
            </ConfirmProvider>
          </ToastProvider>
        </LoadingProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
```

---

## 6. SECURE TOKEN HANDLING (httpOnly Cookies)

### Backend: Set Cookie
```csharp
// Services/AuthService.cs
public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
{
    var user = await _context.Users
        .Include(u => u.UserRoles).ThenInclude(ur => ur.Role)
        .FirstOrDefaultAsync(u => u.Email == dto.Email);

    if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
        return null;

    var token = GenerateToken(user);

    // TODO: Return token to be set in httpOnly cookie by middleware
    return new AuthResponseDto
    {
        Token = token,  // Still return for reference
        Name = user.Name,
        Roles = user.UserRoles.Select(ur => ur.Role.Name).ToList()
    };
}
```

### Backend: Middleware to Set Cookie
```csharp
// API/Middleware/CookieAuthenticationMiddleware.cs
public class CookieAuthenticationMiddleware
{
    private readonly RequestDelegate _next;

    public CookieAuthenticationMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Check for login response
        var originalBodyStream = context.Response.Body;
        using var memoryStream = new MemoryStream();
        context.Response.Body = memoryStream;

        await _next(context);

        if (context.Response.StatusCode == 200 &&
            context.Request.Path.StartsWithSegments("/api/auth/login"))
        {
            // Set httpOnly cookie
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,  // HTTPS only
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddMinutes(60)
            };

            var token = ""; // Extract from response
            context.Response.Cookies.Append("auth", token, cookieOptions);
        }

        memoryStream.Position = 0;
        await memoryStream.CopyToAsync(originalBodyStream);
    }
}
```

### Frontend: Read from Cookie
```javascript
// src/features/common/services/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,  // Send cookies with requests
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;
```

---

## 7. PAGINATION

### Backend: DTO
```csharp
// Application/DTOs/Shared/PaginationRequest.cs
public class PaginationRequest
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;

    public int GetSkip() => (Page - 1) * PageSize;
}

public class PaginatedResponse<T>
{
    public List<T> Items { get; set; } = new();
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int Total { get; set; }
    public int TotalPages => (Total + PageSize - 1) / PageSize;
    public bool HasNextPage => Page < TotalPages;
    public bool HasPreviousPage => Page > 1;
}
```

### Backend: Service
```csharp
// Services/TaskService.cs
public async Task<PaginatedResponse<TaskDto>> GetUserTasksPagedAsync(
    int userId,
    PaginationRequest request)
{
    var query = _context.Tasks.Where(t => t.UserId == userId);
    var total = await query.CountAsync();

    var tasks = await query
        .AsNoTracking()
        .Skip(request.GetSkip())
        .Take(request.PageSize)
        .Select(t => MapToDto(t))
        .ToListAsync();

    return new PaginatedResponse<TaskDto>
    {
        Items = tasks,
        Page = request.Page,
        PageSize = request.PageSize,
        Total = total
    };
}
```

### Backend: Controller
```csharp
// Controllers/TasksController.cs
[HttpGet]
public async Task<ActionResult<PaginatedResponse<TaskDto>>> GetAll(
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 10)
{
    if (page < 1 || pageSize < 1)
        return BadRequest("Page and PageSize must be >= 1");

    var request = new PaginationRequest { Page = page, PageSize = pageSize };
    var result = await _taskService.GetUserTasksPagedAsync(GetUserId(), request);
    return Ok(result);
}
```

### Frontend: Hook
```javascript
// src/features/common/hooks/usePagination.js
import { useState, useCallback } from 'react';

export function usePagination(fetcher, initialPageSize = 10) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetcher(page, pageSize);
      setData(result.items);
      setTotal(result.total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, fetcher]);

  return {
    data,
    total,
    loading,
    page,
    pageSize,
    setPage,
    setPageSize,
    refresh: fetch,
    hasNextPage: page < Math.ceil(total / pageSize),
    hasPreviousPage: page > 1,
    totalPages: Math.ceil(total / pageSize)
  };
}
```

---

## Implementation Checklist

- [ ] Repository Pattern
  - [ ] Create IRepository<T> interface
  - [ ] Implement BaseRepository<T>
  - [ ] Create specific repositories
  - [ ] Update DI container
  - [ ] Update services to use repositories
  - [ ] Test with mocking

- [ ] Validation
  - [ ] Install FluentValidation
  - [ ] Create validators for each DTO
  - [ ] Register in DI
  - [ ] Add validation middleware
  - [ ] Update controllers

- [ ] Logging
  - [ ] Install Serilog
  - [ ] Configure in Program.cs
  - [ ] Add ILogger injections
  - [ ] Log strategic points
  - [ ] Test rolling logs

- [ ] Error Boundary (Frontend)
  - [ ] Create ErrorBoundary component
  - [ ] Wrap App
  - [ ] Test with thrown error

- [ ] API Response Standardization
  - [ ] Create ApiResponse<T>
  - [ ] Update all controllers
  - [ ] Update frontend error handling

- [ ] Pagination
  - [ ] Create PaginatedResponse<T>
  - [ ] Update service methods
  - [ ] Update controllers
  - [ ] Update frontend hooks
