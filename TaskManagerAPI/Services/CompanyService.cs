using Microsoft.EntityFrameworkCore;
using TaskManagerAPI.Data;
using TaskManagerAPI.DTOs;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Services
{
	public interface ICompanyService
	{
		Task<List<CompanyDto>> GetAllCompanyAsync();
		Task<CompanyDto?> GetCompanyByIdAsync(int id);
		Task<CompanyDto> CreateCompanyAsync(CreateCompanyDto dto);
		Task<CompanyDto?> UpdateCompanyAsync(UpdateCompanyDto dto);
		Task<bool> DeleteDataAsync(int id);
	}

	public class CompanyService : ICompanyService
	{
		private readonly AppDbContext _dbContext;

		public CompanyService(AppDbContext dbContext) => _dbContext = dbContext;

		public async Task<List<CompanyDto>> GetAllCompanyAsync()
		{
			return await _dbContext.Companies
					.AsNoTracking()
					.Select(c => new CompanyDto
					{
						Id = c.Id,
						Description = c.Description,
						IsActive = c.IsActive
					})
					.ToListAsync();
		}

		public async Task<CompanyDto?> GetCompanyByIdAsync(int id)
		{
			// Use FindAsync for primary key lookups (more efficient)
			var comp = await _dbContext.Companies.FindAsync(id);
			if (comp == null) return null;

			return new CompanyDto
			{
				Id = comp.Id,
				Description = comp.Description,
				IsActive = comp.IsActive
			};
		}

		public async Task<CompanyDto> CreateCompanyAsync(CreateCompanyDto dto)
		{
			var newCompany = new Company
			{
				Description = dto.Description,
				IsActive = dto.IsActive
			};

			_dbContext.Companies.Add(newCompany);

			// AppDbContext will automatically set CreatedAt/CreatedBy
			await _dbContext.SaveChangesAsync();

			return new CompanyDto
			{
				Id = newCompany.Id,
				Description = newCompany.Description,
				IsActive = newCompany.IsActive
			};
		}

		public async Task<CompanyDto?> UpdateCompanyAsync(UpdateCompanyDto dto)
		{
			var company = await _dbContext.Companies.FindAsync(dto.Id);
			if (company == null) return null;

			company.Description = dto.Description;
			company.IsActive = dto.IsActive;

			// AppDbContext will automatically set UpdatedAt/UpdatedBy
			// and trigger the AuditLog record
			await _dbContext.SaveChangesAsync();

			return new CompanyDto
			{
				Id = company.Id,
				Description = company.Description,
				IsActive = company.IsActive
			};
		}

		public async Task<bool> DeleteDataAsync(int id)
		{
			var company = await _dbContext.Companies.FindAsync(id);
			if (company == null) return false;

			// REPLACED: _dbContext.Companies.Remove(company);
			// We flip the bit instead of removing. 
			// AppDbContext.ApplyAuditProperties will see this and set DeletedAt/DeletedBy.
			company.IsDeleted = true;

			await _dbContext.SaveChangesAsync();
			return true;
		}
	}
}