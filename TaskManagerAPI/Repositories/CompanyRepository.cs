// Repositories/CompanyRepository.cs
// ─────────────────────────────────────────────────────────────────────────────
// WHAT THIS IS:
//   Company's specific repository implementation.
//   Extends Repository<Company> — inherits ALL generic method implementations.
//   Only implements the methods declared in ICompanyRepository.
//
// NOTE:
//   _dbContext is protected in Repository<T> base class — accessible here.
//   All generic methods (GetByIdAsync, GetAllAsync, AddAsync, Update, Delete)
//   are already implemented in Repository<Company> — nothing to rewrite.
//
// REGISTRATION (Program.cs):
//   builder.Services.AddScoped<ICompanyRepository, CompanyRepository>();
// ─────────────────────────────────────────────────────────────────────────────

using Microsoft.EntityFrameworkCore;
using TaskManagerAPI.Data;
using TaskManagerAPI.DTOs;
using TaskManagerAPI.Foundation;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Repositories
{
    public class CompanyRepository : Repository<Company>, ICompanyRepository
    {
        public CompanyRepository(AppDbContext dbContext) : base(dbContext) { }

        // ─── Complex queries ──────────────────────────────────────────────────

        // SQL-level projection — only fetches what the DTO needs.
        // .Include() joins the related Client table.
        // AsNoTracking() — read-only, no change tracking overhead.
        public async Task<List<CompanyWithDetailsDto>> GetAllWithDetailsAsync()
        {
            return await _dbContext.Companies
                .AsNoTracking()
                .Select(c => new CompanyWithDetailsDto
                {
                    Id = c.Id,
                    Description = c.Description,
                    IsActive = c.IsActive,
                    CreatedAt = c.CreatedAt,
                    // Add any related entity fields here as your model grows
                    // e.g. ClientName = c.Client.Name (requires .Include or nav prop)
                })
                .ToListAsync();
        }

        // Filtered at SQL level — WHERE IsActive = 1
        // More efficient than GetAllAsync() + filtering in service memory.
        public async Task<List<CompanyDto>> GetAllActiveAsync()
        {
            return await _dbContext.Companies
                .Where(c => c.IsActive)
                .AsNoTracking()
                .Select(c => new CompanyDto
                {
                    Id = c.Id,
                    Description = c.Description,
                    IsActive = c.IsActive,
                })
                .ToListAsync();
        }
    }
}