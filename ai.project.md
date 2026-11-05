# Application project rules

This profile applies only to this application. Keep it short - every line
loads each session.

## Stack facts

- Backend: `TaskManagerAPI/` ASP.NET Core 9. Pattern: Controllers -> Services
  (interface + impl) -> Repositories -> Foundation (IRepository/IUnitOfWork),
  EF Core config in `Data/Configurations`, migrations in `Migrations/`, JWT auth.
- Frontend: `TaskManagerFrontend/` React 19 + Vite + MUI v7 + Tailwind +
  axios + react-router-dom v7. Feature folders under `src`.
- Dev run from repo root: `npm run dev` (concurrently runs both).
- No automated tests exist yet.

## Project conventions

- Reference module or feature: Tasks (TasksController + TaskService +
  TaskItemConfiguration) is the pattern to copy for new modules
- Folder and naming conventions: PascalCase files; Controllers plural;
  Services/Repositories named per entity; DTOs in `DTOs/`
- Shared components to reuse: Foundation repository/UoW, BaseController,
  existing MUI component patterns in the frontend
- Audit and validation requirements: current-user scoping via
  ICurrentUserService; validate DTO input at the controller boundary

## Workflow paths

- Documentation: `_notes`. Existing `__workflow/` + `README.Workflow.md`
  describe module/permission workflows - read before module work
- Drafts, if used: (none - no-drafts profile)
- Logs, if used: (none)

## Caution

- Large files or risky areas: `Data/AppDbContext.cs`, `Migrations/`,
  AuthService and Auth DTOs, `Data/DbInitializer.cs`
- Rules that must not be broken: no hand-edits to generated
  AGENTS.md/CLAUDE.md/opencode.json; migrations via dotnet-ef CLI only.
