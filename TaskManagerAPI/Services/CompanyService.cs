// Services/CompanyService.cs
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
		Task<CompanyDto?> CreateCompanyAsync(CreateCompanyDto dto, int userId);
		Task<CompanyDto?> UpdateCompanyAsync(UpdateCompanyDto dto, int userId);
		Task<bool> DeleteDataAsync(int id, int userId);
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
			var comp = await _dbContext.Companies
				.AsNoTracking()
				.FirstOrDefaultAsync(c => c.Id == id);

			if (comp == null) return null;

			return new CompanyDto
			{
				Id = comp.Id,
				Description = comp.Description,
				IsActive = comp.IsActive
			};
		}
		
		public async Task<CompanyDto?> CreateCompanyAsync(CreateCompanyDto dto, int userId)
		{
			var newTask = new Company
			{
				Description = dto.Description,
				IsActive = dto.IsActive
			};

			_dbContext.Companies.Add(newTask);
			
			await _dbContext.SaveChangesAsync(); // Non-blocking write

			return new CompanyDto
			{
				Id = newTask.Id,
				Description = newTask.Description,
				IsActive = newTask.IsActive
			};
			
		}


		public async Task<CompanyDto?> UpdateCompanyAsync(UpdateCompanyDto dto, int userId)
		{
			var company = _dbContext.Companies.FirstOrDefault(t => t.Id == dto.Id);
			
			Console.WriteLine($"DTO : {dto.Id}");
			Console.WriteLine($"Company : {company?.Id}");
			
			
			if (company == null) return null;
			
			company.Description = dto.Description;
			company.IsActive = dto.IsActive;
			
			await _dbContext.SaveChangesAsync();
			
			return new CompanyDto
			{
				Id = company.Id,
				Description = company.Description,
				IsActive = company.IsActive
			};

		}
		
		public async Task<bool> DeleteDataAsync(int id, int userId)
		{
				var company = await _dbContext.Companies.FirstOrDefaultAsync(t => t.Id == id);
			if (company == null) return false;

			_dbContext.Companies.Remove(company);
			await _dbContext.SaveChangesAsync();
			return true;
		}

	}
}