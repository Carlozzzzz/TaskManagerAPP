using Xunit;
using FluentAssertions;
using TaskManagerAPI.Application.Validators;
using TaskManagerAPI.DTOs;

namespace TaskManagerAPI.Tests.UnitTests;

public class AuthValidatorTests
{
    [Fact]
    public void RegisterValidator_ValidInput_ShouldPass()
    {
        // Arrange
        var validator = new RegisterValidator();
        var dto = new RegisterDto
        {
            Name = "John Doe",
            Email = "john@example.com",
            Password = "password123"
        };

        // Act
        var result = validator.Validate(dto);

        // Assert
        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void RegisterValidator_MissingName_ShouldFail()
    {
        // Arrange
        var validator = new RegisterValidator();
        var dto = new RegisterDto
        {
            Name = "",
            Email = "john@example.com",
            Password = "password123"
        };

        // Act
        var result = validator.Validate(dto);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Name");
    }

    [Fact]
    public void RegisterValidator_InvalidEmail_ShouldFail()
    {
        // Arrange
        var validator = new RegisterValidator();
        var dto = new RegisterDto
        {
            Name = "John Doe",
            Email = "invalid-email",
            Password = "password123"
        };

        // Act
        var result = validator.Validate(dto);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Email");
    }

    [Fact]
    public void RegisterValidator_PasswordTooShort_ShouldFail()
    {
        // Arrange
        var validator = new RegisterValidator();
        var dto = new RegisterDto
        {
            Name = "John Doe",
            Email = "john@example.com",
            Password = "pass"
        };

        // Act
        var result = validator.Validate(dto);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Password");
    }

    [Fact]
    public void LoginValidator_ValidInput_ShouldPass()
    {
        // Arrange
        var validator = new LoginValidator();
        var dto = new LoginDto
        {
            Email = "john@example.com",
            Password = "password123"
        };

        // Act
        var result = validator.Validate(dto);

        // Assert
        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void LoginValidator_MissingEmail_ShouldFail()
    {
        // Arrange
        var validator = new LoginValidator();
        var dto = new LoginDto
        {
            Email = "",
            Password = "password123"
        };

        // Act
        var result = validator.Validate(dto);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Email");
    }

    [Fact]
    public void LoginValidator_MissingPassword_ShouldFail()
    {
        // Arrange
        var validator = new LoginValidator();
        var dto = new LoginDto
        {
            Email = "john@example.com",
            Password = ""
        };

        // Act
        var result = validator.Validate(dto);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Password");
    }
}

public class TaskValidatorTests
{
    [Fact]
    public void CreateTaskValidator_ValidInput_ShouldPass()
    {
        // Arrange
        var validator = new CreateTaskValidator();
        var dto = new CreateTaskDto
        {
            Title = "Test Task",
            Description = "Test Description",
            DueDate = DateTime.UtcNow.AddDays(1)
        };

        // Act
        var result = validator.Validate(dto);

        // Assert
        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void CreateTaskValidator_MissingTitle_ShouldFail()
    {
        // Arrange
        var validator = new CreateTaskValidator();
        var dto = new CreateTaskDto
        {
            Title = "",
            Description = "Test Description",
            DueDate = DateTime.UtcNow.AddDays(1)
        };

        // Act
        var result = validator.Validate(dto);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Title");
    }

    [Fact]
    public void CreateTaskValidator_DueDateInPast_ShouldFail()
    {
        // Arrange
        var validator = new CreateTaskValidator();
        var dto = new CreateTaskDto
        {
            Title = "Test Task",
            Description = "Test Description",
            DueDate = DateTime.UtcNow.AddDays(-1)
        };

        // Act
        var result = validator.Validate(dto);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "DueDate");
    }

    [Fact]
    public void UpdateTaskStatusValidator_ValidStatus_ShouldPass()
    {
        // Arrange
        var validator = new UpdateTaskStatusValidator();
        var dto = new UpdateTaskStatusDto
        {
            Status = "done"
        };

        // Act
        var result = validator.Validate(dto);

        // Assert
        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void UpdateTaskStatusValidator_InvalidStatus_ShouldFail()
    {
        // Arrange
        var validator = new UpdateTaskStatusValidator();
        var dto = new UpdateTaskStatusDto
        {
            Status = "invalid-status"
        };

        // Act
        var result = validator.Validate(dto);

        // Assert
        result.IsValid.Should().BeFalse();
    }
}
