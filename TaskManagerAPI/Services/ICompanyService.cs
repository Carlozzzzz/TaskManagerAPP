// Services/ICompanyService.cs
// ─────────────────────────────────────────────────────────────────────────────
//
// WHY SEPARATE:
//   Interface in its own file = other services can depend on the contract
//   without pulling in the implementation. Cleaner dependency graph.
//   Also makes it easier to find — ICompanyService.cs is always the contract,
//   CompanyService.cs is always the implementation.
//
// PATTERN for every future module:
//   IEmployeeService.cs  → contract
//   EmployeeService.cs   → implementation
//   Never put both in the same file.
// ─────────────────────────────────────────────────────────────────────────────

using TaskManagerAPI.DTOs;

namespace TaskManagerAPI.Services
{
    public interface ICompanyService
    {
        // ─── Standard CRUD ────────────────────────────────────────────────────
        Task<List<CompanyDto>> GetAll();
        Task<CompanyDto?> GetById(int id);
        Task<CompanyDto> Create(CreateCompanyDto dto);
        Task<CompanyDto?> Update(UpdateCompanyDto dto);
        Task<bool> Delete(int id);

        // ─── Complex queries ──────────────────────────────────────────────────
        // ADDED — delegates to ICompanyRepository.GetAllWithDetailsAsync()
        Task<List<CompanyWithDetailsDto>> GetAllWithDetailsAsync();

        // ADDED — delegates to ICompanyRepository.GetAllActiveAsync()
        Task<List<CompanyDto>> GetAllActiveAsync();
    }
}