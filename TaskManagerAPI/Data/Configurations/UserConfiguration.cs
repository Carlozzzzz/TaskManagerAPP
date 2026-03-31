// Data/Configurations/UserConfiguration.cs
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Data.Configurations
{
	public class UserConfiguration : IEntityTypeConfiguration<User>
	{
		public void Configure(EntityTypeBuilder<User> builder)
		{
			builder.HasKey(u => u.Id);

			builder.Property(u => u.Name).IsRequired().HasMaxLength(200);

			// CRITICAL: Database level unique index for emails
			builder.Property(u => u.Email).IsRequired().HasMaxLength(255);
			builder.HasIndex(u => u.Email).IsUnique();
		}
	}
}