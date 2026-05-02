using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManagerAPI.DTOs;
using TaskManagerAPI.Services;

namespace TaskManagerAPI.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class EmployeeController : Controller
    {
        private readonly IEmployeeService _employeeService;

        public EmployeeController(IEmployeeService employeeService)
            => _employeeService = employeeService;

        // ─── Standard CRUD ────────────────────────────────────────────────────

        // GET /api/Employee
        [HttpGet]
        public async Task<ActionResult<List<EmployeeDto>>> GetAll()
        {
            return Ok(await _employeeService.GetAll());
        }

        // GET /api/Employee/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<EmployeeDetailsDto>> GetById(int id)
        {
            var Employee = await _employeeService.GetById(id);
            if (Employee == null) return NotFound();
            return Ok(Employee);
        }

        // POST /api/Employee
        [HttpPost]
        public async Task<ActionResult<EmployeeDto>> Create([FromBody] CreateEmployeeDto dto)
        {
            var Employee = await _employeeService.Create(dto);
            return CreatedAtAction(nameof(GetById), new { id = Employee.Id }, Employee);
        }

        // PUT /api/Employee/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<EmployeeDto>> Update(int id, [FromBody] UpdateEmployeeDto dto)
        {
            if (id != dto.Id) return BadRequest("ID mismatch between URL and body.");

            var Employee = await _employeeService.Update(dto);
            if (Employee == null) return NotFound();

            return Ok(Employee);
        }

        // DELETE /api/Employee/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _employeeService.Delete(id);
            if (!success) return NotFound();
            return NoContent();
        }

        // ─── Complex queries ──────────────────────────────────────────────────

        // GET /api/Employee/active
        // Returns only active companies — filtered at SQL level.
        [HttpGet("active")]                                            // ADDED
        public async Task<ActionResult<List<EmployeeDto>>> GetAllActive()
        {
            return Ok(await _employeeService.GetAllActiveAsync());
        }
    }
}
