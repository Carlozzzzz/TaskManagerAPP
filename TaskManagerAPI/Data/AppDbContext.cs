// 📂 Path: Data/AppDbContext.cs
using Microsoft.EntityFrameworkCore;
using TaskManagerAPI.Models;
using System.Text.Json;
using TaskManagerAPI.Models.Interfaces;
using TaskManagerAPI.Services;

namespace TaskManagerAPI.Data
{
	public class AppDbContext : DbContext
	{
		// ADDED: The "Spy" who tells us who is logged in
		private readonly ICurrentUserService _currentUserService;

		public AppDbContext(
				DbContextOptions<AppDbContext> options,
				ICurrentUserService currentUserService) // MODIFIED: Inject service
						: base(options)
		{
			_currentUserService = currentUserService;
		}

		// --- TABLES ---
		public DbSet<TaskItem> Tasks { get; set; }
		public DbSet<User> Users { get; set; }
		public DbSet<Role> Roles { get; set; } // ADDED
		public DbSet<Module> Modules { get; set; } // ADDED
		public DbSet<RoleModulePermission> RoleModulePermissions { get; set; } // ADDED
		public DbSet<UserRole> UserRoles { get; set; } // ADDED
		public DbSet<AuditLog> AuditLogs { get; set; } // ADDED

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);

			// 1. Keep your existing configurations
			modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

			// 2. CONFIGURE MANY-TO-MANY (Join Table)
			modelBuilder.Entity<UserRole>()
					.HasKey(ur => new { ur.UserId, ur.RoleId });

			// 3. THE INVISIBLE GUARD: Automated Soft Delete Filter
			// This scans every table. If it has 'ISoftDelete', it hides deleted rows automatically.
			foreach (var entityType in modelBuilder.Model.GetEntityTypes())
			{
				if (typeof(ISoftDelete).IsAssignableFrom(entityType.ClrType))
				{
					modelBuilder.Entity(entityType.ClrType).HasQueryFilter(GetIsDeletedFilter(entityType.ClrType));
				}
			}
		}

		// Helper to build the "IsDeleted == false" expression for EF Core
		private static System.Linq.Expressions.LambdaExpression GetIsDeletedFilter(Type type)
		{
			var parameter = System.Linq.Expressions.Expression.Parameter(type, "e");
			var property = System.Linq.Expressions.Expression.Property(parameter, "IsDeleted");
			var falseConstant = System.Linq.Expressions.Expression.Constant(false);
			var comparison = System.Linq.Expressions.Expression.Equal(property, falseConstant);
			return System.Linq.Expressions.Expression.Lambda(comparison, parameter);
		}

		// 4. THE SECURITY CAMERA: Automated Audit Logging
		public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
		{
			// A. Capture changes before saving
			var auditEntries = OnBeforeSaveChanges();

			// B. Save the actual data
			var result = await base.SaveChangesAsync(cancellationToken);

			// C. Save the Audit records after the data (to get the new IDs)
			await OnAfterSaveChanges(auditEntries);

			return result;
		}

		private List<AuditEntry> OnBeforeSaveChanges()
		{
			ChangeTracker.DetectChanges();
			var auditEntries = new List<AuditEntry>();

			foreach (var entry in ChangeTracker.Entries())
			{
				// Don't log the audit logs themselves or unchanged data
				if (entry.Entity is AuditLog || entry.State == EntityState.Detached || entry.State == EntityState.Unchanged)
					continue;

				var auditEntry = new AuditEntry(entry)
				{
					TableName = entry.Entity.GetType().Name,
					UserId = _currentUserService.GetUserId()?.ToString() ?? "System"
				};
				auditEntries.Add(auditEntry);

				foreach (var property in entry.Properties)
				{
					string propertyName = property.Metadata.Name;
					if (property.Metadata.IsPrimaryKey())
					{
						auditEntry.KeyValues[propertyName] = property.CurrentValue ?? "0"; 
						continue;
					}

					switch (entry.State)
					{
						case EntityState.Added:
							auditEntry.Action = "CREATE";
							// MODIFIED: Add '?? ""' to handle possible nulls from the database
							auditEntry.NewValues[propertyName] = property.CurrentValue ?? "NULL";
							break;

						case EntityState.Deleted:
							auditEntry.Action = "DELETE";
							auditEntry.OldValues[propertyName] = property.OriginalValue ?? "NULL";
							break;

						case EntityState.Modified:
							if (property.IsModified)
							{
								auditEntry.Action = "UPDATE";
								auditEntry.OldValues[propertyName] = property.OriginalValue ?? "NULL";
								auditEntry.NewValues[propertyName] = property.CurrentValue ?? "NULL";
							}
							break;
					}
				}
			}
			return auditEntries;
		}

		private Task OnAfterSaveChanges(List<AuditEntry> auditEntries)
		{
			if (auditEntries == null || auditEntries.Count == 0) return Task.CompletedTask;

			foreach (var auditEntry in auditEntries)
			{
				AuditLogs.Add(auditEntry.ToAudit());
			}
			return base.SaveChangesAsync();
		}
	}
}