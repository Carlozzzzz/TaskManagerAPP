// Program.cs
using System.Text;
using System.Net;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using TaskManagerAPI.Data;
using TaskManagerAPI.Services;
using TaskManagerAPI.Core.Interfaces;
using TaskManagerAPI.Infrastructure.Data.Repositories;
using FluentValidation;
using TaskManagerAPI.API.Middleware;
using TaskManagerAPI.API.Responses;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// --- ADDED: Serilog Configuration (Phase 2C) ---
Log.Logger = new LoggerConfiguration()
	.MinimumLevel.Information()
	.WriteTo.Console()
	.WriteTo.File("logs/app-.txt", rollingInterval: RollingInterval.Day)
	.CreateLogger();

builder.Host.UseSerilog();
// ---

// --- 1. SERVICES CONFIGURATION ---

// MODIFIED — CORS: Added support for reading from Configuration (Production-Ready)
var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>()
										 ?? new[] { "http://localhost:5173" };

builder.Services.AddCors(options =>
{
	options.AddPolicy("AllowFrontend", policy =>
	{
		policy.WithOrigins(allowedOrigins)
						.AllowAnyHeader()
						.AllowAnyMethod()
						.AllowCredentials();
	});
});

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
		options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
		
// ADDED: Allow services to access the current web request (Required for CurrentUserService)
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();

// ADDED: Repository Pattern (NEW - Phase 2A)
builder.Services.AddScoped<ITaskRepository, TaskRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped(typeof(IRepository<>), typeof(BaseRepository<>));

// ADDED: FluentValidation (NEW - Phase 2B)
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

// Dependency Injection: Services
builder.Services.AddScoped<ITaskService, TaskService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddControllers();

// Swagger: Professional JWT Setup
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
	c.SwaggerDoc("v1", new OpenApiInfo
	{
		Title = "Task Manager API",
		Version = "v1",
		Description = "Enterprise Template — Stage 4 Professional Async"
	});

	c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
	{
		Name = "Authorization",
		Type = SecuritySchemeType.Http,
		Scheme = "Bearer",
		BearerFormat = "JWT",
		In = ParameterLocation.Header,
		Description = "Paste your JWT token here."
	});

	c.AddSecurityRequirement(new OpenApiSecurityRequirement
		{
				{
						new OpenApiSecurityScheme
						{
								Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
						},
						Array.Empty<string>()
				}
		});
});

// Authentication & JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
		.AddJwtBearer(options =>
		{
			options.TokenValidationParameters = new TokenValidationParameters
			{
				ValidateIssuer = true,
				ValidateAudience = true,
				ValidateLifetime = true,
				ValidateIssuerSigningKey = true,
				ValidIssuer = builder.Configuration["Jwt:Issuer"],
				ValidAudience = builder.Configuration["Jwt:Audience"],
				IssuerSigningKey = new SymmetricSecurityKey(
							Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
			};
		});

var app = builder.Build();

// --- 2. MIDDLEWARE PIPELINE ---

// ADDED — Global Exception Handler (Enterprise Standard)
// This catches any crash in your app and returns a clean JSON error to the Frontend.
app.UseExceptionHandler(errorApp =>
{
	errorApp.Run(async context =>
	{
		context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
		context.Response.ContentType = "application/json";

		var contextFeature = context.Features.Get<IExceptionHandlerFeature>();
		if (contextFeature != null)
		{
			// UPDATED: Use Serilog to log the exception (Phase 2C)
			Log.Error(contextFeature.Error, "Unhandled exception occurred");

			// UPDATED: Use ApiResponse wrapper (Phase 2D)
			var errorResponse = ApiResponse<object>.ErrorResponse(
				"An unexpected error occurred. Please try again later."
			);
			await context.Response.WriteAsJsonAsync(errorResponse);
		}
	});
});

// ADDED: Serilog HTTP Request Logging (Phase 2C)
app.UseSerilogRequestLogging();

if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Task Manager API v1"));
}

app.UseHttpsRedirection();

// Order is critical here: CORS -> Auth -> Authorization -> Validation
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

// ADDED: Validation Middleware (NEW - Phase 2B) - Must be AFTER Auth/CORS
app.UseMiddleware<ValidationMiddleware>();

app.MapControllers();

app.Run();