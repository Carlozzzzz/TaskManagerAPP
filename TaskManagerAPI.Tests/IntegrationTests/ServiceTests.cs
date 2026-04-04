using Xunit;
using FluentAssertions;
using Moq;
using Microsoft.EntityFrameworkCore;
using TaskManagerAPI.Services;
using TaskManagerAPI.Data;
using TaskManagerAPI.DTOs;
using TaskManagerAPI.Infrastructure.Data.Repositories;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Tests.IntegrationTests;

public class TaskServiceTests
{
    private AppDbContext CreateInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        var mockCurrentUserService = new Mock<ICurrentUserService>();
        mockCurrentUserService.Setup(s => s.GetUserId()).Returns(1);

        return new AppDbContext(options, mockCurrentUserService.Object);
    }

    [Fact]
    public async Task GetTaskByIdAsync_ReturnsTask()
    {
        // Arrange
        var context = CreateInMemoryDbContext();
        var user = new User
        {
            Id = 1,
            Name = "John Doe",
            Email = "john@example.com",
            PasswordHash = "hash",
            CreatedAt = DateTime.UtcNow
        };
        context.Users.Add(user);

        var task = new TaskItem
        {
            Id = 1,
            Title = "Test Task",
            UserId = 1,
            Status = "todo",
            CreatedAt = DateTime.UtcNow
        };
        context.Tasks.Add(task);
        await context.SaveChangesAsync();

        var taskRepository = new TaskRepository(context);
        var taskService = new TaskService(taskRepository);

        // Act
        var result = await taskService.GetTaskByIdAsync(1, 1);

        // Assert
        result.Should().NotBeNull();
        result!.Title.Should().Be("Test Task");
    }

    [Fact]
    public async Task CreateTaskAsync_AddsNewTask()
    {
        // Arrange
        var context = CreateInMemoryDbContext();
        var user = new User
        {
            Id = 1,
            Name = "John Doe",
            Email = "john@example.com",
            PasswordHash = "hash",
            CreatedAt = DateTime.UtcNow
        };
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var taskRepository = new TaskRepository(context);
        var taskService = new TaskService(taskRepository);

        var createDto = new CreateTaskDto
        {
            Title = "New Task",
            Description = "New Description",
            DueDate = DateTime.UtcNow.AddDays(5)
        };

        // Act
        await taskService.CreateTaskAsync(createDto, 1);
        var tasks = await taskRepository.GetUserTasksAsync(1);

        // Assert
        tasks.Should().HaveCount(1);
        tasks.First().Title.Should().Be("New Task");
    }
}

public class UserServiceTests
{
    private AppDbContext CreateInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        var mockCurrentUserService = new Mock<ICurrentUserService>();
        mockCurrentUserService.Setup(s => s.GetUserId()).Returns(1);

        return new AppDbContext(options, mockCurrentUserService.Object);
    }

    [Fact]
    public async Task GetAllUsersAsync_ReturnsAllUsers()
    {
        // Arrange
        var context = CreateInMemoryDbContext();
        var user1 = new User
        {
            Id = 1,
            Name = "John Doe",
            Email = "john@example.com",
            PasswordHash = "hash",
            CreatedAt = DateTime.UtcNow
        };
        var user2 = new User
        {
            Id = 2,
            Name = "Jane Smith",
            Email = "jane@example.com",
            PasswordHash = "hash",
            CreatedAt = DateTime.UtcNow
        };
        context.Users.AddRange(user1, user2);
        await context.SaveChangesAsync();

        var userRepository = new UserRepository(context);
        var userService = new UserService(userRepository);

        // Act
        var result = await userService.GetAllUsersAsync();

        // Assert
        result.Should().HaveCount(2);
    }

    [Fact]
    public async Task GetUserByIdAsync_ReturnsUser()
    {
        // Arrange
        var context = CreateInMemoryDbContext();
        var user = new User
        {
            Id = 1,
            Name = "John Doe",
            Email = "john@example.com",
            PasswordHash = "hash",
            CreatedAt = DateTime.UtcNow
        };
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var userRepository = new UserRepository(context);
        var userService = new UserService(userRepository);

        // Act
        var result = await userService.GetUserByIdAsync(1);

        // Assert
        result.Should().NotBeNull();
        result!.Email.Should().Be("john@example.com");
    }
}
