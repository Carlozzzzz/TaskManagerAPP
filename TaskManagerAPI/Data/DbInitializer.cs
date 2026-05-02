using Microsoft.EntityFrameworkCore;
using TaskManagerAPI.Constants;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Data
{
    public static class DbInitializer
    {
        // REPLACED: Updated SeedAsync with specific existence checks
        public static async Task SeedAsync(AppDbContext context)
        {
            // 1. Check for Roles by Name (Prevents duplicates even if table isn't empty)
            var hasAdmin = await context.Roles.AnyAsync(r => r.Name == "Admin");
            var hasUser = await context.Roles.AnyAsync(r => r.Name == "User");

            if (!hasAdmin || !hasUser)
            {
                if (!hasAdmin) context.Roles.Add(new Role { Name = "Admin" });
                if (!hasUser) context.Roles.Add(new Role { Name = "User" });

                await context.SaveChangesAsync();
            }

            // 2. Check for Core Modules by Key
            var hasHome = await context.Modules.AnyAsync(m => m.Key == "HOME");
            var hasManageUsers = await context.Modules.AnyAsync(m => m.Key == "USER");

            if (!hasHome || !hasManageUsers)
            {
                if (!hasHome) context.Modules.Add(new Module { Key = "HOME", DisplayName = "Home", Section = "Home" });
                if (!hasManageUsers) context.Modules.Add(new Module { Key = "USER", DisplayName = "Manage Users", Section = "Users" });

                await context.SaveChangesAsync();
            }

            // 3. Link Permissions (Only if the Role doesn't already have them)
            var adminRole = await context.Roles.FirstOrDefaultAsync(r => r.Name == UserRoles.Admin);
            var userRole = await context.Roles.FirstOrDefaultAsync(r => r.Name == UserRoles.User);

            var homeModule = await context.Modules.FirstOrDefaultAsync(m => m.Key == "HOME");
            var userModule = await context.Modules.FirstOrDefaultAsync(m => m.Key == "USER");

            if (adminRole != null && homeModule != null && userModule != null)
            {
                // Check if permission already exists for this specific Role-Module combo
                var hasHomePerm = await context.Set<RoleModulePermission>()
                    .AnyAsync(p => p.RoleId == adminRole.Id && p.ModuleId == homeModule.Id);

                if (!hasHomePerm)
                {
                    context.Set<RoleModulePermission>().Add(CreateFullPermission(adminRole.Id, homeModule.Id));
                }

                var hasUserPerm = await context.Set<RoleModulePermission>()
                    .AnyAsync(p => p.RoleId == adminRole.Id && p.ModuleId == userModule.Id);

                if (!hasUserPerm)
                {
                    context.Set<RoleModulePermission>().Add(CreateFullPermission(adminRole.Id, userModule.Id));
                }

                await context.SaveChangesAsync();
            }

            if (userRole != null && homeModule != null)
            {
                var hasHomePerm = await context.Set<RoleModulePermission>()
                        .AnyAsync(p => p.RoleId == userRole.Id && p.ModuleId == homeModule.Id);

                if (!hasHomePerm)
                {
                    context.Set<RoleModulePermission>().Add(CreateFullPermission(userRole.Id, homeModule.Id));
                }

                await context.SaveChangesAsync();
            }
        }

        private static RoleModulePermission CreateFullPermission(int roleId, int moduleId)
        {
            return new RoleModulePermission
            {
                RoleId = roleId,
                ModuleId = moduleId,
                CanView = true,
                CanAdd = true,
                CanEdit = true,
                CanDelete = true
            };
        }
    }
}