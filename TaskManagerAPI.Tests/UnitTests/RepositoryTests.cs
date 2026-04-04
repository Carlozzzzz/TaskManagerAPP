using Xunit;
using FluentAssertions;
using Moq;
using Microsoft.EntityFrameworkCore;
using TaskManagerAPI.Services;
using TaskManagerAPI.Data;
using TaskManagerAPI.Infrastructure.Data.Repositories;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Tests.UnitTests;

public class RepositoryTests
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
    public async Task UserRepository_GetUserByEmailAsync_ReturnsUser()
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

        var repository = new UserRepository(context);

        // Act
        var result = await repository.GetUserByEmailAsync("john@example.com");

        // Assert
        result.Should().NotBeNull();
        result!.Email.Should().Be("john@example.com");
    }

    [Fact]
    public async Task UserRepository_GetUserByEmailAsync_ReturnsNullForNonExistent()
    {
        // Arrange
        var context = CreateInMemoryDbContext();
        var repository = new UserRepository(context);

        // Act
        var result = await repository.GetUserByEmailAsync("nonexistent@example.com");

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task TaskRepository_GetUserTasksAsync_ReturnsUserTasks()
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

        var task1 = new TaskItem
        {
            Id = 1,
            Title = "Task 1",
            UserId = 1,
            Status = "todo",
            CreatedAt = DateTime.UtcNow
        };
        var task2 = new TaskItem
        {
            Id = 2,
            Title = "Task 2",
            UserId = 1,
            Status = "in-progress",
            CreatedAt = DateTime.UtcNow
        };
        context.Tasks.AddRange(task1, task2);
        await context.SaveChangesAsync();

        var repository = new TaskRepository(context);

        // Act
        var results = await repository.GetUserTasksAsync(1);

        // Assert
        results.Should().HaveCount(2);
        results.Should().Contain(t => t.Title == "Task 1");
        results.Should().Contain(t => t.Title == "Task 2");
    }

    [Fact]
    public async Task TaskRepository_GetTasksByStatusAsync_ReturnsFilteredTasks()
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

        var task1 = new TaskItem
        {
            Id = 1,
            Title = "Task 1",
            UserId = 1,
            Status = "todo",
            CreatedAt = DateTime.UtcNow
        };
        var task2 = new TaskItem
        {
            Id = 2,
            Title = "Task 2",
            UserId = 1,
            Status = "done",
            CreatedAt = DateTime.UtcNow
        };
        context.Tasks.AddRange(task1, task2);
        await context.SaveChangesAsync();

        var repository = new TaskRepository(context);

        // Act
        var results = await repository.GetTasksByStatusAsync("todo");

        // Assert
        results.Should().HaveCount(1);
        results.First().Title.Should().Be("Task 1");
    }

    [Fact]
    public async Task BaseRepository_AddAsync_AddsEntity()
    {
        // Arrange
        var context = CreateInMemoryDbContext();
        var repository = new BaseRepository<User>(context);

        var user = new User
        {
            Id = 1,
            Name = "John Doe",
            Email = "john@example.com",
            PasswordHash = "hash",
            CreatedAt = DateTime.UtcNow
        };

        // Act
        await repository.AddAsync(user);
        await repository.SaveChangesAsync();

        // Assert
        var saved = await context.Users.FirstAsync();
        saved.Email.Should().Be("john@example.com");
    }

    [Fact]
    public async Task BaseRepository_GetByIdAsync_ReturnsEntity()
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

        var repository = new BaseRepository<User>(context);

        // Act
        var result = await repository.GetByIdAsync(1);

        // Assert
        result.Should().NotBeNull();
        result!.Email.Should().Be("john@example.com");
    }

    [Fact]
    public async Task BaseRepository_Delete_RemovesEntity()
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

        var repository = new BaseRepository<User>(context);
        var toDelete = await repository.GetByIdAsync(1);

        // Act
        repository.Delete(toDelete!);
        await repository.SaveChangesAsync();

        // Assert
        var result = await repository.GetByIdAsync(1);
        result.Should().BeNull();
    }
}
