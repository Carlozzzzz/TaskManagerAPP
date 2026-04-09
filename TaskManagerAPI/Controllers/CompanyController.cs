// Controllers/CompanyController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManagerAPI.DTOs;
using TaskManagerAPI.Services;
using System.Security.Claims;

namespace TaskManagerAPI.Controllers
{
	[ApiController]
	[Authorize]
	[Route("api/[controller]")]
	public class CompanyController : BaseController
	{
		private readonly ICompanyService _companyService;
		public CompanyController(ICompanyService companyService) => _companyService = companyService;

		[HttpGet]
		public async Task<ActionResult<List<CompanyDto>>> GetAll()
		{
			var companies = await _companyService.GetAllCompanyAsync();
			return Ok(companies);
		}

		[HttpGet("{id}")]
		public async Task<ActionResult<CompanyDto>> GetById(int id)
		{
			var company = await _companyService.GetCompanyByIdAsync(id);
			return Ok(company);

		}

		[HttpPost]
		public async Task<ActionResult<TaskDto>> Create([FromBody] CreateCompanyDto dto)
		{
			var company = await _companyService.CreateCompanyAsync(dto, GetUserId());
			return Ok(company);
		}

		[HttpPut("{id}")]
		public async Task<ActionResult<CompanyDto>> Update(int id, [FromBody] UpdateCompanyDto dto)
		{
			Console.ForegroundColor = ConsoleColor.Green;
			Console.WriteLine("------------------------------------------------------------------------------");
			Console.WriteLine($"Received Update request for Company ID: {id} DTO ID : {dto.Id} with Description: {dto.Description} and IsActive: {dto.IsActive}");
			Console.WriteLine("------------------------------------------------------------------------------");
			Console.ResetColor();
			
			var company = await _companyService.UpdateCompanyAsync(dto, GetUserId());
			if (company == null) return NotFound();
			return Ok(company);
		}

		[HttpDelete("{id}")]
		public async Task<IActionResult> Delete(int id)
		{
			var success = await _companyService.DeleteDataAsync(id, GetUserId());
			if (!success) return NotFound();
			return NoContent(); // 204 No Content is standard for successful deletes
		}
	}
}