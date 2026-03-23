// Program.cs
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TaskManagerAPI.Data;
using TaskManagerAPI.Services;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// ADDED — allow requests from React frontend
builder.Services.AddCors(options =>
{
	options.AddPolicy("AllowFrontend", policy =>
	{
		policy.WithOrigins("http://localhost:5173") // your Vite dev server
						.AllowAnyHeader()
						.AllowAnyMethod();
	});
});

builder.Services.AddDbContext<AppDbContext>(options =>
		options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


// ADDED — register TaskService so it can be injected into controllers
builder.Services.AddScoped<ITaskService, TaskService>();
builder.Services.AddScoped<IUserService, UserService>();

// ADDED - register AuthService
builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddControllers();

// ADDED — Swagger setup
builder.Services.AddEndpointsApiExplorer();
// MODIFIED — add JWT support to Swagger UI
builder.Services.AddSwaggerGen(c =>
{
	c.SwaggerDoc("v1", new()
	{
		Title = "Task Manager API",
		Version = "v1",
		Description = "Learning project — Stage 3 Auth"
	});

	// ADDED — tell Swagger about the Bearer token
	c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
	{
		Name = "Authorization",
		Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
		Scheme = "Bearer",
		BearerFormat = "JWT",
		In = Microsoft.OpenApi.Models.ParameterLocation.Header,
		Description = "Paste your JWT token here. Example: eyJhbGci..."
	});

	c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
		{
				{
						new Microsoft.OpenApi.Models.OpenApiSecurityScheme
						{
								Reference = new Microsoft.OpenApi.Models.OpenApiReference
								{
										Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
										Id   = "Bearer"
								}
						},
						Array.Empty<string>()
				}
		});
});

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
															Encoding.UTF8.GetBytes(
																builder.Configuration["Jwt:Key"]!))
		};
	});

var app = builder.Build();

// ADDED — enable Swagger UI in development
if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Task Manager API v1"));
}

app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();