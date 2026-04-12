// Repositories/ICompanyRepository.cs
// ─────────────────────────────────────────────────────────────────────────────
// WHAT THIS IS:
//   Company's specific repository interface.
//   Extends IRepository<Company> — inherits ALL generic methods:
//     GetByIdAsync, GetAllAsync, AddAsync, Update, Delete
//
//   Only add methods here that IRepository<Company> CANNOT handle:
//     — queries needing .Include() (joins to related tables)
//     — SQL-level projections directly to DTOs
//     — filtered queries specific to Company
//
// RULE:
//   Do NOT add simple CRUD here — the generic repo already handles that.
//   Only create this file when you have a query too complex for GetAllAsync().
//
// REGISTRATION (Program.cs):
//   builder.Services.AddScoped<ICompanyRepository, CompanyRepository>();
// ─────────────────────────────────────────────────────────────────────────────

using TaskManagerAPI.DTOs;
using TaskManagerAPI.Foundation;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Repositories
{
    public interface ICompanyRepository : IRepository<Company>
    {
        // ─── Complex queries — things IRepository<Company> cannot do ──────────

        // Returns all companies with their related Client details.
        // Uses .Include() for the JOIN — generic repo can't do this.
        // Projects directly to DTO at SQL level — efficient for large datasets.
        Task<List<CompanyWithDetailsDto>> GetAllWithDetailsAsync();

        // Returns only active companies — filtered at SQL level.
        Task<List<CompanyDto>> GetAllActiveAsync();
    }
}