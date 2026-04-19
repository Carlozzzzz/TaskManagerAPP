# 🚀 Task Manager API — Enterprise Template

This is a professional-grade .NET 8 Web API built using the **Repository + Unit of Work** pattern.

## 🛠 Tech Stack
- **Backend:** .NET 8 (C#)
- **Database:** SQL Server
- **ORM:** Entity Framework Core
- **Authentication:** JWT Bearer

---

## 🏁 Getting Started

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)

### ⚙️ Configuration (Crucial)
1.  **Database:** Update `DefaultConnection` in `appsettings.json` with your local SQL Server connection string.
2.  **JWT Settings:** 
    *   Configure `Jwt:Issuer`, `Jwt:Audience`, and `Jwt:Key` in `appsettings.json`.
    *   ⚠️ **Warning:** The `Jwt:Key` must be a high-entropy string (at least 32 characters/256-bit).
3.  **Migrations:** Run the migrations to build the schema (see Database section below).

### ✨ Initial Setup & First Run
The application features an **Automatic Data Seeder** that handles initial roles and core permissions.
1.  **Run the App:** Press `F5` in Visual Studio or use `dotnet run`.
2.  **Seeding:** On the very first run, the app will automatically create the `Admin` and `User` Roles, and the `HOME` and `USER` Core Modules.

---

## 🌳 Version Control Workflow (Offline & Online)

This project uses `main` and `development` branches. You can work **offline** (Commit) and sync **online** (Push) using your preferred tool.

### Option 1: GitHub Desktop (Recommended for Visual Workflow)
*   **Working Offline:**
    1.  Select your branch in the top-center dropdown (e.g., `feature/your-task`).
    2.  As you code, changes appear in the **Changes** tab on the left.
    3.  Enter a Summary and click **Commit to [branch name]**. (Your work is now saved locally).
*   **Working Online:**
    1.  Click **Push origin** at the top bar to send your local commits to the cloud.
    2.  Use **Fetch origin** to see if others have updated the code.

### Option 2: Visual Studio / VS Code (IDE Integrated)
*   **Working Offline:**
    1.  Open the **Git Changes** window (Ctrl+Alt+F7 in VS).
    2.  Type a message and select **Commit All**.
*   **Working Online:**
    1.  Click the **Push** icon (Up Arrow) in the Git Changes window or the status bar at the bottom.

### Option 3: Terminal / CLI (Standard)
*   **Working Offline:**
    ```bash
    git add .
    git commit -m "Your commit message"
    ```
*   **Working Online:**
    ```bash
    git push origin [your-branch-name]
    git pull origin development # To stay updated
    ```

---

## 🔑 Admin & Account Logic
- **First Registration:** The very first account registered is automatically assigned the **Admin** role.
- **Subsequent Registrations:** All other users are assigned the **User** role.
- **Admin Privileges:** By default, the first Admin has full access to the `Home` and `Manage Users` modules.

---

## 🗄️ Database & Migrations

### Package Manager Console (Visual Studio)
- **Add a new migration:**  
  `Add-Migration [MigrationName] -Context AppDbContext`
- **Update database to latest:**  
  `Update-Database -Context AppDbContext`
- **Remove last migration:**  
  `Remove-Migration -Context AppDbContext`

### .NET CLI (VS Code / Terminal)
- **Add a new migration:**  
  `dotnet ef migrations add [MigrationName] --context AppDbContext`
- **Update database to latest:**  
  `dotnet ef database update --context AppDbContext`

### 📜 Migration History (Log)
1. `InitialCreate`

---

## 🏗 Understanding the Architecture
We follow a strict **Clean Architecture-lite** approach. Before adding any new features, please read the **[ARCHITECTURE.md](./ARCHITECTURE.md)** file.

## 📂 Project Structure
- **/Controllers**: Thin entry points for HTTP requests.
- **/Services**: Business logic, DTO mapping, and permission resolution.
- **/Foundation**: Generic Repository & Unit of Work implementations.
- **/Repositories**: Entity-specific complex queries (non-generic).
- **/Models**: Database entities and base/interface definitions.
- **/DTOs**: Data Transfer Objects for API contracts.
- **/Data**: `AppDbContext`, Migrations, and `DbInitializer` for seeding.

---

### ⚠️ Troubleshooting
- **Empty Roles Table?** Ensure you have actually *run* the project. The seeder runs at application startup.
- **401 Unauthorized?** Check that your JWT Key in `appsettings.json` is at least 32 characters long.