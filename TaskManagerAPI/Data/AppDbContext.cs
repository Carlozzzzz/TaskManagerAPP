using Microsoft.EntityFrameworkCore;
using TaskManagerAPI.Models;
using TaskManagerAPI.Models.Base;
using TaskManagerAPI.Models.Interfaces;
using TaskManagerAPI.Services;

namespace TaskManagerAPI.Data
{
	public class AppDbContext : DbContext
	{
		private readonly ICurrentUserService _currentUserService;

		public AppDbContext(
				DbContextOptions<AppDbContext> options,
				ICurrentUserService currentUserService) : base(options)
		{
			_currentUserService = currentUserService;
		}

		// --- TABLES ---
		public DbSet<TaskItem> Tasks { get; set; }
		public DbSet<User> Users { get; set; }
		public DbSet<Role> Roles { get; set; }
		public DbSet<Module> Modules { get; set; }
		public DbSet<RoleModulePermission> RoleModulePermissions { get; set; }
		public DbSet<UserRole> UserRoles { get; set; }
		public DbSet<AuditLog> AuditLogs { get; set; }
		public DbSet<Company> Companies { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);

			// Load configurations from Assembly
			modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

            // ─── UserRole Configuration ──────────────────────────────────────────
            // REPLACED: Composite Key removed. 
            // We now use the 'Id' from BaseEntity as the Primary Key.
            modelBuilder.Entity<UserRole>()
                    .HasKey(ur => ur.Id);

            // ADDED: Unique Index
            // This maintains the business rule: One user cannot have the same role twice.
            modelBuilder.Entity<UserRole>()
                    .HasIndex(ur => new { ur.UserId, ur.RoleId })
                    .IsUnique();

            // ─── Automated Soft Delete Filter ────────────────────────────────────
            // This hides records where IsDeleted == true for any class implementing ISoftDelete
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
			{
				if (typeof(ISoftDelete).IsAssignableFrom(entityType.ClrType))
				{
					modelBuilder.Entity(entityType.ClrType).HasQueryFilter(GetIsDeletedFilter(entityType.ClrType));
				}
			}
		}

		private static System.Linq.Expressions.LambdaExpression GetIsDeletedFilter(Type type)
		{
			var parameter = System.Linq.Expressions.Expression.Parameter(type, "e");
			var property = System.Linq.Expressions.Expression.Property(parameter, "IsDeleted");
			var falseConstant = System.Linq.Expressions.Expression.Constant(false);
			var comparison = System.Linq.Expressions.Expression.Equal(property, falseConstant);
			return System.Linq.Expressions.Expression.Lambda(comparison, parameter);
		}

		// --- THE ENGINE: AUTOMATED AUDIT & TRACKING ---
		public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
		{
			// 1. Automatically set CreatedAt, UpdatedAt, etc. on the objects
			ApplyAuditProperties();

			// 2. Capture snapshots of changes for the AuditLog table
			var auditEntries = OnBeforeSaveChanges();

			// 3. Save the actual data to SQL Server
			var result = await base.SaveChangesAsync(cancellationToken);

			// 4. Update AuditLogs with real IDs (for new records) and save the logs
			await OnAfterSaveChanges(auditEntries);

			return result;
		}

		// REPLACED: Type-safe Audit Property Logic
		private void ApplyAuditProperties()
		{
			var userId = _currentUserService.GetUserId();
			var now = DateTime.UtcNow;

			foreach (var entry in ChangeTracker.Entries<BaseEntity>())
			{
				// --- 1. HANDLE ADDED ENTITIES ---
				if (entry.State == EntityState.Added)
				{
					entry.Entity.CreatedAt = now;
					entry.Entity.CreatedBy = userId;

					// If it supports soft delete, initialize it to false
					if (entry.Entity is ISoftDelete sd)
					{
						sd.IsDeleted = false;
					}
				}

				// --- 2. HANDLE MODIFIED ENTITIES ---
				else if (entry.State == EntityState.Modified)
				{
					// Use 'is' pattern matching to safely cast to the soft-delete version
					if (entry.Entity is BaseSoftDeleteEntity baseSoft)
					{
						// We use string-based access "IsDeleted" so EF doesn't look at 'BaseEntity'
						var isDeletedProperty = entry.Property("IsDeleted");

						if (isDeletedProperty.IsModified && baseSoft.IsDeleted)
						{
							// This is a soft-delete action
							baseSoft.DeletedAt = now;
							baseSoft.DeletedBy = userId;
						}
						else
						{
							// This is just a regular update
							entry.Entity.UpdatedAt = now;
							entry.Entity.UpdatedBy = userId;
						}
					}
					else
					{
						// This entity does NOT support soft delete (e.g. TaskItem)
						// Just update the regular audit fields
						entry.Entity.UpdatedAt = now;
						entry.Entity.UpdatedBy = userId;
					}
				}
			}
		}

		private List<AuditEntry> OnBeforeSaveChanges()
		{
			ChangeTracker.DetectChanges();
			var auditEntries = new List<AuditEntry>();
			var userId = _currentUserService.GetUserId()?.ToString() ?? "System";

			foreach (var entry in ChangeTracker.Entries())
			{
				if (entry.Entity is AuditLog || entry.State == EntityState.Detached || entry.State == EntityState.Unchanged)
					continue;

				var auditEntry = new AuditEntry(entry)
				{
					TableName = entry.Entity.GetType().Name,
					UserId = userId
				};
				auditEntries.Add(auditEntry);

				foreach (var property in entry.Properties)
				{
					string propertyName = property.Metadata.Name;

					// Capture Primary Key
					if (property.Metadata.IsPrimaryKey())
					{
						auditEntry.KeyValues[propertyName] = property.CurrentValue ?? "0";
						continue;
					}

					// Capture Changes based on State
					switch (entry.State)
					{
						case EntityState.Added:
							auditEntry.Action = "CREATE";
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
				// After the first SaveChanges, brand new IDs are now generated. 
				// We update the audit log with these real IDs.
				foreach (var prop in auditEntry.Entry.Properties)
				{
					if (prop.Metadata.IsPrimaryKey())
					{
						auditEntry.KeyValues[prop.Metadata.Name] = prop.CurrentValue;
					}
				}
				AuditLogs.Add(auditEntry.ToAudit());
			}

			// Save the final Audit Log entries
			return base.SaveChangesAsync();
		}
	}
}