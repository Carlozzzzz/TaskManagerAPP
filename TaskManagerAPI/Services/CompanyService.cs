// Services/CompanyService.cs
// ─────────────────────────────────────────────────────────────────────────────
// CHANGES from previous version:
//   1. IRepository<Company> swapped → ICompanyRepository
//      (inherits all generic methods + adds complex queries)
//   2. IUnitOfWork injected — owns all SaveAsync() calls
//   3. All _repository.SaveAsync() → _unitOfWork.SaveAsync()
//   4. GetAllWithDetailsAsync() added — delegates to repo
//   5. GetAllActiveAsync() added — delegates to repo
//
// PATTERN:
//   _repository  →  stage changes   (Add, Update, Delete, complex queries)
//   _unitOfWork  →  commit changes  (SaveAsync)
// ─────────────────────────────────────────────────────────────────────────────

using TaskManagerAPI.DTOs;
using TaskManagerAPI.Foundation;
using TaskManagerAPI.Models;
using TaskManagerAPI.Repositories;

namespace TaskManagerAPI.Services
{
    public class CompanyService : ICompanyService
    {
        private readonly ICompanyRepository _repository;  // MODIFIED: specific repo
        private readonly IUnitOfWork _unitOfWork;  // ADDED: owns all saves

        public CompanyService(
            ICompanyRepository repository,
            IUnitOfWork unitOfWork)
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
        }

        // ─── GET ALL ──────────────────────────────────────────────────────────
        public async Task<List<CompanyDto>> GetAll()
        {
            var companies = await _repository.GetAllAsync();

            return companies.Select(c => new CompanyDto
            {
                Id = c.Id,
                Description = c.Description,
                IsActive = c.IsActive
            }).ToList();
        }

        // ─── GET BY ID ────────────────────────────────────────────────────────
        public async Task<CompanyDto?> GetById(int id)
        {
            var company = await _repository.GetByIdAsync(id);
            if (company == null) return null;

            return new CompanyDto
            {
                Id = company.Id,
                Description = company.Description,
                IsActive = company.IsActive
            };
        }

        // ─── CREATE ───────────────────────────────────────────────────────────
        public async Task<CompanyDto> Create(CreateCompanyDto dto)
        {
            var entity = new Company
            {
                Description = dto.Description,
                IsActive = dto.IsActive
                // CreatedAt and CreatedBy set automatically by AppDbContext
            };

            await _repository.AddAsync(entity);
            await _unitOfWork.SaveAsync(); // MODIFIED: UnitOfWork commits

            return new CompanyDto
            {
                Id = entity.Id,
                Description = entity.Description,
                IsActive = entity.IsActive
            };
        }

        // ─── UPDATE ───────────────────────────────────────────────────────────
        public async Task<CompanyDto?> Update(UpdateCompanyDto dto)
        {
            var company = await _repository.GetByIdAsync(dto.Id);
            if (company == null) return null;

            company.Description = dto.Description;
            company.IsActive = dto.IsActive;
            // UpdatedAt and UpdatedBy set automatically by AppDbContext

            await _unitOfWork.SaveAsync(); // MODIFIED: UnitOfWork commits
                                           // No need to call _repository.Update() —
                                           // entity is tracked, EF detects changes

            return new CompanyDto
            {
                Id = company.Id,
                Description = company.Description,
                IsActive = company.IsActive
            };
        }

        // ─── DELETE (soft) ────────────────────────────────────────────────────
        public async Task<bool> Delete(int id)
        {
            var company = await _repository.GetByIdAsync(id);
            if (company == null) return false;

            // Soft delete — flip the bit
            // AppDbContext sees IsDeleted = true → sets DeletedAt + DeletedBy
            company.IsDeleted = true;

            await _unitOfWork.SaveAsync(); // MODIFIED: UnitOfWork commits
            return true;
        }

        // ─── COMPLEX QUERIES ──────────────────────────────────────────────────
        // These delegate directly to ICompanyRepository.
        // No business logic here — the repo handles the query,
        // the service just exposes it to the controller.

        // ADDED — uses ICompanyRepository.GetAllWithDetailsAsync()
        public async Task<List<CompanyWithDetailsDto>> GetAllWithDetailsAsync()
        {
            return await _repository.GetAllWithDetailsAsync();
        }

        // ADDED — uses ICompanyRepository.GetAllActiveAsync()
        public async Task<List<CompanyDto>> GetAllActiveAsync()
        {
            return await _repository.GetAllActiveAsync();
        }
    }
}