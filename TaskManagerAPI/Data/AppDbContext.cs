// Data/AppDbContext.cs

using Microsoft.EntityFrameworkCore;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Data
{
	public class AppDbContext : DbContext
	{
		public AppDbContext(DbContextOptions<AppDbContext> options)
				: base(options) { }

		// ADDED — this tells EF Core "there is a Tasks table in the database"
		public DbSet<TaskItem> Tasks { get; set; }
		public DbSet<User> Users { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			// ADDED — configure the TaskItem table explicitly
			modelBuilder.Entity<TaskItem>(entity =>
			{
				entity.HasKey(t => t.Id);

				entity.Property(t => t.Title)
									.IsRequired()
									.HasMaxLength(200);

				entity.Property(t => t.Description)
									.HasMaxLength(1000);

				entity.Property(t => t.Status)
									.IsRequired()
									.HasDefaultValue("todo");

				entity.Property(t => t.CreatedAt)
									.HasDefaultValueSql("GETUTCDATE()"); // SQL Server sets this automatically
			});
		}
	}
}