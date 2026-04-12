// Program.cs
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Net;
using System.Text;
using TaskManagerAPI.Data;
using TaskManagerAPI.Foundation;
using TaskManagerAPI.Repositories;
using TaskManagerAPI.Services;

var builder = WebApplication.CreateBuilder(args);

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
						.AllowAnyMethod();
	});
});

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
		options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
		
// ADDED: Allow services to access the current web request
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();

// ─── FOUNDATION — register once, works for ALL entities ───────────────────
// IRepository<Company>, IRepository<Employee>, IRepository<Department>, etc.
// all resolve to Repository<T> automatically. No per-entity registration needed.
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// ─── Company module ────────────────────────────────────────────────────────
// ADDED: ICompanyRepository registered — replaces generic repo for Company.
// When ICompanyRepository is requested, DI resolves CompanyRepository
// which extends Repository<Company> so all generic methods still work.
builder.Services.AddScoped<ICompanyRepository, CompanyRepository>();
builder.Services.AddScoped<ICompanyService, CompanyService>();

// ─── Module module ────────────────────────────────────────────────────────
builder.Services.AddScoped<IModuleService, ModuleService>();

// ─── Role module ────────────────────────────────────────────────────────
builder.Services.AddScoped<IRoleRepository, RoleRepository>();
builder.Services.AddScoped<IRoleService, RoleService>();

// Dependency Injection: Services
builder.Services.AddScoped<ITaskService, TaskService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAuthService, AuthService>();


// ─────────────────────────────────────────────────────────────────────────────
// PATTERN FOR FUTURE MODULES:
//
// Simple CRUD only — no complex queries:
//   builder.Services.AddScoped<IEmployeeService, EmployeeService>();
//   (generic IRepository<Employee> resolves automatically — no extra line)
//
// Complex queries needed:
//   builder.Services.AddScoped<IClientRepository, ClientRepository>();
//   builder.Services.AddScoped<IClientService,    ClientService>();
//
// IUnitOfWork is already registered above — inject it into any service.
// ─────────────────────────────────────────────────────────────────────────────


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
			// In a real app, you would use a Logger here (e.g., Serilog)
			var errorResponse = new
			{
				StatusCode = context.Response.StatusCode,
				Message = "An unexpected error occurred. Please try again later.",
				Details = app.Environment.IsDevelopment() ? contextFeature.Error.Message : null
			};
			await context.Response.WriteAsJsonAsync(errorResponse);
		}
	});
});

if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Task Manager API v1"));
}

app.UseHttpsRedirection();

// Order is critical here: CORS -> Auth -> Authorization
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();