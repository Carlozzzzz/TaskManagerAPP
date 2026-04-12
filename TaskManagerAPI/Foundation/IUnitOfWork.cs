// Foundation/IUnitOfWork.cs
// ─────────────────────────────────────────────────────────────────────────────
// WHAT THIS IS:
//   The single commit point for the entire project.
//   Every service injects this alongside IRepository<T> or IXRepository.
//
// RULE:
//   IRepository   →  stage changes  (Add, Update, Delete)
//   IUnitOfWork   →  commit changes (Save, Begin, Commit, Rollback)
//
// WHEN TO USE WHICH:
//   SaveAsync()             — single operation or multiple entities,
//                             no explicit transaction needed.
//                             EF wraps it in a transaction automatically.
//
//   BeginTransactionAsync() — multi-step operations where partial failure
//   CommitAsync()             means corrupted data.
//   RollbackAsync()           e.g. ProcessPayroll, TransferClient, BulkImport
//
// REGISTRATION (Program.cs):
//   builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
// ─────────────────────────────────────────────────────────────────────────────

namespace TaskManagerAPI.Foundation
{
    public interface IUnitOfWork
    {
        // ─── Simple save ──────────────────────────────────────────────────────
        // Use for most operations — EF wraps this in a transaction automatically.
        Task SaveAsync();

        // ─── Explicit transaction ─────────────────────────────────────────────
        // Use when multiple operations must all succeed or all fail.
        Task BeginTransactionAsync();
        Task CommitAsync();
        Task RollbackAsync();
    }
}
