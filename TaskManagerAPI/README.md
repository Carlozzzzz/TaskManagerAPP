# 🚀 Task Manager API — Enterprise Template

This is a professional-grade .NET 8 Web API built using the **Repository + Unit of Work** pattern.

## 🛠 Tech Stack
- **Backend:** .NET 8 (C#)
- **Database:** SQL Server
- **ORM:** Entity Framework Core
- **Authentication:** JWT Bearer

## 🏁 Getting Started

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)

### Configuration
1. Update `DefaultConnection` in `appsettings.json`.
2. Configure JWT settings in `appsettings.json`.

---

## 🗄️ Database & Migrations

Use these commands to manage your database schema.

### Common Commands
- **Add a new migration:**
  `dotnet ef migrations add [MigrationName] --context AppDbContext`
- **Update database to latest:**
  `dotnet ef database update --context AppDbContext`
- **Remove last migration (before updating DB):**
  `dotnet ef migrations remove --context AppDbContext`

### 📜 Migration History (Log)
// ADDED: Track your schema changes here
1. `InitialCreate`
2. `Remove_IdUserRole_Model`
3. `Create_Company_Model`
4. `update_LogsRelated_RestructureModel`
5. `update_DeletedByFromISoftDelete_UserModel_RestructureModel`
5. `update_UpdatePermissionRoles_RestructureModel`
Add-Migration update_UserTable -Context AppDbContext
---

## 🔑 Access & Accounts
// ADDED: Development test accounts
- **Admin/Dev User:** `carloz.claude@gmail.com`

---

## 🏗 Understanding the Architecture
We follow a strict **Clean Architecture-lite** approach. Before adding any new features, please read the **[ARCHITECTURE.md](./ARCHITECTURE.md)** file.

## 📂 Project Structure
- **/Controllers**: Thin entry points.
- **/Services**: Business logic & DTO mapping.
- **/Foundation**: Generic Repository & Unit of Work.
- **/Repositories**: Entity-specific complex queries.
- **/Models**: Database entities.
- **/DTOs**: Data Transfer Objects.
- **/Data**: AppDbContext and Migrations.