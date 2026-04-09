using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManagerAPI.DTOs;
using TaskManagerAPI.Services;

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
			return Ok(await _companyService.GetAllCompanyAsync());
		}

		[HttpGet("{id}")]
		public async Task<ActionResult<CompanyDto>> GetById(int id)
		{
			var company = await _companyService.GetCompanyByIdAsync(id);
			if (company == null) return NotFound();
			return Ok(company);
		}

		[HttpPost]
		public async Task<ActionResult<CompanyDto>> Create([FromBody] CreateCompanyDto dto)
		{
			// Note: We no longer need to pass GetUserId() manually if 
			// the Service uses the DbContext which already has ICurrentUserService
			var company = await _companyService.CreateCompanyAsync(dto);
			return CreatedAtAction(nameof(GetById), new { id = company.Id }, company);
		}

		[HttpPut("{id}")]
		public async Task<ActionResult<CompanyDto>> Update(int id, [FromBody] UpdateCompanyDto dto)
		{
			// SENIOR CHECK: Ensure the URL ID matches the Body ID
			if (id != dto.Id) return BadRequest("ID Mismatch");

			var company = await _companyService.UpdateCompanyAsync(dto);
			if (company == null) return NotFound();

			return Ok(company);
		}

		[HttpDelete("{id}")]
		public async Task<IActionResult> Delete(int id)
		{
			var success = await _companyService.DeleteDataAsync(id);
			if (!success) return NotFound();
			return NoContent();
		}
	}
}