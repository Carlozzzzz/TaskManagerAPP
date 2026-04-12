// Controllers/CompanyController.cs
// ─────────────────────────────────────────────────────────────────────────────
// CHANGES from your original:
//   1. Constructor simplified to expression body (was already close)
//   2. Comments cleaned up — removed implementation notes that don't
//      belong in production code
//
// WHAT STAYS THE SAME:
//   - All 5 endpoints (GetAll, GetById, Create, Update, Delete)
//   - ID mismatch check on PUT — this is correct, keep it always
//   - 201 CreatedAtAction on POST — correct HTTP semantics
//   - 204 NoContent on DELETE — correct HTTP semantics
//   - Inherits BaseController — keep this pattern for all controllers
//
// RULE: Controller does three things only:
//   1. Receive the HTTP request
//   2. Call the service
//   3. Return the HTTP response
//   Nothing else belongs here.
// ─────────────────────────────────────────────────────────────────────────────

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

        public CompanyController(ICompanyService companyService)
            => _companyService = companyService;

        // ─── Standard CRUD ────────────────────────────────────────────────────

        // GET /api/company
        [HttpGet]
        public async Task<ActionResult<List<CompanyDto>>> GetAll()
        {
            return Ok(await _companyService.GetAll());
        }

        // GET /api/company/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<CompanyDto>> GetById(int id)
        {
            var company = await _companyService.GetById(id);
            if (company == null) return NotFound();
            return Ok(company);
        }

        // POST /api/company
        [HttpPost]
        public async Task<ActionResult<CompanyDto>> Create([FromBody] CreateCompanyDto dto)
        {
            var company = await _companyService.Create(dto);
            return CreatedAtAction(nameof(GetById), new { id = company.Id }, company);
        }

        // PUT /api/company/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<CompanyDto>> Update(int id, [FromBody] UpdateCompanyDto dto)
        {
            if (id != dto.Id) return BadRequest("ID mismatch between URL and body.");

            var company = await _companyService.Update(dto);
            if (company == null) return NotFound();

            return Ok(company);
        }

        // DELETE /api/company/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _companyService.Delete(id);
            if (!success) return NotFound();
            return NoContent();
        }

        // ─── Complex queries ──────────────────────────────────────────────────

        // GET /api/company/details
        // Returns all companies with extended detail fields.
        // Uses ICompanyRepository.GetAllWithDetailsAsync() under the hood.
        [HttpGet("details")]                                           // ADDED
        public async Task<ActionResult<List<CompanyWithDetailsDto>>> GetAllWithDetails()
        {
            return Ok(await _companyService.GetAllWithDetailsAsync());
        }

        // GET /api/company/active
        // Returns only active companies — filtered at SQL level.
        [HttpGet("active")]                                            // ADDED
        public async Task<ActionResult<List<CompanyDto>>> GetAllActive()
        {
            return Ok(await _companyService.GetAllActiveAsync());
        }
    }
}