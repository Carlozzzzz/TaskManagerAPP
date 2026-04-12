// Foundation/UnitOfWork.cs
// ─────────────────────────────────────────────────────────────────────────────
// WHAT THIS IS:
//   The single commit point implementation.
//   Wraps AppDbContext — this is the ONLY place SaveChangesAsync() is called
//   outside of AppDbContext itself.
//
// REGISTRATION (Program.cs):
//   builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
// ─────────────────────────────────────────────────────────────────────────────

using Microsoft.EntityFrameworkCore.Storage;
using TaskManagerAPI.Data;

namespace TaskManagerAPI.Foundation
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _dbContext;
        private IDbContextTransaction? _transaction;

        public UnitOfWork(AppDbContext dbContext)
            => _dbContext = dbContext;

        // ─── Simple save ──────────────────────────────────────────────────────
        // Triggers AppDbContext.SaveChangesAsync() override —
        // audit fields (CreatedAt, UpdatedAt, DeletedAt etc.) are set here.
        public async Task SaveAsync()
            => await _dbContext.SaveChangesAsync();

        // ─── Explicit transaction ─────────────────────────────────────────────

        public async Task BeginTransactionAsync()
            => _transaction = await _dbContext.Database.BeginTransactionAsync();

        // Saves all staged changes and commits the transaction atomically.
        public async Task CommitAsync()
        {
            await _dbContext.SaveChangesAsync();
            await _transaction!.CommitAsync();
        }

        // Rolls back everything staged since BeginTransactionAsync().
        // Nothing is saved to the DB.
        public async Task RollbackAsync()
            => await _transaction!.RollbackAsync();
    }
}